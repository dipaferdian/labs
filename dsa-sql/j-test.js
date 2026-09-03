function compute(s) {
  if (s.length == 0) return false;
  const splitParentheses = [];

  for (let index = 0; index < s.length; index++) {
    const element = s[index];

    if (element === "(" || element === "{" || element === "[") {
      splitParentheses.push(element);
    }

    if (element === ")" || element === "}" || element === "]") {
      const bracket = splitParentheses.pop() + element;

      if (bracket !== "()" && bracket !== "{}" && bracket !== "[]") {
        return false;
      }
    }
  }

  return splitParentheses.length == 0;
}

console.log(compute("()"));
console.log(compute("()[]{}"));
console.log(compute("(]"));
console.log(compute("((((()"));
console.log(compute("(())"));
