const ONE_THIRD = 1 / 3;
const MINUS_ONE_THIRD_CUBE = Math.pow(-ONE_THIRD, 3);

function getTetradicNumberIndex(y: number): number {
  const halfD = -3 * y;
  const discriminantSqrt = Math.sqrt((halfD ** 2) + MINUS_ONE_THIRD_CUBE);

  const offsetD = -halfD;
  const u = Math.cbrt(offsetD + discriminantSqrt);
  const v = Math.cbrt(offsetD - discriminantSqrt);
  return Math.round(u + v - 1);
}

function findSums(
  inputNumber: number,
  tetradicNumbers: number[],
  preBuiltArray: Record<number, number[]>
): number[] | null {
  let prebuilt = preBuiltArray[(inputNumber)];

  if (prebuilt) {
    return prebuilt;
  }

  let number1Index = getTetradicNumberIndex(inputNumber)

  let left2;
  let right2
  let number2Index;

  for (; number1Index > 0; number1Index--) {
    const number1 = tetradicNumbers[number1Index];
 
    const required1 = inputNumber - number1;

    if (required1 < 0) {
      continue
    }

    prebuilt = preBuiltArray[(required1)];

    if (prebuilt) {
      if (prebuilt.length > 4) {
        break
      }
      return [number1, prebuilt[0], prebuilt[1] ?? 0, prebuilt[2] ?? 0, 0];
    }

    if (number1 === inputNumber) {
      return [number1];
    }

    left2 = 0;
    right2 = number1Index + 1;
    number2Index;

    while (left2 <= right2) {
      number2Index = Math.floor((left2 + right2) / 2);

      const number2 = tetradicNumbers[number2Index];

      if (number2 === required1) {
        return [number1, number2];
      }

      if (required1 > number2) { 
        const required2 = required1 - number2;

        prebuilt = preBuiltArray[(required2)];

        if (prebuilt) {
          if (prebuilt.length > 3) {
            break
          }
          return [number1, number2, prebuilt[0], prebuilt[1] ?? 0, prebuilt[2] ?? 0];
        }

        left2 = number2Index + 1;

        let left3 = 0;
        let right3 = left2;
        let number3Index;

        while (left3 <= right3) {
          number3Index = Math.floor((left3 + right3) / 2);

          const number3 = tetradicNumbers[number3Index];

          if (number3 === required2) {
            return [number1, number2, number3];
          }

          if (required2 > number3) {
            const required3 = required2 - number3;

            prebuilt = preBuiltArray[(required3)];

            if (prebuilt) {
              if (prebuilt.length > 2) {
                break
              }
              return [number1, number2, number3, prebuilt[0], prebuilt[1] ?? 0];
            }

            left3 = number3Index + 1;

            let left4 = 0;
            let right4 = left3;
            let number4Index;

            while (left4 <= right4) {
              number4Index = Math.floor((left4 + right4) / 2);

              const number4 = tetradicNumbers[number4Index];

              if (number4 === required3) {
                return [number1, number2, number3, number4];
              }

              if (required3 > number4) {
                const required4 = required3 - number4;

                prebuilt = preBuiltArray[(required4)];

                if (prebuilt) {
                  if (prebuilt.length > 1) {
                    break
                  } 
                  return [number1, number2, number3, number4, prebuilt[0]];
                }

                left4 = number4Index + 1;

                let left5 = 0;
                let right5 = left4;
                let number5Index;

                while (left5 <= right5) {
                  number5Index = Math.floor((left5 + right5) / 2);

                  const number5 = tetradicNumbers[number5Index];

                  if (number5 === required4) {
                    return [number1, number2, number3, number4, number5];
                  }

                  if (required4 > number5) {
                    left5 = number5Index + 1;
                  } else {
                    right5 = number5Index - 1;
                  }
                }
              } else {
                right4 = number4Index - 1;
              }
            }
          } else {
            right3 = number3Index - 1;
          }
        }
      } else {
        right2 = number2Index - 1;
      }
    }
  }

  return null;
}

function makeTetradicNumber(index: number): number {
  return (index * (index + 1) * (index + 2)) / 6;
}

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

      for (let k = 1; k <= TEN_THOUSAND_INDEX / 2; k++) {
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

// prevents TS errors
declare var self: Worker;

const counts = [0, 0, 0, 0, 0]

self.onmessage = (event: MessageEvent) => {
  const { start, end } = event.data

  const tetradicNumbers = makeTetradicNumbers(end);
  const cache = preBuild(end);

  for (let i = start; i <= end; i++) {
    const result = findSums(i, tetradicNumbers, cache)
    
    if (result === null) {
      postMessage({ error: 'Failed at ' + i });
      throw new Error('Failed at ' + i)
    }

    counts[result.length - 1]++ 
  
    let sum = 0

    for (let j = 0; j < result.length; j++) {
      sum += result[j]
    }

    if (sum !== i) {
      postMessage({ error: 'Failed at ' + i + ' sum is incorrect (' + sum + ')' });
      throw new Error('Failed at ' + i + ' sum is incorrect (' + sum + ')')
    }
  }

  postMessage({
    counts,
    // sums: results,
    start: event.data.start,
    end: event.data.end,
  });
};