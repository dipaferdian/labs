function compute(nums) {
  let zeroIndexAt = -1;

  for (let index = 0; index < nums.length; index++) {
    const element = nums[index];

    if (element == 0 && zeroIndexAt == -1) {
      zeroIndexAt = index;
    }

    if (element != 0 && zeroIndexAt != -1) {
      const temporary = element;

      nums[index] = 0;
      nums[zeroIndexAt] = temporary;

      zeroIndexAt += 1;
    }
  }

  return nums;
}

console.log(compute([0, 1, 0, 3, 12]));
// [1, 3, 12, 0, 0]

console.log(compute([0, 0, 1]));
// [1, 0, 0]

console.log(compute([1, 2, 3]));
// [1, 2, 3]

console.log(compute([0, 0, 0]));
// [0, 0, 0]

console.log(compute([4, 0, 5, 0, 2]));
// [4, 5, 2, 0, 0]
