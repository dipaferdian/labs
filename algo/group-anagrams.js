/**
---

### 📜 `group-anagrams.js`

**Skenario:**
Diberikan sebuah *array* berisi sekumpulan kata (string). Tugasmu adalah mengelompokkan kata-kata yang merupakan **Anagram** ke dalam satu kelompok (*array* terpisah).

*(Catatan: Anagram adalah kata yang dibentuk dari huruf-huruf yang persis sama, hanya saja urutannya diacak. Contoh: "batu" dan "buta").*

**🧪 Test Cases:**

* **Kasus 1:**
* `input = ["eat", "tea", "tan", "ate", "nat", "bat"]`
* *Target Output =* `[["bat"], ["nat", "tan"], ["ate", "eat", "tea"]]`
* *(Penjelasan: "eat", "tea", dan "ate" memiliki huruf yang sama [a, e, t]. "tan" dan "nat" memiliki huruf [a, n, t]. "bat" tidak punya teman).*
* *(Catatan urutan kelompok keluaran bebas, yang penting isinya benar).*


* **Kasus 2:**
* `input = [""]`
* *Target Output =* `[[""]]`


* **Kasus 3:**
* `input = ["a"]`
* *Target Output =* `[["a"]]`



---

### 📦 Analogi: Pabrik Pengepakan Mainan Blok Huruf

Bayangkan kamu adalah mandor di sebuah pabrik penyortiran mainan edukasi. Di hadapanmu ada ban berjalan yang membawa kotak-kotak kecil berisi "Blok Huruf".

Tugasmu adalah memasukkan kotak-kotak kecil tersebut ke dalam **Kardus Besar** yang tepat, dengan aturan: *Kardus Besar hanya boleh berisi kotak-kotak kecil yang komposisi hurufnya 100% sama, tidak peduli posisinya berantakan.*

Bagaimana cara kerjanya agar kamu tidak pusing mencocokkan satu per satu?
Kamu membuat **"Sistem Label Standar"**.
Setiap kali kamu memegang kotak kecil, kamu membongkar hurufnya, **menyusunnya sesuai abjad (A-Z)**, lalu menempelkan susunan rapi itu sebagai "Label Kardus Besar".

Kamu menggunakan sebuah **Lemari Rak (Hash Map)**:

* **Label Abjad (Key):** Nama stiker di kardus (misal: "a-e-t").
* **Isi Kardus (Value):** Daftar kata asli yang masih berantakan (misal: `["eat", "tea"]`).

---

### 🚶‍♂️ Simulasi Manual

Mari kita proses Kasus 1: `["eat", "tea", "tan", "ate", "nat", "bat"]`

* *Lemari Rak = Kosong `{}*`

1. **Kotak "eat":**
* Susun abjad: `e-a-t` ➔ **"aet"** (Ini adalah Labelnya!).
* Cari rak berlabel "aet". Belum ada.
* Buat kardus baru berlabel "aet", masukkan "eat" ke dalamnya.
* *Isi Rak:* `{ "aet": ["eat"] }`


2. **Kotak "tea":**
* Susun abjad: `t-e-a` ➔ **"aet"**.
* Cari rak "aet". Sudah ada!
* Masukkan "tea" ke dalam kardus tersebut.
* *Isi Rak:* `{ "aet": ["eat", "tea"] }`


3. **Kotak "tan":**
* Susun abjad: `t-a-n` ➔ **"ant"**.
* Cari rak "ant". Belum ada. Buat kardus baru.
* *Isi Rak:* `{ "aet": ["eat", "tea"], "ant": ["tan"] }`


4. **Kotak "ate":**
* Susun abjad: `a-t-e` ➔ **"aet"**. Masukkan ke kardus "aet".


5. **Kotak "nat":**
* Susun abjad: `n-a-t` ➔ **"ant"**. Masukkan ke kardus "ant".


6. **Kotak "bat":**
* Susun abjad: `b-a-t` ➔ **"abt"**. Buat kardus baru.



**Hasil Akhir Lemari Rak:**
`{ "aet": ["eat", "tea", "ate"], "ant": ["tan", "nat"], "abt": ["bat"] }`
Langkah terakhir hanyalah mengeluarkan semua isi kardusnya dan membuang labelnya!

---

### 🧩 Panduan Productive Struggle & Fokus Efisiensi

Jika kita menggunakan *Brute Force* (membandingkan setiap kata dengan kata lainnya satu per satu), Time Complexity-nya bisa mencapai $O(n^2 \times k)$, yang akan hancur lebur jika daftar katanya panjang.

Dengan teknik **Label Abjad + Hash Map**, efisiensinya menjadi **$O(n \times k \log k)$**!
*(Penjelasan efisiensi: $n$ adalah jumlah kata yang di-looping, dan $k \log k$ adalah waktu yang dibutuhkan untuk mengurutkan (sorting) abjad di setiap kata yang panjangnya maksimal $k$).* Space Complexity-nya adalah $O(n \times k)$ untuk menyimpan Hash Map.

**Hint Logika:**

1. Siapkan sebuah Objek/Map kosong sebagai Lemari Rak (misal: `let map = new Map()`).
2. Gunakan `for...of` atau `for` loop untuk memproses setiap string dalam `input`.
3. **Buat Label:** Di JavaScript, kamu tidak bisa langsung melakukan `.sort()` pada string. Kamu harus mengubah string menjadi array huruf, mengurutkannya, lalu menggabungkannya kembali.
*(Contekan sintaksis: `element.split("").sort().join("")`).*
4. Cek apakah `map` sudah memiliki label tersebut.
* Jika BELUM: set label tersebut dengan *array* baru yang berisi elemen saat ini `[element]`.
* Jika SUDAH: ambil *array* yang sudah ada di label tersebut, lalu tambahkan (`push`) elemen saat ini ke dalamnya.


5. Setelah loop selesai, kamu hanya perlu mengembalikan "Isi Value-nya" saja menjadi sebuah *array* besar. (Gunakan fungsi bawaan `Array.from(map.values())` atau `Object.values()` jika memakai objek biasa).

Buka editor-mu dan buat file `group-anagrams.js`, *Engineer*. Mari kita lihat bagaimana kamu merakit pabrik penyortiran ini!
 */

function compute(input) {
  let map = new Map();

  for (let index = 0; index < input.length; index++) {
    const element = input[index];

    const ascending = element.split("").sort().join("");

    if (map.has(ascending)) {
      let temporary = map.get(ascending);
      temporary.push(element);
    } else {
      map.set(ascending, [element]);
    }
  }

  return Array.from(map.values());
}

console.log(compute(["eat", "tea", "tan", "ate", "nat", "bat"]));
console.log(compute([""]));
console.log(compute(["a"]));
