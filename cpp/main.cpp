#include <iostream>
#include <vector>
#include <unordered_map>
#include <chrono>
#include <iomanip>
#include "tetradic.cpp"
#include "find_sum.cpp"
#include "builder.cpp"

const int start = 1;
const int end = 10000000;

std::string printNumber(int number) {
  return std::to_string(number);
}

std::pair<std::vector<int>, double> withTime(std::function<void()> func) {
  auto start = std::chrono::high_resolution_clock::now();
  func();
  auto end = std::chrono::high_resolution_clock::now();
  std::chrono::duration<double> elapsed = end - start;
  return { {}, elapsed.count() };
}

int main() {
  std::cout << "Generating " << printNumber(end - start) << " numbers" << std::endl;

  auto [result, time] = withTime([&]() {
    auto cache = preBuild(start, end);
    int fromCacheCount = 0;

    for (int i = start; i < end; ++i) {
      if (i % 10000 == 0) {
        std::cout << "\r" << printNumber(i) << " / " << printNumber(end) << " (" 
              << (std::floor((i - start) / static_cast<double>(end - start) * 100)) << "%) "
              << "(from cache: " << fromCacheCount << ", size: " << cache.size() << ")";
      }
      auto result = findSums(i, cache);
      if (result.empty() || std::accumulate(result.begin(), result.end(), 0) != i || result.size() > 5 || result.size() < 0) {
        throw std::runtime_error("Failed at " + std::to_string(i) + ", result: " + printNumber(result.size()) + ", cache: " + printNumber(cache.size()));
      }
      cache[i] = result;
    }
  });

  std::cout << "\r" << printNumber(end) << " / " << printNumber(end) << " (100%) (from cache: " << 0 << ")" << std::endl;
  std::cout << "\nFinished testing from " << printNumber(start) << " to " << printNumber(end) << " in " << time << "s" << std::endl;
  std::cout << "makeTetradicNumber calls count " << printNumber(0) << std::endl;
  std::cout << "Accessed from cache " << printNumber(0) << std::endl;

  return 0;
}