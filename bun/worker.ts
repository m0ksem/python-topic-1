import { tryRangeHypothesisToFile } from './lib.ts'

// prevents TS errors
declare var self: Worker;

self.onmessage = (event: MessageEvent) => {
  postMessage(tryRangeHypothesisToFile(event.data.start, event.data.end));
};