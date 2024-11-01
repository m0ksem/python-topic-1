import { cc } from "bun:ffi";

const start = 10_000_000
const end = 100_000_000
const step = 50_000

export const {
  symbols: { tryRangeHypothesisToFile },
} = cc({
  source: "./main.c",
  symbols: {
    tryRangeHypothesisToFile: {
      returns: "int",
      args: ['int', 'int'],
    },
  },
});

for (let i = start; i < end; i += step) {
  console.log(tryRangeHypothesisToFile(i, i + step));
}