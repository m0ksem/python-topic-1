import { makeTetradicNumber, getLowestTetradicNumberIndex, makeTetradicNumberCalls } from './lib';
import { withTime } from './utils'

function findSumBinarySearch(maxIndex: number, sum: number): number | null {
  let left = 0;
  let right = maxIndex + 1;
  let number2Index = Math.floor((left + right) / 2);

  while (left < right) {
    number2Index = Math.floor((left + right) / 2);
    const number2 = makeTetradicNumber(number2Index);

    const diff = sum - number2;

    if (diff === 0) {
      return number2;
    }

    if (diff < 0) {
      right = number2Index;
    } else {
      left = number2Index + 1;
    }
  }

  return null;
}

export function findSums(inputNumber: number): number[] | null {
  const nearestTetradicNumberIndex = getLowestTetradicNumberIndex(inputNumber);

  for (let number1Index = nearestTetradicNumberIndex; number1Index > 0; number1Index--) {
    const number1 = makeTetradicNumber(number1Index);

    if (number1 === inputNumber) {
      return [number1];
    }
    
    const required = inputNumber - number1;
    if (required < 0) {
      continue;
    }
    const number2 = findSumBinarySearch(number1Index, required);

    if (number2 !== null) {
      return [number1, number2];
    }

    for (let number2Index = number1Index; number2Index > 0; number2Index--) {
      const number2 = makeTetradicNumber(number2Index);
      
      if (required === number2) {
        return [number1, number2];
      }

      const required2 = required - number2;
      if (required2 < 0) {
        continue;
      }
      const number3 = findSumBinarySearch(number2Index, required2);

      if (number3 !== null) {
        return [number1, number2, number3];
      }

      for (let number3Index = number2Index; number3Index > 0; number3Index--) {
        const number3 = makeTetradicNumber(number3Index);
        const required3 = required2 - number3;
        if (required3 < 0) {
          continue;
        }
        const number4 = findSumBinarySearch(number3Index, required3);

        if (number4 !== null) {
          return [number1, number2, number3, number4];
        }

        for (let number4Index = number3Index; number4Index > 0; number4Index--) {
          const number4 = makeTetradicNumber(number4Index);

          const required4 = required3 - number4;
          if (required4 < 0) {
            continue;
          }
          const number5 = findSumBinarySearch(number4Index, required4);

          if (number5 !== null) {
            return [number1, number2, number3, number4, number5];
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