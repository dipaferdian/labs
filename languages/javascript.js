function compute(s, t) {
  if (s.length != t.length) return false;
  let map = new Map();
  for (let index = 0; index < s.length; index++) {
    const element = s[index];

    if (map.has(element)) {
      const count = map.get(element) + 1;
      map.set(element, count);
    } else {
      map.set(element, 1);
    }
  }

  for (let index = 0; index < t.length; index++) {
    const element = t[index];

    if (map.get(element) >= 1) {
      const decrement = map.get(element) - 1;

      map.set(element, decrement);
    } else {
      return false;
    }
  }

  return true;
}

console.log(compute("anagram", "nagaram"));
console.log(compute("a", "aa"));
console.log(compute("a", "ab"));
console.log(compute("rat", "car"));
console.log(compute("ab", "a"));
