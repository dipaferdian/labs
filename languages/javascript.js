function compute(nums, target) {
  let count = 0;

  for (let index = 0; index < nums.length; index++) {
    const element = nums[index];

    if (target === element) {
      count++;
    }
  }

  return console.log(count);
}

compute([2, 5, 2, 8, 2, 5], 2);
// 3

compute([1, 1, 1, 1], 1);
// 4

compute([1, 2, 3, 4], 5);
// 0

compute([7], 7);
// 1
