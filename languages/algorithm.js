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
test2(["apple", "banana", "apple", "orange", "banana", "apple"], 2, [
  "apple",
  "banana",
]);
test2(["cat", "dog", "cat", "dog", "bird"], 2, ["cat", "dog"]);

// Alphabetical order when frequencies tie
test2(["banana", "apple", "banana", "apple"], 2, ["apple", "banana"]);
test2(["dog", "cat", "bird"], 3, ["bird", "cat", "dog"]);

// Different frequencies
test2(["red", "blue", "red", "green", "blue", "red"], 3, [
  "red",
  "blue",
  "green",
]);
test2(["zebra", "ant", "zebra", "bee", "ant"], 2, ["ant", "zebra"]);

// Single unique word
test2(["hello", "hello", "hello"], 1, ["hello"]);

// Not enough unique words
test2(["apple", "apple", "banana"], 3, null);
test2([], 1, null);

// Different frequencies
test2(["a", "b", "a", "c", "b", "a"], 2, ["a", "b"]);
test2(["pear", "kiwi", "pear", "plum", "kiwi", "pear", "plum"], 3, [
  "pear",
  "kiwi",
  "plum",
]);
test2(["x", "z", "y", "z", "y", "z"], 3, ["z", "y", "x"]);

// Equal frequencies: alphabetical order
test2(["dog", "ant", "cat", "dog", "ant", "cat"], 2, ["ant", "cat"]);
test2(["mango", "apple", "banana", "mango", "apple", "banana"], 3, [
  "apple",
  "banana",
  "mango",
]);
test2(["zoo", "yak", "ant", "bee"], 4, ["ant", "bee", "yak", "zoo"]);

// Mixed frequencies and alphabetical ties
test2(["pear", "apple", "banana", "apple", "pear", "banana", "pear"], 3, [
  "pear",
  "apple",
  "banana",
]);
test2(["c", "a", "b", "a", "b", "c", "d"], 4, ["a", "b", "c", "d"]);
test2(["orange", "kiwi", "apple", "kiwi", "orange", "apple", "kiwi"], 3, [
  "kiwi",
  "apple",
  "orange",
]);

// K boundary cases
test2(["cat", "cat", "dog", "bird"], 1, ["cat"]);
test2(["cat", "cat", "dog", "bird"], 3, ["cat", "bird", "dog"]);
test2(["pear", "apple", "pear", "apple"], 2, ["apple", "pear"]);

// Not enough unique words
test2(["hi", "hi", "hello"], 3, null);
test2(["same", "same", "same"], 2, null);
test2([], 2, null);
