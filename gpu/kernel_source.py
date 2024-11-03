import os

kernel_source = ""

# Actually it is Metal syntax, but it is similar to C++.
with open(os.path.join(os.path.dirname(__file__), "kernel_source.cpp"), "r") as f:
    kernel_source = f.read()
