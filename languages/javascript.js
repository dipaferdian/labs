function compute(nums, k) {
  let windowSum = 0;
  let maxNumber = -Infinity;
  let left = 0;

  for (let index = 0; index < k; index++) {
    const element = nums[index];
    windowSum += element;
  }

  maxNumber = windowSum;

  for (let index = k; index < nums.length; index++) {
    const element = nums[index];

    windowSum = windowSum - nums[left] + element;

    left++;
    maxNumber = Math.max(maxNumber, windowSum);
  }

  return maxNumber;
}

console.log(compute([2, 1, 5, 1, 3, 2], 3));
console.log(compute([1, 2, 3, 4, 5], 2));
console.log(compute([5], 1));
console.log(compute([1, 1, 1, 1], 2));
console.log(compute([-1, -2, -3, -4], 2));
