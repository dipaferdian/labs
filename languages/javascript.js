function compute(nums) {
  let sum = 0;

  for (let index = 0; index < nums.length; index++) {
    const element = nums[index];

    if (element > 0) {
      sum += element;
    }
  }

  return console.log(sum);
}

compute([4, -2, 7, 10, -5, 3]);
// 24

compute([-5, -2, -1]);
// 0

compute([1, 2, 3]);
// 6

compute([0, -1, 5]);
// 5

compute([-10, 0, 10]);
// 10

compute([7]);
// 7
