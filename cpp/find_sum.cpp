#include <iostream>
#include <vector>
#include <unordered_map>
#include <cmath>
#include <map>
// #include "tetradic.cpp"
std::array<int, 5> findSum(int inputNumber, std::unordered_map< int, std::array<int, 3> >& cache) {
  std::array<int, 5> result = {0, 0, 0, 0, 0};

  if (cache.find(inputNumber) != cache.end()) {
    const std::array<int, 3>& cached = cache[inputNumber];
    std::copy(cached.begin(), cached.end(), result.begin());
    return result;
  }

  int nearestTetradicNumberIndex = getLowestTetradicNumberIndex(inputNumber);

  for (int number1Index = nearestTetradicNumberIndex; number1Index > 0; --number1Index) {
    int number1 = makeTetradicNumber(number1Index);

    if (number1 == inputNumber) {
      result[0] = number1;
      return result;
    }

    int required1 = inputNumber - number1;

    if (required1 < 0) {
      continue;
    }

    if (cache.find(required1) != cache.end()) {
      const std::array<int, 3>& cached = cache[required1];
      result[0] = number1;
      result[1] = cached[0];
      result[2] = cached[1];
      result[3] = cached[2];
      return result;
    }

    int left2 = 0;
    int right2 = number1Index + 1;
    int number2Index;

    while (left2 <= right2) {
      number2Index = (left2 + right2) / 2;
      int number2 = makeTetradicNumber(number2Index);

      if (number2 == required1) {
        result[0] = number1;
        result[1] = number2;
        return result;
      }

      if (number2 < required1) {
        int left3 = 0;
        int right3 = number2Index + 1;
        int number3Index;
        int required2 = required1 - number2;

        if (cache.find(required2) != cache.end()) {
          const std::array<int, 3>& cached = cache[required2];
          result[0] = number1;
          result[1] = number2;
          result[2] = cached[0];
          result[3] = cached[1];
          result[4] = cached[2];
          return result;
        }

        while (left3 <= right3) {
          number3Index = (left3 + right3) / 2;
          int number3 = makeTetradicNumber(number3Index);

          if (number3 == required2) {
            result[0] = number1;
            result[1] = number2;
            result[2] = number3;
            return result;
          }

          if (number3 < required2) {
            int left4 = 0;
            int right4 = number3Index + 1;
            int number4Index;
            int required3 = required2 - number3;

            if (cache.find(required3) != cache.end()) {
              const std::array<int, 3>& cached = cache[required3];
              if (cached[2] == 0) {
                result[0] = number1;
                result[1] = number2;
                result[2] = number3;
                result[3] = cached[0];
                result[4] = cached[1];
                return result;
              } else {
                break;
              }
            }

            while (left4 <= right4) {
              number4Index = (left4 + right4) / 2;
              int number4 = makeTetradicNumber(number4Index);

              if (number4 == required3) {
                result[0] = number1;
                result[1] = number2;
                result[2] = number3;
                result[3] = number4;
                return result;
              }

              if (number4 < required3) {
                int left5 = 0;
                int right5 = number4Index + 1;
                int number5Index;
                int required4 = required3 - number4;

                if (cache.find(required4) != cache.end()) {
                  const std::array<int, 3>& cached = cache[required4];
                  if (cached[1] == 0 && cached[2] == 0) {
                    result[0] = number1;
                    result[1] = number2;
                    result[2] = number3;
                    result[3] = number4;
                    result[4] = cached[0];
                    return result;
                  } else {
                    break;
                  }
                }

                while (left5 <= right5) {
                  number5Index = (left5 + right5) / 2;
                  int number5 = makeTetradicNumber(number5Index);

                  if (number5 == required4) {
                    result[0] = number1;
                    result[1] = number2;
                    result[2] = number3;
                    result[3] = number4;
                    result[4] = number5;
                    return result;
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

  return result;
}