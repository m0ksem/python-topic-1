import { getLowestTetradicNumberIndex, makeTetradicNumber } from "../lib";

export function findSum(inputNumber: number, cache: Map<number, number[]>): number[] | null {
  const cached = cache.get(inputNumber);
  if (cached) {
    return cached
  }
  
  // NOTICE: Must be without "-1", we keep -1 because it is easier to calculate large numbers.
  // Because small numbers are precalculated and stored in the cache we can add -1. For small numbers -1 can ruin calculations.
  const nearestTetradicNumberIndex = getLowestTetradicNumberIndex(inputNumber) - 1;

  for (let number1Index = nearestTetradicNumberIndex; number1Index > 0; number1Index--) {
    const number1 = makeTetradicNumber(number1Index);

    if (number1 === inputNumber) {
      return [number1];
    }

    const required1 = inputNumber - number1;

    if (required1 < 0) {
      continue
    }

    const cached = cache.get(required1)!;

    if (cached && cached.length <= 4) {
      return [number1, ...cached]
    }

    let left2 = 0;
    let right2 = nearestTetradicNumberIndex + 1;
    let number2Index;

    while (left2 <= right2) {
      number2Index = Math.floor((left2 + right2) / 2);

      const number2 = makeTetradicNumber(number2Index);

      if (number2 === required1) {
        return [number1, number2];
      }

      if (number2 < required1) {
        let left3 = 0;
        let right3 = number2Index + 1;
        let number3Index;

        const required2 = required1 - number2;

        if (required2 < 0) {
          continue
        }

        const cached = cache.get(required2)!;

        if (cached) {
          if (cached.length <= 3) {
            return [number1, number2, ...cached]
          } else {
            break
          }
        }

        while (left3 <= right3) {
          number3Index = Math.floor((left3 + right3) / 2);

          const number3 = makeTetradicNumber(number3Index);

          if (number3 === required2) {
            return [number1, number2, number3];
          }

          if (number3 < required2) {
            let left4 = 0;
            let right4 = number3Index + 1;
            let number4Index;

            const required3 = required2 - number3;

            if (required3 < 0) {
              continue
            }

            const cached = cache.get(required3)!;

            if (cached) {
              if (cached.length <= 2) {
                return [number1, number2, number3, ...cached]
              } else {
                break
              }
            }

            while (left4 <= right4) {
              number4Index = Math.floor((left4 + right4) / 2);

              const number4 = makeTetradicNumber(number4Index);

              if (number4 === required3) {
                return [number1, number2, number3, number4];
              }

              if (number4 < required3) {
                let left5 = 0;
                let right5 = number4Index + 1;
                let number5Index;

                const required4 = required3 - number4;

                if (required4 < 0) {
                  continue
                }

                if (cache.has(required4)) {
                  const cached = cache.get(required4)!;
                  if (cached.length <= 1) {
                    return [number1, number2, number3, number4,...cached]
                  } else {
                    break
                  }
                }

                while (left5 <= right5) {
                  number5Index = Math.floor((left5 + right5) / 2);

                  const number5 = makeTetradicNumber(number5Index);

                  if (number5 === required4) {
                    return [number1, number2, number3, number4, number5];
                  }

                  if (number5 < required4) {
                    left5 = number5Index + 1;
                  } else {
                    right5 = number5Index - 1;
                  }
                }

                left4 = number4Index + 1;
              } else {
                right4 = number4Index - 1;
              }
            }

          }

          if (number3 < required2) {
            left3 = number3Index + 1;
          } else {
            right3 = number3Index - 1;
          }
        }


        left2 = number2Index + 1;
      } else {
        right2 = number2Index - 1;
      }
    }
  }

  return null;
}

// prevents TS errors
declare var self: Worker;

self.onmessage = (event: MessageEvent) => {
  // const results = new Map<number, number[]>()
  const results = [] as number[][]
  const { start, end } = event.data

  const startDate = new Date()

  for (let i = start; i <= end; i++) {
    const result = findSum(i, event.data.cache)
    
    if (result === null) {
      throw new Error('Failed at ' + i)
    }

    // process.stdout.write(`\r${printNumber(i)} / ${printNumber(end)} (${(Math.floor((i - start) / (end - start) * 100))}%)`)
    // results.set(i, result)
    // results.push(result)
  }

  postMessage({
    sums: results,
    start: event.data.start,
    end: event.data.end,
    startTimestamp: startDate.getTime(),
    endTimestamp: (new Date()).getTime()
  });
};