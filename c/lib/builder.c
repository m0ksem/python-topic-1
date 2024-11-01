#include <stdio.h>
#include <stdlib.h>
#include "tetradic.h"

#define TEN_THOUSAND_INDEX 200

int makeTetradicNumber(int n) {
  // Placeholder function, replace with actual implementation
  return n * n;
}

typedef struct {
  int *values;
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

void initMap(Map *map, size_t capacity) {
  map->entries = (MapEntry *)malloc(capacity * sizeof(MapEntry));
  map->size = 0;
  map->capacity = capacity;
}

void freeMap(Map *map) {
  for (size_t i = 0; i < map->size; i++) {
    free(map->entries[i].value.values);
  }
  free(map->entries);
}

void addToMap(Map *map, int key, int *values, size_t size) {
  if (map->size >= map->capacity) {
    map->capacity *= 2;
    map->entries = (MapEntry *)realloc(map->entries, map->capacity * sizeof(MapEntry));
  }
  map->entries[map->size].key = key;
  map->entries[map->size].value.values = (int *)malloc(size * sizeof(int));
  for (size_t i = 0; i < size; i++) {
    map->entries[map->size].value.values[i] = values[i];
  }
  map->entries[map->size].value.size = size;
  map->size++;
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

        int values3[] = {number1, number2, number3};
        addToMap(&results, sum3, values3, 3);
      }

      int values2[] = {number1, number2};
      addToMap(&results, sum, values2, 2);
    }

    int values1[] = {number1};
    addToMap(&results, number1, values1, 1);
  }

  return results;
}
