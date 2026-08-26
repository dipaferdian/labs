### [INCIDENT LOG] cwe-601-open-redirect-dns-bypass.log

**Skenario Serangan:**

1. **Skenario A (Post-Login Phishing):** Attacker menyebarkan link login resmi perusahaan kita yang disisipi parameter `?next=`. Setelah korban login dengan kredensial sah, server kita akan melempar (redirect) korban ke situs tiruan milik attacker yang meminta "Verifikasi 2FA", mencuri kode OTP korban.
2. **Skenario B (OAuth Token Stealing):** Attacker memanipulasi parameter `redirect_uri` pada alur Single Sign-On (SSO). Server kita yang rentan memvalidasi URL tersebut, lalu mengirimkan _authorization code_ atau _session token_ langsung ke server attacker.

---

### SIMULASI ATTACK CHAIN: The DNS Illusion

Kamu bertanya tentang trik URL `[https://shop.alibaba.com.attacker.com](https://shop.alibaba.com.attacker.com)`. Mengapa trik ini sangat mematikan? Jawabannya ada pada bagaimana protokol DNS (Domain Name System) bekerja di balik layar.

Banyak developer membaca URL dari **kiri ke kanan**, layaknya membaca buku. Mereka melihat `shop.alibaba.com` di awal, dan otak mereka otomatis berkata, _"Ah, ini domain kita."_

Tetapi, DNS _resolver_ bekerja dengan hierarki dari **kanan ke kiri**:

1. **Root Domain (`.`)**: Level tertinggi (biasanya implisit).
2. **Top-Level Domain (TLD)**: `.com`.
3. **Second-Level Domain (SLD)**: `attacker` (Ini adalah domain utama yang dibeli dan dikuasai oleh hacker).
4. **Subdomain**: `shop.alibaba.com` (Ini murni teks bebas yang bisa dibuat sesuka hati oleh si pemilik domain `attacker.com` di DNS Zone mereka).

**Langkah demi Langkah Eksploitasi (HTTP Level):**

1. Korban mengklik: `[https://our-app.com/login?next=https://shop.alibaba.com.attacker.com/fake-login](https://our-app.com/login?next=https://shop.alibaba.com.attacker.com/fake-login)`
2. Server kita memproses parameter `next`. Logika validasi (yang cacat) memberi lampu hijau.
3. Server kita merespons korban dengan HTTP Header:

```http
HTTP/1.1 302 Found
Location: https://shop.alibaba.com.attacker.com/fake-login

```

4. Browser korban menerima `302 Found`. Browser lalu melakukan _DNS Lookup_ untuk `shop.alibaba.com.attacker.com`.
5. DNS Server merespons dengan IP Address milik server attacker (karena domain utamanya adalah `attacker.com`).
6. Browser korban melakukan request ke IP attacker, dan menampilkan halaman phishing. Bagi korban, transisi ini terasa sangat sah karena awalnya mereka login di domain resmi kita.

---

### PRODUCTIVE STRUGGLE: Blue Team Exercise

Sekarang giliranmu bekerja. Di bawah ini adalah potongan kode dari dua endpoint yang ditulis oleh developer junior bulan lalu. Mereka mencoba mengamankan fitur redirect dengan fungsi _String matching_ bawaan JavaScript.

```javascript
const express = require("express");
const app = express();

// Endpoint A: Validasi dengan .includes()
// Asumsi Dev: "Selama URL mengandung nama domain kita, berarti aman!"
app.get("/login", (req, res) => {
  const redirectUrl = req.query.next;

  if (redirectUrl && redirectUrl.includes("shop.alibaba.com")) {
    return res.redirect(redirectUrl); // VULNERABLE
  }
  res.send("Login sukses, kembali ke beranda default.");
});

// Endpoint B: Validasi dengan .startsWith()
// Asumsi Dev: "Ini pasti aman karena URL-nya HARUS diawali dengan domain kita!"
app.get("/sso-auth", (req, res) => {
  const redirectUrl = req.query.callback;

  if (redirectUrl && redirectUrl.startsWith("https://shop.alibaba.com")) {
    return res.redirect(redirectUrl); // VULNERABLE
  }
  res.send("SSO sukses.");
});
```

**Tugasmu (Jawab 2 poin ini):**

1. **Jebol Pertahanan Ini (Red Teaming Analyst):**
   Sebagai seorang analis keamanan, saya ingin kamu menjelaskan **kenapa** kode di atas gagal. Berikan saya _payload URL spesifik_ (selain contoh DNS di atas) yang bisa mem-bypass Endpoint A (`.includes`) dan Endpoint B (`.startsWith`).
   _Hint: Pikirkan struktur URI (Path, Query Parameter, dan trik DNS lainnya)._
2. **Rancang Arsitektur Perbaikannya (Blue Teaming):**
   Jangan beri saya kodenya dulu. Ceritakan _logika arsitektur_ yang benar untuk memvalidasi URL. Mengapa menggunakan manipulasi _String_ (seperti `includes`, `startsWith`, atau Regex sederhana) adalah _bad practice_ dalam industri keamanan? Konsep Defense-in-Depth apa yang seharusnya kita terapkan di sini?

Tunjukkan analisamu. Saya akan bertindak sebagai _Red Teamer_ untuk menyerang logika perbaikan yang kamu usulkan di jawabanmu berikutnya. Silakan!

```javascript
const express = require("express");
const app = express();

// Daftar domain partner yang diizinkan (Strict Whitelist)
const ALLOWED_HOSTS = ["shop.alibaba.com", "pay.alibaba.com"];

app.get("/secure-redirect", (req, res) => {
  const userInputUrl = req.query.next;

  if (!userInputUrl) {
    return res.status(400).send("Bad Request");
  }

  try {
    urlParser = new URL(userInputUrl);

    if (ALLOWED_HOSTS.includes(urlParser.hostname)) {
      return res.redirect(redirectUrl);
    }
  } catch (error) {
    // Jika 'new URL()' gagal memparsing karena format tidak valid (bukan URL),
    // otomatis jatuh ke blok catch ini.
    return res.status(400).send("Invalid URL format");
  }
});
```
