import time
import Metal
from kernel_source import kernel_source
from prebuild import pre_build, make_tetradic_numbers
import ctypes

# Create a Metal device, library, and kernel function
device = Metal.MTLCreateSystemDefaultDevice()
library, error = device.newLibraryWithSource_options_error_(kernel_source, None, None)
if error:
  raise RuntimeError(f"Failed to create Metal library: {error}")
kernel_function = library.newFunctionWithName_("run")
if not kernel_function:
  raise RuntimeError("Failed to create kernel function 'run'")

# Create a command queue
commandQueue = device.newCommandQueue()

# Create a pipeline state object
pso = device.newComputePipelineStateWithFunction_error_(kernel_function, None)[0]

def make_cache_buffer(cache_size):
  cache = pre_build(cache_size, cache_size)
  NUMBERS_IN_CACHE = 5

  # Create a buffer for the cache
  cache_buffer_length = len(cache) * NUMBERS_IN_CACHE * 4  # 4 bytes per float
  cache_buffer = device.newBufferWithLength_options_(cache_buffer_length, Metal.MTLResourceStorageModeShared)

  # Map the cache to the Metal buffer
  cache_array = (ctypes.c_int * (len(cache) * NUMBERS_IN_CACHE)).from_buffer(cache_buffer.contents().as_buffer(cache_buffer_length))
  for i in range(len(cache)):
    cached = cache.get(i, [-2, -2, -2, -2, -2])
    c = {}
    for j in range(NUMBERS_IN_CACHE):
      cache_array[i * NUMBERS_IN_CACHE + j] = cached[j]
      c[i * NUMBERS_IN_CACHE + j] = cached[j]
    # print(f"Cache[{i}] = {c}")

  return cache_buffer

INT_SIZE = 4

# def make_tetradic_numbers_buffer(num):
#   numbers = make_tetradic_numbers(num)
#   numbers_buffer_length = len(numbers) * INT_SIZE  # 4 bytes per float
#   numbers_buffer = device.newBufferWithLength_options_(numbers_buffer_length, Metal.MTLResourceStorageModeShared)

#   numbers_array = (ctypes.c_int * len(numbers)).from_buffer(numbers_buffer.contents().as_buffer(numbers_buffer_length))
#   for i in range(len(numbers)):
#     numbers_array[i] = numbers[i]

#   return numbers_buffer

LONG_INT_SIZE = 8

def make_kernel(step):
  array_length = step
  input_buffer_length = step * LONG_INT_SIZE
  output_array_length = step * 5
  output_buffer_length = step * 5 * LONG_INT_SIZE

  input_buffer = device.newBufferWithLength_options_(input_buffer_length, Metal.MTLResourceStorageModeShared)
  output_buffer = device.newBufferWithLength_options_(output_buffer_length, Metal.MTLResourceStorageModeShared)
  cache_buffer = make_cache_buffer(100)

  input_array = (ctypes.c_long * array_length).from_buffer(input_buffer.contents().as_buffer(input_buffer_length))

  def run(start, end):
    if (end - start) > array_length:
      raise ValueError(f"Input array size {end - start} is too large for buffer size {array_length}")

    # Fill the input array directly
    for i in range(start, end):
      input_array[i - start] = i

    # Create a command buffer
    commandBuffer = commandQueue.commandBuffer()

    # Set the kernel function and buffers
    computeEncoder = commandBuffer.computeCommandEncoder()
    computeEncoder.setComputePipelineState_(pso)
    computeEncoder.setBuffer_offset_atIndex_(input_buffer, 0, 0)
    computeEncoder.setBuffer_offset_atIndex_(output_buffer, 0, 1)
    computeEncoder.setBuffer_offset_atIndex_(cache_buffer, 0, 2)

    # Define threadgroup size
    threadsPerThreadgroup = Metal.MTLSizeMake(output_array_length, 1, 1)
    threadgroupSize = Metal.MTLSizeMake(pso.maxTotalThreadsPerThreadgroup(), 1, 1)

    # Dispatch the kernel
    computeEncoder.dispatchThreads_threadsPerThreadgroup_(threadsPerThreadgroup, threadgroupSize)
    computeEncoder.endEncoding()

    startTime = time.time()
    # Commit the command buffer
    commandBuffer.commit()
    commandBuffer.waitUntilCompleted()

    print(f"GPU execution time: {time.time() - startTime:.2f} seconds")

    output_data = (ctypes.c_long * output_array_length).from_buffer(output_buffer.contents().as_buffer(output_buffer_length))
    
    # Format the output as a list of lists
    # print(len(output_data))
    startTime = time.time()
    output_list = []
    for i in range(0, output_array_length, 5):
      # output_list.append([output_data[i], output_data[i + 1], output_data[i + 2], output_data[i + 3], output_data[i + 4]])

      expected_sum = int(i / 5) + start

      # print([output_data[i], output_data[i + 1], output_data[i + 2], output_data[i + 3], output_data[i + 4]], expected_sum)
      
      if sum([output_data[i], output_data[i + 1], output_data[i + 2], output_data[i + 3], output_data[i + 4]]) != expected_sum:
          print(f"Error: Expected {expected_sum}, got {[output_data[i], output_data[i + 1], output_data[i + 2], output_data[i + 3], output_data[i + 4]]} ({sum([output_data[i], output_data[i + 1], output_data[i + 2], output_data[i + 3], output_data[i + 4]])})")
          break

    print(f"Python validation time: {time.time() - startTime:.2f} seconds")

    return output_list

  return run
