const ONE_THIRD = 1 / 3;
const MINUS_ONE_THIRD_CUBE = Math.pow(-ONE_THIRD, 3);

function getTetradicNumberIndex(y: number): number {
  const halfD = 3 * y;
  const discriminantSqrt = Math.sqrt((halfD ** 2) + MINUS_ONE_THIRD_CUBE);

  const offsetD = halfD;
  const u = Math.cbrt(offsetD + discriminantSqrt);
  const v = Math.cbrt(offsetD - discriminantSqrt);
  return Math.round(u + v - 1);
}

function searchBinary(required: number, requiredIndex: number, tetradicNumbers: number[]): number | null {
  let left = 1;
  let right = requiredIndex;
  let index;

  while (left <= right) {
    index = Math.floor((left + right) / 2);
    const number = tetradicNumbers[index];

    if (number === required) {
      return number;
    }

    if (number > required) {
      right = index - 1;
    } else {
      left = index + 1;
    }
  }

  return null;
}

function findSums(
  inputNumber: number,
  tetradicNumbers: number[],
  // cache: Map<number, number>
): number[] | null {
  const inputNumberIndex = getTetradicNumberIndex(inputNumber);

  // N1
  for (let i = inputNumberIndex; i >= inputNumberIndex / 2; i--) {
    const number1 = tetradicNumbers[i];

    if (number1 === inputNumber) {
      return [number1]
    }

    const required1 = inputNumber - number1;

    if (required1 < 0) {
      continue
    }
  
    // N2
    const result = searchBinary(required1, i, tetradicNumbers)

    if (result) {
      return [number1, result]
    }
  }

  // N3
  for (let n1i = inputNumberIndex; n1i >= 1; n1i--) {
    const n1 = tetradicNumbers[n1i];
    
    if (inputNumber - n1 < 0) {
      continue
    }

    for (let n2i = 1; n2i <= n1i; n2i++) {
      const n2 = tetradicNumbers[n2i];
      const required = inputNumber - n1 - n2;

      if (required < 0) {
        continue
      }
     
      const n3 = searchBinary(required, n2i, tetradicNumbers)

      if (n3) {
        return [n1, n2, n3]
      }
    }
  }

  // N4
  for (let n1i = inputNumberIndex; n1i >= inputNumberIndex / 2; n1i--) {
    const n1 = tetradicNumbers[n1i];

    const required1 = inputNumber - n1;

    if (required1< 0) {
      continue
    }

    for (let n2i = n1i; n2i >= 1; n2i--) {
      const n2 = tetradicNumbers[n2i];
      const required2 = required1 - n2;

      if (required2 < 0) {
        continue
      }

      for (let n3i = 1; n3i <= n2i; n3i++) {
        const n3 = tetradicNumbers[n3i];
        const required3 = required2 - n3;

        if (required3 < 0) {
          continue
        }

        const n4 = searchBinary(required3,  n3i, tetradicNumbers)

        // [0, 83, 2991, 44455, 52234, 236]
        if (n4) {
          return [n1, n2, n3, n4]
        }
      }
    }
  }

  //
  for (let n1i = inputNumberIndex; n1i >= inputNumberIndex / 2; n1i--) {
    const n1 = tetradicNumbers[n1i];

    if (inputNumber - n1 < 0) {
      continue
    }

    for (let n2i = n1i; n2i >= 1; n2i--) {
      const n2 = tetradicNumbers[n2i];

      if (inputNumber - n1 - n2 < 0) {
        continue
      }

      for (let n3i = n2i; n3i >= 1; n3i--) {
        const n3 = tetradicNumbers[n3i];

        if (inputNumber - n1 - n2 - n3 < 0) {
          continue
        }

        for (let n4i = 1; n4i <= n3i; n4i++) {
          const n4 = tetradicNumbers[n4i];

          if (inputNumber - n1 - n2 - n3 - n4 < 0) {
            continue
          }

          const n5 = searchBinary(inputNumber - n1 - n2 - n3 - n4, n4i, tetradicNumbers)

          if (n5) {
            return [n1, n2, n3, n4, n5]
          }
        }
      }
    }
  }
 
  return null
}
// prevents TS errors
declare var self: Worker;

self.onmessage = (event: MessageEvent) => {
  const results = [] as number[][]
  const { start, end } = event.data
  // const cache = preBuild(start, end)
  const counts = [0, 0, 0, 0, 0, 0]

  for (let i = start; i <= end; i++) {
    const result = findSums(i, event.data.tetradicNumbers)
    
    if (result === null) {
      postMessage({ error: 'Failed at ' + i });
      throw new Error('Failed at ' + i)
    }

    counts[result.length]++

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