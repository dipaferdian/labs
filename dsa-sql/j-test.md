**1. JUDUL SOAL & TEST CASES**

**File:** `validParentheses.js`

**Deskripsi Masalah:**
Diberikan sebuah string `s` yang hanya berisi karakter kurung: `'('`, `')'`, `'{'`, `'}'`, `'['`, dan `']'`. Tentukan apakah string input tersebut valid.
String input dinyatakan valid jika:

1. Tanda kurung buka harus ditutup oleh tanda kurung tutup dengan tipe yang sama.
2. Tanda kurung buka harus ditutup dalam urutan yang benar (setiap tanda kurung tutup harus menutup tanda kurung buka yang paling terakhir belum ditutup).

**Test Cases:**

- **Test Case 1**
- Input: `s = "()"`
- Output: `true`
- Penjelasan: Kurung buka bulat ditutup dengan kurung tutup bulat tepat setelahnya.

- **Test Case 2**
- Input: `s = "()[]{}"`
- Output: `true`
- Penjelasan: Semua kurung dibuka dan ditutup dengan benar secara berurutan.

- **Test Case 3**
- Input: `s = "(]"`
- Output: `false`
- Penjelasan: Kurung buka bulat ditutup oleh kurung tutup siku (tipe tidak cocok).

- **Test Case 4**
- Input: `s = "([)]"`
- Output: `false`
- Penjelasan: Kurung siku tutup muncul sebelum kurung bulat tutup diselesaikan. Urutannya menyilang, sehingga tidak valid.

**2. DAFTAR PILIHAN ALGORITMA**

- **Algoritma A: String Replacement**
- Konsep: Selama string masih mengandung substring `"()"`, `"[]"`, atau `"{}"`, gantikan (replace) pasangan tersebut dengan string kosong `""`. Ulangi proses ini terus-menerus. Jika di akhir proses string menjadi kosong, maka string tersebut valid.
- Time Complexity: O(N²)
- Space Complexity: O(N)

- **Algoritma B: Two Pointers (Ujung ke Ujung)**
- Konsep: Pasang satu pointer di awal string dan satu di akhir string. Cek apakah karakter di pointer awal adalah pasangan kurung buka yang tepat untuk kurung tutup di pointer akhir. Jika cocok, geser kedua pointer ke tengah. Jika tidak cocok, kembalikan false.
- Time Complexity: O(N)
- Space Complexity: O(1)

- **Algoritma C: Karakter / Frequency Counter**
- Konsep: Lakukan satu kali perulangan pada string dan hitung frekuensi setiap kurung. Gunakan variabel untuk menghitung jumlah `'('`, `')'`, `'{'`, `'}'`, `'['`, dan `']'`. Di akhir iterasi, jika jumlah `'('` sama dengan `')'`, `'['` sama dengan `']'`, dan `'{'` sama dengan `'}'`, maka string tersebut valid.
- Time Complexity: O(N)
- Space Complexity: O(1)

- **Algoritma D: Tumpukan Berurutan (Stack)**
- Konsep: Siapkan sebuah array kosong. Saat iterasi string, jika menemukan kurung buka, masukkan ke dalam array. Jika menemukan kurung tutup, ambil elemen paling terakhir dari array dan cocokkan. Jika tidak cocok (atau array sudah kosong padahal ada kurung tutup), maka tidak valid. Di akhir perulangan, array harus kosong.
- Time Complexity: O(N)
- Space Complexity: O(N)
