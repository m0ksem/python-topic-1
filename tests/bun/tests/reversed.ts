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

  for (let i1 = length - 1; i1 >= 0; i1--) {
    const n1 = tetradicNumbers[i1];
    if (n1 === inputNumber) {
      return [n1];
    }

    if (n1 > inputNumber) {
      continue;
    }

    for (let i2 = length - 1; i2 >= i1; i2--) {
      const n2 = tetradicNumbers[i2];
      const required2 = inputNumber - n1 - n2;
      if (required2 === 0) {
        return [n1, n2];
      }

      if (required2 < 0) {
        continue;
      }

      for (let i3 = i2; i3 >= i1; i3--) {
        const n3 = tetradicNumbers[i3];
        const required3 = required2 - n3;
        if (required3 === 0) {
          return [n1, n2, n3];
        }

        if (required3 < 0) {
          continue;
        }

        for (let i4 = i3; i4 >= i1; i4--) {
          const n4 = tetradicNumbers[i4];
          const required4 = required3 - n4;
          if (required4 === 0) {
            return [n1, n2, n3, n4];
          }

          if (required4 < 0) {
            continue;
          }

          for (let i5 = i4; i5 >= i1; i5--) {
            const n5 = tetradicNumbers[i5];
            const required5 = required4 - n5;
            if (required5 === 0) {
              return [n1, n2, n3, n4, n5];
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