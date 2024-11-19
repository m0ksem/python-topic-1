import time
from kernel import Kernel
import multiprocessing

start = 1
end = 200_000_000
step = 20_000_000

if step > end - start:
    step = end - start


start_time = time.time()

def run_kernel(start, end, kernel: Kernel):
   print(f"Processing from {start} to {end} numbers with step {step}.")
   kernel.run(start, end)

def try_range_hypothesis_multithread(start, end, step):
  start_time = time.time()
  max_threads = 10

  threads = []

  kernel = Kernel(step)

  for i in range(start, end, step):
    if len(threads) >= max_threads:
      for thread in threads:
        thread.join()
      threads = []
      

    thread = multiprocessing.Process(target=run_kernel, args=(i, i + step, kernel))
    thread.start()
    threads.append(thread)

  for thread in threads:
    thread.join()


  end_time = time.time()
  print(f"Finished testing from {start} to {end} in {end_time - start_time} seconds")


if __name__ == "__main__":
    try_range_hypothesis_multithread(start, end, step)

