from .tetradic import get_lowest_tetradic_number_index, make_tetradic_number

def find_sum(input_number: int, cache: dict[int, list[int]]) -> list[int] | None:
  if input_number in cache:
    return cache[input_number]

  nearest_tetradic_number_index = get_lowest_tetradic_number_index(input_number)

  for number1_index in range(nearest_tetradic_number_index, 0, -1):
    number1 = make_tetradic_number(number1_index)

    if number1 == input_number:
      return [number1]

    required1 = input_number - number1

    if required1 in cache:
      cached = cache[required1]
      if len(cached) <= 4:
        return [number1] + cached

    if required1 < 0:
      continue

    left2, right2 = 0, number1_index + 1

    while left2 <= right2:
      number2_index = (left2 + right2) // 2
      number2 = make_tetradic_number(number2_index)

      if number2 == required1:
        return [number1, number2]

      if number2 < required1:
        left3, right3 = 0, number2_index + 1
        required2 = required1 - number2

        while left3 <= right3:
          number3_index = (left3 + right3) // 2
          number3 = make_tetradic_number(number3_index)

          if required2 in cache:
            cached = cache[required2]
            if len(cached) <= 3:
              return [number1, number2] + cached
            else:
              break

          if number3 == required2:
            return [number1, number2, number3]

          if number3 < required2:
            left4, right4 = 0, number3_index + 1
            required3 = required2 - number3

            if required3 in cache:
              cached = cache[required3]
              if len(cached) <= 2:
                return [number1, number2, number3] + cached
              else:
                break

            while left4 <= right4:
              number4_index = (left4 + right4) // 2
              number4 = make_tetradic_number(number4_index)

              if number4 == required3:
                return [number1, number2, number3, number4]

              if number4 < required3:
                left5, right5 = 0, number4_index + 1
                required4 = required3 - number4

                if required4 in cache:
                  cached = cache[required4]
                  if len(cached) <= 1:
                    return [number1, number2, number3, number4] + cached
                  else:
                    break

                while left5 <= right5:
                  number5_index = (left5 + right5) // 2
                  number5 = make_tetradic_number(number5_index)

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