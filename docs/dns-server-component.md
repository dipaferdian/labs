# DNS Server Components

## 1. Apa Itu DNS Server Components?

Dalam proses DNS Resolution, terdapat beberapa komponen yang berperan dalam mencari alamat IP berdasarkan hostname.

Komponen tersebut adalah:

1. Recursive DNS Resolver
2. Root DNS Server
3. TLD DNS Server
4. Authoritative DNS Server

Komponen-komponen ini merupakan **peran atau fungsi yang dijalankan oleh server dalam sistem DNS**.

Secara fisik, server dapat berupa komputer, server virtual, atau infrastruktur cloud.

Secara software, server menjalankan program yang menangani DNS query sesuai dengan perannya.

---

## 2. Recursive DNS Resolver

Recursive DNS Resolver adalah server yang menerima DNS query dari client dan bertanggung jawab mencari jawaban hingga ditemukan.

Contoh layanan Recursive DNS Resolver:

- Cloudflare DNS: `1.1.1.1`
- Google Public DNS: `8.8.8.8`
- Quad9: `9.9.9.9`

### Fungsi

- Menerima DNS query dari client.
- Memeriksa cache DNS.
- Melakukan pencarian DNS jika jawaban belum tersedia di cache.
- Menghubungi Root DNS Server.
- Menghubungi TLD DNS Server.
- Menghubungi Authoritative DNS Server.
- Mengembalikan jawaban kepada client.
- Menyimpan jawaban di cache berdasarkan TTL.

### Contoh Software

- Unbound
- BIND
- PowerDNS Recursor

### Contoh

Ketika client meminta:

```text
www.example.com
```

Recursive Resolver bertanggung jawab mencari alamat IP hostname tersebut.

---

## 3. Root DNS Server

Root DNS Server merupakan server DNS yang melayani root zone, yaitu bagian paling atas dalam hierarki DNS.

Root zone direpresentasikan oleh:

```text
.
```

### Struktur DNS

```text
.
└── com
    └── example
        └── www
```

### Fungsi

Root DNS Server memberikan informasi mengenai TLD DNS Server yang harus dihubungi oleh Recursive Resolver.

Root DNS Server tidak menyimpan alamat IP seluruh website.

### Contoh Proses

Recursive Resolver bertanya:

```text
Where can I find DNS servers for .com?
```

Root DNS Server memberikan referral menuju DNS Server yang bertanggung jawab atas `.com`.

### Root Server

Terdapat 13 identitas Root DNS Server:

```text
A
B
C
D
E
F
G
H
I
J
K
L
M
```

Namun, secara fisik terdapat banyak instance Root DNS Server yang tersebar di berbagai lokasi menggunakan teknologi Anycast.

---

## 4. TLD DNS Server

TLD (Top-Level Domain) DNS Server merupakan server DNS yang bertanggung jawab atas Top-Level Domain.

Contoh TLD:

```text
.com
.org
.net
.id
.dev
```

### Fungsi

TLD DNS Server memberikan informasi mengenai Authoritative DNS Server yang bertanggung jawab atas suatu domain.

### Contoh

Domain:

```text
www.example.com
```

Recursive Resolver sudah mendapatkan informasi mengenai TLD `.com` dari Root DNS Server.

Kemudian Recursive Resolver bertanya kepada TLD DNS Server:

```text
Which nameservers are responsible for example.com?
```

TLD DNS Server memberikan referral menuju nameserver domain tersebut.

Contoh ilustrasi:

```text
example.com

NS:
ns1.example-dns.net
ns2.example-dns.net
```

TLD DNS Server biasanya tidak memberikan IP address website secara langsung.

Tugas utamanya adalah memberikan informasi mengenai Authoritative DNS Server.

---

## 5. Authoritative DNS Server

Authoritative DNS Server merupakan server yang memiliki informasi DNS resmi untuk suatu domain atau DNS zone.

### Fungsi

- Menyimpan DNS records.
- Menjawab DNS query berdasarkan records yang dikonfigurasi.
- Memberikan informasi DNS resmi untuk domain yang dilayani.

### Contoh DNS Zone

Domain:

```text
example.com
```

DNS records:

```text
example.com       A       203.0.113.10
www.example.com   A       203.0.113.10
mail.example.com  A       203.0.113.20
example.com       MX      mail.example.com
example.com       TXT     "v=spf1 include:_spf.example.com ~all"
```

Ketika Recursive Resolver bertanya:

```text
What is the IP address of www.example.com?
```

Authoritative DNS Server memberikan jawaban berdasarkan DNS records yang tersedia.

### Contoh Software

- BIND
- PowerDNS Authoritative
- NSD
- Knot DNS

### Contoh DNS Provider

- Cloudflare DNS
- Amazon Route 53
- Google Cloud DNS

---

## 6. Apakah Semuanya Software yang Berbeda?

Tidak selalu.

Satu software DNS dapat menjalankan beberapa peran tergantung konfigurasi.

Contohnya BIND:

```text
BIND
|
+-- Recursive Resolver
|
+-- Authoritative DNS Server
```

Namun, dalam infrastruktur production, peran-peran tersebut biasanya dipisahkan untuk alasan:

- Security
- Performance
- Scalability
- Infrastructure management

### Contoh Infrastruktur

```text
Server A
└── Recursive DNS Resolver
    └── Melayani DNS query dari client

Server B
└── Authoritative DNS Server
    └── Melayani DNS query untuk example.com
```

Root dan TLD DNS Server juga menjalankan software DNS yang berfungsi sebagai authoritative server untuk zone masing-masing.

---

## 7. Perbedaan DNS Provider dan DNS Resolver

DNS Provider dan DNS Resolver memiliki fungsi yang berbeda.

### DNS Provider

DNS Provider menyediakan layanan untuk mengelola DNS zone dan authoritative DNS records.

Contoh:

```text
Cloudflare DNS
Amazon Route 53
Google Cloud DNS
```

Ketika kita menggunakan Cloudflare sebagai DNS Provider, Cloudflare menyimpan DNS records domain kita dan menjawab query DNS yang ditujukan kepada authoritative nameserver mereka.

### DNS Resolver

DNS Resolver bertugas mencari jawaban DNS untuk client.

Contoh:

```text
1.1.1.1
8.8.8.8
9.9.9.9
```

Resolver dapat menghubungi berbagai DNS Server untuk mencari jawaban.

### Perbandingan

| Komponen                 | Fungsi                                           |
| ------------------------ | ------------------------------------------------ |
| DNS Provider             | Menyimpan dan melayani DNS records resmi         |
| Recursive DNS Resolver   | Mencari jawaban DNS untuk client                 |
| Root DNS Server          | Mengarahkan resolver ke TLD                      |
| TLD DNS Server           | Mengarahkan resolver ke authoritative nameserver |
| Authoritative DNS Server | Memberikan jawaban DNS resmi                     |

Cloudflare dapat menyediakan Recursive Resolver dan Authoritative DNS, tetapi keduanya merupakan layanan yang berbeda.

---

## 8. Hubungan Domain Registrar, DNS Provider, dan DNS Server

Misalnya kita membeli domain:

```text
mywebsite.com
```

di DomaiNesia, kemudian menggunakan Cloudflare sebagai DNS Provider.

### Domain Registrar

```text
DomaiNesia
```

Bertanggung jawab atas:

- Registrasi domain.
- Pengelolaan domain.
- Pengaturan nameserver delegation.

### DNS Provider

```text
Cloudflare
```

Bertanggung jawab atas:

- DNS zone.
- DNS records.
- Authoritative nameserver.

### Recursive DNS Resolver

```text
Cloudflare DNS: 1.1.1.1
```

Bertanggung jawab atas:

- Mencari DNS records.
- Melakukan caching.
- Mengembalikan jawaban kepada client.

### Gambaran Infrastruktur

```text
Domain Registrar
└── DomaiNesia
    └── Mengatur nameserver delegation
            |
            v
Authoritative DNS Provider
└── Cloudflare
    └── Menyimpan DNS records
            |
            v
Recursive DNS Resolver
└── ISP / Cloudflare / Google
    └── Mencari jawaban DNS untuk client
```

---

## 9. DNS Resolution Flow

Ketika client ingin mencari IP address:

```text
www.example.com
```

Prosesnya:

```text
Client
  |
  | DNS Query
  v
Recursive DNS Resolver
  |
  | Check Cache
  |
  | Cache Miss
  v
Root DNS Server
  |
  | Referral to .com
  v
TLD DNS Server (.com)
  |
  | Referral to example.com Nameservers
  v
Authoritative DNS Server
  |
  | Return DNS Record
  v
Recursive DNS Resolver
  |
  | Return IP Address
  v
Client
```

Hasil:

```text
www.example.com → 203.0.113.10
```

Client kemudian dapat menggunakan IP tersebut untuk membuat koneksi ke server.

---

## 10. Kesimpulan

1. DNS Server Components merupakan peran atau fungsi dalam sistem DNS.
2. Server dapat berupa komputer fisik, virtual machine, atau infrastruktur cloud.
3. Software DNS menjalankan fungsi sesuai konfigurasi.
4. Recursive DNS Resolver mencari jawaban DNS untuk client.
5. Root DNS Server mengarahkan resolver ke TLD.
6. TLD DNS Server mengarahkan resolver ke Authoritative DNS Server.
7. Authoritative DNS Server memberikan DNS records resmi.
8. DNS Provider menyediakan layanan authoritative DNS.
9. DNS Resolver dan DNS Provider memiliki fungsi berbeda.
10. Satu software DNS dapat menjalankan beberapa peran sekaligus.
