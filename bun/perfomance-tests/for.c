#include <stdio.h>
#include <stdlib.h>
#include <math.h>

int makeTetradicNumber(int index) {
    return (int) (index * (index + 1) * (index + 2)) / 6.0;
}

const double ONE_THIRD = 1.0 / 3.0;

// This function is surprisingly fast
double getLowestTetradicNumberIndex(double y) {
    double halfD = -3 * y;
    double discriminant = (halfD * halfD) + ONE_THIRD * -ONE_THIRD * ONE_THIRD;
    double discriminantSqrt = sqrt(discriminant);
    double u = pow(-halfD + discriminantSqrt, ONE_THIRD);
    double v = pow(-halfD - discriminantSqrt, ONE_THIRD);
    return round(u + v - 1);
}

double* findSums(double inputNumber, int* resultSize) {
    int nearestTetradicNumberIndex = getLowestTetradicNumberIndex(inputNumber);

    for (int number1Index = nearestTetradicNumberIndex; number1Index > 0; number1Index--) {
        double number1 = makeTetradicNumber(number1Index);

        if (number1 == inputNumber) {
            double* result = (double*)malloc(sizeof(double) * 1);
            result[0] = number1;
            *resultSize = 1;
            return result;
        }

        for (int number2Index = nearestTetradicNumberIndex; number2Index > 0; number2Index--) {
            double number2 = makeTetradicNumber(number2Index);
            double sum2 = number1 + number2;

            if (sum2 > inputNumber) {
                continue;
            } else if (sum2 == inputNumber) {
                double* result = (double*)malloc(sizeof(double) * 2);
                result[0] = number1;
                result[1] = number2;
                *resultSize = 2;
                return result;
            }

            for (int number3Index = nearestTetradicNumberIndex; number3Index > 0; number3Index--) {
                double number3 = makeTetradicNumber(number3Index);
                double sum3 = sum2 + number3;

                if (sum3 > inputNumber) {
                    continue;
                } else if (sum3 == inputNumber) {
                    double* result = (double*)malloc(sizeof(double) * 3);
                    result[0] = number1;
                    result[1] = number2;
                    result[2] = number3;
                    *resultSize = 3;
                    return result;
                }

                for (int number4Index = nearestTetradicNumberIndex; number4Index > 0; number4Index--) {
                    double number4 = makeTetradicNumber(number4Index);
                    double sum4 = sum3 + number4;

                    if (sum4 > inputNumber) {
                        continue;
                    } else if (sum4 == inputNumber) {
                        double* result = (double*)malloc(sizeof(double) * 4);
                        result[0] = number1;
                        result[1] = number2;
                        result[2] = number3;
                        result[3] = number4;
                        *resultSize = 4;
                        return result;
                    }

                    for (int number5Index = nearestTetradicNumberIndex; number5Index > 0; number5Index--) {
                        double number5 = makeTetradicNumber(number5Index);
                        double sum5 = sum4 + number5;

                        if (sum5 > inputNumber) {
                            continue;
                        } else if (number1 + number2 + number3 + number4 + number5 == inputNumber) {
                            double* result = (double*)malloc(sizeof(double) * 5);
                            result[0] = number1;
                            result[1] = number2;
                            result[2] = number3;
                            result[3] = number4;
                            result[4] = number5;
                            *resultSize = 5;
                            return result;
                        }
                    }
                }
            }
        }
    }

    *resultSize = 0;
    return NULL;
}

int main() {
    double inputNumber = 100; // Example input
    int resultSize;
    double* result = findSums(inputNumber, &resultSize);

    if (result != NULL) {
        printf("Found sums: ");
        for (int i = 0; i < resultSize; i++) {
            printf("%f ", result[i]);
        }
        printf("\n");
        free(result);
    } else {
        printf("No sums found.\n");
    }

    return 0;
}