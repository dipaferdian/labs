function compute(nums, target) {
  if (nums.length == 0) return "not found";
  let map = new Map();

  for (let index = 0; index < nums.length; index++) {
    const element = nums[index];

    let missingNumber = target - element;

    if (map.has(missingNumber)) {
      return [map.get(missingNumber), index];
    } else {
      map.set(element, index);
    }
  }

  return "not found";
}

console.log(compute([2, 7, 11, 15], 9));
console.log(compute([3, 2, 4], 6));
console.log(compute([3, 3], 6));
