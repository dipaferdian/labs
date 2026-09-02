**1. JUDUL SOAL & TEST CASES**

**File:** `twoSum.js`

**Deskripsi Masalah:**
Diberikan sebuah array bilangan bulat `nums` dan sebuah bilangan bulat `target`. Kembalikan array berisi dua indeks dari angka-angka yang jika dijumlahkan akan menghasilkan nilai `target`. Kamu dapat mengasumsikan setiap _test case_ pasti memiliki tepat satu solusi, dan kamu tidak boleh menggunakan elemen (indeks) yang sama dua kali.

**Test Cases:**

- **Test Case 1**
- Input: `nums = [2, 7, 11, 15]`, `target = 9`
- Output: `[0, 1]`
- Penjelasan: Karena `nums[0] + nums[1] == 9`, kita mengembalikan array `[0, 1]`.

- **Test Case 2**
- Input: `nums = [3, 2, 4]`, `target = 6`
- Output: `[1, 2]`
- Penjelasan: `nums[1] + nums[2]` menghasilkan 6.

- **Test Case 3**
- Input: `nums = [3, 3]`, `target = 6`
- Output: `[0, 1]`
- Penjelasan: Menggunakan dua angka 3 yang memiliki nilai sama, namun berasal dari indeks yang berbeda.

**2. DAFTAR PILIHAN ALGORITMA**

Berikut adalah daftar pendekatan untuk menyelesaikan masalah ini:

- **Algoritma A: Brute Force (Nested Loops)**
- Konsep: Gunakan dua perulangan bersarang. Perulangan pertama menetapkan satu angka dari array, lalu perulangan kedua berjalan maju untuk mengecek semua sisa angka di depannya untuk menemukan pasangan yang jumlahnya sama dengan `target`.
- Time Complexity: O(N²)
- Space Complexity: O(1)

- **Algoritma B: Sorting & Two Pointers**
- Konsep: Urutkan array `nums` dari terkecil ke terbesar terlebih dahulu. Pasang satu pointer di awal array dan satu di akhir. Jumlahkan nilai dari kedua pointer. Jika totalnya lebih besar dari `target`, geser pointer akhir mundur ke kiri. Jika lebih kecil, geser pointer awal maju ke kanan.
- Time Complexity: O(N log N)
- Space Complexity: O(1)

- **Algoritma C: One-Pass Hash Map**
- Konsep: Lakukan satu kali iterasi pada array. Pada setiap langkah iterasi, hitung nilai "kebutuhan" (yaitu `target - elemen saat ini`). Cek apakah nilai kebutuhan tersebut sudah tersimpan di dalam Hash Map. Jika sudah ada, kembalikan indeksnya. Jika belum, simpan elemen saat ini berserta indeksnya ke dalam Hash Map untuk dicocokkan pada iterasi berikutnya.
- Time Complexity: O(N)
- Space Complexity: O(N)

- **Algoritma D: Sliding Window**
- Konsep: Buat sebuah "jendela" ukuran fleksibel dari dua elemen pertama array berdekatan. Hitung jumlah dalam jendela tersebut. Jika lebih kecil dari `target`, perlebar jendela ke kanan. Jika lebih besar, ciutkan jendela dari sebelah kiri.
- Time Complexity: O(N)
- Space Complexity: O(1)
