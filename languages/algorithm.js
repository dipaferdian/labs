function compute(array, target) {
  let nextTarget = null;
  let map = new Map();

  for (let index = 0; index < array.length; index++) {
    const element = array[index];

    nextTarget = target - element;

    if (map.has(nextTarget)) {
      return [map.get(nextTarget), index];
    } else {
      map.set(element, index);
    }
  }

  return null;
}

function test(array, target, expected) {
  const result = compute(array, target);
  const isCorrect = JSON.stringify(result) === JSON.stringify(expected);

  if (!isCorrect) {
    const RED = "\x1b[31m";
    const RESET = "\x1b[0m";

    console.log(`Input:    ${JSON.stringify({ array, target })}`);
    console.log(`Expected: ${JSON.stringify(expected)}`);
    console.log(`Actual:   ${JSON.stringify(result)}`);
    console.log(`${RED}incorrect${RESET}`);
    console.log("--------------------");
  }
}

test([2, 7, 11, 15], 9, [0, 1]);
test([3, 2, 4], 6, [1, 2]);
test([3, 3], 6, [0, 1]);
test([-1, 5, 3, 7], 6, [0, 3]);
test([1, 4, 6, 8], 10, [1, 2]);
test([0, 4, 3, 0], 0, [0, 3]);
test([-3, 4, 3, 90], 0, [0, 2]);
test([5, 1, 2, 8], 9, [1, 3]);
