function compute(nums, k) {
  let left = 0;
  let right = 0;
  let windowSum = 0;
  let maxLength = 0;

  while (right < nums.length) {
    windowSum += nums[right];

    while (windowSum > k) {
      windowSum -= nums[left];

      left++;
    }

    if (windowSum <= k) {
      maxLength = Math.max(maxLength, right - left + 1);
    }

    right++;
  }

  return console.log(maxLength);
}

compute([2, 1, 3, 2, 1], 5); // ?
compute([1, 1, 1, 1], 2); // ?
compute([5, 1, 1, 1], 5); // ?
compute([1, 2, 3, 4], 3); // ?
compute([10], 5); // ?
compute([], 5); // ?
