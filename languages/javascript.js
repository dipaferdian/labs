function compute(s) {
  let left = 0;
  let right = s.length - 1;

  while (left < right) {
    while (left < right && !/^[A-Za-z0-9]$/.test(s[left])) {
      left++;
    }

    while (left < right && !/^[A-Za-z0-9]$/.test(s[right])) {
      right--;
    }

    if (s[left].toLowerCase() != s[right].toLowerCase()) return false;

    left++;
    right--;
  }

  return true;
}

console.log(compute("kaTak"));
console.log(compute("race a car"));
console.log(compute("motor"));
console.log(compute("1a2"));
console.log(compute("a....................a"));
