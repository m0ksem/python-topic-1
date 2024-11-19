export function makeTetradicNumber(index: number): number {
  return (index * (index + 1) * (index + 2)) / 6;
}
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

  for (let i1 = 0; i1 < length; i1++) {
    const n1 = makeTetradicNumber(i1);
    const required1 = inputNumber - n1;
    for (let i2 = 0; i2 < length; i2++) {
      const n2 = makeTetradicNumber(i2);
      const required2 = required1 - n2;
      for (let i3 = 0; i3 < length; i3++) {
        const n3 = makeTetradicNumber(i3);
        const required3 = required2 - n3;
        for (let i4 = 0; i4 < length; i4++) {
          const n4 = makeTetradicNumber(i4);
          const required4 = required3 - n4;
          for (let i5 = 0; i5 < length; i5++) {
            const n5 = makeTetradicNumber(i5);
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