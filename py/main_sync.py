import time
from lib.find_sum import find_sum
from lib.builder import pre_build

start = 1
end = 10_000_000

def print_number(number):
  return f"{number:,}"

def with_time(func):
  start_time = time.time()
  result = func()
  end_time = time.time()
  return result, end_time - start_time

print(f"Generating {print_number(end - start)} numbers")

def main():
  cache = pre_build(start, end)

  for i in range(start, end):
    if i % 10000 == 0:
      print(f"\r{print_number(i)} / {print_number(end)} ({(i - start) / (end - start) * 100:.0f}%)", end="")
    result = find_sum(i, cache)
    if result is None or sum(result) != i or len(result) > 5 or len(result) < 0:
      raise ValueError(f"Failed at {i}, result: {result}, cache: {cache.get(i)}")
    cache[i] = result

result, elapsed_time = with_time(main)
print(f"\r{print_number(end)} / {print_number(end)} (100%))")

print(f"\nFinished testing from {print_number(start)} to {print_number(end)} in {elapsed_time:.2f}s")