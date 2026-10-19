function compute(array) {
  let highNumber = -Infinity;
  let lowNumber = -Infinity;

  for (let index = 0; index < array.length; index++) {
    const element = array[index];

    if (element >= highNumber) {
      const temporary = highNumber;

      if (highNumber != -Infinity && element != highNumber) {
        lowNumber = temporary;
      }

      highNumber = element;
    } else {
      if (element > lowNumber) {
        lowNumber = element;
      }
    }
  }

  if (lowNumber == -Infinity) return null;

  return lowNumber;
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

console.log(compute([10, 10, 8]));
// 8

console.log(compute([3, 2, 1]));
