function compute(nums) {
  let sum = 0;
  const target = 8;

  for (let index = 0; index < nums.length; index++) {
    const element = nums[index];

    if (element % 2 === 0) {
      if (element > target) {
        sum += element;
      }
    }
  }

  return console.log(sum);
}

compute([4, 7, 10, 13, 16, 21, 25]);
// 26

compute([2, 4, 6]);
// 0

compute([10, 12, 14]);
// 36

compute([3, 5, 7]);
// 0

compute([-10, -8, 4, 10]);
// 10
