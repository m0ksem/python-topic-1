#include <iostream>
#include <vector>
#include <unordered_map>
#include <chrono>
#include <iomanip>
#include <numeric>
#include "tetradic.cpp"
#include "find_sum.cpp"
#include "builder.cpp"
#include <thread>

const int start = 1;
const int end = 200000000;
const int step = 10000000;

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

bool testChunk(int start, int end, std::unordered_map< int, std::array<int, 3> >& cache) {
  std::cout << printNumber(start) + " / " + printNumber(end) + "\\m";
  for (int i = start; i < end; ++i) {
    auto result = findSum(i, cache);
    if (result.empty() || std::accumulate(result.begin(), result.end(), 0) != i || result.size() > 5 || result.size() < 0) {
      throw std::runtime_error("Failed at " + std::to_string(i) + ", result: " + printNumber(result.size()) + ", cache: " + printNumber(cache.size()));
    }
  }
  std::cout << printNumber(start) + " / " + printNumber(end) + " Finish \\m";
  return true;
}

int main() {
  std::cout << "Generating " << printNumber(end - start + 1) << " numbers" << std::endl;

  int tasksCount = ((end - start) / step);
  int maxTasks = std::thread::hardware_concurrency();
  int startedTasks = 0;

  auto [result, time] = withTime([&]() {    
    std::vector<std::thread> threads;
    auto cache = preBuild(start, end);

    for (int i = 0; i < tasksCount; ++i) {
      int chunkStart = start + (i * step);
      int chunkEnd = chunkStart + step;
      if (chunkEnd > end) {
        chunkEnd = end;
      }

      std::cout << printNumber(chunkStart) + " / " + printNumber(chunkEnd) + "\\m";
      threads.push_back(std::thread(testChunk, chunkStart, chunkEnd, std::ref(cache)));
      startedTasks++;

      if (startedTasks >= maxTasks) {
        for (auto& thread : threads) {
          thread.join();
        }
        threads.clear();
        startedTasks = 0;
      }
    }

    for (auto& thread : threads) {
      thread.join();
    }
  });

  std::cout << "\r" << printNumber(end) << " / " << printNumber(end) << " (100%)" << std::endl;
  std::cout << "\nFinished testing from " << printNumber(start) << " to " << printNumber(end) << " in " << time << "s" << std::endl;

  return 0;
}