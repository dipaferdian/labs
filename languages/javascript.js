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

    if (map.has(element)) {
      map.set(element, map.get(element) - 1);
    }

    if (map.get(element) === 0) {
      map.delete(element);
    }
  }

  return map.size === 0;
}

console.log(compute("listen", "silent"));
console.log(compute("hello", "world"));
console.log(compute("aab", "abb"));
