import { withTime } from "./utils";
import { cc } from 'bun:ffi'

const { symbols: { getLowestTetradicNumberIndex, makeTetradicNumber } } = cc({
  source: './for.c',
  symbols: {
    getLowestTetradicNumberIndex: {
      returns: 'int',
      args: ['double'],
    },
    makeTetradicNumber: {
      returns: 'int',
      args: ['double'],
    },
  },
})

export function findSums(inputNumber: number): number[] | null {
  const nearestTetradicNumberIndex = getLowestTetradicNumberIndex(inputNumber);

  for (let number1Index = nearestTetradicNumberIndex; number1Index > 0; number1Index--) {
    const number1 = makeTetradicNumber(number1Index);

    if (number1 === inputNumber) {
      return [number1];
    }

    for (let number2Index = nearestTetradicNumberIndex; number2Index > 0; number2Index--) {
      const number2 = makeTetradicNumber(number2Index);

      let sum2 = number1 + number2;

      if (sum2 > inputNumber) {
        continue;
      } else if (sum2 === inputNumber) {
        return [number1, number2];
      }

      for (let number3Index = nearestTetradicNumberIndex; number3Index > 0; number3Index--) {
        const number3 = makeTetradicNumber(number3Index);
        const sum3 = sum2 + number3;

        if (sum3 > inputNumber) {
          continue;
        } else if (sum3 === inputNumber) {
          return [number1, number2, number3];
        }

        for (let number4Index = nearestTetradicNumberIndex; number4Index > 0; number4Index--) {
          const number4 = makeTetradicNumber(number4Index);
          const sum4 = sum3 + number4;

          if (sum4 > inputNumber) {
            continue;
          } else if (sum4 === inputNumber) {
            return [number1, number2, number3, number4];
          }

          for (let number5Index = nearestTetradicNumberIndex; number5Index > 0; number5Index--) {
            const number5 = makeTetradicNumber(number5Index);
            const sum5 = sum4 + number5;

            if (sum5 > inputNumber) {
              continue;
            } else if (number1 + number2 + number3 + number4 + number5 === inputNumber) {
              return [number1, number2, number3, number4, number5];
            }
          }
        }
      }
    }
  }

  return null;
}

const [result, time] = withTime(() => {
  for (let i = 1; i < 10_00; i++) {
    findSums(i)
    // console.log(i)
  }
})

console.log('Time', time)