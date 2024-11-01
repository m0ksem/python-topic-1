import { findSum } from "../lib/find-sum";

// prevents TS errors
declare var self: Worker;

self.onmessage = (event: MessageEvent) => {
  const results = new Map<number, number[]>()

  const startDate = new Date()
  // console.log(`Worker started (${event.data.start}, ${event.data.end})`)
  for (let i = event.data.start; i <= event.data.end; i++) {
    const result = findSum(i, event.data.cache)
    
    if (result === null) {
      throw new Error('Failed at ' + i)
    }

    results.set(i, result)
  }

  postMessage({
    sums: results,
    start: event.data.start,
    end: event.data.end,
    startTimestamp: startDate.getTime(),
    endTimestamp: (new Date()).getTime()
  });

  // console.log(`Worker done (${event.data.start}, ${event.data.end}) ${(new Date().getTime() - startDate.getTime()) / 1000}s`)
};