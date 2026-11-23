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

Client
