function compute(array1, array2) {
  if (array1.length < 1) return array2;
  if (array2.length < 1) return array1;

  let newArray = [];
  let left = 0;
  let right = 0;

  while (left < array1.length && right < array2.length) {
    if (array1[left] < array2[right]) {
      newArray.push(array1[left]);

      left++;
    } else {
      newArray.push(array2[right]);

      right++;
    }
  }

  while (left < array1.length) {
    newArray.push(array1[left]);

    left++;
  }

  while (right < array2.length) {
    newArray.push(array2[right]);

    right++;
  }

  return newArray;
}

console.log(compute([1, 3, 5], [2, 4, 6]));

console.log(compute([1, 2, 7], [3, 4, 5]));

console.log(compute([], [1, 2, 3]));

console.log(compute([1, 2], []));

console.log(compute([1, 2, 3], [4, 5, 6, 7, 8]));
