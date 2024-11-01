from lib.find_sum import find_sum
from lib.builder import pre_build
import time
from multiprocessing.pool import Pool
import multiprocessing

def try_range_hypothesis(start, end):
  cache = pre_build(1, end)
  for i in range(start, end):
    result = find_sum(i, cache)
    if result == None or len(result) > 5:
      print(f"Failed at {i}")

  return True

def try_range_hypothesis_multithread(start, end, step):
  start_time = time.time()
  max_threads = 8

  threads = []

  for i in range(start, end, step):
    if len(threads) >= max_threads:
      for thread in threads:
        thread.join()
      threads = []

    thread = multiprocessing.Process(target=try_range_hypothesis, args=(i, i + step))
    thread.start()
    threads.append(thread)

  for thread in threads:
    thread.join()


  end_time = time.time()
  print(f"Finished testing from {start} to {end} in {end_time - start_time} seconds")

if __name__ == "__main__":
  try_range_hypothesis_multithread(1, 100_000_000, 100_000)