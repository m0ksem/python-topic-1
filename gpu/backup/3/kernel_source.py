kernel_source = """
#include <metal_stdlib>
using namespace metal;

int makeTetradicNumber(int index) {
    return (index * (index + 1) * (index + 2)) / 6;
}

int getLowestTetradicNumberIndex(int number) {
    float oneThird = 1.0 / 3.0;
    float halfD = -3.0 * number;
    float discriminant = (halfD * halfD) + pow(-oneThird, 3);
    float discriminantSqrt = sqrt(discriminant);
    float u = pow(-halfD + discriminantSqrt, 1.0/3.0);
    float v = pow(-halfD - discriminantSqrt, 1.0/3.0);
    return round(u + v - 1.0);
}

device int* getSumFromCache(int inputNumber, device int *cache, int level) {
    if (inputNumber >= 10000 * 5) { // Assuming the cache array size is 1000
        return nullptr;
    }
    int number1 = cache[inputNumber * 5 + 0];

    if (number1 == -1) {
        return nullptr;
    }

    int number2 = cache[inputNumber * 5 + 1];
    int number3 = cache[inputNumber * 5 + 2];
    int number4 = cache[inputNumber * 5 + 3];
    int number5 = cache[inputNumber * 5 + 4];

    if (level == 4) {
        if (number2 == 0 && number3 == 0 && number4 == 0 && number5 == 0) {
            return &cache[inputNumber * 5];
        }
    }

    if (level == 4) {
        if (number3 == 0 && number4 == 0 && number5 == 0) {
            return &cache[inputNumber * 5];
        }
    }

    if (level == 3) {
        if (number4 == 0 && number5 == 0) {
            return &cache[inputNumber * 5];
        }
    }

    if (level == 1) {
        if (number5 == 0) {
            return &cache[inputNumber * 5];
        }
    }

    if (level == 0) {
        return &cache[inputNumber * 5];
    }

    return nullptr;
}

void find_sum(long inputNumber, device long *result, device int *cache) {
    int nearestTetradicNumberIndex = getLowestTetradicNumberIndex(inputNumber);

    for (int number1Index = nearestTetradicNumberIndex; number1Index > 0; number1Index--) {
        int number1 = makeTetradicNumber(number1Index);

        if (number1 == inputNumber) {
            result[0] = number1;
            result[1] = 0;
            result[2] = 0;
            result[3] = 0;
            result[4] = 0;
            return;
        }

        int required1 = inputNumber - number1;

        if (required1 < 0) {
            continue;
        }

        int left2 = 0;
        int right2 = nearestTetradicNumberIndex + 1;
        int number2Index;

        while (left2 <= right2) {
            number2Index = (left2 + right2) / 2;

            int number2 = makeTetradicNumber(number2Index);

            if (number2 == required1) {
                result[0] = number1;
                result[1] = number2;
                result[2] = 0;
                result[3] = 0;
                result[4] = 0;
                return;
            }

            if (number2 < required1) {
                int left3 = 0;
                int right3 = number2Index + 1;
                int number3Index;

                int required2 = required1 - number2;

                if (required2 < 0) {
                    continue;
                }

                while (left3 <= right3) {
                    number3Index = (left3 + right3) / 2;

                    int number3 = makeTetradicNumber(number3Index);

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

                        int required3 = required2 - number3;

                        if (required3 < 0) {
                            continue;
                        }

                        while (left4 <= right4) {
                            number4Index = (left4 + right4) / 2;

                            int number4 = makeTetradicNumber(number4Index);

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

                                int required4 = required3 - number4;

                                if (required4 < 0) {
                                    continue;
                                }

                                while (left5 <= right5) {
                                    number5Index = (left5 + right5) / 2;

                                    int number5 = makeTetradicNumber(number5Index);

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
