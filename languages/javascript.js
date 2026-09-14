// solution

function compute1(nums, nums2) {
  for (let i = 0; i < nums.length; i++) {
    const element = nums[i];
    for (let j = 0; j < nums2.length; j++) {
      const element2 = nums2[j];

      if (element === element2) return true;
    }
  }

  return false;
}

// console.log(compute1([1, 2, 3, 4], [10, 20, 11]));

// console.log(compute1([1, 2, 3, 4], [10, 1, 11]));

// optimize
function compute2(nums, nums2) {
  let set = new Set();

  for (const num of nums2) {
    set.add(num);
  }

  for (let i = 0; i < nums.length; i++) {
    const element = nums[i];

    if (set.has(element)) return true;
  }

  return false;
}

console.log(compute2([1, 2, 3, 4], [10, 20, 11]));

console.log(compute2([1, 2, 3, 4], [10, 1, 11]));
