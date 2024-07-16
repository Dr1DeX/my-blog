rom_alpha = {
    'I': 1,
    'V': 5,
    'X': 10,
    'L': 50,
    'C': 100,
    'D': 500,
    'M': 1000
}

s = 'MCMXCIV'
total = 0
prev_val = 0
for char in reversed(s):
    val = rom_alpha[char]
    if val < prev_val:
        total -= val
    else:
        total += val
    prev_val = val
print(total)