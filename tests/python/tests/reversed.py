import sys

def make_tetradic_number(index):
  # Placeholder function, replace with actual implementation
  return (index * (index + 1) * (index + 2)) // 6

def get_lowest_tetradic_number_index(num):
  # Placeholder function, replace with actual implementation
  index = 0
  while make_tetradic_number(index) <= num:
    index += 1
  return index - 1

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

def find_sums(input_number):
  tetradic_numbers = make_tetradic_numbers(input_number)
  length = len(tetradic_numbers)

  for i1 in range(length - 1, -1, -1):
    n1 = tetradic_numbers[i1]
    if n1 == input_number:
      return [n1]

    if n1 > input_number:
      continue

    for i2 in range(length - 1, i1 - 1, -1):
      n2 = tetradic_numbers[i2]
      required2 = input_number - n1 - n2
      if required2 == 0:
        return [n1, n2]

      if required2 < 0:
        continue

      for i3 in range(i2, i1 - 1, -1):
        n3 = tetradic_numbers[i3]
        required3 = required2 - n3
        if required3 == 0:
          return [n1, n2, n3]

        if required3 < 0:
          continue

        for i4 in range(i3, i1 - 1, -1):
          n4 = tetradic_numbers[i4]
          required4 = required3 - n4
          if required4 == 0:
            return [n1, n2, n3, n4]

          if required4 < 0:
            continue

          for i5 in range(i4, i1 - 1, -1):
            n5 = tetradic_numbers[i5]
            required5 = required4 - n5
            if required5 == 0:
              return [n1, n2, n3, n4, n5]

  return None

def test(start, end, step):
  for i in range(start, end):
    result = find_sums(i)

    if result is None or sum(result) != i:
      raise ValueError(f"No result for {i}")

if __name__ == "__main__":
  args = list(map(int, sys.argv[1:4]))
  test(*args)