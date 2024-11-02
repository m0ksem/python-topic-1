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

function findSums(inputNumber: number, tetradicNumbers: number[]): number[] | null {
  const length = tetradicNumbers.length

  for (let i = length - 1; i >= 0; i--) {
    if (tetradicNumbers[i] > inputNumber) {
      continue
    }

    const sum = tetradicNumbers[i];
    if (tetradicNumbers[i] === inputNumber) {
      return [tetradicNumbers[i]];
    }

    if (sum > inputNumber) {
      continue;
    }

    for (let j = length - 1; j >= i; j--) {
      const sum2 = tetradicNumbers[i] + tetradicNumbers[j];
      if (sum2 === inputNumber) {
         return [tetradicNumbers[i], tetradicNumbers[j]];
      }

      if (sum2 > inputNumber) {
        continue;
      }

      for (let k = j; k >= i; k--) {
        const sum3 = tetradicNumbers[i] + tetradicNumbers[j] + tetradicNumbers[k];
        if (sum3 === inputNumber) {
          return [tetradicNumbers[i], tetradicNumbers[j], tetradicNumbers[k]];
        }

        if (sum3 > inputNumber) {
          continue;
        }

        for (let l = 0; l <= i; l++) {
          const sum4 = tetradicNumbers[i] + tetradicNumbers[j] + tetradicNumbers[k] + tetradicNumbers[l];
          if (sum4 === inputNumber) {
            return [tetradicNumbers[i], tetradicNumbers[j], tetradicNumbers[k], tetradicNumbers[l]];
          }

          if (sum4 > inputNumber) {
            continue;
          }

          for (let m = 0; m <= i; m++) {
            if (tetradicNumbers[i] + tetradicNumbers[j] + tetradicNumbers[k] + tetradicNumbers[l] + tetradicNumbers[m] === inputNumber) {
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
  const tetradicNumbers = makeTetradicNumbers(end);

  for (let i = start; i < end; i++) {
    const result = findSums(i, tetradicNumbers);

    if (result === null || result.reduce((acc, curr) => acc + curr, 0) !== i) {
      throw new Error(`No result for ${i}`);
    }
  }
}

const args = Bun.argv.slice(2).map(Number) as [number, number, number];

test(...args);