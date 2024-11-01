import { availableParallelism } from "node:os";

import { resolve as resolvePath, dirname } from "path";
import { preBuild } from "../lib/builder";

const makeWorker = (cache: Map<number, number[]>) => {
  const worker = new Worker(resolvePath(dirname(import.meta.path), "./worker.ts"));

  worker.onerror = event => {
    console.error(event);
    worker.terminate()
  }
  worker.onmessageerror = event => {
    console.error(event);
    worker.terminate()
  }

  return worker
}

const makeTask = (start: number, end: number, cache: Map<number, number[]>) => {
  return new Promise<{
    sums: Map<number, number[]>,
    start: number,
    end: number,
    startTimestamp: number,
    endTimestamp: number
  }>((resolve, reject) => {
    const worker = new Worker(resolvePath(dirname(import.meta.path), "./worker.ts"));

    worker.postMessage({ start, end, cache });
    worker.onmessage = event => {
      resolve(event.data);
    };
    worker.onerror = event => {
      console.error(event);
      reject(null);
    }
    worker.onmessageerror = event => {
      console.error(event);
      reject(null);
    }
  })
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

        
      Bun.write(fileName, JSON.stringify([...result.sums.entries()], null, 2));
    }
  
    const makeThread = (start: number, end: number) => {
      // makeTask(start, end, cache).then((event) => {
      //   onThreadEnd(event)
      // })
      const worker = makeWorker(cache)
      
      worker.postMessage({ start, end, cache })

      worker.onmessage = event => {
        onThreadEnd(event.data)
        worker.postMessage({ start: i, end: i + step, cache })
        i += step
      }
    }
  
    for (let t = 0; t < maxTasks; t++) {
      makeThread(i, i + step)
      i += step
    }
  })
}


tryRangeHypothesisToFileMultithread(1, 5_000_000_000, 1_000_000, availableParallelism() / 2)
