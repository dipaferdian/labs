function compute(str) {
  let map = new Map();

  for (let index = 0; index < str.length; index++) {
    const element = str[index];

    if (map.has(element)) {
      const count = map.get(element) + 1;

      map.set(element, count);
    } else {
      map.set(element, 1);
    }
  }

  if (map.size == 0) return null;

  for (const [value, key] of map) {
    if (key == 1) return value;
  }

  return null;
}

console.log(compute("aab"));
// b

console.log(compute("aaab"));
// b

console.log(compute("abbb"));
// a

console.log(compute("aabbcdd"));
// "c"

console.log(compute("hello"));
// "h"

console.log(compute("aabbcc"));
// null

console.log(compute("programming"));
// "p"

console.log(compute("swiss"));
// "w"
