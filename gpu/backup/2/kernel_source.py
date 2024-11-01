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

device float* getSumFromCache(int inputNumber, device float *cache, int level) {
    float number1 = cache[inputNumber * 5 + 0];

    if (number1 == -1) {
        return nullptr;
    }

    float number2 = cache[inputNumber * 5 + 1];
    float number3 = cache[inputNumber * 5 + 2];
    float number4 = cache[inputNumber * 5 + 3];
    float number5 = cache[inputNumber * 5 + 4];

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

void find_sum(int inputNumber, device float *result, device float *cache) {
    int nearestTetradicNumberIndex = getLowestTetradicNumberIndex(inputNumber);

    for (int number1Index = nearestTetradicNumberIndex; number1Index > 0; number1Index--) {
        int number1 = makeTetradicNumber(number1Index);

        device float* cachedResult0 = getSumFromCache(inputNumber, cache, 0);
        if (cachedResult0 != nullptr) {
            result[0] = cachedResult0[0];
            result[1] = cachedResult0[1];
            result[2] = cachedResult0[2];
            result[3] = cachedResult0[3];
            result[4] = cachedResult0[4];
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

        int required1 = inputNumber - number1;

        if (required1 < 0) {
            continue;
        }

        device float* cachedResult1 = getSumFromCache(required1, cache, 1);
        if (cachedResult1 != nullptr) {
            result[0] = cachedResult1[0];
            result[1] = cachedResult1[1];
            result[2] = cachedResult1[2];
            result[3] = cachedResult1[3];
            result[4] = cachedResult1[4];
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


                device float* cachedResult2 = getSumFromCache(required2, cache, 2);
                if (cachedResult2 != nullptr) {
                    result[0] = cachedResult2[0];
                    result[1] = cachedResult2[1];
                    result[2] = cachedResult2[2];
                    result[3] = cachedResult2[3];
                    result[4] = cachedResult2[4];
                    return;
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

kernel void run(device float *in  [[ buffer(0) ]],
                device float *out [[ buffer(1) ]],
                device float *cache [[ buffer(2) ]],
                uint id [[ thread_position_in_grid ]]) {
    find_sum(in[id], &out[id * 5], cache);
}
"""

# find_sum(in[id], &out[id * 5]);

# # void find_sum(int inputNumber, device float *result, device float *cache) {
# if (cache[inputNumber] != 0) {
#     result[0] = cache[inputNumber * 5 + 0];
#     result[1] = cache[inputNumber * 5 + 1];
#     result[2] = cache[inputNumber * 5 + 2];
#     result[3] = cache[inputNumber * 5 + 3];
#     result[4] = cache[inputNumber * 5 + 4];
#     return;
# }

# result[1] = -1;
# return;

# device float *cache [[ buffer(2) ]],

# find_sum(in[id], &out[id * 5], cache);



        # while (left2 <= right2) {
        #     number2Index = (left2 + right2) / 2;

        #     int number2 = makeTetradicNumber(number2Index);

        #     if (number2 == required1) {
        #         result[0] = number1;
        #         result[1] = number2;
        #         result[2] = 0;
        #         result[3] = 0;
        #         result[4] = 0;
        #         return;
        #     }

        #     if (number2 < required1) {
        #         int left3 = 0;
        #         int right3 = number2Index + 1;
        #         int number3Index;

        #         int required2 = required1 - number2;

        #         if (required2 < 0) {
        #             continue;
        #         }

        #         while (left3 <= right3) {
        #             number3Index = (left3 + right3) / 2;

        #             int number3 = makeTetradicNumber(number3Index);

        #             if (number3 == required2) {
        #                 result[0] = number1;
        #                 result[1] = number2;
        #                 result[2] = number3;
        #                 result[3] = 0;
        #                 result[4] = 0;
        #                 return;
        #             }

        #             if (number3 < required2) {
        #                 int left4 = 0;
        #                 int right4 = number3Index + 1;
        #                 int number4Index;

        #                 int required3 = required2 - number3;

        #                 if (required3 < 0) {
        #                     continue;
        #                 }

        #                 while (left4 <= right4) {
        #                     number4Index = (left4 + right4) / 2;

        #                     int number4 = makeTetradicNumber(number4Index);

        #                     if (number4 == required3) {
        #                         result[0] = number1;
        #                         result[1] = number2;
        #                         result[2] = number3;
        #                         result[3] = number4;
        #                         result[4] = 0;
        #                         return;
        #                     }

        #                     if (number4 < required3) {
        #                         left4 = number4Index + 1;
        #                     } else {
        #                         right4 = number4Index - 1;
        #                     }
        #                 }

        #             }

        #             if (number3 < required2) {
        #                 left3 = number3Index + 1;
        #             } else {
        #                 right3 = number3Index - 1;
        #             }
        #         }

        #         left2 = number2Index + 1;
        #     } else {
        #         right2 = number2Index - 1;
        #     }
        # }