#include <metal_stdlib>
using namespace metal;

long makeTetradicNumber(int index) {
    return (index * (index + 1) * (index + 2)) / 6;
}

constant int* getSumFromCache(int index, constant int *cache) {
    if (index >= 1000) { // Assuming the cache array size is 1000
        return nullptr;
    }
    int number1 = cache[index * 5 + 0];

    if (number1 < 0) {
        return nullptr;
    }

    return &cache[index * 5];
}

void find_sum(long inputNumber, device long* result, constant int* cache, constant long* tetradicNumbers) {
    int length = 1000;

    for (int number1Index = length - 1; number1Index >= 0; number1Index--) {
        long number1 = tetradicNumbers[number1Index];
        long required1 = inputNumber - number1;

        if (required1 < 0) {
            continue;
        }

        constant int* cached = getSumFromCache(required1, cache);
        if (cached != nullptr) {
          if (cached[4] == 0) {
            result[0] = number1;
            result[1] = cached[0];
            result[2] = cached[1];
            result[3] = cached[2];
            result[4] = cached[3];
            return;
          } else {
            break;
          }
        }

        if (number1 == inputNumber) {
            result[0] = number1;
            result[1] = 0;
            result[2] = 0;
            result[3] = 0;
            result[4] = 0;
            return;
        }

        int left2 = 0;
        int right2 = number1Index + 1;
        int number2Index;

        while (left2 <= right2) {
            number2Index = (left2 + right2) / 2;
            long number2 = tetradicNumbers[number2Index];

            if (number2 == required1) {
                result[0] = number1;
                result[1] = number2;
                result[2] = 0;
                result[3] = 0;
                result[4] = 0;
                return;
            }

            if (number2 < required1) {
                long required2 = required1 - number2;

                if (required2 < 0) {
                    continue;
                }

                constant int* cached = getSumFromCache(required2, cache);
                if (cached != nullptr) {
                    if (cached[4] == 0 && cached[3] == 0) {
                        result[0] = number1;
                        result[1] = number2;
                        result[2] = cached[0];
                        result[3] = cached[1];
                        result[4] = cached[2];
                        return;
                    } else {
                        break;
                    }
                }

                int left3 = 0;
                int right3 = number2Index + 1;
                int number3Index;

                while (left3 <= right3) {
                    number3Index = (left3 + right3) / 2;

                    long number3 = tetradicNumbers[number3Index];

                    if (number3 == required2) {
                        result[0] = number1;
                        result[1] = number2;
                        result[2] = number3;
                        result[3] = 0;
                        result[4] = 0;
                        return;
                    }

                    if (number3 < required2) {
                        int left4 = 0;
                        int right4 = number3Index + 1;
                        int number4Index;

                        long required3 = required2 - number3;

                        if (required3 < 0) {
                            continue;
                        }

                        constant int* cached = getSumFromCache(required3, cache);
                        if (cached != nullptr) {
                            if (cached[4] == 0 && cached[3] == 0 && cached[2] == 0) {
                                result[0] = number1;
                                result[1] = number2;
                                result[2] = number3;
                                result[3] = cached[0];
                                result[4] = cached[1];
                                return;
                            } else {
                                break;
                            }
                        }
         
                        while (left4 <= right4) {
                            number4Index = (left4 + right4) / 2;
                            long number4 = tetradicNumbers[number4Index];

                            if (number4 == required3) {
                                result[0] = number1;
                                result[1] = number2;
                                result[2] = number3;
                                result[3] = number4;
                                result[4] = 0;
                                return;
                            }

                            if (number4 < required3) {
                                int left5 = 0;
                                int right5 = number4Index + 1;
                                int number5Index;

                                long required4 = required3 - number4;

                                if (required4 < 0) {
                                    continue;
                                }

                                constant int* cached = getSumFromCache(required3, cache);
                                if (cached != nullptr) {
                                    if (cached[4] == 0 && cached[3] == 0 && cached[2] == 0 && cached[1] == 0) {
                                        result[0] = number1;
                                        result[1] = number2;
                                        result[2] = number3;
                                        result[3] = number4;
                                        result[4] = cached[0];
                                        return;
                                    } else {
                                        break;
                                    }
                                }

                                while (left5 <= right5) {
                                    number5Index = (left5 + right5) / 2;

                                    long number5 = tetradicNumbers[number5Index];

                                    if (number5 == required4) {
                                        result[0] = number1;
                                        result[1] = number2;
                                        result[2] = number3;
                                        result[3] = number4;
                                        result[4] = number5;
                                        return;
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

    result[0] = -1;
    result[1] = -1;
    result[2] = -1;
    result[3] = -1;
    result[4] = -1;
}


kernel void run(constant long &start  [[ buffer(0) ]],
                device long *out [[ buffer(1) ]],
                constant int *cache [[ buffer(2) ]],
                constant long *tetradicNumbers [[ buffer(3) ]],
                uint id [[ thread_position_in_grid ]]) {
    uint number = start + id;
    
    find_sum(number, &out[id * 5], cache, tetradicNumbers);
}
