Bertindaklah sebagai seorang Senior Database Administrator (DBA) yang sedang menguji kemampuan optimasi SQL seorang Junior Backend Developer. Buatkan saya satu studi kasus soal SQL dengan fokus pada performa dan optimasi.

Topik spesifik untuk soal ini adalah: [TULIS TOPIK SQL, misal: JOIN Optimization / Window Functions / Indexing / Handling Jutaan Baris, atau tulis "BEBAS" agar AI memilihkan].

Gunakan gaya bahasa yang semi-formal, asyik, dan bernada seperti mentor ke mentee. Strukturkan respons Anda persis dengan urutan berikut:

1. Pengantar: Sapaan pembuka (sebut saya "Junior") dan cerita singkat mengenai masalah bisnis/sistem yang sedang terjadi akibat query yang lambat.
2. Skema Database & Script SQL (Setup): Berikan spesifikasi tabel (nama tabel, kolom, tipe data), dan sebutkan kolom mana saja yang memiliki Index. Asumsikan di production data ini berskala jutaan baris. Berikan script SQL CREATE TABLE (termasuk definisi Index) dan INSERT INTO berisi sekitar 10-15 baris data dummy yang mencakup berbagai edge cases. Tujuannya agar saya bisa membuat tabel dan menguji query ciptaan saya di database lokal.
3. Tugas Utama: Jelaskan data apa yang sebenarnya ingin diambil/ditampilkan oleh tim bisnis dari skema di atas.
4. Test Cases (Ilustrasi Data): Berikan minimal 3 contoh skenario/ilustrasi data dan ekspektasi output-nya dalam bentuk tabel Markdown (gunakan kolom seperti: ID/Nama Data, Skenario Kondisi, dan Ekspektasi Output (Masuk/Dibuang)).
5. Daftar Pilihan Konsep / Pendekatan (TANPA CODE FULL & TANPA HINT): Berikan 4 opsi pendekatan logika/klausa untuk menyelesaikan masalah ini.
   Catatan internal untuk Anda (AI): Keempat opsi ini harus mewakili 4 skenario berikut (1. Ada bug/salah data, 2. Sangat lambat/Full Table Scan, 3. Berjalan normal tapi bukan yang terbaik, 4. Paling optimal/Best Practice).
   PENTING SAAT MENYAJIKAN KE SAYA:

JANGAN berikan kode SQL utuhnya.

JANGAN berikan hint, label, catatan performa, atau Execution Plan apapun yang membocorkan mana pendekatan yang benar, salah, atau lambat.

Cukup berikan Nama Pendekatan dan Konsep Logika/Klausa yang disarankan dengan nada yang netral dan seolah-olah semuanya adalah ide yang bagus. Biarkan saya yang menilainya nanti.

6. Instruksi Akhir: Tantang saya (sebagai Junior) untuk:

Merangkai kode SQL secara mandiri berdasarkan satu pendekatan di atas dan mengujinya di database lokal saya.

Menganalisis dan menentukan sendiri status dari masing-masing pendekatan (Mana yang datanya bug/salah? Mana yang sub-optimal/bikin server down? Dan mana SATU pendekatan yang Best Practice?).

Menjabarkan alasan logikanya (bagaimana mesin database merespons masing-masing query tersebut).

Penting: Jangan berikan kode SQL SELECT atau kunci jawaban di awal. Biarkan saya merangkai query, bereksperimen, dan membedah misteri performanya sendiri!
