import time
from kernel import make_kernel

start = 1
end = 100_000_001
step = 100_000_000
# end = 100_000_001
# step = int(10_000_000)

if step > end - start:
    step = end - start

run_kernel = make_kernel(step)

print(f"Processing from {start} to {end} numbers with step {step}.")

start_time = time.time()

for i in range(start, end, step):
    run_kernel(i, i + step)

    # for idx, r in enumerate(result):
    #     if sum(r) != i + idx:
    #         print(f"Error: Expected {i + idx}, got {r} ({sum(r)})")
    #         break
        

    # print(f"Processed from {i} to {i + step} numbers.")

print(f"Execution time: {time.time() - start_time:.2f} seconds")
