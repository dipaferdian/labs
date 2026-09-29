function compute(string) {
  const filtering = string.replace(/[^a-zA-Z]/g, "");
  let left = 0;
  let right = filtering.length - 1;

  while (left < right) {
    if (filtering[left].toLowerCase() != filtering[right].toLowerCase())
      return false;

    left++;
    right--;
  }

  return true;
}

console.log(compute("madam"));
// true

console.log(compute("racecar"));
// true

console.log(compute("hello"));
// false

console.log(compute("A man, a plan, a canal: Panama"));
// true

console.log(compute("race a car"));
// false

console.log(compute("12321"));
// true
