function compute(nums) {
  let max = 0;
  let currentElement = null;
  let count = 0;

  for (let index = 0; index < nums.length; index++) {
    const element = nums[index];

    if (currentElement === element && currentElement != 0) {
      count += 1;
    } else {
      currentElement = element;

      if (currentElement != 0) {
        count = 1;
      }
    }

    max = Math.max(max, count);
  }

  return max;
}

console.log(compute([1, 1, 0, 1, 1, 1, 0])); // 3

console.log(compute([1, 0, 1, 1, 0, 1])); // 2

console.log(compute([0, 0, 0])); // 0

console.log(compute([1, 1, 1, 1])); // 4

console.log(compute([0, 1, 1, 0, 1])); // 2

console.log(compute([1])); // 1

console.log(compute([0])); // 0
