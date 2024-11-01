from functools import lru_cache
from math import sqrt

# Making a tetradic number function

def make_tetradic_number(index):
  return (index * (index + 1) * (index + 2)) // 6

@lru_cache(maxsize=None)
def make_tetradic_number_with_lru_memorization(index):
  return (index * (index + 1) * (index + 2)) // 6

tetradic_cache = {}

def make_tetradic_number_with_custom_memorization(index):
    if index in tetradic_cache:
        return tetradic_cache[index]
    
    # Calculate the tetradic number
    tetradic_number = (index * (index + 1) * (index + 2)) // 6
    
    # Store in cache
    tetradic_cache[index] = tetradic_number
    return tetradic_number

# Finding the tetradic number index

# x^3 + 3ax^2 + 2bx + -6*y = 0
# p = -1 # (3 * a * c - b**2) / (3 * a**2)
ONE_THIRD = 1 / 3
MINUS_ONE_THIRD_CUBE = (-ONE_THIRD)**3

# Somehow this function is actually fast
def get_tetradic_number_index(y):
  half_d = -3 * y

  discriminant = (half_d)**2 + MINUS_ONE_THIRD_CUBE
  discriminant_sqrt = sqrt(discriminant)

  u = (-half_d + discriminant_sqrt)**(ONE_THIRD)
  v = (-half_d - discriminant_sqrt)**(ONE_THIRD)
  return (u + v - 1)

def get_lowest_tetradic_number_index(number):
  return round(get_tetradic_number_index(number))