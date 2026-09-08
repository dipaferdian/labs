function compute(nums) {
  let min = Infinity;

  for (let index = 0; index < nums.length; index++) {
    const element = nums[index];

    if (element < min) {
      min = element;
    }
  }

  return min;
}

console.log(compute([7, 3, 9, 2, 8, 4]));
console.log(compute([-1, -5, -2, -10]));
