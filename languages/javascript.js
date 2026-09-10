function compute(nums) {
  let map = new Map();
  let maxCount = -Infinity;
  let result = null;

  for (let index = 0; index < nums.length; index++) {
    const element = nums[index];

    if (map.has(element)) {
      const count = map.get(element) + 1;

      map.set(element, count);

      if (count > maxCount) {
        maxCount = count;
        result = element;
      }

      maxCount = Math.max(maxCount, count);
    } else {
      map.set(element, 1);

      maxCount = Math.max(maxCount, 1);
    }
  }

  return result;
}

console.log(compute([1, 2, 2, 3, 1, 2]));
// 2

console.log(compute([5, 5, 1, 1, 1, 3]));
// 1

console.log(compute([7, 4, 7, 4]));
// 7

console.log(compute([1, 1]));
