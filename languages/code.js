function code(nums) {
  let max = 0;
  let currentElement = -Infinity;
  let count = 0;

  for (let index = 0; index < nums.length; index++) {
    const element = nums[index];

    if (element > currentElement) {
      currentElement = element;
      count += 1;

      max = Math.max(max, count);
    } else {
      currentElement = element;
      count = 1;

      max = Math.max(max, count);
    }
  }

  return max;
}

console.log(compute([1, 2, 3, 2, 3, 4, 5])); // 4

console.log(compute([1, 2, 2, 3, 4])); // 3

console.log(compute([5, 4, 3, 2, 1])); // 1

console.log(compute([1, 2, 3, 4, 5])); // 5

console.log(compute([5])); // 1

console.log(compute([-3, -2, -1, -5, -4])); // 3
