function compute(array) {
  let set = new Set();

  for (let index = 0; index < array.length; index++) {
    const element = array[index];

    if (set.has(element)) {
      return element;
    } else {
      set.add(element);
    }
  }

  return null;
}

function test(array, expected) {
  const result = compute(array);
  const isCorrect = JSON.stringify(result) === JSON.stringify(expected);

  if (!isCorrect) {
    const RED = "\x1b[31m";
    const RESET = "\x1b[0m";

    console.log(`Input:    ${JSON.stringify({ array })}`);
    console.log(`Expected: ${JSON.stringify(expected)}`);
    console.log(`Actual:   ${JSON.stringify(result)}`);
    console.log(`${RED}incorrect${RESET}`);
    console.log("--------------------");
  }
}

test([4, 2, 7, 2, 4], 2);
test([1, 3, 5, 7], null);
test([8, 8, 6, 6], 8);
test([3, 1, 3, 1], 3);
test([-2, 4, -2, 5], -2);

// Repeated element appears at the end.
test([1, 2, 3, 4, 3], 3);

// Multiple repeated elements.
test([5, 1, 5, 1, 5], 5);

// Repeated negative numbers.
test([-3, -1, -3, -1], -3);

// Single element.
test([7], null);

// Empty array.
test([], null);

// Zero is repeated.
test([0, 1, 0, 2], 0);

// First repeated element is not the smallest number.
test([9, 4, 7, 4, 9], 4);
