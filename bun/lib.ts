function makeTetradicNumber(index: number): number {
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

function getLowestTetradicNumberIndex(number: number): number {
  return Math.round(getTetradicNumberIndex(number));
}

function findSums(inputNumber: number): number[] | null {
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

export function tryRangeHypothesis(start: number, end: number): boolean {
  const startTime = new Date().getTime();

  for (let i = start; i < end; i++) {
      const result = findSums(i);
      if (result === null || result.length > 5) {
          console.log(`Failed at ${i}`, result);
      }
  }

  const endTime = new Date().getTime();

  console.log(`Finished testing from ${start} to ${end} in ${(endTime - startTime) / 1000}s`);
  return true;
}

export function tryRangeHypothesisToFile(start: number, end: number): boolean {
  const startTime = new Date().getTime();

  const results = [] as { number: number, result: number[] | null }[];

  for (let i = start; i < end; i++) {
      const result = findSums(i);
      if (result === null || result.length > 5) {
        results.push({ number: i, result });
      } else {
        results.push({ number: i, result });
      }
  }

  Bun.write(`./out/results-${start}-${end}.json`, JSON.stringify(results));

  const endTime = new Date().getTime();

  console.log(`Finished testing from ${start} to ${end} in ${(endTime - startTime) / 1000}s`);
  return true;
}
