def make_tetradic_number(index: int) -> int:
  return (index * (index + 1) * (index + 2)) // 6

ONE_THIRD = 1 / 3
MINUS_ONE_THIRD_CUBE = (-ONE_THIRD) ** 3

def get_tetradic_number_index(y: float) -> float:
  half_d = -3 * y

  discriminant = (half_d ** 2) + MINUS_ONE_THIRD_CUBE
  discriminant_sqrt = discriminant ** 0.5

  u = (-half_d + discriminant_sqrt) ** ONE_THIRD
  v = (-half_d - discriminant_sqrt) ** ONE_THIRD
  return u + v - 1

def get_lowest_tetradic_number_index(number: float) -> int:
  return round(get_tetradic_number_index(number))