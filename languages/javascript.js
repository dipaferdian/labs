function compute(s = "") {
  const clenWord = s.replace(/[^a-zA-Z]/g, "").toLocaleLowerCase();

  if (clenWord == "") return true;

  let leftPointer = 0;
  let rightPointer = clenWord.length - 1;

  while (leftPointer < rightPointer) {
    if (clenWord[leftPointer] != clenWord[rightPointer]) return false;

    leftPointer++;
    rightPointer--;
  }

  return true;
}

console.log(compute("A man, a plan, a canal: Panama"));
console.log(compute("race a car"));
console.log(compute(" "));
