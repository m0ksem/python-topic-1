import { availableParallelism } from "node:os";

import { resolve as resolvePath, dirname } from "path";
import { preBuild } from "../lib/builder";

type Response = {
  sums: Map<number, number[]>,
  start: number,
  end: number,
  startTimestamp: number,
  endTimestamp: number
}

const makeTask = (cache: Map<number, number[]>, onReponse: (r: Response) => void) => {
    const childProc = Bun.spawn(["bun", resolvePath(dirname(import.meta.path), "child.ts")], {
      ipc(message, childProc) {
        /**
         * The message received from the sub process
         **/
        onReponse(message)
      },
    });
    

  return (start: number, end: number) => childProc.send({ start, end, cache });
}

export const tryRangeHypothesisToFileMultithread = async (start: number, end: number, step: number, maxTasks = 6) => {
  if (maxTasks < 1) {
    maxTasks = 1
  }

  const expectedTasksCount = Math.ceil((end - start) / step)

  const cache = preBuild(start, end)
  
  console.log(`Testing numbers from ${start} to ${end} with step ${step} using ${maxTasks} tasks`)

  let finishedTasksCount = 0

  return new Promise((resolve, reject) => {
    let i = start
    let done = 0

    const onThreadEnd = (result: {
      sums: Map<number, number[]>,
      start: number,
      end: number,
      startTimestamp: number,
      endTimestamp: number
    }) => {
      done++

      const fileName = `./out/results-${result.start}-${result.end}.json`
      // console.log(`Thread ${result.start}-${result.end} done (${done} / ${maxTasks})`)
      finishedTasksCount++
      const timePerTask = (result.endTimestamp - result.startTimestamp) / 1000
      const tasksLeft = expectedTasksCount - done
      let timeLeft: number | string = Math.ceil(tasksLeft * timePerTask)
      if (timeLeft < 60) {
        timeLeft = `${timeLeft}s`
      } else {
        timeLeft = `${Math.floor(timeLeft / 60)}m ${timeLeft % 60}s`
      }
      process.stdout.write(`\rProgress: ${finishedTasksCount} / ${expectedTasksCount} (${Math.floor(finishedTasksCount / expectedTasksCount * 100)}%) | time left: ${timeLeft} (per task: ${timePerTask}s)`)

      if (i >= end) {
        resolve(1)
        Bun.write(fileName, JSON.stringify([...result.sums.entries()], null, 2));
        return
      }

      makeThread(i, i + step)
      i += step
        
      Bun.write(fileName, JSON.stringify([...result.sums.entries()], null, 2));
    }
  
    const makeThread = (start: number, end: number) => {
      const post = makeTask(cache, (event) => {
        onThreadEnd(event)
        post(i, i + step)
      })

      post(start, end)
    }
  
    for (let t = 0; t < maxTasks; t++) {
      makeThread(i, i + step)
      i += step
    }
  })
}


tryRangeHypothesisToFileMultithread(1, 5_000_000_000, 1_000_000, availableParallelism() - 2)
