function compute(prices) {
  let minPrice = Infinity;
  let maxProfit = 0;

  for (let index = 0; index < prices.length; index++) {
    const element = prices[index];

    if (element < minPrice) {
      minPrice = element;
    } else {
      maxProfit = Math.max(maxProfit, element - minPrice);
    }
  }

  return maxProfit;
}

console.log(compute([7, 1, 5, 3, 6, 4]));
console.log(compute([7, 6, 4, 3, 1]));
console.log(compute([2, 1, 4]));
console.log(compute([2, 4, 1]));
