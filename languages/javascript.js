function compute(nums) {
  let minNumber = Infinity;

  for (let index = 0; index < nums.length; index++) {
    const element = nums[index];

    if (element < minNumber) {
      minNumber = element;
    }
  }

  return console.log(minNumber);
}

compute([8, 3, 10, 2, 6]);
// 2

compute([5]);
// 5

compute([-3, -10, -2, -7]);
// -10

compute([100, 50, 25, 75]);
// 25
