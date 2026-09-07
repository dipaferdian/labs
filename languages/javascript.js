function compute(nums, target) {
  let slow = 0;

  for (let fast = 0; fast < nums.length; fast++) {
    const element = nums[fast];

    if (element != target) {
      nums[slow] = nums[fast];

      slow++;
    }
  }

  return slow;
}

console.log(compute([3, 2, 2, 3], 3));
