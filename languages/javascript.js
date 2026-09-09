function compute(nums) {
  let count = 0;
  const minimunNumber = 0;

  for (let index = 0; index < nums.length; index++) {
    const element = nums[index];

    if (element > 0) {
      count++;
    }
  }

  return console.log(count);
}

compute([3, -2, 5, -8, 10, 0, -1]);
// 3

compute([-5, -2, -1]);
// 0

compute([1, 2, 3, 4]);
// 4

compute([0, 0, -1]);
// 0

compute([7]);
// 1
