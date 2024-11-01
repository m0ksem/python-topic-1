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

void find_sum(int inputNumber, device int *cache, device float *result) {
    int nearestTetradicNumberIndex = getLowestTetradicNumberIndex(inputNumber) - 1;

    for (int number1Index = nearestTetradicNumberIndex; number1Index > 0; number1Index--) {
        int number1 = makeTetradicNumber(number1Index);

        if (number1 == inputNumber) {
            result[0] = number1;
            return;
        }

        int required1 = inputNumber - number1;

        if (required1 < 0) {
            continue;
        }

        if (cache[required1] != -1) {
            result[0] = number1;
            result[1] = cache[required1];
            return;
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

                if (cache[required2] != -1) {
                    result[0] = number1;
                    result[1] = number2;
                    result[2] = cache[required2];
                    return;
                }

                while (left3 <= right3) {
                    number3Index = (left3 + right3) / 2;

                    int number3 = makeTetradicNumber(number3Index);

                    if (number3 == required2) {
                        result[0] = number1;
                        result[1] = number2;
                        result[2] = number3;
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

                        if (cache[required3] != -1) {
                            result[0] = number1;
                            result[1] = number2;
                            result[2] = number3;
                            result[3] = cache[required3];
                            return;
                        }

                        while (left4 <= right4) {
                            number4Index = (left4 + right4) / 2;

                            int number4 = makeTetradicNumber(number4Index);

                            if (number4 == required3) {
                                result[0] = number1;
                                result[1] = number2;
                                result[2] = number3;
                                result[3] = number4;
                                return;
                            }

                            if (number4 < required3) {
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
}

kernel void log_kernel(device float *in  [[ buffer(0) ]],
                       device float *out [[ buffer(1) ]],
                       device int *cache [[ buffer(2) ]],
                       uint id [[ thread_position_in_grid ]]) {
    find_sum(in[id], cache, &out[id * 4]);
}