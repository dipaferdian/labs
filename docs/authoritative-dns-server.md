# BIND9 — Authoritative DNS Server

## Posisi belajar saat ini

**Materi:** DNS (Domain Name System)  
**Topik:** Authoritative DNS Server menggunakan BIND9  
**OS:** Ubuntu 24.04  
**Domain:** `lab.test`  
**Status:** Selesai

## 1. Mengenal Authoritative DNS Server

Authoritative DNS Server adalah DNS Server yang memiliki informasi resmi mengenai DNS records dari suatu domain atau zone.

Contohnya, kita memiliki domain lokal:

```text
lab.test
```

Kemudian kita memiliki beberapa DNS records:

| Hostname       | IP Address   |
| -------------- | ------------ |
| lab.test       | 192.168.1.10 |
| ns1.lab.test   | 127.0.0.1    |
| www.lab.test   | 192.168.1.10 |
| api.lab.test   | 192.168.1.20 |
| admin.lab.test | 192.168.1.30 |

Ketika client meminta IP address dari `www.lab.test`, Authoritative DNS Server akan memberikan jawaban berdasarkan DNS records yang tersimpan di dalam zone file.

Berbeda dengan Recursive DNS Resolver, Authoritative DNS Server tidak bertugas mencari jawaban melalui Root DNS Server dan TLD DNS Server.

## 2. Mengenal BIND9

BIND (Berkeley Internet Name Domain) adalah software DNS Server yang dapat digunakan sebagai:

- Authoritative DNS Server.
- Recursive DNS Resolver.
- Caching DNS Server.
- Primary DNS Server.
- Secondary DNS Server.

Dalam lab ini, BIND digunakan sebagai **Primary Authoritative DNS Server**.

Artinya, BIND menyimpan dan mengelola DNS records untuk domain `lab.test`.

## 3. Instalasi BIND9

Install package yang diperlukan:

```bash
sudo apt update
sudo apt install bind9 bind9-utils dnsutils
```

Penjelasan package:

| Package       | Fungsi                                      |
| ------------- | ------------------------------------------- |
| `bind9`       | Menjalankan DNS Server                      |
| `bind9-utils` | Menyediakan utility untuk administrasi BIND |
| `dnsutils`    | Menyediakan tool seperti `dig`              |

### Memeriksa service

```bash
sudo systemctl status bind9
```

Melihat apakah BIND sedang listening pada port 53:

```bash
sudo ss -lnup | grep ':53'
```

Port `53` merupakan port standar DNS.

## 4. Mengenal Struktur Konfigurasi BIND

File konfigurasi BIND berada di:

```text
/etc/bind/
```

Beberapa file penting:

| File                       | Fungsi                   |
| -------------------------- | ------------------------ |
| `named.conf`               | Konfigurasi utama BIND   |
| `named.conf.options`       | Konfigurasi global       |
| `named.conf.local`         | Konfigurasi zone lokal   |
| `named.conf.default-zones` | Konfigurasi default zone |

Dalam lab ini, kita menggunakan dua file utama:

```text
/etc/bind/named.conf.local
/etc/bind/db.lab.test
```

File pertama digunakan untuk mendaftarkan zone.

File kedua digunakan untuk menyimpan DNS records dari zone tersebut.

## 5. Membuat Forward Zone

Forward Zone digunakan untuk menerjemahkan hostname menjadi IP address.

Contoh:

```text
www.lab.test → 192.168.1.10
```

Pertama, buka file:

```bash
sudo nano /etc/bind/named.conf.local
```

Tambahkan konfigurasi:

```conf
zone "lab.test" {
    type master;
    file "/etc/bind/db.lab.test";
};
```

Penjelasan:

| Konfigurasi       | Fungsi                                            |
| ----------------- | ------------------------------------------------- |
| `zone "lab.test"` | Menentukan nama domain atau zone                  |
| `type master`     | Menentukan BIND sebagai primary server untuk zone |
| `file`            | Menentukan lokasi zone file                       |

Setelah itu, buat zone file:

```bash
sudo nano /etc/bind/db.lab.test
```

Isi dengan konfigurasi berikut:

```dns
$TTL 3600

@   IN  SOA ns1.lab.test. admin.lab.test. (
        2026112501 ; Serial
        3600       ; Refresh
        1800       ; Retry
        604800     ; Expire
        86400      ; Negative Cache TTL
)

; Name Server
@       IN  NS  ns1.lab.test.

; A Records
ns1     IN  A   127.0.0.1
@       IN  A   192.168.1.10
www     IN  A   192.168.1.10
api     IN  A   192.168.1.20
admin   IN  A   192.168.1.30
```

## 6. Memahami DNS Records

### A Record

A Record digunakan untuk menghubungkan hostname dengan IPv4 address.

Contoh:

```dns
www IN A 192.168.1.10
```

Artinya:

```text
www.lab.test → 192.168.1.10
```

### NS Record

NS Record digunakan untuk menentukan nameserver yang authoritative untuk suatu zone.

Contoh:

```dns
@ IN NS ns1.lab.test.
```

Artinya, `ns1.lab.test` merupakan nameserver untuk zone `lab.test`.

### SOA Record

SOA (Start of Authority) adalah record yang menyimpan informasi utama mengenai suatu zone.

Contoh:

```dns
@ IN SOA ns1.lab.test. admin.lab.test. (
    2026112501
    3600
    1800
    604800
    86400
)
```

Penjelasan:

| Field              | Fungsi                                                   |
| ------------------ | -------------------------------------------------------- |
| `ns1.lab.test.`    | Primary nameserver untuk zone                            |
| `admin.lab.test.`  | Email administrator, ditulis dengan `.` menggantikan `@` |
| Serial             | Versi zone                                               |
| Refresh            | Interval secondary server memeriksa perubahan zone       |
| Retry              | Interval mencoba kembali jika pemeriksaan gagal          |
| Expire             | Batas waktu secondary menggunakan data zone lama         |
| Negative Cache TTL | Waktu caching untuk jawaban negatif                      |

### Memahami Serial Number

Serial digunakan untuk mengetahui versi terbaru dari zone.

Contoh:

```dns
2026112501
```

Format yang umum digunakan:

```text
YYYYMMDDNN
```

Setiap kali DNS records berubah, serial harus dinaikkan.

Contoh:

```text
2026112501
2026112502
2026112503
```

Secondary DNS Server menggunakan serial untuk mengetahui apakah zone perlu diperbarui.

## 7. Mengonfigurasi BIND sebagai Authoritative-Only

Jika BIND hanya ingin digunakan sebagai Authoritative DNS Server, nonaktifkan recursive resolution.

Buka:

```bash
sudo nano /etc/bind/named.conf.options
```

Di dalam blok `options`, tambahkan:

```conf
options {
    recursion no;
    allow-query { any; };
};
```

Catatan: Jika blok `options` sudah ada, tambahkan kedua directive tersebut ke blok yang sama. Jangan membuat blok `options` kedua.

Penjelasan:

- `recursion no`: BIND tidak melayani recursive DNS resolution.
- `allow-query { any; }`: Mengizinkan query DNS dari client mana pun yang dapat menjangkau server.

Untuk lab lokal, aturan akses dapat dibuat lebih ketat sesuai jaringan yang digunakan.

## 8. Validasi Konfigurasi

Sebelum melakukan restart, periksa konfigurasi terlebih dahulu.

### Memeriksa konfigurasi utama

```bash
sudo named-checkconf
```

Jika tidak ada output, berarti tidak ditemukan kesalahan konfigurasi.

### Memeriksa zone file

```bash
sudo named-checkzone lab.test /etc/bind/db.lab.test
```

Contoh hasil:

```text
zone lab.test/IN: loaded serial 2026112501
OK
```

Artinya zone file berhasil dibaca dan valid.

## 9. Menjalankan BIND9

Restart service:

```bash
sudo systemctl restart bind9
```

Periksa status:

```bash
sudo systemctl status bind9
```

Melihat log jika terjadi error:

```bash
sudo journalctl -u bind9 -n 50 --no-pager
```

## 10. Melakukan DNS Query Menggunakan dig

Sekarang kita dapat menguji DNS records yang sudah dibuat.

### Memeriksa A Record

```bash
dig @127.0.0.1 lab.test A
```

Memeriksa hostname lainnya:

```bash
dig @127.0.0.1 www.lab.test A
dig @127.0.0.1 api.lab.test A
dig @127.0.0.1 admin.lab.test A
```

### Memeriksa NS Record

```bash
dig @127.0.0.1 lab.test NS
```

### Memeriksa SOA Record

```bash
dig @127.0.0.1 lab.test SOA
```

### Menampilkan jawaban saja

```bash
dig @127.0.0.1 www.lab.test A +short
```

Contoh output:

```text
192.168.1.10
```

## 11. Memahami Flag AA

Ketika melakukan query terhadap Authoritative DNS Server, perhatikan flag pada DNS response.

Contoh:

```text
;; ->>HEADER<<- opcode: QUERY, status: NOERROR
;; flags: qr aa
```

Flag:

| Flag | Fungsi                   |
| ---- | ------------------------ |
| `qr` | Response dari DNS Server |
| `aa` | Authoritative Answer     |

Flag `aa` menunjukkan bahwa DNS Server memberikan jawaban authoritative untuk zone tersebut.

Untuk menguji bahwa BIND memberikan jawaban authoritative tanpa melakukan recursive resolution:

```bash
dig @127.0.0.1 lab.test SOA +norecurse
```

Perhatikan apakah response memiliki flag `aa`.

## 12. Memahami Alur DNS Query

Misalnya client ingin mendapatkan IP address dari:

```text
www.lab.test
```

Alur sederhananya:

```text
Client
  |
  | DNS Query: www.lab.test
  v
BIND Authoritative DNS Server
  |
  | Mencari record di zone lab.test
  |
  v
Zone File: /etc/bind/db.lab.test
  |
  | Menemukan A Record
  |
  v
192.168.1.10
  |
  v
DNS Response kepada Client
```

BIND tidak perlu menghubungi Root DNS Server atau TLD DNS Server untuk menjawab query tersebut karena BIND sudah memiliki data zone `lab.test`.

## 13. Hubungan BIND dengan Unbound

Dalam lab kita, BIND dan Unbound menjalankan fungsi berbeda.

| Software | Fungsi                   | Port |
| -------- | ------------------------ | ---- |
| BIND     | Authoritative DNS Server | 53   |
| Unbound  | Recursive DNS Resolver   | 5353 |

Jika Unbound ingin mendapatkan DNS records dari BIND, kita dapat menggunakan `forward-zone`.

Contoh konfigurasi pada Unbound:

```conf
forward-zone:
    name: "lab.test"
    forward-addr: 127.0.0.1@53
```

Alurnya:

```text
Client
  |
  v
Unbound Resolver
127.0.0.1:5353
  |
  | Query untuk lab.test
  v
BIND Authoritative DNS
127.0.0.1:53
  |
  v
Zone File: lab.test
  |
  v
DNS Response
  |
  v
Unbound
  |
  v
Client
```

Untuk menguji:

```bash
dig @127.0.0.1 -p 5353 www.lab.test A
```

Dengan konfigurasi tersebut, client dapat meminta DNS record lokal melalui Unbound, sedangkan BIND tetap menjadi sumber authoritative untuk zone `lab.test`.

## 14. Catatan Penting

### Perbedaan Forward Zone dan Reverse Zone

Forward Zone:

```text
Hostname → IP Address
```

Contoh:

```text
www.lab.test → 192.168.1.10
```

Reverse Zone:

```text
IP Address → Hostname
```

Contoh:

```text
192.168.1.10 → www.lab.test
```

Reverse Zone menggunakan PTR Record dan nama zone khusus seperti:

```text
1.168.192.in-addr.arpa
```

Reverse Zone merupakan konfigurasi tambahan dan tidak wajib untuk membuat Forward Zone berfungsi.

### Catatan mengenai IP Address ns1

Pada lab ini, `ns1.lab.test` menggunakan:

```text
127.0.0.1
```

Alamat tersebut hanya dapat dijangkau dari komputer itu sendiri melalui loopback.

Jika nameserver ingin diakses oleh komputer lain di jaringan, gunakan IP address jaringan server yang dapat dijangkau oleh client, bukan `127.0.0.1`.

---

## Detail Materi yang Sudah Dipelajari

- [x] Mengenal fungsi Authoritative DNS Server.
- [x] Mengenal BIND9.
- [x] Menginstal BIND9 pada Ubuntu.
- [x] Memahami struktur konfigurasi BIND.
- [x] Memahami fungsi `named.conf.local`.
- [x] Membuat Forward Zone.
- [x] Membuat dan mengelola zone file.
- [x] Memahami A Record.
- [x] Memahami NS Record.
- [x] Memahami SOA Record.
- [x] Memahami TTL.
- [x] Memahami Serial Number.
- [x] Mengonfigurasi BIND sebagai Authoritative-Only.
- [x] Memvalidasi konfigurasi menggunakan `named-checkconf`.
- [x] Memvalidasi zone file menggunakan `named-checkzone`.
- [x] Mengelola service menggunakan `systemctl`.
- [x] Memeriksa log menggunakan `journalctl`.
- [x] Melakukan DNS query menggunakan `dig`.
- [x] Memahami flag `aa`.
- [x] Memahami perbedaan Forward Zone dan Reverse Zone.
- [x] Memahami hubungan BIND dengan Unbound.

## Kesimpulan

BIND9 sebagai Authoritative DNS Server bertugas menyimpan dan memberikan DNS records untuk domain atau zone yang dikelolanya.

Zone file merupakan tempat penyimpanan DNS records seperti A, NS, dan SOA.

Ketika client meminta DNS record untuk domain yang dikelola BIND, BIND dapat langsung memberikan jawaban berdasarkan data zone yang dimilikinya.

Dalam lab ini, BIND bertindak sebagai Authoritative DNS Server untuk `lab.test`, sedangkan Unbound bertindak sebagai Recursive DNS Resolver.

## Referensi

- Ubuntu Server Documentation — Domain Name Service (DNS): https://ubuntu.com/server/docs/service-domain-name-service-dns/
- Ubuntu Server Documentation — DNSSEC: https://ubuntu.com/server/docs/how-to/networking/install-dnssec/
- Ubuntu Manpage — named-checkzone: https://manpages.ubuntu.com/manpages/noble/man1/named-checkzone.1.html
