function compute(array, k) {
  let set = new Set();

  for (let index = 0; index < array.length; index++) {
    const element = array[index];

    set.add(element);
  }

  const cleanDuplicate = [...set.values()];

  if (cleanDuplicate.length < k) return null;

  for (let i = 0; i < cleanDuplicate.length; i++) {
    let element = cleanDuplicate[i];
    for (let j = 0; j < cleanDuplicate.length; j++) {
      let subelement = cleanDuplicate[j];

      if (element != subelement) {
        if (subelement < element) {
          const temporary = cleanDuplicate[i];

          cleanDuplicate[j] = temporary;
          cleanDuplicate[i] = subelement;

          element = cleanDuplicate[j];
        }
      }
    }
  }

  return cleanDuplicate[k - 1];
}

// Verify descending order across all permutations
function verifySorting() {
  const arrays = [
    [1, 2, 3, 4],
    [1, 3, 2, 4],
    [2, 4, 1, 3],
    [4, 3, 2, 1],
    [3, 1, 4, 2],
  ];

  for (const array of arrays) {
    const unique = [...new Set(array)];
    const result = compute(array, 1);

    const expected = Math.max(...unique);

    if (result !== expected) {
      console.log({
        array,
        expected,
        actual: result,
      });
    }
  }
}

verifySorting();

function generateArrays(array, length, values, callback) {
  if (array.length === length) {
    callback([...array]);
    return;
  }

  for (const value of values) {
    array.push(value);
    generateArrays(array, length, values, callback);
    array.pop();
  }
}

// Exhaustively test arrays of lengths 0 through 5.
const values = [-1, 0, 1];

for (let length = 0; length <= 5; length++) {
  generateArrays([], length, values, (array) => {
    const uniqueDescending = [...new Set(array)].sort((a, b) => b - a);

    // Test every valid k and one k beyond the available distinct values.
    for (let k = 1; k <= uniqueDescending.length + 1; k++) {
      const expected = uniqueDescending[k - 1] ?? null;

      test2(array, k, expected);
    }
  });
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
test2([4, 9, 2, 9, 7, 5, 7], 1, 9);
test2([4, 9, 2, 9, 7, 5, 7], 2, 7);
test2([4, 9, 2, 9, 7, 5, 7], 3, 5);
test2([4, 9, 2, 9, 7, 5, 7], 4, 4);
test2([4, 9, 2, 9, 7, 5, 7], 5, 2);
test2([10, 2, 8, 6, 4], 2, 8);

// Duplicates
test2([8, 8, 6, 4], 1, 8);
test2([8, 8, 6, 4], 2, 6);
test2([8, 8, 6, 4], 3, 4);
test2([3, 3, 3], 1, 3);

// Not enough distinct values
test2([8, 8, 6], 3, null);
test2([5, 5, 5], 2, null);
test2([], 1, null);

// Negative numbers
test2([-5, -2, -8, -2, -1], 1, -1);
test2([-5, -2, -8, -2, -1], 2, -2);
test2([-5, -2, -8, -2, -1], 3, -5);
test2([-5, -2, -8, -2, -1], 4, -8);
test2([-5, -2, -8, -2, -1], 5, null);

// Different input orders
test2([1, 2, 3, 4], 2, 3);
test2([4, 3, 2, 1], 2, 3);
test2([2, 4, 1, 3], 3, 2);

// Zero and negative values
test2([0, -1, 5, 0, 3], 1, 5);
test2([0, -1, 5, 0, 3], 2, 3);
test2([0, -1, 5, 0, 3], 3, 0);
test2([0, -1, 5, 0, 3], 4, -1);

// Mixed input order
test2([3, 1, 4, 2], 1, 4);
test2([3, 1, 4, 2], 2, 3);
test2([3, 1, 4, 2], 3, 2);
test2([3, 1, 4, 2], 4, 1);

// Verify all positions for different input orders
test2([1, 2, 3, 4], 1, 4);
test2([1, 2, 3, 4], 2, 3);
test2([1, 2, 3, 4], 3, 2);
test2([1, 2, 3, 4], 4, 1);

test2([2, 4, 1, 3], 1, 4);
test2([2, 4, 1, 3], 2, 3);
test2([2, 4, 1, 3], 3, 2);
test2([2, 4, 1, 3], 4, 1);

test2([4, 3, 2, 1], 1, 4);
test2([4, 3, 2, 1], 2, 3);
test2([4, 3, 2, 1], 3, 2);
test2([4, 3, 2, 1], 4, 1);
