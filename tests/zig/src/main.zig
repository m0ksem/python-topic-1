const std = @import("std");
const root = @import("root.zig");

pub fn main() !void {
    // stdout is for the actual output of your application, for example if you
    // are implementing gzip, then only the compressed bytes should be sent to
    // stdout, not any debugging messages.
    const stdout_file = std.io.getStdOut().writer();
    var bw = std.io.bufferedWriter(stdout_file);
    const stdout = bw.writer();

    try stdout.print("Run `zig build test` to run the tests.\n", .{});

    const end: usize = 100;
    const start: usize = 1;

    const tetradicNumbers = root.makeTetradicNumbers(end);
    const cache = root.preBuild(end);

    var i = start;
    while (i < end) {
        const result = root.findSums(i, tetradicNumbers, cache);

        var sum: usize = 0;
        if (result == null) {
            try stdout.print("No result for {}\n", .{i});
        } else {
            for (result.?) |result_item| {
                sum += result_item;
            }
            if (sum != i) {
                try stdout.print("No result for {}\n", .{i});
            }
        }

        i += 1;
    }

    try bw.flush(); // don't forget to flush!
}

test "simple test" {
    var list = std.ArrayList(i32).init(std.testing.allocator);
    defer list.deinit(); // try commenting this out and see if zig detects the memory leak!
    try list.append(42);
    try std.testing.expectEqual(@as(i32, 42), list.pop());
}
