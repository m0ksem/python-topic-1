import { makeTetradicNumber } from '../lib';

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
  cache: Map<number, number[]>,
  result: [number, number, number, number, number]
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
        result[0] = number1;
        result[1] = cached[0] ?? 0;
        result[2] = cached[1] ?? 0;
        result[3] = cached[2] ?? 0;
        result[4] = cached[3] ?? 0;
        return result;
      } else {
        break
      }
    }

    if (number1 === inputNumber) {
      result[0] = number1;
      result[1] = 0;
      result[2] = 0;
      result[3] = 0;
      result[4] = 0;
      return result
    }

    let left2 = 0;
    let right2 = number1Index + 1;
    let number2Index;

    while (left2 <= right2) {
      number2Index = Math.floor((left2 + right2) / 2);

      const number2 = tetradicNumbers[number2Index];

      if (number2 === required1) {
        result[0] = number1;
        result[1] = number2;
        result[2] = 0;
        result[3] = 0;
        result[4] = 0;
        return result
      }

      if (number2 < required1) {
        const required2 = required1 - number2;

        if (required2 < 0) {
          continue
        }

        const cached = cache.get(required2);

        if (cached) {
          if (cached.length <= 3) {
            result[0] = number1;
            result[1] = number2;
            result[2] = cached[0] ?? 0;
            result[3] = cached[1] ?? 0;
            result[4] = cached[2] ?? 0;
            return result
          } else {
            break
          }
        }

        let left3 = 0;
        let right3 = number2Index + 1;
        let number3Index;

        while (left3 <= right3) {
          number3Index = Math.floor((left3 + right3) / 2);

          const number3 = tetradicNumbers[number3Index];

          if (number3 === required2) {
            result[0] = number1;
            result[1] = number2;
            result[2] = number3;
            result[3] = 0;
            result[4] = 0;
            return result
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

            if (cached) {
              if (cached.length <= 2) {
                result[0] = number1;
                result[1] = number2;
                result[2] = number3;
                result[3] = cached[0] ?? 0;
                result[4] = cached[1] ?? 0;
                return result
              } else {
                break
              }
            }

            while (left4 <= right4) {
              number4Index = Math.floor((left4 + right4) / 2);

              const number4 = tetradicNumbers[number4Index];

              if (number4 === required3) {
                result[0] = number1;
                result[1] = number2;
                result[2] = number3;
                result[3] = number4;
                result[4] = 0;
                return result
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

                if (cached) {
                  if (cached.length <= 1) {
                    result[0] = number1;
                    result[1] = number2;
                    result[2] = number3;
                    result[3] = number4;
                    result[4] = cached[0] ?? 0;
                    return result
                  } else {
                    break
                  }
                }

                while (left5 <= right5) {
                  number5Index = Math.floor((left5 + right5) / 2);

                  const number5 = tetradicNumbers[number5Index];

                  if (number5 === required4) {
                    result[0] = number1;
                    result[1] = number2;
                    result[2] = number3;
                    result[3] = number4;
                    result[4] = number5;
                    return result
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
  const cache = preBuild(end);
  const result = [0, 0, 0, 0, 0] as [number, number, number, number, number];

  for (let i = start; i < end; i++) {
    findSums(i, tetradicNumbers, cache, result);

    if (result === null) {
      throw new Error(`No result for ${i}`, result);
    }
    if (result.reduce((acc, curr) => acc + curr, 0) !== i) {
      throw new Error(`Invalid result for ${i} ` + result);
    }
  }

  console.log(`Cache size: ${cache.size}, from cache: ${fromCacheCount}`)
}

const args = Bun.argv.slice(2).map(Number) as [number, number, number];

test(...args);