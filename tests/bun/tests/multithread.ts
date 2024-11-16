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
  makeWorker(), makeWorker(), 
]

let doneTasks = 0

const TEN_THOUSAND_INDEX = 200

const preBuild = (end: number) => {
  const results = {} as Record<number, number[]>

  // Prebuild small numbers, because they repeat frequently
  for (let i = 1; i <= TEN_THOUSAND_INDEX; i++) {
    const number1 = makeTetradicNumber(i)
   
    for (let j = 1; j <= TEN_THOUSAND_INDEX / 2; j++) {
      const number2 = makeTetradicNumber(j)
      const sum = number1 + number2
      
      if (sum > end) {
        break
      }

      for (let k = 1; k <= TEN_THOUSAND_INDEX / 3; k++) {
        const number3 = makeTetradicNumber(k)
        const sum = number1 + number2 + number3
        
        if (sum > end) {
          break
        }

        results[sum] = [number1, number2, number3]
      }

      results[sum] = [number1, number2]
    }

    results[number1] = [number1]
  }

  return results
}

function test(start: number, end: number, step: number) {
  const startTime = Date.now()

  return new Promise((resolve, reject) => {
    const tetradicNumbers = makeTetradicNumbers(end);
    const cache = preBuild(end);
  
    const tasksCount = Math.ceil((end - start) / step)
    let startedTasks = 0
  
    workers.forEach(worker => {
      worker.addEventListener('message', (event: any) => {
        if ('error' in event.data) {
          console.error(event.data.error)
          process.exit(1)
        }

        doneTasks++

        if (doneTasks === tasksCount) {
          workers.forEach(worker => worker.terminate())
          resolve(doneTasks)
          console.log('Time:', Date.now() - startTime)
          process.exit(0)
        } else if (startedTasks < tasksCount) {
          worker.postMessage({
            start: start + startedTasks * step,
            end: start + Math.min(startedTasks * step + step, end),
            cache,
            tetradicNumbers
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
        cache,
        tetradicNumbers
      })
      startedTasks++
    })
  })
}

const args = Bun.argv.slice(2).map(Number) as [number, number, number];

await test(...args);