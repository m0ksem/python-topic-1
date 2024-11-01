import time
from kernel import make_kernel

start = 1
end = 100_000_000
step = 100_000
# end = 101
# step = 100

run_kernel = make_kernel(step)

start_time = time.time()

for i in range(start, end, step):
    result = run_kernel(i, i + step)

    for idx, r in enumerate(result):
        if sum(r) != i + idx:
            print(f"Error: Expected {i + idx}, got {r}")
            break
        

    print(f"Processed from {i} to {i + step} numbers. First result: ", result[0], " all results count ", len(result))

# print(f"Execution time: {time.time() - start_time:.2f} seconds")
