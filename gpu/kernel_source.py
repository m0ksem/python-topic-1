kernel_source = """
#include <metal_stdlib>
using namespace metal;

long makeTetradicNumber(int index) {
    return (index * (index + 1) * (index + 2)) / 6;
}

device long* makeTetradicNumbers(int num, device long* numbers) {
    int index = 1;
    int count = 0;

    while (true) {
        long tetradicNumber = makeTetradicNumber(index);
        if (tetradicNumber > num) {
            break;
        }

        numbers[count] = tetradicNumber;
        count++;
        index++;
    }

    return numbers;
}

device int* getSumFromCache(int index, device int *cache, int level) {
    return nullptr;
    if (index >= 10000 * 5) { // Assuming the cache array size is 1000
        return nullptr;
    }
    int number1 = cache[index * 5 + 0];

    if (number1 == -1) {
        return nullptr;
    }

    int number2 = cache[index * 5 + 1];
    int number3 = cache[index * 5 + 2];
    int number4 = cache[index * 5 + 3];
    int number5 = cache[index * 5 + 4];

    if (level == 4) {
        if (number2 == 0 && number3 == 0 && number4 == 0 && number5 == 0) {
            return &cache[index * 5];
        }
    }

    if (level == 3) {
        if (number3 == 0 && number4 == 0 && number5 == 0) {
            return &cache[index * 5];
        }
    }

    if (level == 2) {
        if (number4 == 0 && number5 == 0) {
            return &cache[index * 5];
        }
    }

    if (level == 1) {
        if (number5 == 0) {
            return &cache[index * 5];
        }
    }

    if (level == 0) {
        return &cache[index * 5];
    }

    return nullptr;
}

void find_sum(long inputNumber, device long* result, device int* cache) {
    long tetradicNumbers[1000];
    int length = 0;

    // Generate tetradic numbers up to inputNumber
    for (int i = 0; i < 1000; i++) {
        long tetradicNumber = makeTetradicNumber(i);
        if (tetradicNumber > inputNumber) {
            break;
        }
        tetradicNumbers[length++] = tetradicNumber;
    }

    for (int number1Index = length - 1; number1Index > 0; number1Index--) {
        long number1 = tetradicNumbers[number1Index];
        long required1 = inputNumber - number1;

        if (required1 < 0) {
            continue;
        }

        device int* cached = getSumFromCache(required1, cache, 1);
        if (cached != nullptr) {
            result[0] = number1;
            result[1] = cached[0];
            result[2] = cached[1];
            result[3] = cached[2];
            result[4] = cached[3];
            return;
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

                device int* cached = getSumFromCache(required2, cache, 2);
                if (cached != nullptr) {
                    result[0] = number1;
                    result[1] = number2;
                    result[2] = cached[0];
                    result[3] = cached[1];
                    result[4] = cached[2];
                    return;
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

                        device int* cached = getSumFromCache(required3, cache, 3);
                        if (cached != nullptr) {
                            result[0] = number1;
                            result[1] = number2;
                            result[2] = number3;
                            result[3] = cached[0];
                            result[4] = cached[1];
                            return;
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

                                device int* cached = getSumFromCache(required3, cache, 4);
                                if (cached != nullptr) {
                                    result[0] = number1;
                                    result[1] = number2;
                                    result[2] = number3;
                                    result[3] = number4;
                                    result[4] = cached[0];
                                    return;
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

kernel void run(device long *in  [[ buffer(0) ]],
                device long *out [[ buffer(1) ]],
                device int *cache [[ buffer(2) ]],
                uint id [[ thread_position_in_grid ]]) {
    find_sum(in[id], &out[id * 5], cache);
}
"""
