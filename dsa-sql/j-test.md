### 1. JUDUL SOAL & TEST CASES

**File:** `validAnagram.js`

**Deskripsi Masalah:**
Diberikan dua buah string `s` dan `t`. Kembalikan `true` jika `t` adalah sebuah anagram dari `s`, dan kembalikan `false` jika bukan.
_(Catatan: Sebuah anagram adalah kata atau frasa yang dibentuk dengan mengatur ulang huruf-huruf dari kata atau frasa lain, biasanya menggunakan semua huruf aslinya tepat satu kali.)_

**Test Cases:**

- **Test Case 1**
- Input: `s = "anagram"`, `t = "nagaram"`
- Output: `true`
- Penjelasan: Kedua string memiliki kumpulan huruf yang sama persis beserta jumlah kemunculannya.

- **Test Case 2**
- Input: `s = "rat"`, `t = "car"`
- Output: `false`
- Penjelasan: Karakter pembentuknya berbeda ('r' vs 'c').

- **Test Case 3**
- Input: `s = "a"`, `t = "ab"`
- Output: `false`
- Penjelasan: Panjang string berbeda, sehingga tidak mungkin menjadi anagram.

---

### 2. DAFTAR PILIHAN ALGORITMA

Berikut adalah beberapa pendekatan yang bisa kamu gunakan untuk menyelesaikan masalah ini.

**Algoritma A: Sorting Array**

- **Konsep:** Ubah kedua string menjadi array of characters, urutkan (sort) elemen-elemen di dalamnya secara alfabetis, lalu gabungkan kembali menjadi string. Jika kedua string hasil sorting tersebut sama persis, maka keduanya adalah anagram.
- **Time Complexity:** O(N log N)
- **Space Complexity:** O(N)

**Algoritma B: ASCII Value Summation**

- **Konsep:** Lakukan iterasi pada string `s` dan jumlahkan seluruh nilai ASCII dari setiap karakternya. Lakukan hal yang sama untuk string `t`. Jika total nilai ASCII `s` sama dengan total nilai ASCII `t`, maka keduanya adalah anagram.
- **Time Complexity:** O(N)
- **Space Complexity:** O(1)

**Algoritma C: Frequency Hash Map**

- **Konsep:** Buat sebuah objek (atau map) untuk mencatat seberapa sering setiap karakter muncul di string `s`. Kemudian, iterasi string `t` dan kurangi jumlah kemunculan karakter tersebut di dalam objek. Jika di akhir pengecekan semua nilai di dalam objek adalah 0, maka keduanya adalah anagram.
- **Time Complexity:** O(N)
- **Space Complexity:** O(1)

**Algoritma D: Permutation Generation**

- **Konsep:** Lakukan rekursi untuk mencari dan menghasilkan semua kemungkinan permutasi (kombinasi susunan huruf) dari string `s`. Setelah semua permutasi terkumpul di dalam sebuah array, cari apakah string `t` ada di dalam array tersebut.
- **Time Complexity:** O(N!)
- **Space Complexity:** O(N!)

**Algoritma E: Two Pointers dari Ujung Berlawanan**

- **Konsep:** Pasang dua pointer, satu di awal string `s` dan satu lagi di akhir string `t`. Lakukan iterasi dengan membandingkan karakter di pointer tersebut. Jika sama, geser pointer `s` ke kanan dan pointer `t` ke kiri. Lanjutkan hingga karakter habis.
- **Time Complexity:** O(N)
- **Space Complexity:** O(1)

---

Sekarang giliranmu.

Tugasmu saat ini adalah:

1. Analisa kelima algoritma (A, B, C, D, E) di atas. Jabarkan mana yang valid (optimal), mana yang valid tapi sub-optimal, dan mana yang SALAH (menghasilkan _bug_ atau _false positive/negative_). Berikan alasan yang solid mengapa algoritma tersebut salah atau kurang baik.
2. Pilih SATU algoritma yang paling optimal dan aman untuk diproduksi.
3. Jabarkan "Tarian Logika"-nya secara detail, langkah demi langkah dari algoritma yang kamu pilih menggunakan salah satu Test Case di atas. Tuliskan pergerakan variabel dan perubahannya di setiap iterasi.

**SANGAT PENTING:** JANGAN menulis kode JavaScript apa pun dalam balasanmu. Kita sedang melatih cara berpikirmu (computational thinking), bukan kecepatanmu mengetik kode.

Silakan lakukan analisamu, Junior. Saya menunggu.
