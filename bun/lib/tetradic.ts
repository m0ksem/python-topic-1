export function makeTetradicNumber(index: number): number {
  return (index * (index + 1) * (index + 2)) / 6;
}

const ONE_THIRD = 1 / 3;

// This function is surprisingly fast
function getTetradicNumberIndex(y: number): number {
  const halfD = -3 * y;

  const discriminant = (halfD ** 2) + Math.pow(-ONE_THIRD, 3);
  const discriminantSqrt = Math.sqrt(discriminant);

  const u = Math.cbrt(-halfD + discriminantSqrt);
  const v = Math.cbrt(-halfD - discriminantSqrt);
  return u + v - 1;
}

export function getLowestTetradicNumberIndex(number: number): number {
  return Math.round(getTetradicNumberIndex(number));
}