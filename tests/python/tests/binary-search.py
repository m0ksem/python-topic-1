import sys

def make_tetradic_number(index):
  return (index * (index + 1) * (index + 2)) // 6

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

  for number1_index in range(length - 1, 0, -1):
    number1 = tetradic_numbers[number1_index]
    required1 = input_number - number1

    if number1 == input_number:
      return [number1]

    left2, right2 = 0, number1_index + 1

    while left2 <= right2:
      number2_index = (left2 + right2) // 2
      number2 = tetradic_numbers[number2_index]

      if number2 == required1:
        return [number1, number2]

      if number2 < required1:
        required2 = required1 - number2

        if required2 < 0:
          continue

        left3, right3 = 0, number2_index + 1

        while left3 <= right3:
          number3_index = (left3 + right3) // 2
          number3 = tetradic_numbers[number3_index]

          if number3 == required2:
            return [number1, number2, number3]

          if number3 < required2:
            required3 = required2 - number3

            if required3 < 0:
              continue

            left4, right4 = 0, number3_index + 1

            while left4 <= right4:
              number4_index = (left4 + right4) // 2
              number4 = tetradic_numbers[number4_index]

              if number4 == required3:
                return [number1, number2, number3, number4]

              if number4 < required3:
                required4 = required3 - number4

                if required4 < 0:
                  continue

                left5, right5 = 0, number4_index + 1

                while left5 <= right5:
                  number5_index = (left5 + right5) // 2
                  number5 = tetradic_numbers[number5_index]

                  if number5 == required4:
                    return [number1, number2, number3, number4, number5]

                  if number5 < required4:
                    left5 = number5_index + 1
                  else:
                    right5 = number5_index - 1

                left4 = number4_index + 1
              else:
                right4 = number4_index - 1

          if number3 < required2:
            left3 = number3_index + 1
          else:
            right3 = number3_index - 1

        left2 = number2_index + 1
      else:
        right2 = number2_index - 1

  return None

def test(start, end, step):
  for i in range(start, end):
    result = find_sums(i)

    if result is None or sum(result) != i:
      raise ValueError(f"No result for {i}")

if __name__ == "__main__":
  args = list(map(int, sys.argv[1:4]))
  test(*args)