import { cc } from "bun:ffi";

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

// prevents TS errors
declare var self: Worker;

self.onmessage = (event: MessageEvent) => {
  postMessage(tryRangeHypothesisToFile(event.data.start, event.data.end));
};