function compute(array) {
  let maxNumber = -Infinity;
  let currentSecondMaxNumber = -Infinity;

  for (let index = 0; index < array.length; index++) {
    const element = array[index];

    maxNumber = Math.max(element, maxNumber);

    if (element > currentSecondMaxNumber) currentSecondMaxNumber = element;
    if (maxNumber != element) {
    }
  }

  if (currentSecondMaxNumber == -Infinity) return null;

  return currentSecondMaxNumber;
}

console.log(compute([10, 5, 8, 10, 3]));
// 8

console.log(compute([1, 2, 3, 4]));
// 3

console.log(compute([7, 7, 7]));
// null

console.log(compute([-5, -2, -8]));
// -5

console.log(compute([4, 4, 2, 2]));
// 2
