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

console.log(compute([1, 2, 2, 3, 1, 4, 2]));
console.log(compute([5]));
console.log(compute([1, 2, 3, 4, 5]));
console.log(compute([1, 1]));
console.log(compute([5, 5, 5, 5]));
