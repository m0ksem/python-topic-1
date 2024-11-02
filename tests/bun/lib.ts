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
  return Math.round(u + v - 1)
}

export function getLowestTetradicNumberIndex(number: number): number {
  return Math.round(getTetradicNumberIndex(number));
}

const TEN_THOUSAND_INDEX = 200

export const preBuild = (start: number, end: number) => {
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