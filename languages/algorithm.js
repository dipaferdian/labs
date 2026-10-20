function compute(array) {
  let firstNumber = -Infinity;
  let secondNumber = -Infinity;
  let thirdNumber = -Infinity;
  let newArray = [];

  if (array.length == 0) {
    return [];
  }

  for (let index = 0; index < array.length; index++) {
    const element = array[index];

    if (element > firstNumber) {
      if (firstNumber > secondNumber && firstNumber != -Infinity) {
        thirdNumber = secondNumber;
        secondNumber = firstNumber;
      }
      firstNumber = element;
    } else {
      if (element > secondNumber && element != firstNumber) {
        thirdNumber = secondNumber;
        secondNumber = element;
      } else {
        if (
          element > thirdNumber &&
          element != secondNumber &&
          element != firstNumber
        ) {
          thirdNumber = element;
        }
      }
    }
  }

  if (firstNumber != -Infinity) {
    newArray.push(firstNumber);
  }

  if (secondNumber != -Infinity) {
    newArray.push(secondNumber);
  }

  if (thirdNumber != -Infinity) {
    newArray.push(thirdNumber);
  }

  return newArray;
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

// Basic cases
test([4, 9, 2, 9, 7, 5, 7], [9, 7, 5]);
test([1, 5, 3, 4, 2], [5, 4, 3]);
test([8, 8, 6, 4], [8, 6, 4]);

// Fewer than three distinct values
test([10, 10, 5], [10, 5]);
test([3, 3, 3], [3]);
test([1, 2], [2, 1]);
test([7], [7]);
test([], []);

// Negative numbers and zero
test([-5, -2, -8, -2, -1], [-1, -2, -5]);
test([0, -1, 3, 0, 2, 3], [3, 2, 0]);

// Ascending and descending order
test([5, 7, 9], [9, 7, 5]);
test([9, 7, 5, 4], [9, 7, 5]);
test([1, 2, 3], [3, 2, 1]);

// Duplicate values in different positions
test([9, 9, 7, 5], [9, 7, 5]);
test([5, 5, 7, 7, 9, 9], [9, 7, 5]);
test([9, 7, 9, 5, 7, 5], [9, 7, 5]);
test([5, 4, 4, 4, 3, 3, 2], [5, 4, 3]);

// Specific test cases
test([5, 5, 5], [5]);
test([1, 2, 3], [3, 2, 1]);

// Edge cases
test([], []);
test([5], [5]);
test([5, 5, 5], [5]);
test([1, 2], [2, 1]);
test([1, 2, 3], [3, 2, 1]);
test([-5, -2, -8, -2, -1], [-1, -2, -5]);
test([3, 1, 2, 3, 2, 1], [3, 2, 1]);
test([7, 9, 8, 10], [10, 9, 8]);
test([10, 9, 8, 7], [10, 9, 8]);
test([8, 7, 9, 10], [10, 9, 8]);
test([2, 2, 3, 1, 3, 4], [4, 3, 2]);
