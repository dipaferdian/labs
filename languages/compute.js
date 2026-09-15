function compute(nums) {
  let left = 0;
  let right = 1;
  let buy = Infinity;
  let profit = 0;

  while (right < nums.length) {
    const stockToday = nums[left];
    const stockTommorow = nums[right];

    buy = Math.min(buy, stockToday);

    profit = Math.max(profit, stockTommorow - buy);

    left++;
    right++;
  }

  return profit;
}

console.log(compute([7, 1, 5, 3, 6, 4]));

console.log(compute([7, 6, 4, 3, 1]));

console.log(compute([2, 4, 1, 7]));

/*

simpan harga termurah, jika ada harga termurah berikutnya maka simpan harga tersebut
kemudian cari maksimal profit dari harga termurah dengan harga hari ini
*/
