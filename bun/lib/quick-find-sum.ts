import { getLowestTetradicNumberIndex, makeTetradicNumber } from "./tetradic";

export function quickFindSum(inputNumber: number, cache: Map<number, number[]>): number[] | null {
  const nearestTetradicNumberIndex = getLowestTetradicNumberIndex(inputNumber);

  for (let number1Index = nearestTetradicNumberIndex; number1Index > 0; number1Index--) {
    const number1 = makeTetradicNumber(number1Index);

    if (number1 === inputNumber) {
      return [number1];
    }

    const required1 = inputNumber - number1;

    if (cache.has(required1)) {
      const cached = cache.get(required1)!;

      if (cached.length > 4) {
        continue
      }

      return [number1, ...cached]
    }

    if (required1 < 0) {
      continue;
    }

    for (let number2Index = getLowestTetradicNumberIndex(required1); number2Index > 0; number2Index--) {
      const number2 = makeTetradicNumber(number2Index);
      const required2 = required1 - number2;

      if (cache.has(required2)) {
        const cached = cache.get(required2)!;

        if (cached.length > 3) {
          continue
        }

        return [number1, number2, ...cached]
      }

      if (required2 < 0) {
        continue;
      } else if (required2 === 0) {
        return [number1, number2];
      }

      for (let number3Index =  number2Index; number3Index > 0; number3Index--) {
        const number3 = makeTetradicNumber(number3Index);
        const required3 = required2 - number3;

        if (cache.has(required3)) {
          const cached = cache.get(required3)!;

          if (cached.length > 2) {
            continue
          }

          return [number1, number2, number3, ...cached]
        }

        if (required3 < 0) {
          continue;
        } else if (required3 === 0) {
          return [number1, number2, number3];
        }

        for (let number4Index = number3Index; number4Index > 0; number4Index--) {
          const number4 = makeTetradicNumber(number4Index);
          const required4 = required3 - number4;

          if (cache.has(required4)) {
            const cached = cache.get(required4)!;

            if (cached.length > 1) {
              continue
            }

            return [number1, number2, number3, number4, ...cached]
          }

          if (required4 < 0) {
            continue;
          } else if (required4 === 0) {
            return [number1, number2, number3, number4];
          }

          for (let number5Index = number4Index; number5Index > 0; number5Index--) {
            const number5 = makeTetradicNumber(number5Index);
            const required5 = required4 - number5;

            if (required5 < 0) {
              continue;
            } else if (required5 === 0) {
              return [number1, number2, number3, number4, number5];
            }
          }
        }
      }
    }
  }

  return null;
}