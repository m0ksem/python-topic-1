import { getLowestTetradicNumberIndex, makeTetradicNumber } from './lib'
import { withTime } from './utils'

const findSums = (start: number, end: number) => {
  const maxIndex = getLowestTetradicNumberIndex(end) + 1 // Next tetradic number
  const minIndex = getLowestTetradicNumberIndex(start)

  const results = new Map<number, number[]>()

  console.log('Max index', maxIndex, makeTetradicNumber(maxIndex + 1))
  console.log('Min index', minIndex)

  // One number sum

  for (let num1Index = minIndex; num1Index <= maxIndex; num1Index++) {
    const number = makeTetradicNumber(num1Index)
    results.set(number, [number])

    for (let num2Index = num1Index; num2Index <= maxIndex; num2Index++) {
      const number2 = makeTetradicNumber(num2Index)
      const sum = number + number2

      if (sum > end) {
        break
      }

      results.set(sum, [number, number2])

      for (let num3Index = num2Index; num3Index <= maxIndex; num3Index++) {
        const number3 = makeTetradicNumber(num3Index)
        const sum = number + number2 + number3

        if (sum > end) {
          break
        }

        results.set(sum, [number, number2, number3])

        for (let num4Index = num3Index; num4Index <= maxIndex; num4Index++) {
          const number4 = makeTetradicNumber(num4Index)
          const sum = number + number2 + number3 + number4

          if (sum > end) {
            break
          }

          results.set(sum, [number, number2, number3, number4])

          for (let num5Index = num4Index; num5Index <= maxIndex; num5Index++) {
            const number5 = makeTetradicNumber(num5Index)
            const sum = number + number2 + number3 + number4 + number5

            if (sum > end) {
              break
            }

            results.set(sum, [number, number2, number3, number4, number5])
          }
        }
      }
    }
  }

  return results
}

const start = 1
const end = 1_000_000

const [result, time] = withTime(() => {
  const results = findSums(start, end)

  console.log('Got results')

  for (let i = start; i <= end; i++) {
    const result = results.get(i)

    if (result === undefined) {
      throw new Error(`Failed at ${i}`)
    }

    if (result.reduce((acc, curr) => acc + curr, 0) !== i) {
      throw new Error(`Failed at ${i}`)
    }
  }
})

console.log(`Finished testing from ${start} to ${end} in ${time / 1000}s`)