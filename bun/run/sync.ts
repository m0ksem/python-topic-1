import { preBuild } from '../lib/builder'
import { findSum } from '../lib/find-sum'
import { printNumber } from '../perfomance-tests/utils'

const start = 1
const end = 1_000_000_000
const step = 10_000_000


export const tryRangeHypothesisToFileSync = (start: number, end: number, step: number) => {
  const cache = preBuild(start, end)

  for (let i = start; i < end; i += step) {
    const results = []

    const timeStart = new Date().getTime()

    for (let j = i; j < i + step; j++) {
      const result = findSum(j, cache)

      if (result === null) {
        console.log('Failed at', j)
      }

      results.push(result)
    }

    const timeEnd = new Date().getTime()

    const timePerTask = (timeEnd - timeStart) / 1000
    let timeLeft: number | string = Math.ceil((end - i) / step * timePerTask)
    if (timeLeft < 60) {
      timeLeft = `${timeLeft}s`
    } else {
      timeLeft = `${Math.floor(timeLeft / 60)}m ${timeLeft % 60}s`
    }

    process.stdout.write(`\rProgress: ${printNumber(i)} / ${printNumber(end)} (${Math.floor(i / end * 100)}%) | time left: ${timeLeft}s (per task: ${Math.floor(timePerTask)}s)`)


    Bun.write(`./out/results-${i}-${i + step}.json`, JSON.stringify(results, null, 2));
  }
}

const timeStart = Date.now()

tryRangeHypothesisToFileSync(start, end, step)

const timeEnd = Date.now()

console.log(`Time elapsed: ${(timeEnd - timeStart) / 1000}s`)