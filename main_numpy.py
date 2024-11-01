from lib import get_lowest_tetradic_number_index, make_tetradic_number
import sys
import time
import numpy as np

tetradic_numbers = np.array([make_tetradic_number(i) for i in range(1, 100_000)])


def find_sums(input_number):
  nearest_tetradic_number_index = get_lowest_tetradic_number_index(input_number)

  def iterate_sum(iterable_number_index, sum):
    if iterable_number_index >= 5:
      return None

    for number_index in range(nearest_tetradic_number_index, 0, -1):
      number = tetradic_numbers[number_index - 1]
      
      new_sum = sum + number

      if new_sum == input_number:
        return [number]
      elif new_sum > input_number:
        continue

      # Unable to make sum with 5 numbers, no need to continue checking lower numbers
      if iterable_number_index == 4:
        return None

      found = iterate_sum(iterable_number_index + 1, new_sum)
      
      if not found  == None:
        return [number] + found

    return None
  
  return iterate_sum(0, 0)

def try_range_hypothesis(start, end):
  start_time = time.time()
  for i in range(start, end):
    sys.stdout.write(f"\rTesting {i}...")
    result = find_sums(i)
    sys.stdout.write(f"\rTesting {i}... Result: {result}")
    if result == None or len(result) > 5:
      print(f"\n\nFailed at {i}", result)
  end_time = time.time()
  print()
  print(f"Finished testing from {start} to {end} in {end_time - start_time} seconds")
  return True

if __name__ == "__main__":
  try_range_hypothesis(1, 100_000)