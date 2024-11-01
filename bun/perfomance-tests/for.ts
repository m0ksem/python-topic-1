import { makeTetradicNumber, getLowestTetradicNumberIndex, makeTetradicNumberCalls } from './lib';
import { withTime } from './utils'

export function findSums(inputNumber: number): number[] | null {
  const nearestTetradicNumberIndex = getLowestTetradicNumberIndex(inputNumber);

  for (let number1Index = nearestTetradicNumberIndex; number1Index > 0; number1Index--) {
    const number1 = makeTetradicNumber(number1Index);

    if (number1 === inputNumber) {
      return [number1];
    }

    const required1 = inputNumber - number1;

    if (required1 < 0) {
      continue;
    }

    for (let number2Index = getLowestTetradicNumberIndex(required1); number2Index > 0; number2Index--) {
      const number2 = makeTetradicNumber(number2Index);
      const required2 = required1 - number2;

      if (required2 < 0) {
        continue;
      } else if (required2 === 0) {
        return [number1, number2];
      }

      for (let number3Index =  number2Index; number3Index > 0; number3Index--) {
        const number3 = makeTetradicNumber(number3Index);
        const required3 = required2 - number3;

        if (required3 < 0) {
          continue;
        } else if (required3 === 0) {
          return [number1, number2, number3];
        }

        for (let number4Index = number3Index; number4Index > 0; number4Index--) {
          const number4 = makeTetradicNumber(number4Index);
          const required4 = required3 - number4;

          if (required4 < 0) {
            continue;
          } else if (required4 === 0) {
            return [number1, number2, number3, number4];
          }

          for (let number5Index = number4Index; number5Index > 0; number5Index--) {
            const number5 = makeTetradicNumber(number5Index);
            const required5 = required4 - number5;

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

const start = 0
const end = 100_000

const [result, time] = withTime(() => {
  for (let i = start; i < end; i++) {
    const result = findSums(i);
    if (i % 10000 === 0) {
      process.stdout.write(`\r${i} / ${end} (${Math.floor(i / end * 100)}%)`)
    }
    if (result === null || result.reduce((acc, curr) => acc + curr, 0) !== i) {
      console.log('Failed at', i)
    }
  }
})

console.log(`Finished testing from ${start} to ${end} in ${time / 1000}s`)
console.log('makeTetradicNumber calls count', makeTetradicNumberCalls)