function compute(nums, target) {
  let map = new Map();

  for (let index = 0; index < nums.length; index++) {
    const element = nums[index];

    const missingNumber = target - element;

    if (map.has(missingNumber)) {
      return [map.get(missingNumber), index];
    } else {
      map.set(element, index);
    }
  }

  return null;
}

console.log(compute([2, 7, 11, 15], 9));
console.log(compute([5], 5));
