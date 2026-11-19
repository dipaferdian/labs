function compute(str) {
  let max_count = 0;
  let max_char = null;
  let current_count = 0;
  let current_char = null;

  for (let index = 0; index < str.length; index++) {
    const element = str[index];

    if (current_char === null) {
      current_char = element;
      current_count++;
    } else {
      if (current_char === element) {
        current_count++;
      } else {
        if (current_count > max_count) {
          max_count = current_count;
          max_char = current_char;
        }

        current_char = element;
        current_count = 1;
      }
    }
  }

  if (current_count > max_count) {
    max_count = current_count;
    max_char = current_char;
  }

  return max_char;
}

console.log(compute("aaabbbaaa"));
// "a" — rangkaian pertama menang saat seri

console.log(compute("abbbcc"));
// ("b");

console.log(compute("aabccccdd"));
// "c"

console.log(compute("abc"));
// "a"

console.log(compute(""));
// null

console.log(compute("aaabbcccc"));
// Expected: "c"
// Actual: null
