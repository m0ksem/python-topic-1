const makeWorker = () => {
  const worker = new Worker(new URL("./multithread-worker.ts", import.meta.url).href);

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

function makeTetradicNumber(index: number): number {
  return (index * (index + 1) * (index + 2)) / 6;
}

const makeTetradicNumbers = (num: number) => {
  const numbers = []
  let index = 0

  while (true) {
    const tetradicNumber = makeTetradicNumber(index);
    if (tetradicNumber > num) {
      break;
    }

    numbers.push(tetradicNumber);
    index++
  }

  return numbers;
}

const workers = [
  makeWorker(), makeWorker(), makeWorker(), makeWorker(),
  makeWorker(), makeWorker(), makeWorker(), makeWorker(),
]

let doneTasks = 0

function test(start: number, end: number, step: number) {
  return new Promise((resolve, reject) => { 
    const tasksCount = Math.ceil((end - start) / step)
    let startedTasks = 0

    let counts = [0, 0, 0, 0, 0]
  
    workers.forEach(worker => {
      worker.addEventListener('message', (event: any) => {
        if ('error' in event.data) {
          console.error(event.data.error)
          process.exit(1)
        }

        event.data.counts.forEach((count: number, index: number) => {
          counts[index] += count
        })

        doneTasks++

        if (doneTasks === tasksCount) {
          console.log(counts)
          workers.forEach(worker => worker.terminate())
          resolve(doneTasks)
          process.exit(0)
        } else if (startedTasks < tasksCount) {
          worker.postMessage({
            start: start + startedTasks * step,
            end: start + Math.min(startedTasks * step + step, end),
          })
          startedTasks++
        }
      })
    })
    
    workers.forEach((worker) => {
      if (startedTasks >= tasksCount) {
        return
      }

      worker.postMessage({
        start: start + startedTasks * step,
        end: start + Math.min(startedTasks * step + step, end),
      })
      startedTasks++
    })
  })
}

const args = Bun.argv.slice(2).map(Number) as [number, number, number];

await test(...args);