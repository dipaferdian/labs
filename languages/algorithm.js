function compute(array, target) {
  let newArray = [];
  for (let index = 0; index < array.length; index++) {
    const element = array[index];

    if (element != target) newArray.push(element);
  }

  return newArray;
}

console.log(compute([3, 2, 2, 3], 3));
// [2, 2]

console.log(compute([1, 2, 3, 4, 5], 3));
// [1, 2, 4, 5]

console.log(compute([4, 4, 4], 4));
// []

console.log(compute([1, 2, 3], 9));
// [1, 2, 3]
