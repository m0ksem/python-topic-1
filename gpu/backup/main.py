import time
from kernel import make_kernel

start = 1
# end = 10_000_000_000
# step = 100_000_000
end = 101
step = 100

run_kernel = make_kernel(step)

start_time = time.time()

for i in range(start, end, step):
    result = run_kernel(i, i + step)
    print(f"Processed {i + step} numbers", result)

# print(f"Execution time: {time.time() - start_time:.2f} seconds")
