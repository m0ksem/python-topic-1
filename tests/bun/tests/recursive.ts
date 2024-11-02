import { makeTetradicNumber, getLowestTetradicNumberIndex } from '../lib';

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

function test(start: number, end: number, step: number) {
  for (let i = start; i < end; i++) {
    const result = findSums(i);

    if (result === null || result.reduce((acc, curr) => acc + curr, 0) !== i) {
      throw new Error(`No result for ${i}`);
    }
  }
}

const args = Bun.argv.slice(2).map(Number) as [number, number, number];

test(...args);