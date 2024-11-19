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

const long start = 1;
const long end = 500000000;
const long step = 1000000;

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

std::unordered_map<int, int> makeTetradicNumbers(int num) {
  std::unordered_map<int, int> numbers;
  int index = 0;

  while (true) {
    int tetradicNumber = (index * (index + 1) * (index + 2)) / 6;
    if (tetradicNumber > num || index > 10000) {
      break;
    }

    index++;

    numbers[index] = tetradicNumber++;
  }

  return numbers;
}

bool testChunk(int start, int end, std::unordered_map< int, std::array<int, 3> >& cache, std::unordered_map<int, int>& tetradicNumbers) {
  for (int i = start; i < end; ++i) {
    auto result = findSum(i, tetradicNumbers, cache);

    if (result.empty() || std::accumulate(result.begin(), result.end(), 0) != i || result.size() > 5 || result.size() < 0) {
      for (int j = 0; j < result.size(); ++j) {
        std::cout << result[j] << " ";
      }
    }
  }
  
  return true;
}

int main() {
  std::cout << "Generating " << printNumber(end - start + 1) << " numbers" << std::endl;

  int tasksCount = ((end - start) / step) + 1;
  int maxTasks = std::thread::hardware_concurrency();

  int startedTasks = 0;

  std::unordered_map<int, int> tetradicNumbers = makeTetradicNumbers(end);

  auto [result, time] = withTime([&]() {    
    std::vector<std::thread> threads;
    auto cache = preBuild(start, end);

    for (int i = 0; i < tasksCount; i++) {
      int chunkStart = start + (i * step);
      int chunkEnd = chunkStart + step;
      if (chunkEnd > end) {
        chunkEnd = end;
      }

      threads.push_back(std::thread(testChunk, chunkStart, chunkEnd, std::ref(cache), std::ref(tetradicNumbers)));
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
  std::cout << "\nFinished testing from " << printNumber(start) << " to " << printNumber(end) << " in " << time << "s" << std::endl;

  return 0;
}