import { quickFindSum } from "./quick-find-sum";

export const buildCache = (size: number = 100_000) => {
  const cache = new Map<number, number[]>();

  for (let i = 1; i < size; i++) {
    const result = quickFindSum(i, cache);
  
    if (result === null) {
      throw new Error(`Failed at ${i}`);
    }
  
    cache.set(i, result);
  }

  return cache
}