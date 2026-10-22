function compute(array, k, minFrequency) {
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

  if (array.length < k && array.length < minFrequency) return [];

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

    if (max_value >= minFrequency) {
      new_array.push(current_key);
    }

    map.delete(current_key);

    max_value = -Infinity;
    current_key = undefined;

    count_map = map.size;
  }

  let result = [];

  for (let index = 0; index < k; index++) {
    const element = new_array[index];

    if (element || element == 0) {
      result.push(element);
    }
  }

  return result;
}

function test3(array, k, minFrequency, expected) {
  const result = compute(array, k, minFrequency);
  const isCorrect = JSON.stringify(result) === JSON.stringify(expected);

  if (!isCorrect) {
    const RED = "\x1b[31m";
    const RESET = "\x1b[0m";

    console.log(`Input:    ${JSON.stringify({ array, k, minFrequency })}`);
    console.log(`Expected: ${JSON.stringify(expected)}`);
    console.log(`Actual:   ${JSON.stringify(result)}`);
    console.log(`${RED}incorrect${RESET}`);
    console.log("--------------------");
  }
}

// Basic cases
test3([1, 1, 1, 2, 2, 3], 2, 2, [1, 2]);
test3([4, 4, 4, 2, 2, 1], 3, 2, [4, 2]);

// Minimum frequency filter
test3([1, 1, 1, 2, 2, 3], 3, 3, [1]);
test3([1, 1, 2, 2, 3, 3], 3, 2, [1, 2, 3]);
test3([1, 1, 2, 2, 3], 3, 3, []);

// Frequency ties
test3([4, 4, 2, 2, 1, 1], 2, 2, [1, 2]);
test3([5, 5, 5, 3, 3, 3, 1, 1], 2, 2, [3, 5]);

// Fewer qualifying numbers than k
test3([7, 7, 7, 2, 2, 1], 3, 3, [7]);
test3([8, 8, 4, 4, 4], 3, 2, [4, 8]);

// Negative numbers and zero
test3([-2, -2, -1, -1, 0, 0], 2, 2, [-2, -1]);
test3([0, 0, 0, -1, -1, 2, 2], 3, 3, [0]);

// No qualifying numbers
test3([1, 2, 3, 4], 2, 2, []);
test3([], 2, 1, []);

// One unique number meets the minimum frequency
test3([7, 7, 7], 2, 3, [7]);
test3([7], 2, 3, []);
test3([7], 2, 1, [7]);
test3([1, 2, 3], 2, 2, []);
test3([7], 2, 1, [7]);
test3([], 2, 1, []);
test3([1, 1, 2], 3, 2, [1]);

// More qualifying numbers than k
test3([5, 5, 5, 4, 4, 4, 2, 2], 2, 2, [4, 5]);

// Exactly k qualifying numbers
test3([3, 3, 2, 2, 1], 2, 2, [2, 3]);

// No qualifying numbers
test3([1, 2, 3, 4], 2, 2, []);

// A qualifying number is zero
test3([0, 0, -1], 2, 2, [0]);

// Array length is smaller than k, but a number qualifies
test3([7, 7, 7], 4, 3, [7]);

test3([7, 7], 4, 3, []);

// Minimum frequency exceeds the array length
test3([1, 2, 3], 2, 4, []);

// Only some numbers meet the minimum frequency
test3([4, 4, 4, 2, 2, 1], 3, 2, [4, 2]);
