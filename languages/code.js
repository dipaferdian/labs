function compute(array1, array2) {
  const mergeArray = [...array1, ...array2];
  let currentIndex = -1;

  if (array1.length < 1) return array2;
  if (array2.length < 1) return array1;

  for (let index = 0; index < mergeArray.length; index++) {
    const element = mergeArray[index];

    if (currentIndex == -1) {
      currentIndex = index;
    } else {
      if (mergeArray[currentIndex] > element) {
        const temporary = element;

        mergeArray[index] = mergeArray[currentIndex];
        mergeArray[currentIndex] = temporary;

        currentIndex = index;
      }
    }
  }
  return mergeArray;
}

// console.log(compute([1, 3, 5], [2, 4, 6]));
// // [1, 2, 3, 4, 5, 6]

console.log(compute([1, 2, 7], [3, 4, 5]));
// [1, 2, 3, 4, 5, 7]

// console.log(compute([], [1, 2, 3]));
// // [1, 2, 3]

// console.log(compute([1, 2], []));
// // [1, 2]
