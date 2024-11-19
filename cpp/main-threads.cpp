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
const long end = 100000000;
const long step = 10000000;

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

std::vector<int> makeTetradicNumbers(int num) {
  std::vector<int> numbers;
  int index = 0;

  while (true) {
    int tetradicNumber = (index * (index + 1) * (index + 2)) / 6;
    if (tetradicNumber > num) {
      break;
    }

    numbers.push_back(tetradicNumber);
    index++;
  }

  return numbers;
}

bool testChunk(int start, int end, std::unordered_map< int, std::array<int, 3> >& cache, std::vector<int>& tetradicNumbers) {
  for (int i = start; i < end; ++i) {
    auto result = findSum(i, tetradicNumbers, cache);
    if (result.empty() || std::accumulate(result.begin(), result.end(), 0) != i || result.size() > 5 || result.size() < 0) {
      std::cout << "Failed at " << i << ", result: " << result.size() << ", cache: " << cache.size() << std::endl;
      for (int j = 0; j < result.size(); ++j) {
        std::cout << result[j] << " ";
        return false;
      }
    }
  }
  
  return true;
}

int main() {
  std::cout << "Generating " << printNumber(end - start + 1) << " numbers" << std::endl;


  int tasksCount = ((end - start) / step) - 1;
  int maxTasks = std::thread::hardware_concurrency();

  if (tasksCount < maxTasks) {
    maxTasks = tasksCount;
  }
  int startedTasks = 0;

  std::vector<int> tetradicNumbers = makeTetradicNumbers(end);

  auto [result, time] = withTime([&]() {    
    std::vector<std::thread> threads;
    auto cache = preBuild(start, end);

    printf("Starting testing from %s to %s\n", printNumber(start).c_str(), printNumber(end).c_str());

    printf("Tasks: %d, maxTasks: %d\n", tasksCount, maxTasks);

    for (int i = 0; i < tasksCount; i++) {
      int chunkStart = start + (i * step);
      int chunkEnd = chunkStart + step;
      if (chunkEnd > end) {
        chunkEnd = end;
      }

      threads.push_back(std::thread(testChunk, chunkStart, chunkEnd, std::ref(cache), std::ref(tetradicNumbers)));
      startedTasks++;

      if (startedTasks > maxTasks) {
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