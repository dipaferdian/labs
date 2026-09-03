**1. JUDUL SOAL & TEST CASES**

**File:** `maxProfit.js`

**Deskripsi Masalah:**
Diberikan sebuah array `prices` di mana elemen `prices[i]` merepresentasikan harga sebuah saham pada hari ke-`i`. Tugasmu adalah memaksimalkan keuntungan dengan memilih satu hari untuk membeli saham dan satu hari lain di masa depan untuk menjual saham tersebut. Kembalikan nilai keuntungan maksimal yang bisa diraih. Jika tidak ada keuntungan yang bisa didapatkan (harga selalu turun), kembalikan `0`.

**Test Cases:**

- **Test Case 1**
- Input: `prices = [7, 1, 5, 3, 6, 4]`
- Output: `5`
- Penjelasan: Beli pada hari ke-2 (harga = 1) dan jual pada hari ke-5 (harga = 6). Keuntungan = 6 - 1 = 5.

- **Test Case 2**
- Input: `prices = [7, 6, 4, 3, 1]`
- Output: `0`
- Penjelasan: Harga saham terus turun setiap hari. Transaksi tidak dilakukan sama sekali, keuntungan 0.

- **Test Case 3**
- Input: `prices = [2, 4, 1]`
- Output: `2`
- Penjelasan: Beli di harga 2 dan jual di harga 4 (untung 2). Meskipun ada harga terendah 1 di akhir array, tidak ada hari esok untuk menjualnya.

**2. DAFTAR PILIHAN ALGORITMA**

- **Algoritma A: Future Checking (Brute Force)**
- Konsep: Gunakan dua perulangan bersarang. Perulangan pertama (`i`) memilih hari untuk membeli. Perulangan kedua (`j = i + 1`) mengecek semua hari di masa depan untuk mencari harga jual. Catat selisih tertingginya.
- Time Complexity: O(N²)
- Space Complexity: O(1)

- **Algoritma B: Sort and Subtract**
- Konsep: Lakukan duplikasi pada array, lalu urutkan array duplikat tersebut dari nilai terkecil hingga terbesar. Ambil nilai paling awal (terkecil) sebagai harga beli dan nilai paling akhir (terbesar) sebagai harga jual. Kembalikan selisih keduanya.
- Time Complexity: O(N log N)
- Space Complexity: O(N)

- **Algoritma C: Track Min & Max Separately**
- Konsep: Lakukan dua kali iterasi terpisah. Iterasi pertama mencari nilai harga paling rendah di seluruh array. Iterasi kedua mencari nilai harga paling tinggi di seluruh array. Kurangi nilai tertinggi dengan nilai terendah untuk mendapatkan keuntungan maksimal.
- Time Complexity: O(N)
- Space Complexity: O(1)

- **Algoritma D: Dynamic Sliding Pointer**
- Konsep: Sediakan satu variabel untuk mencatat harga beli terendah sejauh ini (inisialisasi dengan tak terhingga), dan satu variabel untuk keuntungan maksimal (inisialisasi dengan 0). Lakukan satu kali iterasi pada array. Jika harga hari ini lebih rendah dari harga beli terendah, perbarui harga beli terendah. Jika tidak, hitung potensi keuntungan (harga hari ini dikurangi harga beli terendah) dan perbarui keuntungan maksimal jika hasilnya lebih besar.
- Time Complexity: O(N)
- Space Complexity: O(1)
