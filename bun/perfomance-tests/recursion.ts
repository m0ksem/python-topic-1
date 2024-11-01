import { makeTetradicNumber, getLowestTetradicNumberIndex, makeTetradicNumberCalls } from './lib';
import { withTime } from './utils';

export function findSums(inputNumber: number): number[] | null {
  const nearestTetradicNumberIndex = getLowestTetradicNumberIndex(inputNumber);

  function iterateSum(iterableNumberIndex: number, currentSum: number): number[] | null {
      if (iterableNumberIndex >= 5) {
          return null;
      }

      for (let numberIndex = nearestTetradicNumberIndex; numberIndex > 0; numberIndex--) {
          const number = makeTetradicNumber(numberIndex);
          const newSum = currentSum + number;

          if (newSum === inputNumber) {
              return [number];
          } else if (newSum > inputNumber) {
              continue;
          }

          // Unable to make sum with 5 numbers, no need to continue checking lower numbers
          if (iterableNumberIndex === 4) {
              return null;
          }

          const found = iterateSum(iterableNumberIndex + 1, newSum);
          if (found !== null) {
              return [number, ...found];
          }
      }

      return null;
  }

  return iterateSum(0, 0);
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