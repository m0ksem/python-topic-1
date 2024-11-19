import sys

def make_tetradic_number(index: int) -> int:
  return (index * (index + 1) * (index + 2)) // 6

def make_tetradic_numbers(num: int) -> list:
  numbers = []
  index = 0

  while True:
    tetradic_number = make_tetradic_number(index)
    if tetradic_number > num:
      break

    numbers.append(tetradic_number)
    index += 1

  return numbers

def find_sums(input_number: int) -> list:
  tetradic_numbers = make_tetradic_numbers(input_number)
  length = len(tetradic_numbers)

  for i1 in range(length):
    n1 = make_tetradic_number(i1)
    required1 = input_number - n1
    for i2 in range(length):
      n2 = make_tetradic_number(i2)
      required2 = required1 - n2
      for i3 in range(length):
        n3 = make_tetradic_number(i3)
        required3 = required2 - n3
        for i4 in range(length):
          n4 = make_tetradic_number(i4)
          required4 = required3 - n4
          for i5 in range(length):
            n5 = make_tetradic_number(i5)
            required5 = required4 - n5
            if required5 == 0:
              return [n1, n2, n3, n4, n5]

  return None

def test(start: int, end: int, step: int):
  for i in range(start, end):
    result = find_sums(i)

    if result is None or sum(result) != i:
      raise ValueError(f"No result for {i}")

if __name__ == "__main__":
  args = list(map(int, sys.argv[1:4]))
  test(*args)