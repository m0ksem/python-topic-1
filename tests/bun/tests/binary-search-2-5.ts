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

  let left1 = 0;
  let right1 = length - 1;

  while (left1 <= right1) {
    const sum = tetradicNumbers[left1];
    if (sum === inputNumber) {
      return [tetradicNumbers[left1]];
    }

    if (sum > inputNumber) {
      right1--;
    } else {
      left1++;

      let left2 = 0;
      let right2 = right1;

      while (left2 <= right2) {
        const sum2 = tetradicNumbers[left1] + tetradicNumbers[right2];
        if (sum2 === inputNumber) {
          return [tetradicNumbers[left1], tetradicNumbers[right2]];
        }

        if (sum2 > inputNumber) {
          right2--;
        } else {
          left2++;

          let left3 = 0;
          let right3 = right2;

          while (left3 <= right3) {
            const sum3 = tetradicNumbers[left1] + tetradicNumbers[left2] + tetradicNumbers[right3];
            if (sum3 === inputNumber) {
              return [tetradicNumbers[left1], tetradicNumbers[left2], tetradicNumbers[right3]];
            }

            if (sum3 > inputNumber) {
              right3--;
            } else {
              left3++;

              let left4 = 0;
              let right4 = right3;

              while (left4 <= right4) {
                const sum4 = tetradicNumbers[left1] + tetradicNumbers[left2] + tetradicNumbers[left3] + tetradicNumbers[right4];
                if (sum4 === inputNumber) {
                  return [tetradicNumbers[left1], tetradicNumbers[left2], tetradicNumbers[left3], tetradicNumbers[right4]];
                }

                if (sum4 > inputNumber) {
                  right4--;
                } else {
                  left4++;

                  let left5 = 0;
                  let right5 = right4;

                  while (left5 <= right5) {
                    const sum5 = tetradicNumbers[left1] + tetradicNumbers[left2] + tetradicNumbers[left3] + tetradicNumbers[left4] + tetradicNumbers[right5];
                    if (sum5 === inputNumber) {
                      return [tetradicNumbers[left1], tetradicNumbers[left2], tetradicNumbers[left3], tetradicNumbers[left4], tetradicNumbers[right5]];
                    }

                    if (sum5 > inputNumber) {
                      right5--;
                    } else {
                      left5++;
                    }
                  }
                }
              }
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