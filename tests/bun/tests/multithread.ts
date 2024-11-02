import { makeTetradicNumber } from '../lib';
import { dirname, resolve } from 'path'

let fromCacheCount = 0

const makeWorker = () => {
  const worker = new Worker(resolve(dirname(import.meta.path), "./multithread-worker.ts"));

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

const TEN_THOUSAND_INDEX = 100

const preBuild = (end: number) => {
  const results = new Map<number, number[]>()

  // Prebuild small numbers, because they repeat frequently
  for (let i = 1; i <= TEN_THOUSAND_INDEX; i++) {
    const number1 = makeTetradicNumber(i)
    
    for (let j = 1; j <= TEN_THOUSAND_INDEX; j++) {
      const number2 = makeTetradicNumber(j)
      const sum = number1 + number2
      
      if (sum > end) {
        break
      }

      for (let k = 1; k <= TEN_THOUSAND_INDEX; k++) {
        const number3 = makeTetradicNumber(k)
        const sum = number1 + number2 + number3
        
        if (sum > end) {
          break
        }
  
        results.set(sum, [number1, number2, number3])
      }

      results.set(sum, [number1, number2])
    }

    results.set(number1, [number1])
  }

  return results
}

function test(start: number, end: number, step: number) {
  return new Promise((resolve, reject) => {
    const tetradicNumbers = makeTetradicNumbers(end);
    const cache = preBuild(end);
  
    const tasksCount = Math.ceil((end - start) / step)
  
    workers.forEach(worker => {
      worker.addEventListener('message', (event: any) => {
        doneTasks++
    
        if (doneTasks === tasksCount) {
          workers.forEach(worker => worker.terminate())
          resolve(doneTasks)
        } else {
          worker.postMessage({
            start: event.data.end + step,
            end: Math.min(event.data.end + step * 2, end),
            cache,
            tetradicNumbers
          })
        }
      })
    })
    
    workers.forEach((worker, i) => {
      worker.postMessage({
        start: start + i * step,
        end: start + Math.min(i * step + step, end),
        cache,
        tetradicNumbers
      })
    })
  })
}

const args = Bun.argv.slice(2).map(Number) as [number, number, number];

await test(...args);