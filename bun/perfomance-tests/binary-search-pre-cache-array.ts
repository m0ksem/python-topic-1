import { makeTetradicNumber, getLowestTetradicNumberIndex, makeTetradicNumberCalls } from './lib';
import { withTime } from './utils'

let fromCacheCount = 0
let maxNumber = 0

export function findSum(inputNumber: number, cache: Map<number, number[]>): number[] | null {
  const nearestTetradicNumberIndex = getLowestTetradicNumberIndex(inputNumber);

  for (let number1Index = nearestTetradicNumberIndex; number1Index > 0; number1Index--) {
    const number1 = makeTetradicNumber(number1Index);

    if (number1 === inputNumber) {
      return [number1];
    }

    let left2 = 0;
    let right2 = number1Index + 1;
    let number2Index;

    const required1 = inputNumber - number1;

    if (cache.has(required1)) {
      return [number1, ...cache.get(required1)!]
    }

    while (left2 <= right2) {
      number2Index = Math.floor((left2 + right2) / 2);

      const number2 = makeTetradicNumber(number2Index);

      if (number2 === required1) {
        return [number1, number2];
      }

      if (number2 < required1) {
        let left3 = 0;
        let right3 = number2Index + 1;
        let number3Index;

        const required2 = required1 - number2;

        if (cache.has(required2)) {
          return [number1, number2, ...cache.get(required2)!];
        }

        while (left3 <= right3) {
          number3Index = Math.floor((left3 + right3) / 2);

          const number3 = makeTetradicNumber(number3Index);

          if (number3 === required2) {
            return [number1, number2, number3];
          }

          if (number3 < required2) {
            let left4 = 0;
            let right4 = number3Index + 1;
            let number4Index;

            const required3 = required2 - number3;

            if (cache.has(required3)) {
              [number1, number2, number3, ...cache.get(required3)!]
            }

            while (left4 <= right4) {
              number4Index = Math.floor((left4 + right4) / 2);

              const number4 = makeTetradicNumber(number4Index);

              if (number4 === required3) {
                return [number1, number2, number3, number4]
              }

              if (number4 < required3) {
                let left5 = 0;
                let right5 = number4Index + 1;
                let number5Index;

                const required4 = required3 - number4;

                if (cache.has(required4)) {
                  return [number1, number2, number3, number4, ...cache.get(required4)!]
                }

                while (left5 <= right5) {
                  number5Index = Math.floor((left5 + right5) / 2);

                  const number5 = makeTetradicNumber(number5Index);

                  if (number5 === required4) {
                    return [number1, number2, number3, number4, number5]
                  }

                  if (number5 < required4) {
                    left5 = number5Index + 1;
                  } else {
                    right5 = number5Index - 1;
                  }
                }

                left4 = number4Index + 1;
              } else {
                right4 = number4Index - 1;
              }
            }

          }

          if (number3 < required2) {
            left3 = number3Index + 1;
          } else {
            right3 = number3Index - 1;
          }
        }


        left2 = number2Index + 1;
      } else {
        right2 = number2Index - 1;
      }
    }
  }

  return null;
}

export function quickFindSum(inputNumber: number, cache: Map<number, number[]>): number[] | null {
  const nearestTetradicNumberIndex = getLowestTetradicNumberIndex(inputNumber);

  for (let number1Index = nearestTetradicNumberIndex; number1Index > 0; number1Index--) {
    const number1 = makeTetradicNumber(number1Index);

    if (number1 === inputNumber) {
      return [number1];
    }

    const required1 = inputNumber - number1;

    if (cache.has(required1)) {
      return [number1, ...cache.get(required1)!]
    }

    if (required1 < 0) {
      continue;
    }

    for (let number2Index = getLowestTetradicNumberIndex(required1); number2Index > 0; number2Index--) {
      const number2 = makeTetradicNumber(number2Index);
      const required2 = required1 - number2;

      if (cache.has(required2)) {
        return [number1, number2, ...cache.get(required2)!]
      }

      if (required2 < 0) {
        continue;
      } else if (required2 === 0) {
        return [number1, number2];
      }

      for (let number3Index =  number2Index; number3Index > 0; number3Index--) {
        const number3 = makeTetradicNumber(number3Index);
        const required3 = required2 - number3;

        if (cache.has(required3)) {
          return [number1, number2, number3, ...cache.get(required3)!]
        }

        if (required3 < 0) {
          continue;
        } else if (required3 === 0) {
          return [number1, number2, number3];
        }

        for (let number4Index = number3Index; number4Index > 0; number4Index--) {
          const number4 = makeTetradicNumber(number4Index);
          const required4 = required3 - number4;

          if (cache.has(required4)) {
            return [number1, number2, number3, number4, ...cache.get(required4)!]
          }

          if (required4 < 0) {
            continue;
          } else if (required4 === 0) {
            return [number1, number2, number3, number4];
          }

          for (let number5Index = number4Index; number5Index > 0; number5Index--) {
            const number5 = makeTetradicNumber(number5Index);
            const required5 = required4 - number5;

            if (cache.has(required5)) {
              return [number1, number2, number3, number4, number5, ...cache.get(required5)!]
            }

            if (required5 < 0) {
              continue;
            } else if (required5 === 0) {
              return [number1, number2, number3, number4, number5];
            }
          }
        }
      }
    }
  }

  return null;
}

const start = 1
const end = 100_000_000

const [result, time] = withTime(() => {
  const cache = new Map<number, number[]>();
  const results = []

  for (let i = 1; i < 100_000; i++) {
    const result = quickFindSum(i, cache);
  
    if (result === null) {
      throw new Error(`Failed at ${i}`);
    }
  
    cache.set(i, result);
  }

  for (let i = start; i < end; i++) {
    if (i % 10000 === 0) {
      process.stdout.write(`\r${i} / ${end} (${Math.floor(i / end * 100)}%) (from cache: ${fromCacheCount}, max: ${maxNumber}, size: ${cache.size})`)
    }
    const result = findSum(i, cache);
    if (result === null || result.reduce((acc, curr) => acc + curr, 0) !== i || result.length > 5) {
      console.log('Failed at', i)
    } else {
      results.push(result)
    }
  }
})
process.stdout.write(`\r${end} / ${end} (100%) (from cache: ${fromCacheCount})`)

console.log(`Finished testing from ${start} to ${end} in ${time / 1000}s`)
console.log('makeTetradicNumber calls count', makeTetradicNumberCalls)
console.log('Accessed from cache', fromCacheCount)