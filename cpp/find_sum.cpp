#include <iostream>
#include <vector>
#include <unordered_map>
#include <cmath>
#include <algorithm>

std::vector<int> findSum(
  int inputNumber,
  std::vector<int>& tetradicNumbers,
  std::unordered_map<int, std::array<int, 3>>& preBuiltArray
) {
  auto prebuilt = preBuiltArray.find(inputNumber);

  if (prebuilt != preBuiltArray.end()) {
    return {prebuilt->second[0], prebuilt->second[1], prebuilt->second[2]};
  }

  int number1Index = getTetradicNumberIndex(inputNumber);

  for (; number1Index > 0; number1Index--) {
    int number1 = tetradicNumbers[number1Index];
    int required1 = inputNumber - number1;

    if (required1 < 0) {
      continue;
    }

    prebuilt = preBuiltArray.find(required1);

    if (prebuilt != preBuiltArray.end()) {
      return {number1, prebuilt->second[0], prebuilt->second[1], prebuilt->second[2]};
    }

    if (number1 == inputNumber) {
      return {number1};
    }

    int left2 = 0;
    int right2 = number1Index + 1;
    int number2Index;

    while (left2 <= right2) {
      number2Index = (left2 + right2) / 2;
      int number2 = tetradicNumbers[number2Index];

      if (number2 == required1) {
        return {number1, number2};
      }

      if (required1 > number2) {
        int required2 = required1 - number2;

        prebuilt = preBuiltArray.find(required2);

        if (prebuilt != preBuiltArray.end()) {
          return {number1, number2, prebuilt->second[0], prebuilt->second[1], prebuilt->second[2]};
        }

        left2 = number2Index + 1;

        int left3 = 0;
        int right3 = left2;
        int number3Index;

        while (left3 <= right3) {
          number3Index = (left3 + right3) / 2;
          int number3 = tetradicNumbers[number3Index];

          if (number3 == required2) {
            return {number1, number2, number3};
          }

          if (required2 > number3) {
            int required3 = required2 - number3;

            left3 = number3Index + 1;

            int left4 = 0;
            int right4 = left3;
            int number4Index;

            while (left4 <= right4) {
              number4Index = (left4 + right4) / 2;
              int number4 = tetradicNumbers[number4Index];

              if (number4 == required3) {
                return {number1, number2, number3, number4};
              }

              if (required3 > number4) {
                int required4 = required3 - number4;

                left4 = number4Index + 1;

                int left5 = 0;
                int right5 = left4;
                int number5Index;

                while (left5 <= right5) {
                  number5Index = (left5 + right5) / 2;
                  int number5 = tetradicNumbers[number5Index];

                  if (number5 == required4) {
                    return {number1, number2, number3, number4, number5};
                  }

                  if (required4 > number5) {
                    left5 = number5Index + 1;
                  } else {
                    right5 = number5Index - 1;
                  }
                }
              } else {
                right4 = number4Index - 1;
              }
            }
          } else {
            right3 = number3Index - 1;
          }
        }
      } else {
        right2 = number2Index - 1;
      }
    }
  }

  return {};
}
