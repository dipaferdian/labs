function compute(array) {
  let negativeArray = [];
  let posifithArray = [];

  for (let index = 0; index < array.length; index++) {
    const element = array[index];

    if (element < 0) {
      negativeArray.push(element);
    } else {
      posifithArray.push(element);
    }
  }

  return [...negativeArray, ...posifithArray];
}

console.log(compute([3, -1, 0, -5, 2]));
// [-1, -5, 3, 0, 2]

console.log(compute([1, 2, 3]));
// [1, 2, 3]

console.log(compute([-4, -2, -1]));
// [-4, -2, -1]

console.log(compute([0, -1, 0, -2]));
// [-1, -2, 0, 0]
