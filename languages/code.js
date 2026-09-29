function compute(array) {
  let currentElement = undefined;
  let newArray = [];

  for (let index = 0; index < array.length; index++) {
    const element = array[index];

    if (currentElement == undefined) {
      currentElement = element;

      newArray.push(element);
    } else {
      if (currentElement != element) {
        currentElement = element;

        newArray.push(element);
      }
    }
  }

  return newArray;
}

console.log(compute([0, 0, 1, 1, 2, 2]));
// [1, 2]

console.log(compute([0, 0, 1, 1, 2, 2, 3]));
// [0, 1, 2, 3]

console.log(compute([1, 2, 3]));
// [1, 2, 3]

console.log(compute([1, 1, 1, 1]));
[1];
