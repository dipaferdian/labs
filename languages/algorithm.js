function compute(array, k) {
  let map = new Map();

  for (let index = 0; index < array.length; index++) {
    const element = array[index];

    if (map.has(element)) {
      const add_count = map.get(element) + 1;

      map.set(element, add_count);
    } else {
      map.set(element, 1);
    }
  }

  if (map.size < k) return null;

  let count_map = map.size;
  let max_value = -Infinity;
  let current_key = undefined;
  let new_array = [];

  while (count_map != 0) {
    for (const [key, value] of map) {
      if (max_value === -Infinity) {
        max_value = value;
        current_key = key;
      } else {
        if (value > max_value) {
          max_value = value;
          current_key = key;
        }

        if (value === max_value) {
          if (current_key > key) {
            max_value = value;
            current_key = key;
          }
        }
      }
    }

    new_array.push(current_key);
    map.delete(current_key);

    max_value = -Infinity;
    current_key = undefined;

    count_map = map.size;
  }

  let result = [];

  for (let index = 0; index < k; index++) {
    const element = new_array[index];

    result.push(element);
  }

  return result;
}

// Test helper with colored output
function test(input, expected) {
  const result = compute(input);
  const isCorrect = JSON.stringify(result) === JSON.stringify(expected);

  const GREEN = "\x1b[32m";
  const RED = "\x1b[31m";
  const RESET = "\x1b[0m";

  // console.log(
  //   isCorrect ? `${GREEN}correct${RESET}` : `${RED}incorrect${RESET}`,
  // );

  // if (isCorrect) {
  //   console.log(`Input:    ${JSON.stringify(input)}`);
  //   console.log(`Expected: ${JSON.stringify(expected)}`);
  //   console.log(`Actual:   ${JSON.stringify(result)}`);

  //   console.log(`${GREEN}correct${RESET}`);

  //   console.log("--------------------");
  // }

  if (!isCorrect) {
    console.log(`Input:    ${JSON.stringify(input)}`);
    console.log(`Expected: ${JSON.stringify(expected)}`);
    console.log(`Actual:   ${JSON.stringify(result)}`);

    console.log(`${RED}incorrect${RESET}`);

    console.log("--------------------");
  }
}

// Test helper: print only incorrect results
function test2(array, k, expected) {
  const result = compute(array, k);
  const isCorrect = JSON.stringify(result) === JSON.stringify(expected);

  if (!isCorrect) {
    const RED = "\x1b[31m";
    const RESET = "\x1b[0m";

    console.log(`Input:    ${JSON.stringify({ array, k })}`);
    console.log(`Expected: ${JSON.stringify(expected)}`);
    console.log(`Actual:   ${JSON.stringify(result)}`);
    console.log(`${RED}incorrect${RESET}`);
    console.log("--------------------");
  }
}
// Basic cases
test2([1, 1, 1, 2, 2, 3], 2, [1, 2]);
test2([5, 5, 3, 3, 3, 8, 8, 8, 8], 2, [8, 3]);
test2([4, 4, 4, 2, 2, 1], 2, [4, 2]);
test2([7, 7, 8], 2, [7, 8]);

// Equal frequencies: smaller number comes first
test2([4, 4, 1, 1, 2, 2], 2, [1, 2]);
test2([3, 3, 1, 1, 2, 2], 3, [1, 2, 3]);
test2([9, 9, 5, 5], 2, [5, 9]);

// Different input orders
test2([3, 1, 3, 2, 1, 3], 2, [3, 1]);
test2([2, 3, 1, 2, 3, 1], 2, [1, 2]);
test2([8, 5, 8, 5, 8, 3], 2, [8, 5]);

// Single distinct number
test2([4, 4, 4], 1, [4]);
test2([7, 7, 7, 7], 1, [7]);

// Not enough distinct numbers
test2([1, 1, 2, 2], 3, null);
test2([5, 5, 5], 2, null);
test2([], 1, null);

// Negative numbers
test2([-1, -1, -1, -2, -2, -3], 2, [-1, -2]);
test2([-5, -5, -2, -2, -8, -8], 2, [-8, -5]);
test2([-3, -3, -1, -1, -2, -2], 3, [-3, -2, -1]);

// Zero and negative values
test2([0, 0, -1, -1, 2, 2, 2], 2, [2, -1]);
test2([0, 0, -1, -1, 1, 1], 3, [-1, 0, 1]);

// K equals the number of distinct values
test2([4, 4, 2, 2, 1], 3, [2, 4, 1]);
test2([3, 1, 2], 3, [1, 2, 3]);

// Frequency priority
test2([1, 1, 1, 2, 2, 3], 2, [1, 2]);
test2([5, 5, 3, 3, 3, 8, 8, 8, 8], 2, [8, 3]);

// Equal frequencies
test2([4, 4, 1, 1, 2, 2], 2, [1, 2]);
test2([4, 4, 2, 2, 1], 3, [2, 4, 1]);

// Not enough distinct values
test2([1, 1, 2, 2], 3, null);
test2([], 1, null);

// Negative numbers
test2([-3, -3, -1, -1, -2, -2], 3, [-3, -2, -1]);

// Different frequencies
test2([1, 1, 2, 2, 2, 3, 3, 4], 3, [2, 1, 3]);
test2([6, 6, 6, 2, 2, 4, 4, 4, 4], 2, [4, 6]);
test2([9, 8, 9, 8, 9, 7, 7, 6], 3, [9, 7, 8]);

// Equal frequencies: smaller number comes first
test2([5, 3, 1, 5, 3, 1], 2, [1, 3]);
test2([10, 20, 30, 20, 30, 10], 3, [10, 20, 30]);
test2([-4, -2, -4, -2, -6, -6], 3, [-6, -4, -2]);

// Zero and negative numbers
test2([0, 0, 0, -1, -1, 2, 2], 2, [0, -1]);
test2([-5, -5, -5, -1, -1, -3, -3, -3], 2, [-5, -3]);

// Different input orders, same frequencies
test2([3, 2, 1, 3, 2, 1], 2, [1, 2]);
test2([8, 4, 6, 8, 4, 6, 8], 3, [8, 4, 6]);

// K boundary cases
test2([3, 3, 2, 2, 1, 1], 1, [1]);
test2([3, 3, 2, 2, 1, 1], 3, [1, 2, 3]);
test2([5, 5, 4, 4], 2, [4, 5]);

// Not enough distinct numbers
test2([7, 7, 7, 7], 2, null);
test2([], 3, null);
