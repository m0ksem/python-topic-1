import sys
import time
from multiprocessing.pool import Pool
import multiprocessing

def make_tetradic_number(index):
  # Placeholder function, replace with actual implementation
  return index * 4

def make_tetradic_numbers(num):
  numbers = []
  index = 0

  while True:
    tetradic_number = make_tetradic_number(index)
    if tetradic_number > num:
      break

    numbers.append(tetradic_number)
    index += 1

  return numbers

def get_tetradic_number_index(y):
  one_third = 1 / 3
  minus_one_third_cube = (-one_third) ** 3

  half_d = -3 * y
  discriminant_sqrt = (half_d ** 2 + minus_one_third_cube) ** 0.5

  offset_d = -half_d
  u = (offset_d + discriminant_sqrt) ** one_third
  v = (offset_d - discriminant_sqrt) ** one_third

  return round(u + v - 1)

TEN_THOUSAND_INDEX = 100

def pre_build(end):
  results = {}

  for i in range(1, TEN_THOUSAND_INDEX + 1):
    number1 = make_tetradic_number(i)

    for j in range(1, TEN_THOUSAND_INDEX + 1):
      number2 = make_tetradic_number(j)
      sum_ = number1 + number2

      if sum_ > end:
        break

      for k in range(1, TEN_THOUSAND_INDEX + 1):
        number3 = make_tetradic_number(k)
        sum_ = number1 + number2 + number3

        if sum_ > end:
          break

        results[sum_] = [number1, number2, number3]

      results[sum_] = [number1, number2]

    results[number1] = [number1]

  return results

def find_sums(input_number, tetradic_numbers, pre_built_array):
  prebuilt = pre_built_array.get(input_number)

  if prebuilt:
    return prebuilt

  number1_index = get_tetradic_number_index(input_number)

  for number1_index in range(number1_index, 0, -1):
    number1 = tetradic_numbers[number1_index]
    required1 = input_number - number1

    if required1 < 0:
      continue

    prebuilt = pre_built_array.get(required1)

    if prebuilt:
      if len(prebuilt) > 4:
        break
      return [number1, prebuilt[0], prebuilt[1] if len(prebuilt) > 1 else 0, prebuilt[2] if len(prebuilt) > 2 else 0, prebuilt[3] if len(prebuilt) > 3 else 0]

    if number1 == input_number:
      return [number1]

    left2, right2 = 0, number1_index + 1

    while left2 <= right2:
      number2_index = (left2 + right2) // 2
      number2 = tetradic_numbers[number2_index]

      if number2 == required1:
        return [number1, number2]

      if required1 > number2:
        required2 = required1 - number2
        prebuilt = pre_built_array.get(required2)

        if prebuilt:
          if len(prebuilt) > 3:
            break
          return [number1, number2, prebuilt[0], prebuilt[1] if len(prebuilt) > 1 else 0, prebuilt[2] if len(prebuilt) > 2 else 0]

        left2 = number2_index + 1
        left3, right3 = 0, left2

        while left3 <= right3:
          number3_index = (left3 + right3) // 2
          number3 = tetradic_numbers[number3_index]

          if number3 == required2:
            return [number1, number2, number3]

          if required2 > number3:
            required3 = required2 - number3
            prebuilt = pre_built_array.get(required3)

            if prebuilt:
              if len(prebuilt) > 2:
                break
              return [number1, number2, number3, prebuilt[0], prebuilt[1] if len(prebuilt) > 1 else 0]

            left3 = number3_index + 1
            left4, right4 = 0, left3

            while left4 <= right4:
              number4_index = (left4 + right4) // 2
              number4 = tetradic_numbers[number4_index]

              if number4 == required3:
                return [number1, number2, number3, number4]

              if required3 > number4:
                required4 = required3 - number4
                prebuilt = pre_built_array.get(required4)

                if prebuilt:
                  if len(prebuilt) > 1:
                    break
                  return [number1, number2, number3, number4, prebuilt[0]]

                left4 = number4_index + 1
                left5, right5 = 0, left4

                while left5 <= right5:
                  number5_index = (left5 + right5) // 2
                  number5 = tetradic_numbers[number5_index]

                  if number5 == required4:
                    return [number1, number2, number3, number4, number5]

                  if required4 > number5:
                    left5 = number5_index + 1
                  else:
                    right5 = number5_index - 1
              else:
                right4 = number4_index - 1
          else:
            right3 = number3_index - 1
      else:
        right2 = number2_index - 1

  return None


def test(start, end):
  tetradic_numbers = make_tetradic_numbers(end)
  cache = pre_build(end)

  for i in range(start, end):
    result = find_sums(i, tetradic_numbers, cache)

    if result is None or sum(result) != i and len(result) <= 5 and sum(result) == i:
      raise ValueError(f"No result for {i}")

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

    thread = multiprocessing.Process(target=test, args=(i, i + step))
    thread.start()
    threads.append(thread)

  for thread in threads:
    thread.join()


  end_time = time.time()

if __name__ == "__main__":
  args = list(map(int, sys.argv[1:4]))
  try_range_hypothesis_multithread(*args)