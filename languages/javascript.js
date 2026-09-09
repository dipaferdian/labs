function compute(s) {
  let left = 0;
  let right = 0;
  let maxLength = 0;
  let set = new Set();

  while (right < s.length) {
    while (set.has(s[right])) {
      set.delete(s[left]);
      left++;
    }

    set.add(s[right]);
    right++;

    maxLength = Math.max(maxLength, right - left);
  }

  return maxLength;
}

console.log(compute("abcabcbb"));
console.log(compute("bbbbb"));
console.log(compute("pwwzkew"));
console.log(compute(""));
console.log(compute("a"));
