function compute(l, r) {
  if (l.length != r.length) return false;

  let left_map = new Map();
  let right_map = new Map();
  let is_right = false;

  for (let index = 0; index < l.length; index++) {
    if (is_right) {
      const right_element = r[index];

      if (right_map.has(right_element)) {
        const count = right_map.get(right_element) + 1;
        right_map.set(right_element, count);
      } else {
        right_map.set(right_element, 1);
      }
    } else {
      const left_element = l[index];

      if (left_map.has(left_element)) {
        const count = left_map.get(left_element) + 1;
        left_map.set(left_element, count);
      } else {
        left_map.set(left_element, 1);
      }
    }

    if (index === l.length - 1 && is_right == false) {
      index = -1;
      is_right = true;
    }
  }

  for (const [key, value] of left_map) {
    if (!right_map.has(key) || right_map.get(key) != value) return false;
  }

  return true;
}

function test(s, t, expected) {
  const result = compute(s, t);
  const isCorrect = JSON.stringify(result) === JSON.stringify(expected);

  if (!isCorrect) {
    const RED = "\x1b[31m";
    const RESET = "\x1b[0m";

    console.log(`Input:    ${JSON.stringify({ s, t })}`);
    console.log(`Expected: ${JSON.stringify(expected)}`);
    console.log(`Actual:   ${JSON.stringify(result)}`);
    console.log(`${RED}incorrect${RESET}`);
    console.log("--------------------");
  }
}

test("listen", "silent", true);
test("hello", "world", false);
test("anagram", "nagaram", true);
test("rat", "car", false);
test("a", "a", true);
test("a", "b", false);
test("ab", "a", false);
test("aabb", "bbaa", true);
test("aabb", "abbb", false);
test("", "", true);
test("Aa", "aA", true);
test("abc", "cba", true);
test("aabb", "bbaa", true);
test("ab", "cd", false);
test("Aa", "aa", false);
test("aabb", "bbbb", false);
