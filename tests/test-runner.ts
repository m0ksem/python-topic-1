import { exec } from 'child_process'

export const printNumber = (n: number) => {
  return n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
}

const results = [] as { testName: string, range: string, time: string }[]

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

      results.push({
        testName: testName,
        range: `${printNumber(start)} - ${printNumber(end)}${stepText}`,
        time: `${printNumber(time / 1000)}s`,
      })
      clearTimeout(timeout);
      resolve(true);
    })

    process.stdout?.on('data', (data) => {
      console.log(data)
    })


    timeout = setTimeout(() => {
      process.kill()
      console.error(`Timeout for ${testName} ${start} - ${end} ${step}`)
      results.push({
        testName: testName,
        range: `${printNumber(start)} - ${printNumber(end)}${stepText}`,
        time: `>${printNumber(timeoutInMins * 60)}s`,
      })
      resolve(true)
    }, 1000 * 60 * timeoutInMins)
  })
}

const config = {
  python: [
    // 10_000
    // { name: 'simple', start: 1, end: 10_000, step: 0 },
    // { name: 'reversed', start: 1, end: 10_000, step: 0 },
    { name: 'binary-search', start: 1, end: 10_000, step: 0 },
    { name: 'binary-search-prebuild', start: 1, end: 10_000, step: 0 },
    { name: 'binary-search-prebuild-skip', start: 1, end: 10_000, step: 0 },
    { name: 'multithread', start: 1, end: 10_000, step: 10_000 },
  ],
  bun: [
    // 10_000
    // { name: 'simple', start: 1, end: 10_000, step: 0 },
    // { name: 'reversed', start: 1, end: 10_000, step: 0 },
    { name: 'binary-search', start: 1, end: 10_000, step: 0 },
    { name: 'binary-search-prebuild', start: 1, end: 10_000, step: 0 },
    { name: 'binary-search-prebuild-skip', start: 1, end: 10_000, step: 0 },
    { name: 'multithread', start: 1, end: 10_000, step: 10_000 },







    // { name: 'half-reversed-2', start: 1, end: 10_000, step: 0 },
    // { name: 'half-reversed-3', start: 1, end: 10_000, step: 0 },
    // { name: 'binary-search-pre', start: 1, end: 10_000, step: 0 },
    // { name: 'binary-search-formula', start: 1, end: 10_000, step: 0 },
    // { name: 'horizontal-binary-search', start: 1, end: 10_000, step: 10_000 },

    // // 100_000
    // { name: 'simple', start: 1, end: 100_000, step: 0 },
    // { name: 'reversed', start: 1, end: 100_000, step: 0 },
    // { name: 'half-reversed-2', start: 1, end: 100_000, step: 0 },
    // { name: 'binary-search', start: 1, end: 100_000, step: 0 },
    // { name: 'binary-search-pre', start: 1, end: 100_000, step: 0 },
    // { name: 'binary-search-cache', start: 1, end: 100_000, step: 0 },
    // { name: 'binary-search-formula', start: 1, end: 100_000, step: 0 },
    // { name: 'binary-search-prebuild', start: 1, end: 100_000, step: 0 },
    // { name: 'multithread', start: 1, end: 100_000, step: 10_000 },
    // { name: 'horizontal-binary-search', start: 1, end: 100_000, step: 0 },

    // // 1_000_000
    // { name: 'simple', start: 1, end: 1_000_000, step: 0 },
    // { name: 'reversed', start: 1, end: 1_000_000, step: 0 },
    // { name: 'half-reversed-2', start: 1, end: 1_000_000, step: 0 },
    // { name: 'binary-search', start: 1, end: 1_000_000, step: 0 },
    // { name: 'binary-search-cache', start: 1, end: 1_000_000, step: 0 },
    // { name: 'binary-search-formula', start: 1, end: 1_000_000, step: 0 },
    // { name: 'binary-search-prebuild', start: 1, end: 1_000_000, step: 0 },
    // { name: 'horizontal-binary-search', start: 1, end: 1_000_000, step: 0 },
    // { name: 'multithread', start: 1, end: 1_000_000, step: 1_000_000 },

    // // 10_000_000
    // { name: 'half-reversed-2', start: 1, end: 1_000_000, step: 0 },
    // { name: 'binary-search', start: 1, end: 10_000_000, step: 0 },
    // { name: 'binary-search-cache', start: 1, end: 10_000_000, step: 0 },
    // { name: 'binary-search-formula', start: 1, end: 10_000_000, step: 0 },
    // { name: 'binary-search-prebuild', start: 1, end: 10_000_000, step: 0 },
    // { name: 'multithread', start: 1, end: 10_000_000, step: 1_000_000 },

    // 100_000_000
    // { name: 'binary-search-prebuild', start: 1, end: 100_000_000, step: 0 },
    // { name: 'multithread', start: 1, end: 100_000_000, step: 10_000_000 },

    // 200_000_000
    // { name: 'multithread', start: 1, end: 200_000_000, step: 20_000_000 },

    // 500_000_000
    // { name: 'multithread', start: 1, end: 500_000_000, step: 25_000_000, timeout: 10 },

    // 1_000_000_000
    // { name: 'multithread', start: 1, end: 1_000_000_000, step: 25_000_000, timeout: 10 },
    
    // 2_000_000_000
    // { name: 'multithread', start: 1, end: 2_000_000_000, step: 25_000_000, timeout: 10 },

    // 5_000_000_000
    // { name: 'multithread', start: 1, end: 5_000_000_000, step: 25_000_000, timeout: 10 },
  ]
} as Record<string, { name: string, start: number, end: number, step: number, timeout?: number }[]>

const run = async () => {
  for (const r in commands) {
    console.log(`Running tests for ${r}`)
    const runner = r as keyof typeof commands;
    for (let i = 0; i < config[runner].length; i++) {
      const test = config[runner][i];
      await runTest(runner, test.name, test.start, test.end, test.step, test.timeout)
    }
  }

  console.table(results)
}

run()