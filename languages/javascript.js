function compute(nums) {
  let maxNumber = -Infinity;

  for (let index = 0; index < nums.length; index++) {
    const element = nums[index];

    maxNumber = Math.max(maxNumber, element);
  }

  return console.log(maxNumber);
}

compute([10, 3, 7, 2, 15, 6]);
// 15

compute([-5, -2, -10]);
// -2

compute([-5, 3, -10, 2]);
// 3

compute([7]);
// 7
