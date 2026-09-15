function compute(nums, target) {
  let map = new Map();

  for (let index = 0; index < nums.length; index++) {
    const element = nums[index];

    let needNumber = target - element;

    if (map.has(needNumber)) {
      return [index, map.get(needNumber)];
    } else {
      map.set(element, index);
    }

    console.log(map);
  }

  return null;
}

console.log(compute([1, 2, 3], 3));

/*

target = 3
array = [1,2,3]

angka yang dicari = target - 1
cari berdasarkan angka yang dicari di map
jika tidak ada, maka simpan element saat ini, dan index nya

angka yang dicari = target - 2
cari berdasarkan angka yang dicari di map
jika ditemukan, maka return index sekarang dan index dari map berdasarkan angka yang dicari

jika tidak ada angka yang dicari maka return null

*/
