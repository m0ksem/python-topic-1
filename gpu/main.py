import time
from kernel import make_kernel

start = 1
end = 1_000_000_000
step = 1_000_000
# end = 101
# step = 100

run_kernel = make_kernel(step)

start_time = time.time()

for i in range(start, end, step):
    run_kernel(i, i + step)

    # for idx, r in enumerate(result):
    #     if sum(r) != i + idx:
    #         print(f"Error: Expected {i + idx}, got {r} ({sum(r)})")
    #         break
        

    # print(f"Processed from {i} to {i + step} numbers.")

print(f"Execution time: {time.time() - start_time:.2f} seconds")
