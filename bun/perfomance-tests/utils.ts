export const withTime = <T>(fn: () => T): [T, number] => {
  const startTime = new Date().getTime();
  const result = fn();
  const endTime = new Date().getTime();
  return [result, endTime - startTime];
}

export const printNumber = (n: number) => {
  return n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
}