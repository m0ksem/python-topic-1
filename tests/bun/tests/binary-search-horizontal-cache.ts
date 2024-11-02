import { makeTetradicNumber, getLowestTetradicNumberIndex, makeTetradicNumberCalls } from '../lib';

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

export function findSums(inputNumber: number, tetradicNumbers: number[], cache: Map<number, number[]>): number[] | null {
  const length = tetradicNumbers.length;

  for (let number1Index = length - 1; number1Index > 0; number1Index--) {
    const number1 = tetradicNumbers[number1Index];

    const required1 = inputNumber - number1;

    if (number1 === inputNumber) {
      return [number1];
    }

    if (number1 + number1 < required1) {
      continue
    }

    const cached = cache.get(required1);
    if (cached && cached.length <= 4) {
      return [number1, ...cached];
    }

    let left2 = 0;
    let right2 = number1Index + 1;
    let number2Index;

    while (left2 <= right2) {
      number2Index = Math.floor((left2 + right2) / 2);

      const number2 = tetradicNumbers[number2Index];
      if (number2 > number1) {
        break
      }

      if (number2 === required1) {
        return [number1, number2];
      }

      if (number2 < required1) {
        left2 = number2Index + 1;
      } else {
        right2 = number2Index - 1;
      }
    }
  }

  for (let number1Index = length - 1; number1Index > 0; number1Index--) {
    const number1 = tetradicNumbers[number1Index];

    for (let number2Index = 0; number2Index <= number1Index; number2Index++) {
      const number2 = tetradicNumbers[number2Index];
      const required2 = inputNumber - number1 - number2;

      if (number2 + number2 < required2) {
        continue
      }

      if (required2 < 0) {
        continue
      }

      const cached = cache.get(required2);
      if (cached && cached.length <= 3) {
        return [number1, number2, ...cached];
      }

      let left3 = 0;
      let right3 = number2Index + 1;
      let number3Index;

      while (left3 <= right3) {
        number3Index = Math.floor((left3 + right3) / 2);

        const number3 = tetradicNumbers[number3Index];

        if (number3 > number2) {
          break
        }

        if (number3 === required2) {
          return [number1, number2, number3];
        }

        if (number3 < required2) {
          left3 = number3Index + 1;
        } else {
          right3 = number3Index - 1;
        }
      }
    }
  }

  for (let number1Index = length - 1; number1Index > 0; number1Index--) {
    const number1 = tetradicNumbers[number1Index];
    for (let number2Index = number1Index; number2Index > 0; number2Index--) {
      const number2 = tetradicNumbers[number2Index];
      for (let number3Index = number2Index; number3Index > 0; number3Index--) {
        const number3 = tetradicNumbers[number3Index];
        const required3 = inputNumber - number1 - number2 - number3;

        if (number3 + number3 < required3) {
          continue
        }

        if (required3 < 0) {
          continue
        }

        const cached = cache.get(required3);
        if (cached && cached.length <= 2) {
          return [number1, number2, number3, ...cached];
        }

        let left4 = 0;
        let right4 = number3Index + 1;
        let number4Index;

        while (left4 <= right4) {
          number4Index = Math.floor((left4 + right4) / 2);

          const number4 = tetradicNumbers[number4Index];

          if (number4 > number3) {
            break
          }

          if (number4 === required3) {
            return [number1, number2, number3, number4];
          }

          if (number4 < required3) {
            left4 = number4Index + 1;
          } else {
            right4 = number4Index - 1;
          }
        }
      }
    }
  }

  for (let number1Index = length - 1; number1Index > 0; number1Index--) {
    const number1 = tetradicNumbers[number1Index];
    for (let number2Index = number1Index; number2Index > 0; number2Index--) {
      const number2 = tetradicNumbers[number2Index];
      for (let number3Index = number2Index; number3Index > 0; number3Index--) {
        const number3 = tetradicNumbers[number3Index];
        for (let number4Index = number3Index; number4Index > 0; number4Index--) { 
          const number4 = tetradicNumbers[number4Index];
          const required4 = inputNumber - number1 - number2 - number3 - number4;

          if (required4 < 0) {
            continue
          }

          if (number4 + number4 < required4) {
            continue
          }


          const cached = cache.get(required4);
          if (cached && cached.length <= 1) {
            return [number1, number2, number3, number4, ...cached];
          }

          let left5 = 0;
          let right5 = number4Index + 1;
          let number5Index;

          while (left5 <= right5) {
            number5Index = Math.floor((left5 + right5) / 2);

            const number5 = tetradicNumbers[number5Index];

            if (number5 > number4) {
              break
            }

            if (number5 === required4) {
              return [number1, number2, number3, number4, number5];
            }

            if (number5 < required4) {
              left5 = number5Index + 1;
            } else {
              right5 = number5Index - 1;
            }
          }
        }
      }
    }
  }

  return null;
}

let counts = {
  1: 0,
  2: 0,
  3: 0,
  4: 0,
  5: 0
} as Record<number, number>;

function test(start: number, end: number, step: number) {
  const tetradicNumbers = makeTetradicNumbers(end);
  const cache = new Map<number, number[]>();

  for (let i = start; i < end; i++) {
    const result = findSums(i, tetradicNumbers, cache);

    if (result === null || result.reduce((acc, curr) => acc + curr, 0) !== i) {
      throw new Error(`No result for ${i}`);
    }

    cache.set(i, result);
  }
}

const args = Bun.argv.slice(2).map(Number) as [number, number, number];

test(...args);