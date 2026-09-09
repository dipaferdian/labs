function compute(nums) {
  let maxNumber = -Infinity;

  for (let index = 0; index < nums.length; index++) {
    const element = nums[index];

    if (element > maxNumber) {
      maxNumber = element;
    }
  }

  return console.log(maxNumber);
}

compute([3, 7, 2, 9, 5]);
// 9

compute([10, 3, 25, 7, 2]);
// 25

compute([-5, -2, -10, -1]);
// -1

compute([7]);
// 7
