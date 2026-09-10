function compute(nums) {
  let map = new Map();

  for (let index = 0; index < nums.length; index++) {
    const element = nums[index];

    if (map.has(element)) {
      const count = map.get(element) + 1;

      map.set(element, count);
    } else {
      map.set(element, 1);
    }
  }

  for (let index = 0; index < nums.length; index++) {
    const element = nums[index];

    if (map.get(element) === 1) {
      return element;
    }
  }
}

console.log(compute([1, 2, 3, 4, 1]));
