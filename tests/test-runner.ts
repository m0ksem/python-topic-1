import { exec } from 'child_process'

export const printNumber = (n: number) => {
  return n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
}

const results = {} as Record<string, Record<string, string>>

const commands = {
  bun: (testName: string) => `bun run ./bun/tests/${testName}.ts`,
  python: (testName: string) => `python3 ./python/tests/${testName}.py`,
}

const runTest = (runner: keyof typeof commands, testName: string, start: number, end: number, step: number, timeoutInMins = 0.5) => {
  return new Promise((resolve, reject) => {
    const startMs = new Date().getTime();
    const command = `${commands[runner](testName)} ${start} ${end} ${step}`;

    let timeout: ReturnType<typeof setTimeout>;

    console.log(`Testing ${testName} from ${printNumber(start)} to ${printNumber(end)} with step ${printNumber(step)}`);

    const stepText = step === 0 ? '' : ` with step ${printNumber(step)}`;

    testName = `${runner}/${testName}`;

    const process = exec(command, (error, stdout, stderr) => {
      if (error) {
        console.error(`Error testing ${testName}`);
        console.error(`stderr: ${stderr}`);
        clearTimeout(timeout);
        resolve(false);
        return;
      }

      const endMs = new Date().getTime();

      const time = endMs - startMs;

      // results.push({
      //   testName: testName,
      //   range: `${printNumber(start)} - ${printNumber(end)}${stepText}`,
      //   time: `${printNumber(time / 1000)}s`,
      // })
      results[printNumber(end)] = results[printNumber(end)] || {}
      results[printNumber(end)][testName] = String(time / 1000)
      clearTimeout(timeout);
      resolve(true);
    })

    process.stdout?.on('data', (data) => {
      console.log(data)
    })


    timeout = setTimeout(() => {
      process.kill()
      console.error(`Timeout for ${testName} ${start} - ${end} ${step}`)
      results[printNumber(end)] = results[printNumber(end)] || {}
      results[printNumber(end)][testName] = '>30'
      // results.push({
      //   testName: testName,
      //   range: `${printNumber(start)} - ${printNumber(end)}${stepText}`,
      //   time: `>${printNumber(timeoutInMins * 60)}s`,
      // })
      resolve(true)
    }, 1000 * 60 * timeoutInMins)
  })
}

const makeTests = (end: number) => {
  return [
    { runner: 'python', name: 'simple', start: 1, end: end, step: 0 },
    { runner: 'bun', name: 'simple', start: 1, end: end, step: 0 },
  
    { runner: 'python', name: 'reversed', start: 1, end: end, step: 0 },
    { runner: 'bun', name: 'reversed', start: 1, end: end, step: 0 },
  
    { runner: 'python', name: 'binary-search', start: 1, end: end, step: 0 },
    { runner: 'bun', name: 'binary-search', start: 1, end: end, step: 0 },
  
    { runner: 'python', name: 'binary-search-prebuild', start: 1, end: end, step: 0 },
    { runner: 'bun', name: 'binary-search-prebuild', start: 1, end: end, step: 0 },
  
    { runner: 'python', name: 'binary-search-prebuild-skip', start: 1, end: end, step: 0 },
    { runner: 'bun', name: 'binary-search-prebuild-skip', start: 1, end: end, step: 0 },
  
    { runner: 'python', name: 'multithread', start: 1, end: end, step: end / 10 },
    { runner: 'bun', name: 'multithread', start: 1, end: end, step: end / 10 },
  ] as { runner: 'python' | 'bun', name: string, start: number, end: number, step: number, timeout?: number }[]
}

const config = [
  { runner: 'bun', name: 'multithread', start: 1, end: 100_000_000, step: 100_000_000 / 10 },
  // ...makeTests(10_000),
  // ...makeTests(100_000),
  // ...makeTests(100_000),
  // ...makeTests(1_000_000),
  // ...makeTests(10_000_000),
  // ...makeTests(100_000_000),
  // ...makeTests(1_000_000_000),
] as { runner: 'python' | 'bun', name: string, start: number, end: number, step: number, timeout?: number }[]

const run = async () => {
  for (let i = 0; i < config.length; i++) {
    const test = config[i];
    await runTest(test.runner, test.name, test.start, test.end, test.step, test.timeout)
  }

  console.table(results)
}

run()