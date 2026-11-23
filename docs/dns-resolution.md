# DNS Resolution

## 1. Apa Itu DNS Resolution?

DNS (Domain Name System) adalah sistem yang menerjemahkan nama domain menjadi alamat IP.

Contoh:

```text
www.hackycorp.com → 51.158.147.132
```

Komputer membutuhkan alamat IP untuk terhubung ke server. DNS membantu kita menggunakan nama domain yang lebih mudah diingat daripada alamat IP.

**DNS Resolution** adalah proses mencari alamat IP berdasarkan nama domain.

---

## 2. Bagaimana DNS Resolution Bekerja?

Ketika kita mengakses:

```text
https://www.example.com
```

Komputer perlu mengetahui alamat IP dari `www.example.com`.

Prosesnya melibatkan beberapa komponen:

1. Client
2. Recursive DNS Resolver
3. Root DNS Server
4. TLD DNS Server
5. Authoritative DNS Server

### 2.1 Client

Client adalah perangkat atau aplikasi yang meminta alamat IP sebuah domain.

Contohnya ketika kita menjalankan:

```bash
curl https://www.example.com
```

Browser atau `curl` membutuhkan alamat IP dari domain tersebut.

### 2.2 Recursive DNS Resolver

Recursive Resolver bertugas mencari alamat IP untuk client.

Contoh layanan Recursive Resolver:

- Cloudflare DNS: `1.1.1.1`
- Google DNS: `8.8.8.8`

Resolver akan memeriksa cache terlebih dahulu.

Jika alamat IP sudah tersedia di cache dan belum kedaluwarsa, resolver langsung mengembalikannya.

Jika belum tersedia, resolver akan mencari jawabannya melalui DNS hierarchy.

### 2.3 Root DNS Server

Root DNS Server merupakan titik awal pencarian ketika resolver belum mengetahui lokasi DNS berikutnya.

Root Server tidak menyimpan alamat IP seluruh website.

Sebaliknya, Root Server memberikan informasi tentang TLD DNS Server yang harus ditanyakan.

Contohnya:

```text
example.com
```

Root Server mengarahkan resolver ke DNS Server untuk `.com`.

### 2.4 TLD DNS Server

TLD (Top-Level Domain) adalah bagian terakhir dari sebuah domain.

Contoh:

```text
example.com
         └── .com

example.id
         └── .id
```

TLD DNS Server memberikan informasi mengenai Authoritative DNS Server yang bertanggung jawab atas domain tersebut.

### 2.5 Authoritative DNS Server

Authoritative DNS Server adalah server yang menyimpan informasi DNS resmi untuk sebuah domain.

Contohnya, DNS zone `example.com` dapat memiliki record:

```text
example.com       A       203.0.113.10
www.example.com   A       203.0.113.10
mail.example.com  A       203.0.113.20
```

Ketika resolver meminta alamat IP `www.example.com`, Authoritative DNS Server memberikan jawaban berdasarkan DNS record yang tersedia.

---

## 3. Alur DNS Resolution

Misalnya client ingin mengakses:

```text
www.example.com
```

Alurnya:

```text
Client
  |
  | 1. Request IP for www.example.com
  v
Recursive DNS Resolver
  |
  | 2. Check cache
  |
  | 3. Ask Root DNS Server
  v
Root DNS Server
  |
  | 4. Return .com TLD information
  v
TLD DNS Server (.com)
  |
  | 5. Return authoritative nameserver information
  v
Authoritative DNS Server
  |
  | 6. Return A record
  v
Recursive DNS Resolver
  |
  | 7. Return IP address
  v
Client
```

Hasil akhirnya:

```text
www.example.com → 203.0.113.10
```

Client kemudian dapat menggunakan alamat IP tersebut untuk membuat koneksi ke server.

**Catatan:** Tidak semua DNS query harus melewati seluruh proses ini. Jika resolver sudah memiliki jawaban di cache, proses dapat selesai lebih cepat.

---

## 4. DNS Record Types

DNS Record adalah informasi yang disimpan di DNS zone untuk menentukan bagaimana sebuah domain harus diarahkan atau digunakan.

### 4.1 A Record

Menghubungkan hostname dengan alamat IPv4.

Contoh:

```text
example.com    A    203.0.113.10
```

Artinya:

```text
example.com → 203.0.113.10
```

### 4.2 AAAA Record

Menghubungkan hostname dengan alamat IPv6.

Contoh:

```text
example.com    AAAA    2001:db8::10
```

### 4.3 CNAME Record

Membuat alias dari satu hostname ke hostname lainnya.

Contoh:

```text
www.example.com    CNAME    example.com
```

Artinya `www.example.com` merupakan alias dari `example.com`.

Resolver kemudian mencari alamat IP dari hostname tujuan.

### 4.4 MX Record

Menentukan mail server yang bertanggung jawab menerima email untuk sebuah domain.

Contoh:

```text
example.com    MX    10 mail.example.com
```

Angka `10` merupakan priority. Angka yang lebih kecil memiliki prioritas lebih tinggi.

### 4.5 NS Record

Menentukan nameserver yang bertanggung jawab atas DNS zone sebuah domain.

Contoh:

```text
example.com    NS    ns1.example-dns.com
example.com    NS    ns2.example-dns.com
```

Artinya DNS zone `example.com` dilayani oleh kedua nameserver tersebut.

NS record tidak menunjukkan alamat IP website. NS record menunjukkan server yang memiliki informasi DNS resmi untuk domain tersebut.

### 4.6 TXT Record

Menyimpan informasi berbentuk teks.

Biasanya digunakan untuk:

- Domain ownership verification
- SPF
- DKIM
- DMARC

Contoh:

```text
example.com    TXT    "v=spf1 include:_spf.example.com ~all"
```

---

## 5. Perbedaan Domain Registrar, DNS Provider, dan Hosting Provider

Ketiganya memiliki fungsi berbeda.

### 5.1 Domain Registrar

Perusahaan tempat kita membeli dan mendaftarkan domain.

Contoh:

- Namecheap
- GoDaddy
- Cloudflare Registrar

Registrar mengelola pendaftaran domain dan pengaturan nameserver delegation.

### 5.2 DNS Provider

Perusahaan yang menyediakan layanan pengelolaan DNS records dan authoritative nameserver.

Contoh:

- Cloudflare DNS
- Amazon Route 53
- Namecheap DNS

DNS Provider bertugas menyimpan dan menjawab informasi DNS untuk domain kita.

### 5.3 Hosting Provider

Perusahaan yang menyediakan server untuk menjalankan website atau aplikasi.

Contoh:

- AWS
- DigitalOcean
- Hetzner

Hosting Provider menyediakan infrastruktur tempat aplikasi berjalan.

### 5.4 Contoh Hubungan Ketiganya

Misalnya kita:

1. Membeli domain `mywebsite.com` di Namecheap.
2. Menggunakan Cloudflare sebagai DNS Provider.
3. Menjalankan website di server DigitalOcean.

Maka:

```text
Domain Registrar:
Namecheap

DNS Provider:
Cloudflare

Hosting Provider:
DigitalOcean
```

Ketiganya bisa berasal dari perusahaan yang berbeda.

---

## 6. Bagaimana Menghubungkan Domain ke DNS Provider?

Misalnya kita membeli domain:

```text
mywebsite.com
```

di Namecheap dan ingin menggunakan Cloudflare sebagai DNS Provider.

### Step 1 — Membeli Domain

Beli domain melalui Namecheap.

Pada tahap ini, Namecheap berperan sebagai Domain Registrar.

### Step 2 — Menambahkan Domain ke Cloudflare

Tambahkan domain `mywebsite.com` ke akun Cloudflare.

Cloudflare akan memberikan nameserver khusus untuk domain tersebut.

Contoh ilustrasi:

```text
alice.ns.cloudflare.com
bob.ns.cloudflare.com
```

Nama nameserver sebenarnya harus menggunakan nilai yang diberikan Cloudflare untuk domain kita.

### Step 3 — Mengubah Nameserver di Namecheap

Masuk ke pengaturan domain di Namecheap.

Ubah nameserver menjadi nameserver yang diberikan Cloudflare.

Contoh:

```text
Nameserver 1:
alice.ns.cloudflare.com

Nameserver 2:
bob.ns.cloudflare.com
```

Dengan perubahan ini, kita mengarahkan DNS delegation domain ke Cloudflare.

### Step 4 — Membuat DNS Records di Cloudflare

Setelah domain menggunakan nameserver Cloudflare, kita dapat mengelola DNS records melalui Cloudflare.

Misalnya server website kita memiliki IP:

```text
203.0.113.10
```

Buat record:

```text
Type: A
Name: @
Content: 203.0.113.10
```

Untuk subdomain `www`, kita bisa membuat:

```text
Type: CNAME
Name: www
Content: mywebsite.com
```

Hasilnya:

```text
mywebsite.com     → 203.0.113.10
www.mywebsite.com → mywebsite.com → 203.0.113.10
```

**Penting:** Mengubah nameserver tidak berarti kita memindahkan kepemilikan domain. Domain tetap terdaftar di Namecheap, tetapi DNS zone sekarang dilayani oleh Cloudflare.

---

## 7. Cara Melakukan DNS Resolution

Kita dapat melakukan DNS resolution menggunakan beberapa command Linux.

### 7.1 Menggunakan dig

Melihat informasi DNS:

```bash
dig www.hackycorp.com
```

Melihat IP address saja:

```bash
dig +short www.hackycorp.com
```

Melihat A record:

```bash
dig www.hackycorp.com A
```

Melihat AAAA record:

```bash
dig www.hackycorp.com AAAA
```

Melihat NS record:

```bash
dig hackycorp.com NS
```

Melihat MX record:

```bash
dig hackycorp.com MX
```

Melihat TXT record:

```bash
dig hackycorp.com TXT
```

### 7.2 Menggunakan nslookup

```bash
nslookup www.hackycorp.com
```

Melihat NS record:

```bash
nslookup -type=NS hackycorp.com
```

Melihat MX record:

```bash
nslookup -type=MX hackycorp.com
```

### 7.3 Menggunakan getent

```bash
getent hosts www.hackycorp.com
```

`getent` menggunakan mekanisme name resolution yang dikonfigurasi oleh sistem operasi.

Artinya, hasilnya bisa berasal dari `/etc/hosts` maupun DNS, tergantung konfigurasi sistem.

---

## 8. Menggunakan DNS Resolver Tertentu

Kita juga bisa menentukan DNS Resolver yang ingin digunakan.

Contoh menggunakan Cloudflare DNS:

```bash
dig @1.1.1.1 www.example.com
```

Menggunakan Google DNS:

```bash
dig @8.8.8.8 www.example.com
```

Perbedaannya:

```bash
dig www.example.com
```

Menggunakan DNS resolver default dari sistem.

Sedangkan:

```bash
dig @1.1.1.1 www.example.com
```

Secara eksplisit meminta jawaban melalui Cloudflare DNS.

---

## 9. Perbedaan DNS Resolution, /etc/hosts, dan curl --resolve

Ketiganya dapat digunakan untuk menentukan hubungan hostname dengan IP, tetapi mekanismenya berbeda.

### 9.1 DNS Resolution

Melakukan pencarian alamat IP melalui sistem DNS.

```bash
dig www.hackycorp.com
```

### 9.2 /etc/hosts

File lokal yang dapat digunakan untuk memetakan hostname ke alamat IP tanpa melakukan pencarian DNS untuk hostname tersebut.

Contoh isi `/etc/hosts`:

```text
51.158.147.132 www.hackycorp.com
```

Setelah itu:

```bash
getent hosts www.hackycorp.com
```

Sistem dapat menggunakan pemetaan lokal tersebut sesuai konfigurasi name resolution.

### 9.3 curl --resolve

Mengatur pemetaan hostname dan IP hanya untuk koneksi `curl` yang sedang dijalankan.

Contoh:

```bash
curl -k -i \
    --resolve "www.hackycorp.com:443:51.158.147.132" \
    https://www.hackycorp.com/
```

Artinya:

- Hostname: `www.hackycorp.com`
- Port: `443`
- IP tujuan: `51.158.147.132`

`curl` akan menggunakan IP tersebut tanpa perlu mengandalkan hasil DNS untuk koneksi itu.

**Perbedaan utamanya:**

| Metode           | Cakupan                                  |
| ---------------- | ---------------------------------------- |
| DNS Resolution   | Menggunakan sistem DNS                   |
| `/etc/hosts`     | Pemetaan lokal pada sistem               |
| `curl --resolve` | Hanya untuk koneksi curl yang ditentukan |

`curl --resolve` tidak membuat DNS record dan tidak mengubah konfigurasi DNS domain.

---

## 10. DNS Resolution dalam Security Reconnaissance

Dalam security testing, DNS resolution berguna untuk mengetahui infrastruktur yang berhubungan dengan domain target.

Contohnya:

### Mengetahui IP Domain

```bash
dig +short hackycorp.com
```

### Mengetahui Subdomain

```bash
dig +short www.hackycorp.com
dig +short admin.hackycorp.com
dig +short dev.hackycorp.com
```

### Mengetahui Nameserver

```bash
dig hackycorp.com NS
```

### Mengetahui Mail Server

```bash
dig hackycorp.com MX
```

### Mengetahui DNS Records

```bash
dig hackycorp.com ANY
```

Catatan: Query `ANY` tidak menjamin semua record akan dikembalikan. Untuk pemeriksaan yang lebih akurat, query tipe record secara terpisah.

Informasi tersebut dapat membantu memahami:

- IP address yang digunakan domain.
- Nameserver yang melayani domain.
- Mail server yang digunakan.
- Subdomain yang ditemukan.
- Hubungan antara hostname dan server.

Lakukan reconnaissance hanya terhadap domain atau sistem yang memang diizinkan untuk diuji.

---

## 11. Kesimpulan

Hal-hal penting yang perlu dipahami:

1. DNS Resolution menerjemahkan hostname menjadi informasi DNS, seperti alamat IP.
2. Recursive Resolver mencari jawaban DNS untuk client.
3. Root DNS Server mengarahkan resolver ke TLD DNS Server.
4. TLD DNS Server mengarahkan resolver ke Authoritative DNS Server.
5. Authoritative DNS Server menyimpan dan memberikan DNS records resmi.
6. DNS Provider mengelola DNS records dan authoritative nameserver.
7. Domain Registrar mengelola pendaftaran domain dan nameserver delegation.
8. Hosting Provider menyediakan server tempat aplikasi berjalan.
9. `dig`, `nslookup`, dan `getent` dapat digunakan untuk melakukan pemeriksaan DNS.
10. `/etc/hosts` dan `curl --resolve` dapat digunakan untuk pemetaan hostname secara lokal tanpa mengubah DNS publik.
