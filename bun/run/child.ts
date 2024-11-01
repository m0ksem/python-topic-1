import { findSum } from "../lib/find-sum";

process.on("message", (event: any) => {
  const results = new Map<number, number[]>()
  
  const startDate = new Date()
  
  for (let i = event.start; i <= event.end; i++) {
    const result = findSum(i, event.cache)
    
    if (result === null) {
      throw new Error('Failed at ' + i)
    }
  
    results.set(i, result)
  }
  
  if (process.send) {
    process.send({
      sums: results,
      start: event.start,
      end: event.end,
      startTimestamp: startDate.getTime(),
      endTimestamp: (new Date()).getTime()
    });
  } else {
    console.log({
      sums: results,
      start: event.start,
      end: event.end,
      startTimestamp: startDate.getTime(),
      endTimestamp: (new Date()).getTime()
    })
  }
});

