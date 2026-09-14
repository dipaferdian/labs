function compute(nums) {
  let set = new Set();

  for (let index = 0; index < nums.length; index++) {
    const element = nums[index];

    if (set.has(element)) {
      return element;
    } else {
      set.add(element);
    }
  }

  return null;
}

console.log(compute([2, 5, 1, 2, 3, 5]));
// 2

console.log(compute([1, 2, 3, 4]));
