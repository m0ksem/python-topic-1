export let makeTetradicNumberCalls = 0

export function makeTetradicNumber(index: number): number {
  makeTetradicNumberCalls++
  return (index * (index + 1) * (index + 2)) / 6;
}

const ONE_THIRD = 1 / 3;
const MINUS_ONE_THIRD_CUBE = Math.pow(-ONE_THIRD, 3);

// This function is surprisingly fast
function getTetradicNumberIndex(y: number): number {
  const halfD = -3 * y;

  const discriminant = (halfD ** 2) + MINUS_ONE_THIRD_CUBE;
  const discriminantSqrt = Math.sqrt(discriminant);

  const u = Math.pow(-halfD + discriminantSqrt, ONE_THIRD);
  const v = Math.pow(-halfD - discriminantSqrt, ONE_THIRD);
  return u + v - 1;
}

export function getLowestTetradicNumberIndex(number: number): number {
  return Math.round(getTetradicNumberIndex(number));
}

export function getLowestTetradicNumberIndexBinarySearch(number: number, max: number): number {
  let left = 0;
  let right = max;
  let middle = 0;

  while (left < right) {
    middle = Math.floor((left + right) / 2);
    const value = makeTetradicNumber(middle);

    if (value === number) {
      return middle;
    }

    if (value < number) {
      left = middle + 1;
    } else {
      right = middle - 1;
    }
  }

  return left;
}

// const cache = new Map<number, number>();

// export function makeTetradicNumberWithMemorization(number: number): number {
//   if (cache.has(number)) {
//     return cache.get(number)!;
//   }

//   const result = makeTetradicNumber(number)

//   cache.set(number, result);
  
//   return result
// }

export function isTetradicNumber(number: number): boolean {
  return makeTetradicNumber(getLowestTetradicNumberIndex(number)) === number;
}