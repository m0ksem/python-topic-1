const ONE_THIRD = 1 / 3;
const MINUS_ONE_THIRD_CUBE = Math.pow(-ONE_THIRD, 3);

function getTetradicNumberIndex(y: number): number {
  const halfD = -3 * y;
  const discriminantSqrt = Math.sqrt((halfD ** 2) + MINUS_ONE_THIRD_CUBE);

  const offsetD = -halfD;
  const u = Math.cbrt(offsetD + discriminantSqrt);
  const v = Math.cbrt(offsetD - discriminantSqrt);
  return Math.round(u + v - 1);
}

function findSums(
  inputNumber: number,
  tetradicNumbers: number[],
  preBuiltArray: Record<number, number[]>
): number[] | null {
  const maxIndex = getTetradicNumberIndex(inputNumber) + 1
  let l1 = 0;
  let r1 = maxIndex;
  let n1index
  let sum

  while (l1 <= r1) {
    n1index = Math.floor((l1 + r1) / 2);

    const n1 = tetradicNumbers[n1index];

    if (n1 === inputNumber) {
      preBuiltArray[inputNumber] = [n1];
      return [n1];
    }

    const required1 = inputNumber - n1;

    if (required1 < 0) {
      r1 = n1index - 1;
      continue
    }

    let l2 = 0;
    let r2 = n1index + 1;
    let n2index;

    while (l2 <= r2) {
      n2index = Math.floor((l2 + r2) / 2);

      const n2 = tetradicNumbers[n2index];

      if (n2 === required1) {
        sum = [n1, n2];
        break
      }

      if (n2 < required1) {
        l2 = n2index + 1;
      } else {
        r2 = n2index - 1;
      }
    }

    if (!sum) {
      l2 = 0;
      r2 = n1index + 1;
      let l3;
      let r3;
      let n3index;
      let required2

      while (l2 <= r2) {
        n2index = Math.floor((l2 + r2) / 2);

        const n2 = tetradicNumbers[n2index];

        if (n2 < required1) {
          l2 = n2index + 1;

          l3 = 0;
          r3 = n2index;

          required2 = required1 - n2;

          while (l3 <= r3) {
            n3index = Math.floor((l3 + r3) / 2);

            const n3 = tetradicNumbers[n3index];

            if (n3 === required2) {
              sum = [n1, n2, n3];
              break;
            }

            if (n3 < required2) {
              l3 = n3index + 1;
            } else {
              r3 = n3index - 1;
            }
          }
        } else {
          r2 = n2index - 1;
        }
      }
    }

    if (n1 < required1) {
      l1 = n1index + 1;
    } else {
      r1 = n1index - 1;
    }
  }

  if (sum) {
    return sum
  }

  let result = null

  for (let n1index = maxIndex; n1index >= 0; n1index--) {
    const n1 = tetradicNumbers[n1index];

    const required1 = inputNumber - n1;

    if (required1 < 0) {
      continue
    }

    for (let n2index = n1index; n2index >= 0; n2index--) {
      const n2 = tetradicNumbers[n2index];
      const required2 = required1 - n2;

      if (required2 < 0) {
        continue
      }

      for (let n3index = n2index; n3index >= 0; n3index--) {
        const n3 = tetradicNumbers[n3index];
        const required3 = required2 - n3;

        if (required3 < 0) {
          continue
        }

        let l4 = 0;
        let r4 = n3index;
        let n4index;

        while (l4 <= r4) {
          n4index = Math.floor((l4 + r4) / 2);
          const n4 = tetradicNumbers[n4index];
          const required4 = required3 - n4;

          if (required4 < 0) {
            r4 = n4index - 1;
            continue
          }

          if (n4 === required3) {
            return [n1, n2, n3, n4];
          }

          if (result) {
            r4 = n4index - 1;
            continue
          }

          let l5 = 0;
          let r5 = n4index;
          let n5index;

          while (l5 <= r5) {
            n5index = Math.floor((l5 + r5) / 2);
            const n5 = tetradicNumbers[n5index];

            if (n5 === required4) {
              result = [n1, n2, n3, n4, n5];
              break;
            }

            if (n5 < required4) {
              l5 = n5index + 1;
            } else {
              r5 = n5index - 1;
            }
          }

          if (n4 < required3) {
            l4 = n4index + 1;
          } else {
            r4 = n4index - 1;
          }
        }
      }
    }
  }

  return result

    // console.log('failed at', inputNumber)
    // console.log(preBuiltArray)

    // const number1 = tetradicNumbers[number1Index];
 
    // const required1 = inputNumber - number1;

    // if (required1 < 0) {
    //   continue
    // }

    // prebuilt = preBuiltArray[(required1)];

    // if (prebuilt) {
    //   if (prebuilt.length <= 2) {
    //     const found = [number1, prebuilt[0], prebuilt[1] ?? 0];
    //     preBuiltArray[inputNumber] = found;
    //     return found
    //   }
    // }

    // if (number1 === inputNumber) {
    //   return [number1];
    // }

    // left2 = 0;
    // right2 = number1Index + 1;
    // number2Index;

    // while (left2 <= right2) {
    //   number2Index = Math.floor((left2 + right2) / 2);

    //   const number2 = tetradicNumbers[number2Index];

    //   if (number2 === required1) {
    //     return [number1, number2];
    //   }

    //   if (required1 > number2) { 
    //     const required2 = required1 - number2;

    //     prebuilt = preBuiltArray[(required2)];

    //     if (prebuilt) {
    //       if (prebuilt.length === 1) {
    //         const found = [number1, number2, prebuilt[0]];
    //         preBuiltArray[inputNumber] = found;
    //         return found;
    //       }
    //     }

    //     left2 = number2Index + 1;

    //     let left3 = 0;
    //     let right3 = left2;
    //     let number3Index;

    //     while (left3 <= right3) {
    //       number3Index = Math.floor((left3 + right3) / 2);

    //       const number3 = tetradicNumbers[number3Index];

    //       if (number3 === required2) {
    //         return [number1, number2, number3];
    //       }

    //       if (required2 > number3) {
    //         const required3 = required2 - number3;

    //         // prebuilt = preBuiltArray[(required3)];

    //         // if (prebuilt) {
    //         //   if (prebuilt.length > 2) {
    //         //     break
    //         //   }
    //         //   return [number1, number2, number3, prebuilt[0], prebuilt[1] ?? 0];
    //         // }

    //         left3 = number3Index + 1;

    //         let left4 = 0;
    //         let right4 = left3;
    //         let number4Index;

    //         while (left4 <= right4) {
    //           number4Index = Math.floor((left4 + right4) / 2);

    //           const number4 = tetradicNumbers[number4Index];

    //           if (number4 === required3) {
    //             return [number1, number2, number3, number4];
    //           }

    //           if (required3 > number4) {
    //             const required4 = required3 - number4;

    //             // prebuilt = preBuiltArray[(required4)];

    //             // if (prebuilt) {
    //             //   if (prebuilt.length > 1) {
    //             //     break
    //             //   } 
    //             //   return [number1, number2, number3, number4, prebuilt[0]];
    //             // }

    //             left4 = number4Index + 1;

    //             let left5 = 0;
    //             let right5 = left4;
    //             let number5Index;

    //             while (left5 <= right5) {
    //               number5Index = Math.floor((left5 + right5) / 2);

    //               const number5 = tetradicNumbers[number5Index];

    //               if (number5 === required4) {
    //                 return [number1, number2, number3, number4, number5];
    //               }

    //               if (required4 > number5) {
    //                 left5 = number5Index + 1;
    //               } else {
    //                 right5 = number5Index - 1;
    //               }
    //             }
    //           } else {
    //             right4 = number4Index - 1;
    //           }
    //         }
    //       } else {
    //         right3 = number3Index - 1;
    //       }
    //     }
    //   } else {
    //     right2 = number2Index - 1;
    //   }
    // }

  return null;
}

// prevents TS errors
declare var self: Worker;

self.onmessage = (event: MessageEvent) => {
  const results = [] as number[][]
  const { start, end, cache } = event.data
  // const cache = preBuild(start, end)

  for (let i = start; i <= end; i++) {
    const result = findSums(i, event.data.tetradicNumbers, cache)
    
    if (result === null) {
      console.log('Failed at ' + i)
      continue
      // postMessage({ error: 'Failed at ' + i });
      // throw new Error('Failed at ' + i)
    }

    let sum = 0

    for (let j = 0; j < result.length; j++) {
      sum += result[j]
    }

    if (sum !== i) {
      postMessage({ error: 'Failed at ' + i + ' sum is incorrect (' + sum + ')' });
      throw new Error('Failed at ' + i + ' sum is incorrect (' + sum + ')')
    }
  }

  postMessage({
    sums: results,
    start: event.data.start,
    end: event.data.end,
  });
};