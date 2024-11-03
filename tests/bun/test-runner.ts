import { exec } from 'child_process'

export const printNumber = (n: number) => {
  return n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
}

const results = [] as { testName: string, range: string, time: string }[]

const runTest = (testName: string, start: number, end: number, step: number) => {
  return new Promise((resolve, reject) => {
    const startMs = new Date().getTime();
    const command = `bun run tests/${testName}.ts ${start} ${end} ${step}`;

    let timeout: ReturnType<typeof setTimeout>;

    const process = exec(command, (error, stdout, stderr) => {
      if (error) {
        console.error(`Error testing ${testName}: ${error}`);
        console.error(`stderr: ${stderr}`);
        clearTimeout(timeout);
        resolve(false);
        return;
      }

      if (stdout) {
        console.log(stdout);
      }

      const endMs = new Date().getTime();

      const time = endMs - startMs;

      const stepText = step === 0 ? '' : ` with step ${printNumber(step)}`;

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
      resolve(true)
    }, 1000 * 60 * 2)
  })
}

const config = {
  bun: [
    // { name: 'half-reversed-2', start: 1, end: 100_000, step: 0 },
    // { name: 'pre-build', start: 1, end: 1_000_000, step: 0 },
    // { name: 'half-reversed-2', start: 1, end: 100_000, step: 0 },
    // { name: 'binary-search', start: 1, end: 100_000, step: 0 },
    // { name: 'binary-search', start: 1, end: 1_000_000, step: 0 },
    // { name: 'pre-build', start: 1, end: 100_000_000_000_000, step: 0 },
    // { name: 'binary-search-pre', start: 1, end: 10_000_000, step: 0 },
    // { name: 'binary-search-pre', start: 1, end: 1_000_000, step: 0 },
    // { name: 'binary-search-cache', start: 1, end: 1_000_000, step: 0 },
    // { name: 'binary-search-horizontal', start: 1, end: 100_000, step: 0 },
    // { name: 'binary-search-horizontal-cache', start: 1, end: 1_000_000, step: 0 },

    // { name: 'binary-search-pre', start: 1, end: 10_000_000, step: 0 },
    // { name: 'binary-search-prebuild', start: 1, end: 10_000_000, step: 0 },


    // { name: 'binary-search-pre', start: 1, end: 100_000_000, step: 0 },
    // { name: 'binary-search-prebuild-skip-gbc', start: 100_000_000, end: 110_000_000, step: 0 },    
    // { name: 'binary-search-prebuild-skip', start: 1, end: 100_000_000, step: 0 },  
    { name: 'multithread', start: 1, end: 100_000_000, step: 1_000_000 },    


    // { name: 'simple', start: 1, end: 10_000, step: 0 },
    // { name: 'reversed', start: 1, end: 10_000, step: 0 },
    // { name: 'half-reversed-2', start: 1, end: 10_000, step: 0 },
    // { name: 'half-reversed-3', start: 1, end: 10_000, step: 0 },

    // { name: 'simple', start: 1, end: 100_000, step: 0 },
    // { name: 'reversed', start: 1, end: 100_000, step: 0 },
    // { name: 'half-reversed-3', start: 1, end: 100_000, step: 0 },
    // { name: 'recursive', start: 1, end: 100_000, step: 10_000 },
    // { name: 'for', start: 1, end: 100_000, step: 10_000 },
    // { name: 'for-horizontal', start: 1, end: 100_000, step: 10_000 },
    // { name: 'binary-search', start: 1, end: 100_000, step: 10_000 },
    // { name: 'binary-search-cache', start: 1, end: 100_000, step: 10_000 },
    // { name: 'binary-search-pre-cache', start: 1, end: 100_000, step: 10_000 },

    // { name: 'recursive', start: 1, end: 1_000_000, step: 100_000 },
    // { name: 'for', start: 1, end: 1_000_000, step: 100_000 },
    // { name: 'for-horizontal', start: 1, end: 1_000_000, step: 100_000 },
    // { name: 'binary-search', start: 1, end: 1_000_000, step: 100_000 },
    // { name: 'binary-search-cache', start: 1, end: 1_000_000, step: 100_000 },
    // { name: 'binary-search-pre-cache', start: 1, end: 1_000_000, step: 100_000 },

    // { name: 'recursive', start: 1, end: 1_000_000_000, step: 100_000 },
    // { name: 'for', start: 1, end: 1_000_000_000, step: 100_000 },
    // { name: 'for-horizontal', start: 1, end: 1_000_000_000, step: 100_000 },
    // { name: 'binary-search', start: 1, end: 1_000_000_000, step: 100_000 },
    // { name: 'binary-search-cache', start: 1, end: 1_000_000_000, step: 100_000 },
    // { name: 'binary-search-pre-cache', start: 1, end: 1_000_000_000, step: 100_000 },
    
    // { name: 'recursive', start: 1, end: 1_000_000_000, step: 1_000_000 },
    // { name: 'for', start: 1, end: 1_000_000_000, step: 1_000_000 },
    // { name: 'for-horizontal', start: 1, end: 1_000_000_000, step: 1_000_000 },
    // { name: 'binary-search', start: 1, end: 1_000_000_000, step: 1_000_000 },
    // { name: 'binary-search-cache', start: 1, end: 1_000_000_000, step: 1_000_000 },
    // { name: 'binary-search-pre-cache', start: 1, end: 1_000_000_000, step: 1_000_000 },
  ]
}

const run = async () => {
  for (let i = 0; i < config.bun.length; i++) {
    const test = config.bun[i];
    await runTest(test.name, test.start, test.end, test.step)
  }

  console.table(results)
}

run()