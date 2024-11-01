import { makeTetradicNumber, getLowestTetradicNumberIndex, makeTetradicNumberCalls } from './lib';
import { withTime } from './utils'


let count1 = 0
let count2 = 0
let count3 = 0
let count4 = 0
let count5 = 0

export function findSums(inputNumber: number): number[] | null {
  const nearestTetradicNumberIndex = getLowestTetradicNumberIndex(inputNumber);

  for (let number1Index = nearestTetradicNumberIndex; number1Index > 0; number1Index--) {
    const number1 = makeTetradicNumber(number1Index);
    count1++

    const required1 = inputNumber - number1;

    if (required1 < 0) {
      continue
    }

    if (number1 === inputNumber) {
      return [number1];
    }

    let left2 = 0;
    let right2 = number1Index + 1;
    let number2Index;

    while (left2 <= right2) {
      number2Index = Math.floor((left2 + right2) / 2);

      const number2 = makeTetradicNumber(number2Index);
      count2++

      if (number2 === required1) {
        return [number1, number2];
      }

      if (number2 < required1) {
        let left3 = 0;
        let right3 = number2Index + 1;
        let number3Index;

        const required2 = required1 - number2;

        if (required2 < 0) {
          continue
        }

        while (left3 <= right3) {
          number3Index = Math.floor((left3 + right3) / 2);

          const number3 = makeTetradicNumber(number3Index);
          count3++

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

            while (left4 <= right4) {
              number4Index = Math.floor((left4 + right4) / 2);

              const number4 = makeTetradicNumber(number4Index);
              count4++

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

                while (left5 <= right5) {
                  number5Index = Math.floor((left5 + right5) / 2);

                  const number5 = makeTetradicNumber(number5Index);
                  count5++

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

const start = 999_999
const end = 1_000_000

const [result, time] = withTime(() => {
  for (let i = start; i < end; i++) {
    const result = findSums(i);
    if (i % 10000 === 0) {
      process.stdout.write(`\r${i} / ${end} (${Math.floor(i / end * 100)}%)`)
    }
    if (result === null || result.reduce((acc, curr) => acc + curr, 0) !== i || result.length > 5 || result.length < 0) {
      console.log('Failed at', i)
    }
  }
})

console.log(`Finished testing from ${start} to ${end} in ${time / 1000}s`)
console.log('makeTetradicNumber calls count', makeTetradicNumberCalls)
console.log('count1', count1)
console.log('count2', count2)
console.log('count3', count3)
console.log('count4', count4)
console.log('count5', count5)