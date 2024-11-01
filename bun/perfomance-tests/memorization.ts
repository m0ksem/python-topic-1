import { makeTetradicNumber, getLowestTetradicNumberIndex, makeTetradicNumberCalls } from './lib';
import { withTime } from './utils'

const cache = new Map<number, number[]>();

let fromCacheCount = 0

export function findSums(inputNumber: number): number[] | null {
  const nearestTetradicNumberIndex = getLowestTetradicNumberIndex(inputNumber);

  for (let number1Index = nearestTetradicNumberIndex; number1Index > 0; number1Index--) {
    const number1 = makeTetradicNumber(number1Index);

    if (number1 === inputNumber) {
      return [number1];
    }

    const required1 = inputNumber - number1;

    if (cache.has(required1)) {
      cache.set(inputNumber, [number1, ...cache.get(required1)!]);
      fromCacheCount++
      return [number1, ...cache.get(required1)!];
    }

    if (required1 < 0) {
      continue;
    }

    for (let number2Index = getLowestTetradicNumberIndex(required1); number2Index > 0; number2Index--) {
      const number2 = makeTetradicNumber(number2Index);
      const required2 = required1 - number2;

      if (cache.has(required2)) {
        cache.set(inputNumber, [number1, number2, ...cache.get(required2)!]);
        fromCacheCount++
        return [number1, number2, ...cache.get(required2)!];
      }

      if (required2 < 0) {
        continue;
      } else if (required2 === 0) {
        cache.set(inputNumber, [number1, number2]);
        return [number1, number2];
      }

      for (let number3Index =  number2Index; number3Index > 0; number3Index--) {
        const number3 = makeTetradicNumber(number3Index);
        const required3 = required2 - number3;

        if (cache.has(required3)) {
          cache.set(inputNumber, [number1, number2, number3, ...cache.get(required3)!]);
          fromCacheCount++
          return [number1, number2, number3, ...cache.get(required3)!];
        }

        if (required3 < 0) {
          continue;
        } else if (required3 === 0) {
          cache.set(inputNumber, [number1, number2, number3]);
          return [number1, number2, number3];
        }

        for (let number4Index = number3Index; number4Index > 0; number4Index--) {
          const number4 = makeTetradicNumber(number4Index);
          const required4 = required3 - number4;

          if (cache.has(required4)) {
            cache.set(inputNumber, [number1, number2, number3, number4, ...cache.get(required4)!]);
            fromCacheCount++
            return [number1, number2, number3, number4, ...cache.get(required4)!];
          }

          if (required4 < 0) {
            continue;
          } else if (required4 === 0) {
            cache.set(inputNumber, [number1, number2, number3, number4]);
            return [number1, number2, number3, number4];
          }

          for (let number5Index = number4Index; number5Index > 0; number5Index--) {
            const number5 = makeTetradicNumber(number5Index);
            const required5 = required4 - number5;

            if (required5 < 0) {
              continue;
            } else if (required5 === 0) {
              cache.set(inputNumber, [number1, number2, number3, number4, number5]);
              return [number1, number2, number3, number4, number5];
            }
          }
        }
      }
    }
  }

  return null;
}

const start = 99_900_000
const end = 100_000_000

const [result, time] = withTime(() => {
  for (let i = start; i < end; i++) {
    const result = findSums(i);
    if (result === null || result.reduce((acc, curr) => acc + curr, 0) !== i) {
      console.log('Failed at', i)
    }
  }
})

console.log(`Finished testing from ${start} to ${end} in ${time / 1000}s`)
console.log('makeTetradicNumber calls count', makeTetradicNumberCalls)
console.log('Accessed from cache', fromCacheCount)
console.log('Cache size', cache.size)