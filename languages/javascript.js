function compute(nums) {
  let set = new Set();

  for (let index = 0; index < nums.length; index++) {
    const element = nums[index];

    if (set.has(element)) {
      return console.log(true);
    } else {
      set.add(element);
    }
  }

  return console.log(false);
}

compute([1, 2, 3, 4]);
// false

compute([1, 2, 3, 2]);
// true
