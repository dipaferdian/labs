function compute(array) {
  if (array.length === 0) return 0;

  let set = new Set();

  for (let index = 0; index < array.length; index++) {
    const element = array[index];

    set.add(element);
  }

  array = Array.from(set.values());

  for (let i = 0; i < array.length; i++) {
    let element = array[i];

    for (let j = 0; j < array.length; j++) {
      let subelement = array[j];

      if (element < subelement && element != subelement) {
        const temporary = array[i];

        array[j] = temporary;
        array[i] = subelement;

        element = array[j];
      }
    }
  }

  let addCount = undefined;
  let sumCount = 0;
  let maxCount = 0;

  for (let index = 0; index < array.length; index++) {
    const element = array[index];

    if (addCount === undefined) {
      addCount = element;
      sumCount = 1;
    }

    if (element != addCount) {
      if (element === addCount + 1) {
        sumCount += 1;
        addCount = element;
      } else {
        addCount = element;
        sumCount = 1;
      }
    }

    maxCount = Math.max(sumCount, maxCount);
  }

  return maxCount;
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

test([100, 4, 200, 1, 3, 2], 4);
test([1, 9, 3, 10, 2, 20], 3);
test([5, 5, 5], 1);
test([], 0);
test([8, 7, 6, 5], 4);
test([-2, -1, 0, 2, 3], 3);
test([1], 1);
test([1, 3, 5, 7], 1);
test([1, 2, 0, 1], 3);
test([-3, -2, -1, 0, 1], 5);
test([10, 11, 12, 15, 16, 17, 18], 4);
test([0, -1], 2);
