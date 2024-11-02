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

  for (let i = 0; i < length; i++) {
    if (tetradicNumbers[i] === inputNumber) {
      return [tetradicNumbers[i]];
    }

    for (let j = i; j < length; j++) {
      const sum2 = tetradicNumbers[i] + tetradicNumbers[j];

      if (sum2 === inputNumber) {
        return [tetradicNumbers[i], tetradicNumbers[j]];
      }
      
      if (sum2 > inputNumber) {
        break;
      }

      for (let k = j; k < length; k++) {
        const sum3 = tetradicNumbers[i] + tetradicNumbers[j] + tetradicNumbers[k];
        if (sum3 === inputNumber) {
          return [tetradicNumbers[i], tetradicNumbers[j], tetradicNumbers[k]];
        }

        if (sum3 > inputNumber) {
          break;
        }

        for (let l = k; l < length; l++) {
          const sum4 = tetradicNumbers[i] + tetradicNumbers[j] + tetradicNumbers[k] + tetradicNumbers[l];
          if (sum4 === inputNumber) {
            return [tetradicNumbers[i], tetradicNumbers[j], tetradicNumbers[k], tetradicNumbers[l]];
          }

          if (sum4 > inputNumber) {
            break;
          }

          for (let m = l; m < length; m++) {
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
  for (let i = start; i < end; i++) {
    const result = findSums(i);

    if (result === null || result.reduce((acc, curr) => acc + curr, 0) !== i) {
      throw new Error(`No result for ${i}`);
    }
  }
}

const args = Bun.argv.slice(2).map(Number) as [number, number, number];

test(...args);