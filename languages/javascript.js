function compute(s) {
  let left = 0;
  let right = s.length - 1;

  while (left < right) {
    const temporary = s[right];
    s[right] = s[left];
    s[left] = temporary;

    left++;
    right--;
  }

  return s;
}

console.log(compute(["h", "e", "l", "l", "o"]));
