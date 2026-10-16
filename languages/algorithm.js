function compute(array) {
  let evenNUmbers = [];
  let oddNumbers = [];

  for (let index = 0; index < array.length; index++) {
    const element = array[index];

    if (element % 2 == 0) {
      evenNUmbers.push(element);
    } else {
      oddNumbers.push(element);
    }
  }

  return [...evenNUmbers, ...oddNumbers];
}

console.log(compute([3, 2, 4, 1, 6]));
// [2, 4, 6, 3, 1]

console.log(compute([1, 3, 5]));
// [1, 3, 5]

console.log(compute([2, 4, 6]));
// [2, 4, 6]

console.log(compute([0, -3, -2, 5]));
// [0, -2, -3, 5]
