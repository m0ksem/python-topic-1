import Metal
from kernel_source import kernel_source
from prebuild import pre_build
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
  cache = pre_build(cache_size, 100_000)
  NUMBERS_IN_CACHE = 5

  # Create a buffer for the cache
  cache_buffer_length = len(cache) * NUMBERS_IN_CACHE * 4  # 4 bytes per float
  cache_buffer = device.newBufferWithLength_options_(cache_buffer_length, Metal.MTLResourceStorageModeShared)

  # Map the cache to the Metal buffer
  cache_array = (ctypes.c_float * (len(cache) * NUMBERS_IN_CACHE)).from_buffer(cache_buffer.contents().as_buffer(cache_buffer_length))
  for i in range(len(cache)):
    cached = cache.get(i, [-1, -1, -1, -1, -1])
    for j in range(NUMBERS_IN_CACHE):
      cache_array[i * NUMBERS_IN_CACHE + j] = cached[j]

  return cache_buffer

def make_kernel(step):
  array_length = step
  buffer_length = step * 4  # 4 bytes per float

  input_buffer = device.newBufferWithLength_options_(buffer_length, Metal.MTLResourceStorageModeShared)
  output_buffer = device.newBufferWithLength_options_(buffer_length, Metal.MTLResourceStorageModeShared)
  cache_buffer = make_cache_buffer(10_000)

  input_array = (ctypes.c_float * array_length).from_buffer(input_buffer.contents().as_buffer(buffer_length))

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
    threadsPerThreadgroup = Metal.MTLSizeMake(1024, 1, 1)
    threadgroupSize = Metal.MTLSizeMake(pso.maxTotalThreadsPerThreadgroup(), 1, 1)

    # Dispatch the kernel
    computeEncoder.dispatchThreads_threadsPerThreadgroup_(threadsPerThreadgroup, threadgroupSize)
    computeEncoder.endEncoding()

    # Commit the command buffer
    commandBuffer.commit()
    commandBuffer.waitUntilCompleted()

    # Map the Metal buffer to a Python array
    output_data = (ctypes.c_float * array_length).from_buffer(output_buffer.contents().as_buffer(buffer_length))
    
    # Format the output as a list of lists
    output_list = []
    for i in range(0, end - start, 5):
      output_list.append(list(output_data[i:i + 5]))

    return output_list

  return run
