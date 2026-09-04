function compute(nums) {
  let currentSum = 0;
  let maxSum = -Infinity;

  for (let right = 0; right < nums.length; right++) {
    currentSum += nums[right];
    const currentNumber = nums[right];

    if (currentNumber > currentSum) {
      currentSum = currentNumber;
    }

    maxSum = Math.max(maxSum, currentSum);
  }

  return maxSum;
}

console.log(compute([-2, 1, -3, 4, -1, 2, 1, -5, 4]));
console.log(compute([5, 2, -1, 0, 3]));
console.log(compute([1]));
console.log(compute([5, -1, 8]));
console.log(compute([-2, 1, -3, 4]));
console.log(compute([-2, -1]));
