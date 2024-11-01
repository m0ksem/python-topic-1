import { makeTetradicNumberCalls } from '../lib';
import { printNumber } from '../utils'
import { preBuild } from '../../lib/builder'
import { dirname, resolve } from 'path'

let fromCacheCount = 0

const makeWorker = () => {
  const worker = new Worker(resolve(dirname(import.meta.path), "./worker.ts"));

  worker.onerror = event => {
    console.error(event);
    worker.terminate()
  }
  worker.onmessageerror = event => {
    console.error(event);
    worker.terminate()
  }
  
  worker.addEventListener('message', (event: any) => {
    // console.log('received', event.data)
  })

  return worker
}


const start = 1
const end = 1_000_000_000

console.log(`Generating ${printNumber(end - start)} numbers`)

const timeStart = new Date().getTime()
const cache = preBuild(start, 100_000)

const workers = [
  makeWorker(), makeWorker(), makeWorker(), makeWorker(),
  makeWorker(), makeWorker(), makeWorker(), makeWorker(),
  makeWorker(), makeWorker(), 
]

const step = 10_000_000

const tasksCount = Math.ceil((end - start) / step)
let doneTasks = 0

workers.forEach(worker => {
  worker.addEventListener('message', (event: any) => {
    doneTasks++

    process.stdout.write(`\r${printNumber(doneTasks)} / ${printNumber(tasksCount)} (${(Math.floor((doneTasks) / (tasksCount - start) * 100))}%) (from cache: ${fromCacheCount}, size: ${cache.size})`)

    if (doneTasks === tasksCount) {
      workers.forEach(worker => worker.terminate())

      const time = new Date().getTime() - timeStart

      console.log(`\n\nFinished testing from ${printNumber(start)} to ${printNumber(end)} in ${time / 1000}s (per task: ${Math.floor(time / (end - start) * 10_000) / 10_000}ms)`)
      console.log('makeTetradicNumber calls count', printNumber(makeTetradicNumberCalls))
      console.log('Accessed from cache', printNumber(fromCacheCount))

      return
    } else {
      worker.postMessage({
        start: event.data.end + step,
        end: Math.min(event.data.end + step * 2, end),
        cache
      })
    }
  })
})

  workers.forEach((worker, i) => {
    worker.postMessage({
      start: i * step + 1,
      end: Math.min(i * step + step, end),
      cache
    })
  })
