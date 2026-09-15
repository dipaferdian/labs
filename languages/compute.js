function compute(nums) {
  let count = 0;
  let max = -Infinity;

  for (let index = 0; index < nums.length; index++) {
    const element = nums[index];

    count += element;

    if (count < element) {
      count = element;
    }

    max = Math.max(max, count);
  }

  return max;
}

console.log(compute([-2, 1, -3, 4, -1, 2, 1, -5, 4]));

console.log(compute([4, -1, 2, 1]));

/*
 jumlahkan setiap element, jika element berikut nya lebih besar maka ganti dengan element yang sekarang
 jika ada element yang sama maka lewatkan
*/
