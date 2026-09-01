function compute(s, t) {
  if (s.length != t.length) return false;

  let group = new Map();

  for (let index = 0; index < s.length; index++) {
    const element = s[index];

    if (group.get(element)) {
      const getCount = group.get(element);
      group.set(element, getCount + 1);
    } else {
      group.set(element, 1);
    }
  }

  for (let index = 0; index < t.length; index++) {
    const element = t[index];

    if (group.get(element)) {
      const getCount = group.get(element);
      group.set(element, getCount - 1);
    } else {
      return false;
    }
  }

  console.log(group);

  return true;
}

console.log(compute("anagram", "nagaram"));
console.log(compute("rat", "car"));
console.log(compute("a", "ab"));
console.log(compute("ab", "a"));
console.log(compute("aab", "abb"));
console.log(compute("a", "aa"));
