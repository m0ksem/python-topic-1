#include <math.h>
#include <stdio.h>
#include <time.h>

int makeTetradicNumber(int index) {
  return (index * (index + 1) * (index + 2)) / 6;
}

const double ONE_THIRD = 1.0 / 3.0;
const double MINUS_ONE_THIRD_CUBE = -ONE_THIRD * -ONE_THIRD * -ONE_THIRD;

// This function is surprisingly fast
double getTetradicNumberIndex(double y) {
  double halfD = -3 * y;

  double discriminant = (halfD * halfD) + MINUS_ONE_THIRD_CUBE;
  double discriminantSqrt = sqrt(discriminant);

  double u = pow(-halfD + discriminantSqrt, ONE_THIRD);
  double v = pow(-halfD - discriminantSqrt, ONE_THIRD);
  return u + v - 1;
}

int getLowestTetradicNumberIndex(double number) {
  return round(getTetradicNumberIndex(number));
}

// Builder

#include <stdlib.h>
#include <stdio.h>

#define TEN_THOUSAND_INDEX 200

typedef struct {
  int *numbers;
  size_t size;
} NumberArray;

typedef struct {
  int key;
  NumberArray value;
} MapEntry;

typedef struct {
  MapEntry *entries;
  size_t size;
  size_t capacity;
} Map;

void initMap(Map *map, size_t initialCapacity) {
  map->entries = (MapEntry *)malloc(initialCapacity * sizeof(MapEntry));
  map->size = 0;
  map->capacity = initialCapacity;
}

void freeMap(Map *map) {
  for (size_t i = 0; i < map->size; i++) {
    free(map->entries[i].value.numbers);
  }
  free(map->entries);
}

void addToMap(Map *map, int key, int *numbers, size_t size) {
  if (map->size >= map->capacity) {
    map->capacity *= 2;
    map->entries = (MapEntry *)realloc(map->entries, map->capacity * sizeof(MapEntry));
  }
  map->entries[map->size].key = key;
  map->entries[map->size].value.numbers = (int *)malloc(size * sizeof(int));
  for (size_t i = 0; i < size; i++) {
    map->entries[map->size].value.numbers[i] = numbers[i];
  }
  map->entries[map->size].value.size = size;
  map->size++;
}

// Get from map
MapEntry *getFromMap(Map *map, int key) {
  for (size_t i = 0; i < map->size; i++) {
    if (map->entries[i].key == key) {
      return &map->entries[i];
    }
  }
  return NULL;
}

Map preBuild(int start, int end) {
  Map results;
  initMap(&results, 100);

  for (int i = 1; i <= TEN_THOUSAND_INDEX; i++) {
    int number1 = makeTetradicNumber(i);

    for (int j = 1; j <= TEN_THOUSAND_INDEX; j++) {
      int number2 = makeTetradicNumber(j);
      int sum = number1 + number2;

      if (sum > end) {
        break;
      }

      for (int k = 1; k <= TEN_THOUSAND_INDEX; k++) {
        int number3 = makeTetradicNumber(k);
        int sum3 = number1 + number2 + number3;

        if (sum3 > end) {
          break;
        }

        int numbers3[] = {number1, number2, number3};
        addToMap(&results, sum3, numbers3, 3);
      }

      int numbers2[] = {number1, number2};
      addToMap(&results, sum, numbers2, 2);
    }

    int numbers1[] = {number1};
    addToMap(&results, number1, numbers1, 1);
  }

  return results;
}

int *findSum(int inputNumber, Map *cache, size_t *resultSize) {
  // for (size_t i = 0; i < cache->size; i++) {
  //   if (cache->entries[i].key == inputNumber) {
  //     *resultSize = cache->entries[i].value.size;
  //     int *result = (int *)malloc(*resultSize * sizeof(int));
  //     for (size_t j = 0; j < *resultSize; j++) {
  //       result[j] = cache->entries[i].value.numbers[j];
  //     }
  //     return result;
  //   }
  // }

  int nearestTetradicNumberIndex = getLowestTetradicNumberIndex(inputNumber);

  for (int number1Index = nearestTetradicNumberIndex; number1Index > 0; number1Index--) {
    int number1 = makeTetradicNumber(number1Index);

    if (number1 == inputNumber) {
      *resultSize = 1;
      int *result = (int *)malloc(sizeof(int));
      result[0] = number1;
      return result;
    }

    int required1 = inputNumber - number1;

    // for (size_t i = 0; i < cache->size; i++) {
    //   if (cache->entries[i].key == required1 && cache->entries[i].value.size <= 4) {
    //     *resultSize = cache->entries[i].value.size + 1;
    //     int *result = (int *)malloc(*resultSize * sizeof(int));
    //     result[0] = number1;
    //     for (size_t j = 0; j < cache->entries[i].value.size; j++) {
    //       result[j + 1] = cache->entries[i].value.numbers[j];
    //     }
    //     return result;
    //   }
    // }

    if (required1 < 0) {
      continue;
    }

    int left2 = 0;
    int right2 = number1Index + 1;
    int number2Index;

    while (left2 <= right2) {
      number2Index = (left2 + right2) / 2;
      int number2 = makeTetradicNumber(number2Index);

      if (number2 == required1) {
        *resultSize = 2;
        int *result = (int *)malloc(2 * sizeof(int));
        result[0] = number1;
        result[1] = number2;
        return result;
      }

      if (number2 < required1) {
        int left3 = 0;
        int right3 = number2Index + 1;
        int number3Index;
        int required2 = required1 - number2;

        while (left3 <= right3) {
          number3Index = (left3 + right3) / 2;
          int number3 = makeTetradicNumber(number3Index);

          // for (size_t i = 0; i < cache->size; i++) {
          //   if (cache->entries[i].key == required2 && cache->entries[i].value.size <= 3) {
          //     *resultSize = cache->entries[i].value.size + 2;
          //     int *result = (int *)malloc(*resultSize * sizeof(int));
          //     result[0] = number1;
          //     result[1] = number2;
          //     for (size_t j = 0; j < cache->entries[i].value.size; j++) {
          //       result[j + 2] = cache->entries[i].value.numbers[j];
          //     }
          //     return result;
          //   }
          // }

          if (number3 == required2) {
            *resultSize = 3;
            int *result = (int *)malloc(3 * sizeof(int));
            result[0] = number1;
            result[1] = number2;
            result[2] = number3;
            return result;
          }

          if (number3 < required2) {
            int left4 = 0;
            int right4 = number3Index + 1;
            int number4Index;
            int required3 = required2 - number3;

            // for (size_t i = 0; i < cache->size; i++) {
            //   if (cache->entries[i].key == required3 && cache->entries[i].value.size <= 2) {
            //     *resultSize = cache->entries[i].value.size + 3;
            //     int *result = (int *)malloc(*resultSize * sizeof(int));
            //     result[0] = number1;
            //     result[1] = number2;
            //     result[2] = number3;
            //     for (size_t j = 0; j < cache->entries[i].value.size; j++) {
            //       result[j + 3] = cache->entries[i].value.numbers[j];
            //     }
            //     return result;
            //   }
            // }

            while (left4 <= right4) {
              number4Index = (left4 + right4) / 2;
              int number4 = makeTetradicNumber(number4Index);

              if (number4 == required3) {
                *resultSize = 4;
                int *result = (int *)malloc(4 * sizeof(int));
                result[0] = number1;
                result[1] = number2;
                result[2] = number3;
                result[3] = number4;
                return result;
              }

              if (number4 < required3) {
                int left5 = 0;
                int right5 = number4Index + 1;
                int number5Index;
                int required4 = required3 - number4;

                // for (size_t i = 0; i < cache->size; i++) {
                //   if (cache->entries[i].key == required4 && cache->entries[i].value.size <= 1) {
                //     *resultSize = cache->entries[i].value.size + 4;
                //     int *result = (int *)malloc(*resultSize * sizeof(int));
                //     result[0] = number1;
                //     result[1] = number2;
                //     result[2] = number3;
                //     result[3] = number4;
                //     for (size_t j = 0; j < cache->entries[i].value.size; j++) {
                //       result[j + 4] = cache->entries[i].value.numbers[j];
                //     }
                //     return result;
                //   }
                // }

                while (left5 <= right5) {
                  number5Index = (left5 + right5) / 2;
                  int number5 = makeTetradicNumber(number5Index);

                  if (number5 == required4) {
                    *resultSize = 5;
                    int *result = (int *)malloc(5 * sizeof(int));
                    result[0] = number1;
                    result[1] = number2;
                    result[2] = number3;
                    result[3] = number4;
                    result[4] = number5;
                    return result;
                  }

                  if (number5 < required4) {
                    left5 = number5Index + 1;
                  } else {
                    right5 = number5Index - 1;
                  }
                }

                left4 = number4Index + 1;
              } else {
                right4 = number4Index - 1;
              }
            }
          }

          if (number3 < required2) {
            left3 = number3Index + 1;
          } else {
            right3 = number3Index - 1;
          }
        }

        left2 = number2Index + 1;
      } else {
        right2 = number2Index - 1;
      }
    }
  }

  return NULL;
}


int main() {
  const int start = 1;
  const int end = 10000000;

  printf("Generating %d numbers\n", end - start);

  Map cache = preBuild(start, end);

  printf("Finished prebuilding\n");

  // Start time
  clock_t startTime = clock();

  for (int i = start; i < end; i++) {
    printf("\r%d / %d (%d%%) (size: %zu)", i, end, (int)((i - start) / (double)(end - start) * 100), cache.size);
    if (i % 10000 == 0) {
      printf("\r%d / %d (%d%%) (size: %zu)", i, end, (int)((i - start) / (double)(end - start) * 100), cache.size);
      fflush(stdout);
    }

    size_t resultSize;
    int *result = findSum(i, &cache, &resultSize);

    if (result == NULL || resultSize > 5 || resultSize < 0) {
      fprintf(stderr, "Failed at %d, result: %p\n", i, (void *)result);
      free(result);
      freeMap(&cache);
      return 1;
    }

    int sum = 0;
    for (size_t j = 0; j < resultSize; j++) {
      sum += result[j];
    }

    if (sum != i) {
      fprintf(stderr, "Failed at %d, sum: %d, expected: %d\n", i, sum, i);
      free(result);
      freeMap(&cache);
      return 1;
    }

    free(result);
  }

  // End time
  clock_t endTime = clock();
  double timeSpent = (double)(endTime - startTime) / CLOCKS_PER_SEC;

  printf("\r%d / %d (100%%)\n", end, end);
  printf("Finished testing from %d to %d\n", start, end);

  printf("Time spent: %f seconds\n", timeSpent);

  freeMap(&cache);
  return 0;
}