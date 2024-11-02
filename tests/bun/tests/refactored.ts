import { makeTetradicNumber } from '../lib';

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


const TEN_THOUSAND_INDEX = 100

const preBuild = (end: number) => {
  const results = new Map<number, number[]>()

  // Prebuild small numbers, because they repeat frequently
  for (let i = 1; i <= TEN_THOUSAND_INDEX; i++) {
    const number1 = makeTetradicNumber(i)
   
    for (let j = 1; j <= TEN_THOUSAND_INDEX; j++) {
      const number2 = makeTetradicNumber(j)
      const sum = number1 + number2
      
      if (sum > end) {
        break
      }

      for (let k = 1; k <= TEN_THOUSAND_INDEX; k++) {
        const number3 = makeTetradicNumber(k)
        const sum = number1 + number2 + number3
        
        if (sum > end) {
          break
        }
  
        results.set(sum, [number1, number2, number3])
      }

      results.set(sum, [number1, number2])
    }

    results.set(number1, [number1])
  }

  return results
}

let fromCacheCount = 0

export function findSums(
  inputNumber: number,
  tetradicNumbers: number[],
  cache: Map<number, number[]>
): number[] | null {
  const length = tetradicNumbers.length;

  function checkCache(required: number, numbers: number[], maxLength: number): number[] | null {
    const cached = cache.get(required);
    if (cached && cached.length <= maxLength) {
      return [...numbers, ...cached];
    }
    return null;
  }

  function binarySearch(
    requiredSum: number,
    start: number,
    end: number,
    numbers: number[],
    maxLength: number
  ): number[] | null {
    while (start <= end) {
      const index = Math.floor((start + end) / 2);
      const currentNumber = tetradicNumbers[index];

      if (currentNumber === requiredSum) {
        return [...numbers, currentNumber];
      }

      if (currentNumber < requiredSum) {
        const newRequired = requiredSum - currentNumber;
        const resultFromCache = checkCache(newRequired, [...numbers, currentNumber], maxLength - 1);
        if (resultFromCache) return resultFromCache;

        const nextResult = binarySearch(newRequired, 0, index - 1, [...numbers, currentNumber], maxLength - 1);
        if (nextResult) return nextResult;

        start = index + 1;
      } else {
        end = index - 1;
      }
    }

    return null;
  }

  for (let number1Index = length - 1; number1Index >= 0; number1Index--) {
    const number1 = tetradicNumbers[number1Index];
    const required1 = inputNumber - number1;

    if (required1 < 0) continue;
    const resultFromCache = checkCache(required1, [number1], 4);
    if (resultFromCache) return resultFromCache;

    const result = binarySearch(required1, 0, number1Index - 1, [number1], 4);
    if (result) return result;
  }

  return null;
}

function test(start: number, end: number, step: number) {
  const tetradicNumbers = makeTetradicNumbers(end);
  const cache = preBuild(end);

  for (let i = start; i < end; i++) {
    const result = findSums(i, tetradicNumbers, cache);

    if (result === null || result.reduce((acc, curr) => acc + curr, 0) !== i) {
      throw new Error(`No result for ${i}`);
    }

    if (result.length <= 3 && i < 10_000) {
      cache.set(i, result)
    }
  }

  console.log(`Cache size: ${cache.size}, from cache: ${fromCacheCount}`)
}

const args = Bun.argv.slice(2).map(Number) as [number, number, number];

test(...args);