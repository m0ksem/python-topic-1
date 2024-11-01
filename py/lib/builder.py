from .tetradic import make_tetradic_number

TEN_THOUSAND_INDEX = 200

def pre_build(start: int, end: int) -> dict:
  results = {}

  # Prebuild small numbers, because they repeat frequently
  for i in range(1, TEN_THOUSAND_INDEX + 1):
    number1 = make_tetradic_number(i)
    
    for j in range(1, TEN_THOUSAND_INDEX + 1):
      number2 = make_tetradic_number(j)
      sum_2 = number1 + number2
      
      if sum_2 > end:
        break

      for k in range(1, TEN_THOUSAND_INDEX + 1):
        number3 = make_tetradic_number(k)
        sum_3 = number1 + number2 + number3
        
        if sum_3 > end:
          break

        results[sum_3] = [number1, number2, number3]

      results[sum_2] = [number1, number2]

    results[number1] = [number1]

  return results