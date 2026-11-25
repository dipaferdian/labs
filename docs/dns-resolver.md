# Unbound — Recursive DNS Resolver & DNSSEC

## Posisi belajar saat ini

**Materi:** DNS (Domain Name System)  
**Topik:** Recursive DNS Resolver, Unbound, DNSSEC, dan Root Trust Anchor  
**Status:** Selesai

## 1. Mengenal Unbound

Unbound adalah DNS Resolver yang bertugas menerjemahkan hostname menjadi IP address.

Contoh:

```text
google.com → 142.250.x.x
```

Ketika aplikasi meminta IP address dari `google.com`, Unbound akan melakukan proses DNS resolution.

Unbound dapat menggunakan cache untuk menyimpan hasil DNS query sebelumnya.

Jika hasilnya tersedia di cache dan belum kedaluwarsa, Unbound dapat langsung mengembalikan hasil tersebut tanpa melakukan recursive lookup kembali.

## 2. Proses Recursive DNS Resolution

Jika hostname tidak ditemukan di cache, Unbound akan melakukan recursive DNS resolution.

Urutan prosesnya:

```text
Client
  |
  v
Unbound Resolver
  |
  |-- Check Cache
  |
  |-- Root DNS Server
  |      |
  |      v
  |   TLD DNS Server
  |      |
  |      v
  |   Authoritative DNS Server
  |      |
  |      v
  |   DNS Record
  |
  v
Return IP Address to Client
```

Penjelasan:

1. Client mengirim DNS query kepada Unbound.
2. Unbound memeriksa cache.
3. Jika tidak ditemukan, Unbound menghubungi Root DNS Server.
4. Root DNS Server memberikan informasi mengenai TLD DNS Server.
5. Unbound menghubungi TLD DNS Server.
6. TLD DNS Server memberikan informasi mengenai Authoritative DNS Server.
7. Unbound menghubungi Authoritative DNS Server untuk mendapatkan DNS record.
8. Unbound mengembalikan hasil kepada client dan menyimpannya dalam cache sesuai TTL.

## 3. Perbedaan BIND dan Unbound

Dalam konfigurasi lokal, kita menggunakan dua software DNS dengan fungsi berbeda.

| Software | Fungsi                   |
| -------- | ------------------------ |
| BIND     | Authoritative DNS Server |
| Unbound  | Recursive DNS Resolver   |

**BIND sebagai Authoritative DNS Server**

BIND bertugas menyimpan dan memberikan DNS record untuk domain atau zone yang dikelolanya.

Contohnya:

```text
example.test → 192.168.1.10
```

**Unbound sebagai Recursive DNS Resolver**

Unbound bertugas mencari DNS record dari berbagai DNS Server hingga mendapatkan jawaban yang dibutuhkan client.

Keduanya dapat berjalan pada satu komputer, tetapi menggunakan port yang berbeda.

## 4. Konfigurasi Unbound pada Local Machine

Pada konfigurasi ini, Unbound menggunakan:

- IP address: `127.0.0.1`
- Port: `5353`

File konfigurasi:

```text
/etc/unbound/unbound.conf.d/local-resolver.conf
```

Konfigurasi:

```conf
server:
    interface: 127.0.0.1
    port: 5353
    access-control: 127.0.0.0/8 allow
```

Penjelasan:

| Konfigurasi      | Fungsi                                             |
| ---------------- | -------------------------------------------------- |
| `interface`      | Menentukan alamat IP tempat Unbound menerima query |
| `port`           | Menentukan port yang digunakan Unbound             |
| `access-control` | Menentukan client yang diizinkan mengakses Unbound |

Port `5353` digunakan agar tidak berbenturan dengan BIND yang menggunakan port `53`.

### Memeriksa konfigurasi

```bash
sudo unbound-checkconf
```

### Restart Unbound

```bash
sudo systemctl restart unbound
```

### Memeriksa status service

```bash
sudo systemctl status unbound
```

### Memeriksa listening port

```bash
ss -lnup | grep ':5353'
```

## 5. Melakukan DNS Query ke Unbound

Untuk mengirim query secara langsung ke Unbound:

```bash
dig @127.0.0.1 -p 5353 google.com A
```

Penjelasan:

| Parameter    | Fungsi                         |
| ------------ | ------------------------------ |
| `dig`        | Tool untuk melakukan DNS query |
| `@127.0.0.1` | Menentukan DNS Server tujuan   |
| `-p 5353`    | Menentukan port DNS Server     |
| `google.com` | Domain yang ingin dicari       |
| `A`          | Meminta IPv4 address           |

Perlu diingat bahwa `127.0.0.1` hanya menunjukkan alamat loopback. Software DNS yang menerima query ditentukan oleh port dan proses yang sedang listening.

## 6. Menghubungkan Unbound dengan BIND

Karena BIND dan Unbound memiliki fungsi berbeda, Unbound dapat diarahkan ke BIND untuk melakukan query terhadap local zone.

Contoh konfigurasi pada Unbound:

```conf
forward-zone:
    name: "lab.test"
    forward-addr: 127.0.0.1@53
```

Penjelasan:

- `name`: Domain yang akan diteruskan ke BIND.
- `forward-addr`: Alamat dan port BIND yang menerima query.

Dengan konfigurasi tersebut:

```text
Client
  |
  v
Unbound (127.0.0.1:5353)
  |
  v
BIND (127.0.0.1:53)
  |
  v
Local DNS Record
```

Untuk domain publik seperti `google.com`, Unbound tetap melakukan recursive resolution.

## 7. Mengenal DNSSEC

DNSSEC (Domain Name System Security Extensions) adalah mekanisme keamanan DNS yang digunakan untuk memvalidasi keaslian dan integritas data DNS.

DNSSEC membantu memastikan bahwa DNS response berasal dari sumber yang dapat dipercaya dan tidak dimodifikasi.

DNSSEC menggunakan mekanisme digital signature dan public key cryptography.

Beberapa record yang digunakan:

| Record       | Fungsi                                        |
| ------------ | --------------------------------------------- |
| DNSKEY       | Menyimpan public key                          |
| DS           | Menghubungkan trust chain antar-zone          |
| RRSIG        | Menyimpan digital signature DNS record        |
| NSEC / NSEC3 | Membuktikan bahwa suatu record tidak tersedia |

### Perbedaan DNS dan DNSSEC

DNS biasa memberikan jawaban DNS kepada client.

DNSSEC menambahkan proses validasi terhadap jawaban tersebut.

Dengan demikian, resolver dapat memeriksa apakah data DNS yang diterima memiliki signature yang valid.

## 8. Mengenal Trust Anchor

Trust Anchor adalah titik awal kepercayaan yang digunakan resolver untuk memvalidasi DNSSEC.

Dalam DNSSEC, proses validasi dimulai dari Root DNS Zone (`.`).

Unbound membutuhkan Root Trust Anchor agar dapat memvalidasi DNSSEC dari root hingga domain tujuan.

Pada Unbound, konfigurasi trust anchor dapat menggunakan:

```conf
server:
    auto-trust-anchor-file: "/var/lib/unbound/root.key"
```

File tersebut menyimpan informasi trust anchor yang digunakan Unbound.

## 9. Masalah DNSSEC yang Ditemukan

Ketika melakukan query:

```bash
dig @127.0.0.1 -p 5353 google.com A
```

Unbound mengembalikan:

```text
status: SERVFAIL
```

Namun, ketika DNSSEC checking dinonaktifkan untuk query tersebut menggunakan `+cdflag`:

```bash
dig @127.0.0.1 -p 5353 google.com A +cdflag
```

Hasilnya:

```text
status: NOERROR
```

Artinya, Unbound sebenarnya dapat memperoleh DNS response, tetapi mengalami masalah ketika melakukan validasi DNSSEC.

### Memeriksa Root DNSKEY

Query melalui Cloudflare:

```bash
dig @1.1.1.1 . DNSKEY +dnssec
```

Hasilnya menunjukkan beberapa DNSKEY, termasuk:

```text
Key Tag: 20326
Key Tag: 38696
```

Sedangkan file lokal:

```bash
sudo cat /var/lib/unbound/root.key
```

hanya memiliki KSK-2017 dengan key tag:

```text
20326
```

### Penyebab masalah

Terjadi pergantian Root Key Signing Key (KSK).

| KSK      | Key Tag | Keterangan |
| -------- | ------: | ---------- |
| KSK-2017 |   20326 | Kunci lama |
| KSK-2024 |   38696 | Kunci baru |

Pada 11 Oktober 2026, KSK-2024 mulai digunakan untuk menandatangani Root DNSKEY RRset.

Karena Unbound masih menggunakan trust anchor lama saja, Unbound tidak dapat memvalidasi signature baru tersebut.

KSK-2017 belum langsung dihapus dari trust anchor. Namun, resolver harus sudah mempercayai KSK-2024 agar validasi DNSSEC tetap berjalan.

## 10. Memperbarui Root Trust Anchor

Untuk memperbarui trust anchor, kita menggunakan utility `unbound-anchor`.

### Memeriksa utility

```bash
command -v unbound-anchor
```

Jika tidak ditemukan, berarti utility tersebut belum tersedia pada sistem.

Pada Ubuntu, periksa paket yang menyediakan utility tersebut:

```bash
apt-cache search unbound-anchor
```

Setelah memasang paket yang sesuai, periksa kembali:

```bash
command -v unbound-anchor
```

### Memperbarui trust anchor

```bash
sudo -u unbound unbound-anchor -a /var/lib/unbound/root.key
```

Penjelasan:

- `sudo -u unbound`: Menjalankan command sebagai user `unbound`.
- `unbound-anchor`: Utility untuk menginisialisasi atau memperbarui root trust anchor.
- `-a`: Menentukan lokasi file trust anchor.
- `/var/lib/unbound/root.key`: Lokasi file trust anchor.

Utility ini dapat menggunakan mekanisme pembaruan trust anchor otomatis dan sumber trust anchor resmi.

### Memeriksa hasil pembaruan

```bash
sudo cat /var/lib/unbound/root.key
```

Pastikan KSK-2024 dengan key tag `38696` sudah tersedia.

### Restart Unbound

```bash
sudo systemctl restart unbound
```

## 11. Verifikasi DNSSEC

Setelah trust anchor diperbarui, lakukan query:

```bash
dig @127.0.0.1 -p 5353 google.com A
```

Periksa hasilnya.

Contoh bagian header:

```text
;; ->>HEADER<<- opcode: QUERY, status: NOERROR
;; flags: qr rd ra ad
```

Penjelasan flag:

| Flag | Fungsi                                            |
| ---- | ------------------------------------------------- |
| `qr` | Pesan merupakan DNS response                      |
| `rd` | Client meminta recursive resolution               |
| `ra` | Server mendukung recursive query                  |
| `ad` | Data telah divalidasi secara DNSSEC oleh resolver |

Jika mendapatkan `NOERROR`, jawaban DNS berhasil diperoleh.

Jika mendapatkan flag `ad`, artinya jawaban tersebut telah berhasil divalidasi DNSSEC.

## 12. Catatan Penting

Jangan menggunakan:

```bash
dig @127.0.0.1 -p 5353 google.com A +cdflag
```

sebagai solusi permanen.

`+cdflag` hanya meminta resolver untuk tidak melakukan pemeriksaan DNSSEC pada query tersebut. Ini berguna untuk diagnosis, tetapi bukan cara memperbaiki trust anchor.

Solusi yang benar adalah memperbaiki konfigurasi dan memperbarui Root Trust Anchor.

---

## Detail Materi yang Sudah Dipelajari

- [x] Mengenal fungsi Unbound sebagai Recursive DNS Resolver.
- [x] Memahami fungsi cache pada DNS Resolver.
- [x] Memahami proses Root DNS → TLD DNS → Authoritative DNS.
- [x] Memahami perbedaan BIND dan Unbound.
- [x] Menjalankan BIND dan Unbound pada satu mesin menggunakan port berbeda.
- [x] Mengonfigurasi interface dan port Unbound.
- [x] Menggunakan `unbound-checkconf`.
- [x] Memeriksa service menggunakan `systemctl`.
- [x] Memeriksa listening port menggunakan `ss`.
- [x] Melakukan DNS query menggunakan `dig`.
- [x] Memahami forwarding query dari Unbound ke BIND.
- [x] Mengenal DNSSEC.
- [x] Mengenal DNSKEY, DS, RRSIG, dan Root Trust Anchor.
- [x] Memahami fungsi KSK.
- [x] Memahami masalah perubahan Root KSK 2017 ke KSK 2024.
- [x] Mendiagnosis `SERVFAIL` akibat kegagalan validasi DNSSEC.
- [x] Memahami fungsi `+cdflag` untuk diagnosis.
- [x] Memahami fungsi `unbound-anchor`.
- [x] Memperbarui Root Trust Anchor.
- [x] Memverifikasi DNSSEC menggunakan flag `ad`.

## Kesimpulan

Unbound bertugas melakukan recursive DNS resolution, sedangkan BIND dapat bertugas sebagai Authoritative DNS Server.

DNSSEC memberikan mekanisme validasi terhadap jawaban DNS menggunakan digital signature dan public key.

Agar Unbound dapat memvalidasi DNSSEC, Unbound membutuhkan Root Trust Anchor yang sesuai dan selalu diperbarui.

Masalah `SERVFAIL` yang ditemukan bukan karena Unbound tidak bisa melakukan recursive lookup, melainkan karena trust anchor lokal belum memiliki KSK-2024 yang dibutuhkan untuk memvalidasi Root DNSKEY RRset.
