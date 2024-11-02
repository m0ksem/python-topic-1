import { makeTetradicNumber, getLowestTetradicNumberIndex, makeTetradicNumberCalls } from '../lib';

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

let fromCacheCount = 0

export function findSums(
  inputNumber: number,
  tetradicNumbers: number[],
  cache: Map<number, number[]>
): number[] | null {
  const length = tetradicNumbers.length;

  for (let number1Index = length - 1; number1Index > 0; number1Index--) {
    const number1 = tetradicNumbers[number1Index];
 
    const required1 = inputNumber - number1;

    if (required1 < 0) {
      continue
    }

    const cached = cache.get(required1);

    if (cached) {
      if (cached.length <= 4) {
        return [number1, ...cached];
      }
    }

    if (number1 === inputNumber) {
      return [number1];
    }

    let left2 = 0;
    let right2 = number1Index + 1;
    let number2Index;

    while (left2 <= right2) {
      number2Index = Math.floor((left2 + right2) / 2);

      const number2 = tetradicNumbers[number2Index];

      if (number2 === required1) {
        return [number1, number2];
      }

      if (number2 < required1) {
        const required2 = required1 - number2;

        if (required2 < 0) {
          continue
        }

        const cached = cache.get(required2);

        if (cached && cached.length <= 3) {
          fromCacheCount++
          return [number1, number2, ...cached];
        }

        let left3 = 0;
        let right3 = number2Index + 1;
        let number3Index;

        while (left3 <= right3) {
          number3Index = Math.floor((left3 + right3) / 2);

          const number3 = tetradicNumbers[number3Index];

          if (number3 === required2) {
            return [number1, number2, number3];
          }

          if (number3 < required2) {
            let left4 = 0;
            let right4 = number3Index + 1;
            let number4Index;

            const required3 = required2 - number3;

            if (required3 < 0) {
              continue
            }

            const cached = cache.get(required3);

            if (cached && cached.length <= 2) {
              fromCacheCount++
              return [number1, number2, number3, ...cached];
            }

            while (left4 <= right4) {
              number4Index = Math.floor((left4 + right4) / 2);

              const number4 = tetradicNumbers[number4Index];

              if (number4 === required3) {
                return [number1, number2, number3, number4];
              }

              if (number4 < required3) {
                let left5 = 0;
                let right5 = number4Index + 1;
                let number5Index;

                const required4 = required3 - number4;

                if (required4 < 0) {
                  continue
                }

                const cached = cache.get(required4);

                if (cached && cached.length <= 1) {
                  fromCacheCount++
                  return [number1, number2, number3, number4, ...cached];
                }

                while (left5 <= right5) {
                  number5Index = Math.floor((left5 + right5) / 2);

                  const number5 = tetradicNumbers[number5Index];

                  if (number5 === required4) {
                    return [number1, number2, number3, number4, number5];
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

function test(start: number, end: number, step: number) {
  const tetradicNumbers = makeTetradicNumbers(end);
  const cache = new Map()// preBuild(end);

  for (let i = start; i < end; i++) {
    const result = findSums(i, tetradicNumbers, cache);

    if (result === null || result.reduce((acc, curr) => acc + curr, 0) !== i) {
      throw new Error(`No result for ${i}`);
    }

    if (result.length <= 3 && i < 10_000) {
      cache.set(i, result)
    }
  }

  console.log(`Cache size: ${cache.size}, from cache: ${fromCacheCount}`)
}

const args = Bun.argv.slice(2).map(Number) as [number, number, number];

test(...args);