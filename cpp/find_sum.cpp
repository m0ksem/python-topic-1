#include <iostream>
#include <vector>
#include <unordered_map>
#include <cmath>
#include <map>
// #include "tetradic.cpp"

std::vector<int> findSum(int inputNumber, std::map< int, std::vector<int> >& cache) {
  if (cache.find(inputNumber) != cache.end()) {
    return cache[inputNumber];
  }

  int nearestTetradicNumberIndex = getLowestTetradicNumberIndex(inputNumber);

  for (int number1Index = nearestTetradicNumberIndex; number1Index > 0; --number1Index) {
    int number1 = makeTetradicNumber(number1Index);

    if (number1 == inputNumber) {
      return std::vector<int>{ number1 };
    }

    int required1 = inputNumber - number1;

    if (cache.find(required1) != cache.end()) {
      const std::vector<int>& cached = cache[required1];
      if (cached.size() <= 4) {
        std::vector<int> result;
        result.push_back(number1);
        result.insert(result.end(), cached.begin(), cached.end());
        return result;
      }
    }

    if (required1 < 0) {
      continue;
    }

    int left2 = 0;
    int right2 = number1Index + 1;
    int number2Index;

    while (left2 <= right2) {
      number2Index = (left2 + right2) / 2;
      int number2 = makeTetradicNumber(number2Index);

      if (number2 == required1) {
        return { number1, number2 };
      }

      if (number2 < required1) {
        int left3 = 0;
        int right3 = number2Index + 1;
        int number3Index;
        int required2 = required1 - number2;

        while (left3 <= right3) {
          number3Index = (left3 + right3) / 2;
          int number3 = makeTetradicNumber(number3Index);

          if (cache.find(required2) != cache.end()) {
            const std::vector<int>& cached = cache[required2];
            if (cached.size() <= 3) {
              std::vector<int> result = {number1, number2};
              result.insert(result.end(), cached.begin(), cached.end());
              return result;
            } else {
              break;
            }
          }

          if (number3 == required2) {
            return std::vector<int>{number1, number2, number3};
          }

          if (number3 < required2) {
            int left4 = 0;
            int right4 = number3Index + 1;
            int number4Index;
            int required3 = required2 - number3;

            if (cache.find(required3) != cache.end()) {
              const std::vector<int>& cached = cache[required3];
              if (cached.size() <= 2) {
                std::vector<int> result = {number1, number2, number3};
                result.insert(result.end(), cached.begin(), cached.end());
                return result;
              } else {
                break;
              }
            }

            while (left4 <= right4) {
              number4Index = (left4 + right4) / 2;
              int number4 = makeTetradicNumber(number4Index);

              if (number4 == required3) {
                return std::vector<int>{number1, number2, number3, number4};
              }

              if (number4 < required3) {
                int left5 = 0;
                int right5 = number4Index + 1;
                int number5Index;
                int required4 = required3 - number4;

                if (cache.find(required4) != cache.end()) {
                  const std::vector<int>& cached = cache[required4];
                  if (cached.size() <= 1) {
                    std::vector<int> result = {number1, number2, number3, number4};
                    result.insert(result.end(), cached.begin(), cached.end());
                    return result;
                  } else {
                    break;
                  }
                }

                while (left5 <= right5) {
                  number5Index = (left5 + right5) / 2;
                  int number5 = makeTetradicNumber(number5Index);

                  if (number5 == required4) {
                    return std::vector<int>{number1, number2, number3, number4, number5};
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

  return {};
}