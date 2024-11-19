def make_tetradic_number(index):
    return (index * (index + 1) * (index + 2)) // 6

def pre_build(size, end):
    results = {}

    for i in range(1, size + 1):
        number1 = make_tetradic_number(i)

        for j in range(1, size + 1 / 2):
            number2 = make_tetradic_number(j)
            sum_2 = number1 + number2

            if sum_2 > end:
                break

            for k in range(1, size + 1 / 3):
                number3 = make_tetradic_number(k)
                sum_3 = number1 + number2 + number3

                if sum_3 > end:
                    break

                results[sum_3] = [number1, number2, number3, 0, 0]

            results[sum_2] = [number1, number2, 0, 0, 0]

        results[number1] = [number1, 0, 0, 0, 0]

    return results

def make_tetradic_numbers(num):
    numbers = []
    index = 0

    while True:
        tetradic_number = make_tetradic_number(index)
        if tetradic_number > num:
            break

        numbers.append(tetradic_number)
        index += 1

    return numbers