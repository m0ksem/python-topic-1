const std = @import("std");

const six: usize = 6;

fn makeTetradicNumber(index: u64) u64 {
    return (index * (index + 1) * (index + 2) / six);
}

pub fn makeTetradicNumbers(num: usize) []u64 {
    const allocator = std.heap.page_allocator;
    var numbers = std.ArrayList(usize).init(allocator);
    var index: usize = 0;

    while (true) {
        const tetradicNumber = makeTetradicNumber(index);
        if (tetradicNumber > num) {
            break;
        }

        numbers.append(tetradicNumber) catch {
            std.debug.print("Failed to append tetradic number\n", .{});
            break;
        };
        index += 1;
    }

    return numbers.items;
}

const TEN_THOUSAND_INDEX = 200;

pub fn preBuild(end: u64) std.AutoHashMap(u64, *const [5]u64) {
    const allocator = std.heap.page_allocator;
    var results = std.AutoHashMap(u64, *const [5]u64).init(allocator);

    var i: usize = 1;
    while (i <= TEN_THOUSAND_INDEX) {
        const number1 = makeTetradicNumber(i);

        var j: usize = 1;
        while (j <= TEN_THOUSAND_INDEX / 2) {
            const number2 = makeTetradicNumber(j);
            const sum1 = number1 + number2;

            if (sum1 > end) {
                break;
            }

            var k: usize = 1;
            while (k <= TEN_THOUSAND_INDEX / 3) {
                const number3 = makeTetradicNumber(k);
                const sum2 = sum1 + number3;

                if (sum2 > end) {
                    break;
                }

                results.put(sum2, &[_]u64{ number1, number2, number3, 0.0, 0.0 }) catch {
                    std.debug.print("Failed to insert sum2\n", .{});
                };
                k += 1;
            }

            results.put(sum1, &[_]u64{ number1, number2, 0.0, 0.0, 0.0 }) catch {
                std.debug.print("Failed to insert sum1\n", .{});
            };
            j += 1;
        }

        results.put(number1, &[_]u64{ number1, 0.0, 0.0, 0.0, 0.0 }) catch {
            std.debug.print("Failed to insert number1\n", .{});
        };
        i += 1;
    }

    return results;
}

const ONE_THIRD = 1.0 / 3.0;
const MINUS_ONE_THIRD_CUBE = (-ONE_THIRD * -ONE_THIRD) * -ONE_THIRD;

fn getTetradicNumberIndex(y: usize) usize {
    const x: f64 = @floatFromInt(y);
    const halfD = -3.0 * x;
    const discriminantSqrt = std.math.sqrt((halfD * halfD) + MINUS_ONE_THIRD_CUBE);

    const offsetD = -halfD;
    const u = std.math.cbrt(offsetD + discriminantSqrt);
    const v = std.math.cbrt(offsetD - discriminantSqrt);
    return @intFromFloat(@round(u + v - 1.0));
}

fn numberOrZero(number: ?f64) f64 {
    if (number == null) {
        return 0.0;
    }
    return number.?;
}

pub fn findSums(inputNumber: u64, tetradicNumbers: []const u64, preBuiltArray: std.AutoHashMap(u64, *const [5]u64)) ?*const [5]u64 {
    var prebuilt = preBuiltArray.get(inputNumber);

    if (prebuilt != null) {
        return prebuilt.?;
    }

    var number1Index = getTetradicNumberIndex(inputNumber);

    while (number1Index > 0) {
        const number1 = tetradicNumbers[number1Index];

        std.debug.print("Number is {} and {}\n", .{ inputNumber, number1 });
        const required1: u64 = inputNumber - number1;

        if (required1 < 0) {
            number1Index -= 1;
            continue;
        }

        prebuilt = preBuiltArray.get(required1);

        if (prebuilt != null) {
            if (prebuilt.?.len > 4) {
                break;
            }
            return &[_]u64{ number1, prebuilt.?[0], numberOrZero(prebuilt.?[1]), numberOrZero(prebuilt.?[2]), numberOrZero(prebuilt.?[3]) };
        }

        if (number1 == inputNumber) {
            return &[_]u64{ number1, 0.0, 0.0, 0.0, 0.0 };
        }

        var left2: usize = 0;
        var right2 = number1Index + 1;
        var number2Index: usize = 0;

        while (left2 <= right2) {
            number2Index = (left2 + right2) / 2;

            const number2 = tetradicNumbers[number2Index];

            if (number2 == required1) {
                return &[_]u64{ number1, number2, 0.0, 0.0, 0.0 };
            }

            if (required1 > number2) {
                const required2 = required1 - number2;

                prebuilt = preBuiltArray.get(required2);

                if (prebuilt != null) {
                    if (prebuilt.?.len > 3) {
                        break;
                    }
                    return &[_]u64{ number1, number2, numberOrZero(prebuilt.?[0]), numberOrZero(prebuilt.?[1]), numberOrZero(prebuilt.?[2]) };
                }

                left2 = number2Index + 1;

                var left3: usize = 0;
                var right3 = left2;
                var number3Index: usize = 0;

                while (left3 <= right3) {
                    number3Index = (left3 + right3) / 2;

                    const number3 = tetradicNumbers[number3Index];

                    if (number3 == required2) {
                        return &[_]u64{ number1, number2, number3, 0.0, 0.0 };
                    }

                    if (required2 > number3) {
                        const required3 = required2 - number3;

                        prebuilt = preBuiltArray.get(required3);

                        if (prebuilt != null) {
                            if (prebuilt.?.len > 2) {
                                break;
                            }
                            return &[_]u64{ number1, number2, number3, numberOrZero(prebuilt.?[0]), numberOrZero(prebuilt.?[1]) };
                        }

                        left3 = number3Index + 1;

                        var left4: usize = 0;
                        var right4 = left3;
                        var number4Index: usize = 0;

                        while (left4 <= right4) {
                            number4Index = (left4 + right4) / 2;

                            const number4 = tetradicNumbers[number4Index];

                            if (number4 == required3) {
                                return &[_]u64{ number1, number2, number3, number4, 0.0 };
                            }

                            if (required3 > number4) {
                                const required4 = required3 - number4;

                                prebuilt = preBuiltArray.get(required4);

                                if (prebuilt != null) {
                                    if (prebuilt.?.len > 1) {
                                        break;
                                    }
                                    return &[_]u64{ number1, number2, number3, number4, prebuilt.?[0] };
                                }

                                left4 = number4Index + 1;

                                var left5: usize = 0;
                                var right5 = left4;
                                var number5Index: usize = 0;

                                while (left5 <= right5) {
                                    number5Index = (left5 + right5) / 2;

                                    const number5 = tetradicNumbers[number5Index];

                                    if (number5 == required4) {
                                        return &[_]u64{ number1, number2, number3, number4, number5 };
                                    }

                                    if (required4 > number5) {
                                        left5 = number5Index + 1;
                                    } else {
                                        right5 = number5Index - 1;
                                    }
                                }
                            } else {
                                right4 = number4Index - 1;
                            }
                        }
                    } else {
                        right3 = number3Index - 1;
                    }
                }
            } else {
                right2 = number2Index - 1;
            }
        }

        number1Index -= 1;
    }

    return null;
}
