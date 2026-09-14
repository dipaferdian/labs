function compute(nums, nums2) {
  let map = new Map();

  for (const element of nums) {
    if (map.has(element)) {
      const count = map.get(element) + 1;

      map.set(element, count);
    } else {
      map.set(element, 1);
    }
  }

  for (let index = 0; index < nums2.length; index++) {
    const element = nums2[index];

    if (map.has(element)) {
      const count = map.get(element);

      map.set(element, count - 1);
    }
  }

  for (const [key, value] of map) {
    if (value >= 1) return false;
  }

  return true;
}

console.log(compute([1, 2, 3, 1], [3, 2, 1, 1]));
// true

console.log(compute([1, 2, 3], [1, 2]));
// false

console.log(compute([1, 2, 3], [1, 2, 4]));
// false

console.log(compute([1, 2, 2, 3], [1, 2, 3, 3]));
// false

/*
- kembalikan false jika jumlah nums dengan nums2 tidak sama
- lakukan iterasi di nums
- simpan setiap iterasi dengan jumlah kemunculan pada element yang sama
- lakukan iterasi di nums2
- cek apakah ada element nya dan jumlah nya sama
- ambil yang jumlah count nya tidak habis sampai 0
*/
