#include <iostream>
#include <unordered_map>
#include <vector>
// #include "tetradic.cpp"

const int TEN_THOUSAND_INDEX = 200;

std::unordered_map<int, std::array<int, 3>> preBuild(int start, int end) {
  std::unordered_map<int, std::array<int, 3>> results;

  // Prebuild small numbers, because they repeat frequently
  for (int i = 1; i <= TEN_THOUSAND_INDEX; ++i) {
    int number1 = makeTetradicNumber(i);

    for (int j = 1; j <= TEN_THOUSAND_INDEX / 2; ++j) {
      int number2 = makeTetradicNumber(j);
      int sum = number1 + number2;

      if (sum > end) {
        break;
      }

      for (int k = 1; k <= TEN_THOUSAND_INDEX / 3; ++k) {
        int number3 = makeTetradicNumber(k);
        int sum3 = number1 + number2 + number3;

        if (sum3 > end) {
          break;
        }

        results[sum3] = {number1, number2, number3};
      }

      results[sum] = {number1, number2, 0};
    }

    results[number1] = {number1, 0, 0};
  }

  return results;
}