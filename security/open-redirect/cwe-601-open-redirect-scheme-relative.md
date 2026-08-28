### [INCIDENT LOG] cwe-601-open-redirect-scheme-relative.log

**Skenario Serangan:**

1. **Skenario A (Internal Redirect Bypass):** Developer menambahkan fitur untuk mengizinkan "Relative Path" (URL internal yang hanya berisi path, tanpa nama domain). Attacker memanfaatkan kelemahan validasi path ini untuk melempar korban ke situs eksternal berbahaya.
2. **Skenario B (Protocol-Relative Phishing):** Korban mengklik link di email dengan payload yang lolos pengecekan karakter awalan, lalu browser otomatis meresolusi payload tersebut sebagai URL eksternal yang valid.

---

### SIMULASI ATTACK CHAIN: The "Double Slash" Trap

Di dunia web, browser sangat pintar—terkadang terlalu pintar. Jika kamu memberikan URL tanpa skema (seperti `http://` atau `https://`), browser memiliki aturan fallback yang disebut **Scheme-Relative URL** (atau Protocol-Relative URL).

Jika browser melihat URL yang diawali dengan dua garis miring (`//`), browser akan membacanya sebagai: _"Gunakan protokol yang sama dengan halaman saat ini, dan anggap teks setelahnya sebagai **Hostname** (Domain)."_

**Langkah demi Langkah Eksploitasi:**

1. Korban berada di `[https://our-app.com/login](https://our-app.com/login)`.
2. Attacker mengirimkan payload yang diawali karakter tertentu yang diizinkan oleh sistem, tapi merujuk ke trik _Double Slash_.
3. Server merespons: `Location: //[attacker.com/phishing](https://attacker.com/phishing)`
4. Browser korban mengeksekusi header tersebut. Karena asal halamannya adalah `https`, browser menerjemahkan `//attacker.com` menjadi `[https://attacker.com](https://attacker.com)`. Korban berhasil diretas!

---

### PRODUCTIVE STRUGGLE: Blue Team Exercise

Tim developer kita memperbaiki kode dari sesi sebelumnya. Mereka kini ingin mengizinkan _Absolute URL_ (ke whitelist) DAN _Relative URL_ (ke internal path seperti `/dashboard`).

Jika input di-parse dengan `new URL()`, input seperti `/dashboard` akan menyebabkan error _Invalid URL_ karena tidak ada host-nya. Jadi, developer menulis logika ini:

```javascript
app.get("/login", (req, res) => {
  const userInputUrl = req.query.next;

  if (!userInputUrl) return res.redirect("/");

  // Asumsi Dev: "Jika URL diawali dengan SATU garis miring (/),
  // itu pasti path internal kita, jadi aman untuk langsung di-redirect!"
  if (userInputUrl.startsWith("/")) {
    return res.redirect(userInputUrl); // VULNERABLE
  }

  // (Logika Whitelist Absolute URL dari sesi sebelumnya diabaikan dulu untuk fokus ke sini)
  res.send("Bukan path internal");
});
```

**Tugasmu (Jawab 2 poin ini):**

1. **Jebol Pertahanan Ini (Red Teaming Analyst):**
   Dengan menggunakan konsep _Scheme-Relative URL_ yang saya jelaskan di atas, berikan saya **satu payload spesifik** yang diawali dengan karakter `/` sehingga lolos dari pengecekan `startsWith('/')`, tetapi tetap akan me-redirect browser korban ke `attacker.com`!
2. **Rancang Arsitektur Perbaikannya (Blue Teaming):**
   Bagaimana cara memvalidasi sebuah _Relative Path_ agar kita yakin 100% bahwa itu akan tetap berada di dalam domain kita sendiri (local redirect), dan tidak akan pernah ditafsirkan sebagai _Scheme-Relative URL_ eksternal oleh browser? (Jelaskan logikanya, tunjukkan karakter apa yang harus kita waspadai).

### SIMULASI ATTACK CHAIN: The HTTP Pipeline

Sebagai attacker, saya tidak perlu meretas server secara langsung. Saya hanya perlu mengirimkan _link_ (URL) kepada korban melalui email phishing atau pesan chat.

**Langkah 1: Attacker Membuat Payload (URL Serangan)**
Attacker merakit URL menuju aplikasi kita, tetapi menyisipkan payload _Double Slash_ di parameter `next`:
`[https://our-app.com/login?next=//attacker.com/phishing](https://our-app.com/login?next=//attacker.com/phishing)`

**Langkah 2: Aplikasi Kita Memproses Input (Backend)**
Saat korban mengklik link tersebut, server Express.js kita mengeksekusi kode rentan tadi:

```javascript
const userInputUrl = req.query.next; // Nilainya adalah: "//attacker.com/phishing"

// Apakah "//attacker.com/phishing" diawali dengan '/'?
// Jawabannya: YA! Karakter pertamanya adalah '/'
if (userInputUrl.startsWith("/")) {
  return res.redirect(userInputUrl);
}
```

Karena kondisi `startsWith('/')` bernilai **TRUE**, aplikasi mengeksekusi `res.redirect('//[attacker.com/phishing](https://attacker.com/phishing)')`.

**Langkah 3: Server Merespons dengan HTTP Header**
Di balik layar, fungsi `res.redirect()` di Express.js (dan framework web lainnya) sebenarnya hanya melakukan satu hal: membuat _HTTP Response_ dengan status code 302 (Found) dan menyisipkan nilai tadi ke dalam header `Location`.

Server kita secara otomatis membalas ke browser korban seperti ini:

```http
HTTP/1.1 302 Found
X-Powered-By: Express
Location: //attacker.com/phishing

```

**Langkah 4: Browser Korban Mengeksekusi Redirect**
Browser korban membaca HTTP Response di atas. Browser melihat header `Location: //[attacker.com/phishing](https://attacker.com/phishing)`.
Karena diawali dengan `//`, browser menggunakan aturan _Scheme-Relative URL_. Browser akan melihat protokol asal web kita (`https`), lalu menggabungkannya sehingga menjadi:
`[https://attacker.com/phishing](https://attacker.com/phishing)`

Boom! Korban diarahkan ke situs palsu, dan kode kita yang menjadi jembatannya.

---

### PRODUCTIVE STRUGGLE: Blue Team Exercise

Sekarang kamu sudah melihat _Payload_-nya: `//attacker.com`. Kamu juga sudah melihat bagaimana karakter pertama `/` membuat kode `startsWith('/')` tertipu, padahal karakter keduanya juga `/` yang mengubah maknanya menjadi domain eksternal.

Selain `//`, ada variasi trik lain yang sering dipakai hacker, yaitu `/\` (satu garis miring, satu _backslash_). Banyak browser modern akan menormalisasi `/\attacker.com` menjadi `//attacker.com`.

**Tugasmu (Rancang Arsitektur Perbaikannya):**

Bagaimana cara kita memperbaiki baris kode ini?

```javascript
if (userInputUrl.startsWith('/')) {

```

Pikirkan logika validasinya. Kamu ingin memastikan URL tersebut **BENAR-BENAR** hanya path internal (seperti `/dashboard` atau `/profile`).

Jika URL diawali dengan `/`, itu bagus. Tetapi karakter **keberapa** yang harus kita cek agar kita yakin itu bukan trik `//` atau `/\`? Coba tuliskan logika `if` condition yang baru untuk menambal celah ini! (Tidak perlu kode lengkap, cukup logika `if`-nya saja).
