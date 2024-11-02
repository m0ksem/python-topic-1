def make_tetradic_number(index: int) -> int:
  return (index * (index + 1) * (index + 2)) // 6

ONE_THIRD = 1 / 3
MINUS_ONE_THIRD_CUBE = (-ONE_THIRD) ** 3

# def get_tetradic_number_index(y: float) -> float:
#   half_d = -3 * y

#   discriminant = (half_d ** 2) + MINUS_ONE_THIRD_CUBE
#   discriminant_sqrt = discriminant ** 0.5

#   u = (-half_d + discriminant_sqrt) ** ONE_THIRD
#   v = (-half_d - discriminant_sqrt) ** ONE_THIRD

#   return u + v - 1

def get_tetradic_number_indexes(number: int) -> int:
  indexes = []
  index = 0
  
  while True:
    tetradic_number = make_tetradic_number(index)
    
    if tetradic_number >= number:
      break
    
    index += 1
    indexes.append(index)
    
  return indexes


def get_tetradic_number_index(number: int) -> int:
  index = 0
  
  while True:
    tetradic_number = make_tetradic_number(index)
    
    if tetradic_number >= number:
      break
    
    index += 1
    
  return index

def get_lowest_tetradic_number_index(number: float) -> int:
  return round(get_tetradic_number_index(number))

def find_tetradic_sum(number):
    tetradic_numbers = get_tetradic_number_indexes(number)
    length = len(tetradic_numbers)
    
    for i in range(length):
        if tetradic_numbers[i] == number:
            return [tetradic_numbers[i]]
        
        for j in range(i, length):
            if tetradic_numbers[i] + tetradic_numbers[j] == number:
                return [
                   tetradic_numbers[i], 
                   tetradic_numbers[j]
                ]
            
            for k in range(j, length):
                if tetradic_numbers[i] + tetradic_numbers[j] + tetradic_numbers[k] == number:
                    return [
                       tetradic_numbers[i], 
                       tetradic_numbers[j], 
                       tetradic_numbers[k]
                    ]
                
                for l in range(k, length):
                    if tetradic_numbers[i] + tetradic_numbers[j] + tetradic_numbers[k] + tetradic_numbers[l] == number:
                        return [
                           tetradic_numbers[i],
                           tetradic_numbers[j], 
                           tetradic_numbers[k],
                           tetradic_numbers[l]
                        ]
                    
                    for m in range(l, length):
                        if (tetradic_numbers[i] + tetradic_numbers[j] + tetradic_numbers[k] +
                            tetradic_numbers[l] + tetradic_numbers[m] == number):
                            return [
                               tetradic_numbers[i],
                               tetradic_numbers[j], 
                               tetradic_numbers[k],
                               tetradic_numbers[l],
                               tetradic_numbers[m]
                            ]
    
    return None

def find_tetradic_sum_reversed(number):
    tetradic_numbers = get_tetradic_number_indexes(number)
    length = len(tetradic_numbers)
    
    for i in range(length, 0, -1):
        if tetradic_numbers[i] == number:
            return [tetradic_numbers[i]]
        
        for j in range(length, i, -1):
            if tetradic_numbers[i] + tetradic_numbers[j] == number:
                return [
                   tetradic_numbers[i], 
                   tetradic_numbers[j]
                ]
            
            for k in range(j, length):
                if tetradic_numbers[i] + tetradic_numbers[j] + tetradic_numbers[k] == number:
                    return [
                       tetradic_numbers[i], 
                       tetradic_numbers[j], 
                       tetradic_numbers[k]
                    ]
                
                for l in range(k, length):
                    if tetradic_numbers[i] + tetradic_numbers[j] + tetradic_numbers[k] + tetradic_numbers[l] == number:
                        return [
                           tetradic_numbers[i],
                           tetradic_numbers[j], 
                           tetradic_numbers[k],
                           tetradic_numbers[l]
                        ]
                    
                    for m in range(l, length):
                        if (tetradic_numbers[i] + tetradic_numbers[j] + tetradic_numbers[k] +
                            tetradic_numbers[l] + tetradic_numbers[m] == number):
                            return [
                               tetradic_numbers[i],
                               tetradic_numbers[j], 
                               tetradic_numbers[k],
                               tetradic_numbers[l],
                               tetradic_numbers[m]
                            ]
    
    return None