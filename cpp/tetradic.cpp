#include <math.h>

int makeTetradicNumber(int index) {
  return (index * (index + 1) * (index + 2)) / 6;
}

const double ONE_THIRD = 1.0 / 3.0;
const double MINUS_ONE_THIRD_CUBE = pow(-ONE_THIRD, 3);

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

