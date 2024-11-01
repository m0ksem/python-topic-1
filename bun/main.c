#include <stdio.h>
#include <math.h>
#include <stdlib.h>
#include <time.h>

double makeTetradicNumber(int index) {
    return (index * (index + 1) * (index + 2)) / 6.0;
}

const double ONE_THIRD = 1.0 / 3.0;
double MINUS_ONE_THIRD_CUBE;

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

int* iterateSum(int iterableNumberIndex, double currentSum, double inputNumber, int nearestTetradicNumberIndex, int* resultSize) {
    if (iterableNumberIndex >= 5) {
        return NULL;
    }

    for (int numberIndex = nearestTetradicNumberIndex; numberIndex > 0; numberIndex--) {
        double number = makeTetradicNumber(numberIndex);
        double newSum = currentSum + number;

        if (newSum == inputNumber) {
            int* result = (int*)malloc(sizeof(int));
            result[0] = number;
            *resultSize = 1;
            return result;
        } else if (newSum > inputNumber) {
            continue;
        }

        if (iterableNumberIndex == 4) {
            return NULL;
        }

        int newResultSize;
        int* found = iterateSum(iterableNumberIndex + 1, newSum, inputNumber, nearestTetradicNumberIndex, &newResultSize);
        if (found != NULL) {
            int* result = (int*)malloc((newResultSize + 1) * sizeof(int));
            result[0] = number;
            for (int i = 0; i < newResultSize; i++) {
                result[i + 1] = found[i];
            }
            free(found);
            *resultSize = newResultSize + 1;
            return result;
        }
    }

    return NULL;
}

int* findSums(double inputNumber, int* resultSize) {
    int nearestTetradicNumberIndex = getLowestTetradicNumberIndex(inputNumber);
    return iterateSum(0, 0, inputNumber, nearestTetradicNumberIndex, resultSize);
}

void tryRangeHypothesis(int start, int end) {
    long startTime = time(NULL);

    for (int i = start; i < end; i++) {
        int resultSize;
        int* result = findSums(i, &resultSize);
        if (result == NULL || resultSize > 5) {
            printf("Failed at %d\n", i);
        }
        free(result);
    }

    long endTime = time(NULL);
    printf("Finished testing from %d to %d in %lds\n", start, end, endTime - startTime);
}

void tryRangeHypothesisToFile(int start, int end) {
    long startTime = time(NULL);

    char fileName[256];
    snprintf(fileName, sizeof(fileName), "./out/results-%d-%d.json", start, end);
    FILE* file = fopen(fileName, "w");
    fprintf(file, "[");

    for (int i = start; i < end; i++) {
        int resultSize;
        int* result = findSums(i, &resultSize);

        fprintf(file, "{\"number\": %d, \"result\": [", i);
        if (result != NULL) {
            for (int j = 0; j < resultSize; j++) {
                fprintf(file, "%d", result[j]);
                if (j < resultSize - 1) {
                    fprintf(file, ", ");
                }
            }
        }
        fprintf(file, "]}");
        if (i < end - 1) {
            fprintf(file, ", ");
        }
        free(result);
    }

    fprintf(file, "]");
    fclose(file);

    long endTime = time(NULL);
    printf("Finished testing from %d to %d in %lds\n", start, end, endTime - startTime);
}

int main(int argc, char *argv[]) {
    if (argc != 3) {
        printf("Usage: %s <start> <end>\n", argv[0]);
        return 1;
    }

    int start = atoi(argv[1]);
    int end = atoi(argv[2]);

    MINUS_ONE_THIRD_CUBE = pow(-1.0 / 3.0, 3);
    tryRangeHypothesis(1, 1000000);
    // tryRangeHypothesisToFile(1, 1000000);
    return 0;
}