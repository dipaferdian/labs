function compute(nums, target) {
  let set = new Set();

  for (let i = 0; i < nums.length; i++) {
    if (set.has(target - nums[i])) {
      return console.log(true);
    }

    set.add(nums[i]);
  }

  return console.log(false);
}
compute([2, 7, 11, 15], 9);
// true

compute([2, 7, 11, 15], 20);
// false

compute([3, 3], 6);
// true

compute([1, 2, 3, 4], 8);
// false

compute([10, -2, 5, 7], 8);
// // true
