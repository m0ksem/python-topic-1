const start = 13_000_000
const end = 100_000_000
const step = 1_000_000

const maxThreads = 6

const makeTread = (start: number, end: number) => {
  return new Promise((resolve) => {
    const worker = new Worker("./worker.ts");

    worker.postMessage({ start, end });
    worker.onmessage = event => {
      resolve(event.data);
    };
    worker.onerror = event => {
      console.error(event);
      resolve(null);
    }
    worker.onmessageerror = event => {
      console.error(event);
      resolve(null);
    }
  })
}

for (let i = start; i < end; i += step * maxThreads) {
  const threads = []
  for (let j = 0; j < maxThreads; j++) {
    console.log('Start', i + step * j, i + step * (j + 1))
    threads.push(makeTread(i + step * j, i + step * (j + 1)))
  }
  await Promise.all(threads)
}