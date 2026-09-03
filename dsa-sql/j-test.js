function compute(s) {
  if (s.length == 0) return false;
  const splitParentheses = s.split("");

  let openBracket = 0;
  let closedBracket = 0;
  let currentOpenBracket = "";
  let currentCloseBracket = "";

  for (let index = 0; index < splitParentheses.length; index++) {
    const element = splitParentheses[index];

    if (element === "(" || element === "[" || element === "{") {
      openBracket += 1;
      currentOpenBracket = element;
    }

    if (element === ")" || element === "]" || element === "}") {
      closedBracket += 1;
      currentCloseBracket = element;
    }

    if (openBracket + closedBracket === 2) {
      const bracket = currentOpenBracket + currentCloseBracket;

      if (bracket === "()" || bracket === "{}" || bracket === "[]") {
        currentOpenBracket = "";
        currentCloseBracket = "";
      } else {
        return false;
      }
    }
  }

  if (openBracket !== closedBracket) return false;

  return true;
}

console.log(compute("()"));
console.log(compute("()[]{}"));
console.log(compute("(]"));
console.log(compute("((((()"));
