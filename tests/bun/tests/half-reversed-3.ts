import { makeTetradicNumber, getLowestTetradicNumberIndex } from '../lib';

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

function findSums(inputNumber: number): number[] | null {
  const tetradicNumbers = makeTetradicNumbers(inputNumber);
  const length = tetradicNumbers.length;

  for (let i = length - 1; i >= 0; i--) {
    const required1 = tetradicNumbers[i];

    if (required1 < 0) {
      continue;
    }

    if (required1 === inputNumber) {
      return [tetradicNumbers[i]];
    }

    for (let j = length - 1; j >= i; j--) {
      const required2 = required1 - tetradicNumbers[j];
      if (required2 === inputNumber) {
         return [tetradicNumbers[i], tetradicNumbers[j]];
      }

      if (required2 < 0) {
        continue;
      }

      for (let k = 0; k <= i; k++) {
        const required3 = required2 - tetradicNumbers[k];
        if (required3 === inputNumber) {
          return [tetradicNumbers[i], tetradicNumbers[j], tetradicNumbers[k]];
        }

        if (required3 < 0) {
          continue;
        }

        for (let l = 0; l <= i; l++) {
          const required4 = required3 - tetradicNumbers[l];
          if (required4 === inputNumber) {
            return [tetradicNumbers[i], tetradicNumbers[j], tetradicNumbers[k], tetradicNumbers[l]];
          }

          if (required4 < 0) {
            continue;
          }

          for (let m = 0; m <= i; m++) {
            if (required4 - tetradicNumbers[m] === inputNumber) {
              return [tetradicNumbers[i], tetradicNumbers[j], tetradicNumbers[k], tetradicNumbers[l], tetradicNumbers[m]];
            }
          }
        }
      }
    }
  }

  return null;
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