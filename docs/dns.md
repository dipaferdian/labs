# DNS --- Complete Notes

> Gabungan catatan pembelajaran DNS: konsep, mental model, resolver,
> authoritative server, BIND9, Unbound, DNSSEC, systemd-resolved, zone,
> SOA/NS, dan AXFR.

## Daftar Isi

1.  Mental Model DNS --- Mulai dari Konsep
2.  Komponen dalam Sistem DNS
3.  DNS Resolution dan DNS Records
4.  DNS Resolver di Linux --- systemd-resolved
5.  Recursive Resolver --- Unbound dan DNSSEC
6.  Authoritative DNS Server --- BIND9
7.  DNS Zone, SOA, NS, dan Zone Transfer (AXFR)

------------------------------------------------------------------------

## Cara Menggunakan Catatan Ini

Urutan belajar utama:

``` text
Konsep DNS
    ↓
Mental Model
    ↓
DNS Components
    ↓
DNS Resolution
    ↓
OS Resolver / systemd-resolved
    ↓
Recursive Resolver / Unbound
    ↓
Authoritative DNS / BIND
    ↓
DNS Zone / SOA / NS
    ↓
AXFR / DNSSEC
```

Prinsipnya: pahami **peran dan aliran data terlebih dahulu**, kemudian
gunakan command sebagai alat untuk mengamati dan memverifikasi konsep
tersebut.

------------------------------------------------------------------------

# Part 1 --- Mental Model DNS --- Mulai dari Konsep

### 1. Konsep Universal

Mental model utama DNS:

``` text
Application / Browser
        ↓
OS Name Resolution
        ↓
DNS Resolver
        ↓
DNS Query
        ↓
DNS Server
        ↓
DNS Response
        ↓
IP Address
        ↓
Application / Browser
```

Konsep ini berlaku secara umum di berbagai sistem operasi.

Yang berbeda adalah **implementasi** di masing-masing OS.

------------------------------------------------------------------------

## 2. Linux dengan systemd-resolved

Pada Linux yang menggunakan `systemd-resolved`:

``` text
Application
    ↓
OS Name Resolution
    ↓
systemd-resolved
    ↓
Cache
    ↓
Configured DNS Server
    ↓
DNS Response
    ↓
IP Address
```

Contoh:

``` text
Browser
   ↓
google.com
   ↓
systemd-resolved
   ↓
cache miss
   ↓
8.8.8.8:53
   ↓
142.250.x.x
   ↓
Browser
```

`systemd-resolved` adalah **implementasi Linux tertentu**, bukan bagian
wajib dari DNS.

------------------------------------------------------------------------

## 3. Sistem Operasi Lain

Sistem operasi lain memiliki komponen DNS resolver masing-masing.

Mental modelnya tetap:

``` text
Application
    ↓
OS DNS Mechanism
    ↓
Configured DNS Resolver
    ↓
DNS Server
```

Yang berubah hanya bagian:

``` text
OS DNS Mechanism
```

Contohnya secara konseptual:

``` text
Linux
Application
    ↓
systemd-resolved
    ↓
DNS Server
```

``` text
Windows
Application
    ↓
Windows DNS Client / Resolver
    ↓
DNS Server
```

``` text
macOS
Application
    ↓
macOS Resolver
    ↓
DNS Server
```

Jadi jangan menghafal:

``` text
DNS = systemd-resolved
```

Tetapi pahami:

``` text
DNS Resolution
      ↓
memiliki implementasi berbeda
      ↓
tergantung Operating System
```

------------------------------------------------------------------------

## 4. dig google.com

Command:

``` bash
dig google.com
```

Mental model:

``` text
dig
 ↓
Resolver configuration
 ↓
Configured nameserver
 ↓
DNS Query
 ↓
DNS Response
```

Pada Ubuntu dengan stub `systemd-resolved`, misalnya:

``` text
/etc/resolv.conf

nameserver 127.0.0.53
```

maka:

``` text
dig google.com
      ↓
/etc/resolv.conf
      ↓
127.0.0.53:53
      ↓
systemd-resolved
      ↓
Upstream DNS
```

------------------------------------------------------------------------

## 5. dig @8.8.8.8 google.com

Jika DNS server ditentukan secara eksplisit:

``` bash
dig @8.8.8.8 google.com
```

mental model berubah menjadi:

``` text
dig
 ↓
8.8.8.8:53
 ↓
DNS Query
 ↓
DNS Response
```

Nameserver default dari konfigurasi resolver tidak digunakan untuk query
tersebut.

Perbandingan:

``` text
dig google.com

dig
 ↓
Resolver Configuration
 ↓
Default DNS Server
```

vs:

``` text
dig @8.8.8.8 google.com

dig
 ↓
8.8.8.8:53
```

------------------------------------------------------------------------

## 6. Browser Menggunakan System DNS

Jika browser menggunakan resolver sistem operasi:

``` text
Browser
   ↓
OS Name Resolution
   ↓
OS DNS Resolver
   ↓
DNS Server
   ↓
IP Address
   ↓
Browser
```

Pada Linux dengan `systemd-resolved`:

``` text
Browser
   ↓
OS Name Resolution
   ↓
systemd-resolved
   ↓
DNS Server
   ↓
IP Address
```

Setelah mendapatkan IP:

``` text
Browser
   ↓
IP Address:443
   ↓
Connection
   ↓
TLS
   ↓
HTTP
```

------------------------------------------------------------------------

## 7. Browser Menggunakan DNS over HTTPS

Jika browser melakukan DNS over HTTPS (DoH) sendiri:

``` text
Browser
   ↓
DNS Query
   ↓
HTTPS :443
   ↓
DoH Resolver
   ↓
DNS Response
   ↓
IP Address
```

Untuk query yang ditangani DoH tersebut, browser dapat melewati resolver
DNS normal milik OS.

Perbandingan:

``` text
System DNS

Browser
   ↓
OS Resolver
   ↓
DNS Server :53
```

vs:

``` text
Browser DoH

Browser
   ↓
HTTPS
   ↓
DoH Resolver :443
```

------------------------------------------------------------------------

## 8. Mental Model Request Website

Tanpa DoH:

``` text
Browser
   ↓
Hostname
   ↓
OS DNS Resolution
   ↓
DNS Resolver
   ↓
DNS Server
   ↓
IP Address
   ↓
Connection ke IP
   ↓
TCP / QUIC
   ↓
TLS
   ↓
HTTP Request
   ↓
HTTP Response
```

Dengan DoH:

``` text
Browser
   ↓
Hostname
   ↓
DoH Resolver
   ↓
HTTPS :443
   ↓
IP Address
   ↓
Connection ke IP
   ↓
TCP / QUIC
   ↓
TLS
   ↓
HTTP Request
   ↓
HTTP Response
```

------------------------------------------------------------------------

## 9. Mental Model yang Harus Diingat

Jangan terlalu terikat pada nama software seperti:

``` text
systemd-resolved
BIND
Unbound
```

Mulai dari konsep:

``` text
WHO?
Application

WHAT?
Butuh IP dari hostname

WHO HANDLES IT?
Resolver

WHERE DOES IT ASK?
DNS Server

WHAT COMES BACK?
DNS Record / IP Address
```

Sehingga mental model dasarnya:

``` text
Application
    ↓
Resolver
    ↓
DNS Server
    ↓
DNS Response
    ↓
Application
```

Kemudian baru masukkan implementasinya.

Contoh Linux:

``` text
Browser
    ↓
systemd-resolved
    ↓
8.8.8.8
```

Contoh resolver lokal:

``` text
Application
    ↓
systemd-resolved
    ↓
Unbound
    ↓
DNS Infrastructure
```

Contoh browser DoH:

``` text
Browser
    ↓
DoH
    ↓
DoH Provider
```

### Prinsip Utama

> Pelajari **konsep dan aliran datanya terlebih dahulu**, kemudian lihat
> software atau komponen apa yang mengimplementasikan setiap bagian.

Dengan begitu, ketika berpindah dari Linux ke Windows, macOS, container,
server, atau cloud, nama komponennya dapat berubah tetapi mental model
dasarnya tetap dapat digunakan.

------------------------------------------------------------------------

# Part 2 --- Komponen dalam Sistem DNS

### 1. Apa Itu DNS Server Components?

Dalam proses DNS Resolution, terdapat beberapa komponen yang berperan
dalam mencari alamat IP berdasarkan hostname.

Komponen tersebut adalah:

1.  Recursive DNS Resolver
2.  Root DNS Server
3.  TLD DNS Server
4.  Authoritative DNS Server

Komponen-komponen ini merupakan **peran atau fungsi yang dijalankan oleh
server dalam sistem DNS**.

Secara fisik, server dapat berupa komputer, server virtual, atau
infrastruktur cloud.

Secara software, server menjalankan program yang menangani DNS query
sesuai dengan perannya.

------------------------------------------------------------------------

### 2. Recursive DNS Resolver

Recursive DNS Resolver adalah server yang menerima DNS query dari client
dan bertanggung jawab mencari jawaban hingga ditemukan.

Contoh layanan Recursive DNS Resolver:

-   Cloudflare DNS: `1.1.1.1`
-   Google Public DNS: `8.8.8.8`
-   Quad9: `9.9.9.9`

#### Fungsi

-   Menerima DNS query dari client.
-   Memeriksa cache DNS.
-   Melakukan pencarian DNS jika jawaban belum tersedia di cache.
-   Menghubungi Root DNS Server.
-   Menghubungi TLD DNS Server.
-   Menghubungi Authoritative DNS Server.
-   Mengembalikan jawaban kepada client.
-   Menyimpan jawaban di cache berdasarkan TTL.

#### Contoh Software

-   Unbound
-   BIND
-   PowerDNS Recursor

#### Contoh

Ketika client meminta:

``` text
www.example.com
```

Recursive Resolver bertanggung jawab mencari alamat IP hostname
tersebut.

------------------------------------------------------------------------

### 3. Root DNS Server

Root DNS Server merupakan server DNS yang melayani root zone, yaitu
bagian paling atas dalam hierarki DNS.

Root zone direpresentasikan oleh:

``` text
.
```

#### Struktur DNS

``` text
.
└── com
    └── example
        └── www
```

#### Fungsi

Root DNS Server memberikan informasi mengenai TLD DNS Server yang harus
dihubungi oleh Recursive Resolver.

Root DNS Server tidak menyimpan alamat IP seluruh website.

#### Contoh Proses

Recursive Resolver bertanya:

``` text
Where can I find DNS servers for .com?
```

Root DNS Server memberikan referral menuju DNS Server yang bertanggung
jawab atas `.com`.

#### Root Server

Terdapat 13 identitas Root DNS Server:

``` text
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

Namun, secara fisik terdapat banyak instance Root DNS Server yang
tersebar di berbagai lokasi menggunakan teknologi Anycast.

------------------------------------------------------------------------

### 4. TLD DNS Server

TLD (Top-Level Domain) DNS Server merupakan server DNS yang bertanggung
jawab atas Top-Level Domain.

Contoh TLD:

``` text
.com
.org
.net
.id
.dev
```

#### Fungsi

TLD DNS Server memberikan informasi mengenai Authoritative DNS Server
yang bertanggung jawab atas suatu domain.

#### Contoh

Domain:

``` text
www.example.com
```

Recursive Resolver sudah mendapatkan informasi mengenai TLD `.com` dari
Root DNS Server.

Kemudian Recursive Resolver bertanya kepada TLD DNS Server:

``` text
Which nameservers are responsible for example.com?
```

TLD DNS Server memberikan referral menuju nameserver domain tersebut.

Contoh ilustrasi:

``` text
example.com

NS:
ns1.example-dns.net
ns2.example-dns.net
```

TLD DNS Server biasanya tidak memberikan IP address website secara
langsung.

Tugas utamanya adalah memberikan informasi mengenai Authoritative DNS
Server.

------------------------------------------------------------------------

### 5. Authoritative DNS Server

Authoritative DNS Server merupakan server yang memiliki informasi DNS
resmi untuk suatu domain atau DNS zone.

#### Fungsi

-   Menyimpan DNS records.
-   Menjawab DNS query berdasarkan records yang dikonfigurasi.
-   Memberikan informasi DNS resmi untuk domain yang dilayani.

#### Contoh DNS Zone

Domain:

``` text
example.com
```

DNS records:

``` text
example.com       A       203.0.113.10
www.example.com   A       203.0.113.10
mail.example.com  A       203.0.113.20
example.com       MX      mail.example.com
example.com       TXT     "v=spf1 include:_spf.example.com ~all"
```

Ketika Recursive Resolver bertanya:

``` text
What is the IP address of www.example.com?
```

Authoritative DNS Server memberikan jawaban berdasarkan DNS records yang
tersedia.

#### Contoh Software

-   BIND
-   PowerDNS Authoritative
-   NSD
-   Knot DNS

#### Contoh DNS Provider

-   Cloudflare DNS
-   Amazon Route 53
-   Google Cloud DNS

------------------------------------------------------------------------

### 6. Apakah Semuanya Software yang Berbeda?

Tidak selalu.

Satu software DNS dapat menjalankan beberapa peran tergantung
konfigurasi.

Contohnya BIND:

``` text
BIND
|
+-- Recursive Resolver
|
+-- Authoritative DNS Server
```

Namun, dalam infrastruktur production, peran-peran tersebut biasanya
dipisahkan untuk alasan:

-   Security
-   Performance
-   Scalability
-   Infrastructure management

#### Contoh Infrastruktur

``` text
Server A
└── Recursive DNS Resolver
    └── Melayani DNS query dari client

Server B
└── Authoritative DNS Server
    └── Melayani DNS query untuk example.com
```

Root dan TLD DNS Server juga menjalankan software DNS yang berfungsi
sebagai authoritative server untuk zone masing-masing.

------------------------------------------------------------------------

### 7. Perbedaan DNS Provider dan DNS Resolver

DNS Provider dan DNS Resolver memiliki fungsi yang berbeda.

#### DNS Provider

DNS Provider menyediakan layanan untuk mengelola DNS zone dan
authoritative DNS records.

Contoh:

``` text
Cloudflare DNS
Amazon Route 53
Google Cloud DNS
```

Ketika kita menggunakan Cloudflare sebagai DNS Provider, Cloudflare
menyimpan DNS records domain kita dan menjawab query DNS yang ditujukan
kepada authoritative nameserver mereka.

#### DNS Resolver

DNS Resolver bertugas mencari jawaban DNS untuk client.

Contoh:

``` text
1.1.1.1
8.8.8.8
9.9.9.9
```

Resolver dapat menghubungi berbagai DNS Server untuk mencari jawaban.

#### Perbandingan

  -----------------------------------------------------------------------
  Komponen                Fungsi
  ----------------------- -----------------------------------------------
  DNS Provider            Menyimpan dan melayani DNS records resmi

  Recursive DNS Resolver  Mencari jawaban DNS untuk client

  Root DNS Server         Mengarahkan resolver ke TLD

  TLD DNS Server          Mengarahkan resolver ke authoritative
                          nameserver

  Authoritative DNS       Memberikan jawaban DNS resmi
  Server                  
  -----------------------------------------------------------------------

Cloudflare dapat menyediakan Recursive Resolver dan Authoritative DNS,
tetapi keduanya merupakan layanan yang berbeda.

------------------------------------------------------------------------

### 8. Hubungan Domain Registrar, DNS Provider, dan DNS Server

Misalnya kita membeli domain:

``` text
mywebsite.com
```

di DomaiNesia, kemudian menggunakan Cloudflare sebagai DNS Provider.

#### Domain Registrar

``` text
DomaiNesia
```

Bertanggung jawab atas:

-   Registrasi domain.
-   Pengelolaan domain.
-   Pengaturan nameserver delegation.

#### DNS Provider

``` text
Cloudflare
```

Bertanggung jawab atas:

-   DNS zone.
-   DNS records.
-   Authoritative nameserver.

#### Recursive DNS Resolver

``` text
Cloudflare DNS: 1.1.1.1
```

Bertanggung jawab atas:

-   Mencari DNS records.
-   Melakukan caching.
-   Mengembalikan jawaban kepada client.

#### Gambaran Infrastruktur

``` text
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

------------------------------------------------------------------------

### 9. DNS Resolution Flow

Ketika client ingin mencari IP address:

``` text
www.example.com
```

Prosesnya:

``` text
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

``` text
www.example.com → 203.0.113.10
```

Client kemudian dapat menggunakan IP tersebut untuk membuat koneksi ke
server.

------------------------------------------------------------------------

### 10. Kesimpulan

1.  DNS Server Components merupakan peran atau fungsi dalam sistem DNS.
2.  Server dapat berupa komputer fisik, virtual machine, atau
    infrastruktur cloud.
3.  Software DNS menjalankan fungsi sesuai konfigurasi.
4.  Recursive DNS Resolver mencari jawaban DNS untuk client.
5.  Root DNS Server mengarahkan resolver ke TLD.
6.  TLD DNS Server mengarahkan resolver ke Authoritative DNS Server.
7.  Authoritative DNS Server memberikan DNS records resmi.
8.  DNS Provider menyediakan layanan authoritative DNS.
9.  DNS Resolver dan DNS Provider memiliki fungsi berbeda.
10. Satu software DNS dapat menjalankan beberapa peran sekaligus.

------------------------------------------------------------------------

# Part 3 --- DNS Resolution dan DNS Records

### 1. Apa Itu DNS Resolution?

DNS (Domain Name System) adalah sistem yang menerjemahkan nama domain
menjadi alamat IP.

Contoh:

``` text
www.hackycorp.com → 51.158.147.132
```

Komputer membutuhkan alamat IP untuk terhubung ke server. DNS membantu
kita menggunakan nama domain yang lebih mudah diingat daripada alamat
IP.

**DNS Resolution** adalah proses mencari alamat IP berdasarkan nama
domain.

------------------------------------------------------------------------

### 2. Bagaimana DNS Resolution Bekerja?

Ketika kita mengakses:

``` text
https://www.example.com
```

Komputer perlu mengetahui alamat IP dari `www.example.com`.

Prosesnya melibatkan beberapa komponen:

1.  Client
2.  Recursive DNS Resolver
3.  Root DNS Server
4.  TLD DNS Server
5.  Authoritative DNS Server

#### 2.1 Client

Client adalah perangkat atau aplikasi yang meminta alamat IP sebuah
domain.

Contohnya ketika kita menjalankan:

``` bash
curl https://www.example.com
```

Browser atau `curl` membutuhkan alamat IP dari domain tersebut.

#### 2.2 Recursive DNS Resolver

Recursive Resolver bertugas mencari alamat IP untuk client.

Contoh layanan Recursive Resolver:

-   Cloudflare DNS: `1.1.1.1`
-   Google DNS: `8.8.8.8`

Resolver akan memeriksa cache terlebih dahulu.

Jika alamat IP sudah tersedia di cache dan belum kedaluwarsa, resolver
langsung mengembalikannya.

Jika belum tersedia, resolver akan mencari jawabannya melalui DNS
hierarchy.

#### 2.3 Root DNS Server

Root DNS Server merupakan titik awal pencarian ketika resolver belum
mengetahui lokasi DNS berikutnya.

Root Server tidak menyimpan alamat IP seluruh website.

Sebaliknya, Root Server memberikan informasi tentang TLD DNS Server yang
harus ditanyakan.

Contohnya:

``` text
example.com
```

Root Server mengarahkan resolver ke DNS Server untuk `.com`.

#### 2.4 TLD DNS Server

TLD (Top-Level Domain) adalah bagian terakhir dari sebuah domain.

Contoh:

``` text
example.com
         └── .com

example.id
         └── .id
```

TLD DNS Server memberikan informasi mengenai Authoritative DNS Server
yang bertanggung jawab atas domain tersebut.

#### 2.5 Authoritative DNS Server

Authoritative DNS Server adalah server yang menyimpan informasi DNS
resmi untuk sebuah domain.

Contohnya, DNS zone `example.com` dapat memiliki record:

``` text
example.com       A       203.0.113.10
www.example.com   A       203.0.113.10
mail.example.com  A       203.0.113.20
```

Ketika resolver meminta alamat IP `www.example.com`, Authoritative DNS
Server memberikan jawaban berdasarkan DNS record yang tersedia.

------------------------------------------------------------------------

### 3. Alur DNS Resolution

Misalnya client ingin mengakses:

``` text
www.example.com
```

Alurnya:

``` text
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

``` text
www.example.com → 203.0.113.10
```

Client kemudian dapat menggunakan alamat IP tersebut untuk membuat
koneksi ke server.

**Catatan:** Tidak semua DNS query harus melewati seluruh proses ini.
Jika resolver sudah memiliki jawaban di cache, proses dapat selesai
lebih cepat.

------------------------------------------------------------------------

### 4. DNS Record Types

DNS Record adalah informasi yang disimpan di DNS zone untuk menentukan
bagaimana sebuah domain harus diarahkan atau digunakan.

#### 4.1 A Record

Menghubungkan hostname dengan alamat IPv4.

Contoh:

``` text
example.com    A    203.0.113.10
```

Artinya:

``` text
example.com → 203.0.113.10
```

#### 4.2 AAAA Record

Menghubungkan hostname dengan alamat IPv6.

Contoh:

``` text
example.com    AAAA    2001:db8::10
```

#### 4.3 CNAME Record

Membuat alias dari satu hostname ke hostname lainnya.

Contoh:

``` text
www.example.com    CNAME    example.com
```

Artinya `www.example.com` merupakan alias dari `example.com`.

Resolver kemudian mencari alamat IP dari hostname tujuan.

#### 4.4 MX Record

Menentukan mail server yang bertanggung jawab menerima email untuk
sebuah domain.

Contoh:

``` text
example.com    MX    10 mail.example.com
```

Angka `10` merupakan priority. Angka yang lebih kecil memiliki prioritas
lebih tinggi.

#### 4.5 NS Record

Menentukan nameserver yang bertanggung jawab atas DNS zone sebuah
domain.

Contoh:

``` text
example.com    NS    ns1.example-dns.com
example.com    NS    ns2.example-dns.com
```

Artinya DNS zone `example.com` dilayani oleh kedua nameserver tersebut.

NS record tidak menunjukkan alamat IP website. NS record menunjukkan
server yang memiliki informasi DNS resmi untuk domain tersebut.

#### 4.6 TXT Record

Menyimpan informasi berbentuk teks.

Biasanya digunakan untuk:

-   Domain ownership verification
-   SPF
-   DKIM
-   DMARC

Contoh:

``` text
example.com    TXT    "v=spf1 include:_spf.example.com ~all"
```

------------------------------------------------------------------------

### 5. Perbedaan Domain Registrar, DNS Provider, dan Hosting Provider

Ketiganya memiliki fungsi berbeda.

#### 5.1 Domain Registrar

Perusahaan tempat kita membeli dan mendaftarkan domain.

Contoh:

-   Namecheap
-   GoDaddy
-   Cloudflare Registrar

Registrar mengelola pendaftaran domain dan pengaturan nameserver
delegation.

#### 5.2 DNS Provider

Perusahaan yang menyediakan layanan pengelolaan DNS records dan
authoritative nameserver.

Contoh:

-   Cloudflare DNS
-   Amazon Route 53
-   Namecheap DNS

DNS Provider bertugas menyimpan dan menjawab informasi DNS untuk domain
kita.

#### 5.3 Hosting Provider

Perusahaan yang menyediakan server untuk menjalankan website atau
aplikasi.

Contoh:

-   AWS
-   DigitalOcean
-   Hetzner

Hosting Provider menyediakan infrastruktur tempat aplikasi berjalan.

#### 5.4 Contoh Hubungan Ketiganya

Misalnya kita:

1.  Membeli domain `mywebsite.com` di Namecheap.
2.  Menggunakan Cloudflare sebagai DNS Provider.
3.  Menjalankan website di server DigitalOcean.

Maka:

``` text
Domain Registrar:
Namecheap

DNS Provider:
Cloudflare

Hosting Provider:
DigitalOcean
```

Ketiganya bisa berasal dari perusahaan yang berbeda.

------------------------------------------------------------------------

### 6. Bagaimana Menghubungkan Domain ke DNS Provider?

Misalnya kita membeli domain:

``` text
mywebsite.com
```

di Namecheap dan ingin menggunakan Cloudflare sebagai DNS Provider.

#### Step 1 --- Membeli Domain

Beli domain melalui Namecheap.

Pada tahap ini, Namecheap berperan sebagai Domain Registrar.

#### Step 2 --- Menambahkan Domain ke Cloudflare

Tambahkan domain `mywebsite.com` ke akun Cloudflare.

Cloudflare akan memberikan nameserver khusus untuk domain tersebut.

Contoh ilustrasi:

``` text
alice.ns.cloudflare.com
bob.ns.cloudflare.com
```

Nama nameserver sebenarnya harus menggunakan nilai yang diberikan
Cloudflare untuk domain kita.

#### Step 3 --- Mengubah Nameserver di Namecheap

Masuk ke pengaturan domain di Namecheap.

Ubah nameserver menjadi nameserver yang diberikan Cloudflare.

Contoh:

``` text
Nameserver 1:
alice.ns.cloudflare.com

Nameserver 2:
bob.ns.cloudflare.com
```

Dengan perubahan ini, kita mengarahkan DNS delegation domain ke
Cloudflare.

#### Step 4 --- Membuat DNS Records di Cloudflare

Setelah domain menggunakan nameserver Cloudflare, kita dapat mengelola
DNS records melalui Cloudflare.

Misalnya server website kita memiliki IP:

``` text
203.0.113.10
```

Buat record:

``` text
Type: A
Name: @
Content: 203.0.113.10
```

Untuk subdomain `www`, kita bisa membuat:

``` text
Type: CNAME
Name: www
Content: mywebsite.com
```

Hasilnya:

``` text
mywebsite.com     → 203.0.113.10
www.mywebsite.com → mywebsite.com → 203.0.113.10
```

**Penting:** Mengubah nameserver tidak berarti kita memindahkan
kepemilikan domain. Domain tetap terdaftar di Namecheap, tetapi DNS zone
sekarang dilayani oleh Cloudflare.

------------------------------------------------------------------------

### 7. Cara Melakukan DNS Resolution

Kita dapat melakukan DNS resolution menggunakan beberapa command Linux.

#### 7.1 Menggunakan dig

Melihat informasi DNS:

``` bash
dig www.hackycorp.com
```

Melihat IP address saja:

``` bash
dig +short www.hackycorp.com
```

Melihat A record:

``` bash
dig www.hackycorp.com A
```

Melihat AAAA record:

``` bash
dig www.hackycorp.com AAAA
```

Melihat NS record:

``` bash
dig hackycorp.com NS
```

Melihat MX record:

``` bash
dig hackycorp.com MX
```

Melihat TXT record:

``` bash
dig hackycorp.com TXT
```

#### 7.2 Menggunakan nslookup

``` bash
nslookup www.hackycorp.com
```

Melihat NS record:

``` bash
nslookup -type=NS hackycorp.com
```

Melihat MX record:

``` bash
nslookup -type=MX hackycorp.com
```

#### 7.3 Menggunakan getent

``` bash
getent hosts www.hackycorp.com
```

`getent` menggunakan mekanisme name resolution yang dikonfigurasi oleh
sistem operasi.

Artinya, hasilnya bisa berasal dari `/etc/hosts` maupun DNS, tergantung
konfigurasi sistem.

------------------------------------------------------------------------

### 8. Menggunakan DNS Resolver Tertentu

Kita juga bisa menentukan DNS Resolver yang ingin digunakan.

Contoh menggunakan Cloudflare DNS:

``` bash
dig @1.1.1.1 www.example.com
```

Menggunakan Google DNS:

``` bash
dig @8.8.8.8 www.example.com
```

Perbedaannya:

``` bash
dig www.example.com
```

Menggunakan DNS resolver default dari sistem.

Sedangkan:

``` bash
dig @1.1.1.1 www.example.com
```

Secara eksplisit meminta jawaban melalui Cloudflare DNS.

------------------------------------------------------------------------

### 9. Perbedaan DNS Resolution, /etc/hosts, dan curl --resolve

Ketiganya dapat digunakan untuk menentukan hubungan hostname dengan IP,
tetapi mekanismenya berbeda.

#### 9.1 DNS Resolution

Melakukan pencarian alamat IP melalui sistem DNS.

``` bash
dig www.hackycorp.com
```

#### 9.2 /etc/hosts

File lokal yang dapat digunakan untuk memetakan hostname ke alamat IP
tanpa melakukan pencarian DNS untuk hostname tersebut.

Contoh isi `/etc/hosts`:

``` text
51.158.147.132 www.hackycorp.com
```

Setelah itu:

``` bash
getent hosts www.hackycorp.com
```

Sistem dapat menggunakan pemetaan lokal tersebut sesuai konfigurasi name
resolution.

#### 9.3 curl --resolve

Mengatur pemetaan hostname dan IP hanya untuk koneksi `curl` yang sedang
dijalankan.

Contoh:

``` bash
curl -k -i \
    --resolve "www.hackycorp.com:443:51.158.147.132" \
    https://www.hackycorp.com/
```

Artinya:

-   Hostname: `www.hackycorp.com`
-   Port: `443`
-   IP tujuan: `51.158.147.132`

`curl` akan menggunakan IP tersebut tanpa perlu mengandalkan hasil DNS
untuk koneksi itu.

**Perbedaan utamanya:**

  Metode             Cakupan
  ------------------ ------------------------------------------
  DNS Resolution     Menggunakan sistem DNS
  `/etc/hosts`       Pemetaan lokal pada sistem
  `curl --resolve`   Hanya untuk koneksi curl yang ditentukan

`curl --resolve` tidak membuat DNS record dan tidak mengubah konfigurasi
DNS domain.

------------------------------------------------------------------------

### 10. DNS Resolution dalam Security Reconnaissance

Dalam security testing, DNS resolution berguna untuk mengetahui
infrastruktur yang berhubungan dengan domain target.

Contohnya:

#### Mengetahui IP Domain

``` bash
dig +short hackycorp.com
```

#### Mengetahui Subdomain

``` bash
dig +short www.hackycorp.com
dig +short admin.hackycorp.com
dig +short dev.hackycorp.com
```

#### Mengetahui Nameserver

``` bash
dig hackycorp.com NS
```

#### Mengetahui Mail Server

``` bash
dig hackycorp.com MX
```

#### Mengetahui DNS Records

``` bash
dig hackycorp.com ANY
```

Catatan: Query `ANY` tidak menjamin semua record akan dikembalikan.
Untuk pemeriksaan yang lebih akurat, query tipe record secara terpisah.

Informasi tersebut dapat membantu memahami:

-   IP address yang digunakan domain.
-   Nameserver yang melayani domain.
-   Mail server yang digunakan.
-   Subdomain yang ditemukan.
-   Hubungan antara hostname dan server.

Lakukan reconnaissance hanya terhadap domain atau sistem yang memang
diizinkan untuk diuji.

------------------------------------------------------------------------

### 11. Kesimpulan

Hal-hal penting yang perlu dipahami:

1.  DNS Resolution menerjemahkan hostname menjadi informasi DNS, seperti
    alamat IP.
2.  Recursive Resolver mencari jawaban DNS untuk client.
3.  Root DNS Server mengarahkan resolver ke TLD DNS Server.
4.  TLD DNS Server mengarahkan resolver ke Authoritative DNS Server.
5.  Authoritative DNS Server menyimpan dan memberikan DNS records resmi.
6.  DNS Provider mengelola DNS records dan authoritative nameserver.
7.  Domain Registrar mengelola pendaftaran domain dan nameserver
    delegation.
8.  Hosting Provider menyediakan server tempat aplikasi berjalan.
9.  `dig`, `nslookup`, dan `getent` dapat digunakan untuk melakukan
    pemeriksaan DNS.
10. `/etc/hosts` dan `curl --resolve` dapat digunakan untuk pemetaan
    hostname secara lokal tanpa mengubah DNS publik.

------------------------------------------------------------------------

# Part 4 --- DNS Resolver di Linux --- systemd-resolved

### 1. Gambaran Besar

Ketika aplikasi ingin mengakses hostname seperti:

``` text
google.com
```

komputer membutuhkan IP address dari hostname tersebut.

Contoh:

``` text
google.com
    ↓
142.250.x.x
```

Proses mengubah hostname menjadi IP address disebut **DNS resolution**.

Pada Ubuntu yang menggunakan `systemd-resolved`, alur umumnya:

``` text
Application
    ↓
System Resolver
    ↓
systemd-resolved
    ↓
Cache
    ↓
Upstream DNS Server
    ↓
IP Address
```

Contoh upstream DNS server:

``` text
192.168.8.1
1.1.1.1
8.8.8.8
```

------------------------------------------------------------------------

## 2. systemd-resolved

`systemd-resolved` adalah service Linux yang menangani resolusi nama
untuk sistem.

Cek status:

``` bash
systemctl status systemd-resolved
```

Melihat konfigurasi DNS:

``` bash
resolvectl status
```

Contoh:

``` text
Link 3 (wlp0s20f3)
    Current DNS Server: 8.8.8.8
    DNS Servers: 192.168.8.1 1.1.1.1 8.8.8.8
```

`Current DNS Server` menunjukkan DNS server yang saat ini dipilih
`systemd-resolved` untuk link tersebut.

------------------------------------------------------------------------

## 3. Stub Resolver 127.0.0.53

Pada konfigurasi `systemd-resolved` dengan stub mode, `/etc/resolv.conf`
biasanya berisi:

``` text
nameserver 127.0.0.53
```

Cek dengan:

``` bash
cat /etc/resolv.conf
```

`127.0.0.53` adalah local DNS stub milik `systemd-resolved`.

Secara sederhana:

``` text
Application
    ↓
127.0.0.53:53
    ↓
systemd-resolved
    ↓
Upstream DNS Server
```

Misalnya upstream yang sedang digunakan:

``` text
8.8.8.8:53
```

------------------------------------------------------------------------

## 4. Cache pada systemd-resolved

Ketika menerima permintaan resolusi, `systemd-resolved` dapat
menggunakan cache.

Contoh:

``` text
Application
    |
    | Query google.com
    v
systemd-resolved
    |
    +---- Cache HIT
    |        |
    |        v
    |    Return IP
    |
    +---- Cache MISS
             |
             v
      Upstream DNS Server
             |
             v
        DNS Response
             |
             v
      systemd-resolved
             |
             v
        Application
```

Jika data masih tersedia dan valid di cache, tidak perlu melakukan query
upstream baru.

Jika tidak tersedia, `systemd-resolved` dapat mengirim query ke DNS
server upstream.

Cache dapat dibersihkan dengan:

``` bash
sudo resolvectl flush-caches
```

------------------------------------------------------------------------

## 5. resolvectl query

Command:

``` bash
resolvectl query google.com
```

digunakan untuk meminta `systemd-resolved` melakukan resolusi nama.

Konsep:

``` text
resolvectl
    |
    | query google.com
    v
systemd-resolved
    |
    +---- cache
    |
    +---- jika diperlukan
             |
             v
        Upstream DNS
             |
             v
        DNS Response
```

Contoh:

``` bash
resolvectl query google.com
```

Hasilnya dapat berupa:

``` text
google.com: 142.250.x.x
```

------------------------------------------------------------------------

## 6. Cara Kerja dig google.com

Command:

``` bash
dig google.com
```

tidak berarti `dig` secara otomatis menghubungi `8.8.8.8`.

`dig` melihat konfigurasi resolver, biasanya melalui:

``` text
/etc/resolv.conf
```

Misalnya:

``` bash
cat /etc/resolv.conf
```

menghasilkan:

``` text
nameserver 127.0.0.53
```

Maka:

``` bash
dig google.com
```

akan mengirim DNS query ke:

``` text
127.0.0.53:53
```

Dalam konfigurasi ini, alamat tersebut adalah stub `systemd-resolved`.

Alurnya:

``` text
dig google.com
      |
      | membaca resolver configuration
      v
/etc/resolv.conf
      |
      | nameserver 127.0.0.53
      v
systemd-resolved
      |
      v
Upstream DNS Server
      |
      v
DNS Response
```

Jadi:

``` bash
dig google.com
```

mengikuti konfigurasi DNS resolver yang digunakan oleh `dig`.

------------------------------------------------------------------------

## 7. dig dengan DNS Server Spesifik

Kita juga bisa menentukan DNS server secara langsung.

Contoh:

``` bash
dig @8.8.8.8 google.com
```

`@8.8.8.8` berarti:

> Kirim DNS query langsung ke DNS server `8.8.8.8`.

Alurnya menjadi:

``` text
dig
 |
 | DNS query
 | destination 8.8.8.8:53
 v
8.8.8.8
 |
 | DNS response
 v
dig
```

Dengan begitu, `dig` tidak menggunakan nameserver default dari
`/etc/resolv.conf` untuk query tersebut.

Perbandingan:

``` text
dig google.com

dig
 ↓
/etc/resolv.conf
 ↓
127.0.0.53
 ↓
systemd-resolved
 ↓
Upstream DNS
```

sedangkan:

``` text
dig @8.8.8.8 google.com

dig
 ↓
8.8.8.8:53
```

------------------------------------------------------------------------

## 8. Menentukan Port dengan dig

DNS standar menggunakan port:

``` text
53
```

Kita juga dapat menentukan port sendiri.

Contoh Unbound berjalan pada:

``` text
127.0.0.1:5353
```

Query:

``` bash
dig @127.0.0.1 -p 5353 google.com
```

Artinya:

``` text
dig
 |
 | DNS Query
 | destination 127.0.0.1:5353
 v
Unbound
 |
 v
DNS Resolution
```

Ini berguna ketika menjalankan DNS resolver sendiri pada port
non-standar.

------------------------------------------------------------------------

## 9. DNS Query dan Port 53

Contoh DNS query:

``` text
Client
192.168.8.100:52341
        |
        | UDP DNS Query
        v
8.8.8.8:53
```

`52341` adalah contoh ephemeral port milik client.

`53` adalah port service DNS pada server.

Response:

``` text
8.8.8.8:53
        |
        | UDP DNS Response
        v
192.168.8.100:52341
```

Yang perlu dibedakan:

``` text
53
```

adalah **port DNS**.

Sedangkan:

``` text
142.250.x.x
```

adalah contoh **IP address yang terdapat dalam jawaban DNS**.

Jadi port `53` bukan "IP address hasil dari google.com".

------------------------------------------------------------------------

## 10. Browser Menggunakan System DNS

Dalam kondisi normal, browser dapat menggunakan mekanisme resolver
sistem operasi.

Misalnya membuka:

``` text
https://google.com
```

Secara konseptual:

``` text
Browser
   |
   | membutuhkan IP google.com
   v
OS Name Resolution
   |
   v
systemd-resolved
   |
   +---- Cache
   |
   +---- Upstream DNS
             |
             v
          IP Address
             |
             v
          Browser
             |
             | HTTPS
             v
       Google IP:443
```

Perhatikan bahwa DNS dan HTTPS merupakan tahap berbeda.

DNS:

``` text
google.com
    ↓
IP address
```

kemudian koneksi web:

``` text
IP address:443
```

------------------------------------------------------------------------

## 11. Browser dengan DNS over HTTPS (DoH)

Browser modern dapat menggunakan **DNS over HTTPS (DoH)**.

Jika browser menggunakan DoH secara langsung, query DNS tertentu dapat
dilakukan oleh browser melalui koneksi HTTPS ke DoH resolver, bukan
melalui DNS resolver sistem operasi.

Alurnya berubah dari:

``` text
Browser
    ↓
System Resolver
    ↓
systemd-resolved
    ↓
DNS Server :53
```

menjadi secara konseptual:

``` text
Browser
    |
    | HTTPS
    v
DoH Server :443
    |
    v
DNS Response
```

Jadi browser dapat melewati DNS resolver sistem operasi untuk resolusi
yang ditangani oleh DoH.

Contoh konsep:

``` text
Browser
   |
   | DNS over HTTPS
   | TCP/QUIC 443
   v
DoH Provider
   |
   v
IP address google.com
```

Namun detail perilakunya bergantung pada browser, konfigurasi DoH,
kebijakan sistem, dan fallback yang digunakan.

------------------------------------------------------------------------

## 12. Perbedaan DNS Biasa dan DoH

DNS biasa:

``` text
Browser/Application
       ↓
systemd-resolved
       ↓
DNS Server
       ↓
UDP/TCP 53
```

DNS over HTTPS:

``` text
Browser
   ↓
HTTPS
   ↓
DoH Server
   ↓
Port 443
```

Karena DoH menggunakan HTTPS, DNS query tidak terlihat sebagai paket
UDP/TCP port 53 biasa.

------------------------------------------------------------------------

## 13. Mengamati DNS dengan tcpdump

Untuk melihat DNS biasa pada Wi-Fi:

``` bash
sudo tcpdump -ni wlp0s20f3 'port 53'
```

Kemudian:

``` bash
sudo resolvectl flush-caches
```

Lakukan query:

``` bash
resolvectl query google.com
```

atau:

``` bash
dig google.com
```

Kita dapat melihat paket seperti:

``` text
192.168.8.x.52341 > 8.8.8.8.53
8.8.8.8.53 > 192.168.8.x.52341
```

Artinya:

``` text
Client ephemeral port
        ↓
DNS Server port 53
        ↓
DNS Response
```

------------------------------------------------------------------------

## 14. Mengapa DNS Browser Kadang Tidak Terlihat di Port 53?

Misalnya kita menjalankan:

``` bash
sudo tcpdump -ni wlp0s20f3 'port 53'
```

kemudian membuka website tetapi tidak melihat DNS query.

Beberapa kemungkinan:

1.  DNS answer sudah berada di cache.
2.  Browser memiliki DNS cache sendiri.
3.  `systemd-resolved` memiliki cache.
4.  Browser menggunakan DNS over HTTPS.
5.  Browser menggunakan koneksi/network state yang sudah ada.

Karena itu, tidak munculnya paket port 53 tidak otomatis berarti DNS
tidak terjadi sama sekali.

------------------------------------------------------------------------

## 15. Perbandingan Command

#### Menggunakan systemd-resolved secara eksplisit

``` bash
resolvectl query google.com
```

Konsep:

``` text
resolvectl
    ↓
systemd-resolved
    ↓
cache / upstream DNS
```

------------------------------------------------------------------------

#### Menggunakan resolver dari konfigurasi dig

``` bash
dig google.com
```

Konsep:

``` text
dig
 ↓
/etc/resolv.conf
 ↓
configured nameserver
```

Jika:

``` text
nameserver 127.0.0.53
```

maka:

``` text
dig
 ↓
127.0.0.53
 ↓
systemd-resolved
```

------------------------------------------------------------------------

#### Query langsung ke Google Public DNS

``` bash
dig @8.8.8.8 google.com
```

Konsep:

``` text
dig
 ↓
8.8.8.8:53
```

Nameserver default dari `/etc/resolv.conf` tidak digunakan untuk query
tersebut.

------------------------------------------------------------------------

#### Query langsung ke Unbound lokal

``` bash
dig @127.0.0.1 -p 5353 google.com
```

Konsep:

``` text
dig
 ↓
127.0.0.1:5353
 ↓
Unbound
```

------------------------------------------------------------------------

#### Browser menggunakan DoH

Konsep:

``` text
Browser
 ↓
HTTPS :443
 ↓
DoH Resolver
```

Untuk resolusi yang dilakukan melalui DoH tersebut, browser tidak perlu
mengirim query DNS biasa melalui `systemd-resolved`.

------------------------------------------------------------------------

## 16. Ringkasan Mental Model

Hal paling penting untuk diingat:

``` text
dig google.com
```

berarti:

``` text
Gunakan resolver yang dikonfigurasi untuk dig
```

Sedangkan:

``` text
dig @8.8.8.8 google.com
```

berarti:

``` text
Kirim DNS query langsung ke 8.8.8.8
```

Sedangkan:

``` text
resolvectl query google.com
```

berarti:

``` text
Minta systemd-resolved melakukan resolusi
```

Dan browser normal yang menggunakan system DNS secara konseptual:

``` text
Browser
 ↓
OS resolver
 ↓
systemd-resolved
 ↓
DNS resolver
```

Tetapi browser dengan DoH dapat melakukan:

``` text
Browser
 ↓
DoH
 ↓
DNS provider melalui HTTPS :443
```

Sehingga DNS resolver sistem operasi dapat dilewati untuk query yang
ditangani DoH.

------------------------------------------------------------------------

## 17. Gambaran Lengkap Request Website

Tanpa DoH:

``` text
Browser
   |
   | google.com
   v
System DNS Resolution
   |
   v
systemd-resolved
   |
   | cache miss
   v
DNS Server :53
   |
   | IP address
   v
systemd-resolved
   |
   v
Browser
   |
   | Connect ke IP:443
   v
TCP / QUIC
   |
   v
TLS
   |
   v
HTTP Request
   |
   v
HTTP Response
```

Dengan DoH yang dilakukan browser:

``` text
Browser
   |
   | DNS query via HTTPS
   v
DoH Resolver :443
   |
   | IP address
   v
Browser
   |
   | Connect ke IP:443
   v
TCP / QUIC
   |
   v
TLS
   |
   v
HTTP Request
   |
   v
HTTP Response
```

Mental model akhirnya:

``` text
Hostname
   ↓
DNS Resolution
   ↓
IP Address
   ↓
Connection
   ↓
TLS
   ↓
HTTP
```

DNS bertugas menemukan **alamat IP**.

Port `53` adalah port standar **DNS biasa**.

Port `443` digunakan untuk **HTTPS**, dan juga dapat membawa DNS ketika
menggunakan **DNS over HTTPS (DoH)**.

------------------------------------------------------------------------

# Part 5 --- Recursive Resolver --- Unbound dan DNSSEC

### Posisi belajar saat ini

**Materi:** DNS (Domain Name System)\
**Topik:** Recursive DNS Resolver, Unbound, DNSSEC, dan Root Trust
Anchor\
**Status:** Selesai

### 1. Mengenal Unbound

Unbound adalah DNS Resolver yang bertugas menerjemahkan hostname menjadi
IP address.

Contoh:

``` text
google.com → 142.250.x.x
```

Ketika aplikasi meminta IP address dari `google.com`, Unbound akan
melakukan proses DNS resolution.

Unbound dapat menggunakan cache untuk menyimpan hasil DNS query
sebelumnya.

Jika hasilnya tersedia di cache dan belum kedaluwarsa, Unbound dapat
langsung mengembalikan hasil tersebut tanpa melakukan recursive lookup
kembali.

### 2. Proses Recursive DNS Resolution

Jika hostname tidak ditemukan di cache, Unbound akan melakukan recursive
DNS resolution.

Urutan prosesnya:

``` text
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

1.  Client mengirim DNS query kepada Unbound.
2.  Unbound memeriksa cache.
3.  Jika tidak ditemukan, Unbound menghubungi Root DNS Server.
4.  Root DNS Server memberikan informasi mengenai TLD DNS Server.
5.  Unbound menghubungi TLD DNS Server.
6.  TLD DNS Server memberikan informasi mengenai Authoritative DNS
    Server.
7.  Unbound menghubungi Authoritative DNS Server untuk mendapatkan DNS
    record.
8.  Unbound mengembalikan hasil kepada client dan menyimpannya dalam
    cache sesuai TTL.

### 3. Perbedaan BIND dan Unbound

Dalam konfigurasi lokal, kita menggunakan dua software DNS dengan fungsi
berbeda.

  Software   Fungsi
  ---------- --------------------------
  BIND       Authoritative DNS Server
  Unbound    Recursive DNS Resolver

**BIND sebagai Authoritative DNS Server**

BIND bertugas menyimpan dan memberikan DNS record untuk domain atau zone
yang dikelolanya.

Contohnya:

``` text
example.test → 192.168.1.10
```

**Unbound sebagai Recursive DNS Resolver**

Unbound bertugas mencari DNS record dari berbagai DNS Server hingga
mendapatkan jawaban yang dibutuhkan client.

Keduanya dapat berjalan pada satu komputer, tetapi menggunakan port yang
berbeda.

### 4. Konfigurasi Unbound pada Local Machine

Pada konfigurasi ini, Unbound menggunakan:

-   IP address: `127.0.0.1`
-   Port: `5353`

File konfigurasi:

``` text
/etc/unbound/unbound.conf.d/local-resolver.conf
```

Konfigurasi:

``` conf
server:
    interface: 127.0.0.1
    port: 5353
    access-control: 127.0.0.0/8 allow
```

Penjelasan:

  ------------------------------------------------------------------------
  Konfigurasi        Fungsi
  ------------------ -----------------------------------------------------
  `interface`        Menentukan alamat IP tempat Unbound menerima query

  `port`             Menentukan port yang digunakan Unbound

  `access-control`   Menentukan client yang diizinkan mengakses Unbound
  ------------------------------------------------------------------------

Port `5353` digunakan agar tidak berbenturan dengan BIND yang
menggunakan port `53`.

#### Memeriksa konfigurasi

``` bash
sudo unbound-checkconf
```

#### Restart Unbound

``` bash
sudo systemctl restart unbound
```

#### Memeriksa status service

``` bash
sudo systemctl status unbound
```

#### Memeriksa listening port

``` bash
ss -lnup | grep ':5353'
```

### 5. Melakukan DNS Query ke Unbound

Untuk mengirim query secara langsung ke Unbound:

``` bash
dig @127.0.0.1 -p 5353 google.com A
```

Penjelasan:

  Parameter      Fungsi
  -------------- --------------------------------
  `dig`          Tool untuk melakukan DNS query
  `@127.0.0.1`   Menentukan DNS Server tujuan
  `-p 5353`      Menentukan port DNS Server
  `google.com`   Domain yang ingin dicari
  `A`            Meminta IPv4 address

Perlu diingat bahwa `127.0.0.1` hanya menunjukkan alamat loopback.
Software DNS yang menerima query ditentukan oleh port dan proses yang
sedang listening.

### 6. Menghubungkan Unbound dengan BIND

Karena BIND dan Unbound memiliki fungsi berbeda, Unbound dapat diarahkan
ke BIND untuk melakukan query terhadap local zone.

Contoh konfigurasi pada Unbound:

``` conf
forward-zone:
    name: "lab.test"
    forward-addr: 127.0.0.1@53
```

Penjelasan:

-   `name`: Domain yang akan diteruskan ke BIND.
-   `forward-addr`: Alamat dan port BIND yang menerima query.

Dengan konfigurasi tersebut:

``` text
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

Untuk domain publik seperti `google.com`, Unbound tetap melakukan
recursive resolution.

### 7. Mengenal DNSSEC

DNSSEC (Domain Name System Security Extensions) adalah mekanisme
keamanan DNS yang digunakan untuk memvalidasi keaslian dan integritas
data DNS.

DNSSEC membantu memastikan bahwa DNS response berasal dari sumber yang
dapat dipercaya dan tidak dimodifikasi.

DNSSEC menggunakan mekanisme digital signature dan public key
cryptography.

Beberapa record yang digunakan:

  Record         Fungsi
  -------------- -----------------------------------------------
  DNSKEY         Menyimpan public key
  DS             Menghubungkan trust chain antar-zone
  RRSIG          Menyimpan digital signature DNS record
  NSEC / NSEC3   Membuktikan bahwa suatu record tidak tersedia

#### Perbedaan DNS dan DNSSEC

DNS biasa memberikan jawaban DNS kepada client.

DNSSEC menambahkan proses validasi terhadap jawaban tersebut.

Dengan demikian, resolver dapat memeriksa apakah data DNS yang diterima
memiliki signature yang valid.

### 8. Mengenal Trust Anchor

Trust Anchor adalah titik awal kepercayaan yang digunakan resolver untuk
memvalidasi DNSSEC.

Dalam DNSSEC, proses validasi dimulai dari Root DNS Zone (`.`).

Unbound membutuhkan Root Trust Anchor agar dapat memvalidasi DNSSEC dari
root hingga domain tujuan.

Pada Unbound, konfigurasi trust anchor dapat menggunakan:

``` conf
server:
    auto-trust-anchor-file: "/var/lib/unbound/root.key"
```

File tersebut menyimpan informasi trust anchor yang digunakan Unbound.

### 9. Masalah DNSSEC yang Ditemukan

Ketika melakukan query:

``` bash
dig @127.0.0.1 -p 5353 google.com A
```

Unbound mengembalikan:

``` text
status: SERVFAIL
```

Namun, ketika DNSSEC checking dinonaktifkan untuk query tersebut
menggunakan `+cdflag`:

``` bash
dig @127.0.0.1 -p 5353 google.com A +cdflag
```

Hasilnya:

``` text
status: NOERROR
```

Artinya, Unbound sebenarnya dapat memperoleh DNS response, tetapi
mengalami masalah ketika melakukan validasi DNSSEC.

#### Memeriksa Root DNSKEY

Query melalui Cloudflare:

``` bash
dig @1.1.1.1 . DNSKEY +dnssec
```

Hasilnya menunjukkan beberapa DNSKEY, termasuk:

``` text
Key Tag: 20326
Key Tag: 38696
```

Sedangkan file lokal:

``` bash
sudo cat /var/lib/unbound/root.key
```

hanya memiliki KSK-2017 dengan key tag:

``` text
20326
```

#### Penyebab masalah

Terjadi pergantian Root Key Signing Key (KSK).

  KSK          Key Tag Keterangan
  ---------- --------- ------------
  KSK-2017       20326 Kunci lama
  KSK-2024       38696 Kunci baru

Pada 11 Oktober 2026, KSK-2024 mulai digunakan untuk menandatangani Root
DNSKEY RRset.

Karena Unbound masih menggunakan trust anchor lama saja, Unbound tidak
dapat memvalidasi signature baru tersebut.

KSK-2017 belum langsung dihapus dari trust anchor. Namun, resolver harus
sudah mempercayai KSK-2024 agar validasi DNSSEC tetap berjalan.

### 10. Memperbarui Root Trust Anchor

Untuk memperbarui trust anchor, kita menggunakan utility
`unbound-anchor`.

#### Memeriksa utility

``` bash
command -v unbound-anchor
```

Jika tidak ditemukan, berarti utility tersebut belum tersedia pada
sistem.

Pada Ubuntu, periksa paket yang menyediakan utility tersebut:

``` bash
apt-cache search unbound-anchor
```

Setelah memasang paket yang sesuai, periksa kembali:

``` bash
command -v unbound-anchor
```

#### Memperbarui trust anchor

``` bash
sudo -u unbound unbound-anchor -a /var/lib/unbound/root.key
```

Penjelasan:

-   `sudo -u unbound`: Menjalankan command sebagai user `unbound`.
-   `unbound-anchor`: Utility untuk menginisialisasi atau memperbarui
    root trust anchor.
-   `-a`: Menentukan lokasi file trust anchor.
-   `/var/lib/unbound/root.key`: Lokasi file trust anchor.

Utility ini dapat menggunakan mekanisme pembaruan trust anchor otomatis
dan sumber trust anchor resmi.

#### Memeriksa hasil pembaruan

``` bash
sudo cat /var/lib/unbound/root.key
```

Pastikan KSK-2024 dengan key tag `38696` sudah tersedia.

#### Restart Unbound

``` bash
sudo systemctl restart unbound
```

### 11. Verifikasi DNSSEC

Setelah trust anchor diperbarui, lakukan query:

``` bash
dig @127.0.0.1 -p 5353 google.com A
```

Periksa hasilnya.

Contoh bagian header:

``` text
;; ->>HEADER<<- opcode: QUERY, status: NOERROR
;; flags: qr rd ra ad
```

Penjelasan flag:

  Flag   Fungsi
  ------ ---------------------------------------------------
  `qr`   Pesan merupakan DNS response
  `rd`   Client meminta recursive resolution
  `ra`   Server mendukung recursive query
  `ad`   Data telah divalidasi secara DNSSEC oleh resolver

Jika mendapatkan `NOERROR`, jawaban DNS berhasil diperoleh.

Jika mendapatkan flag `ad`, artinya jawaban tersebut telah berhasil
divalidasi DNSSEC.

### 12. Catatan Penting

Jangan menggunakan:

``` bash
dig @127.0.0.1 -p 5353 google.com A +cdflag
```

sebagai solusi permanen.

`+cdflag` hanya meminta resolver untuk tidak melakukan pemeriksaan
DNSSEC pada query tersebut. Ini berguna untuk diagnosis, tetapi bukan
cara memperbaiki trust anchor.

Solusi yang benar adalah memperbaiki konfigurasi dan memperbarui Root
Trust Anchor.

------------------------------------------------------------------------

### Detail Materi yang Sudah Dipelajari

-   [x] Mengenal fungsi Unbound sebagai Recursive DNS Resolver.
-   [x] Memahami fungsi cache pada DNS Resolver.
-   [x] Memahami proses Root DNS → TLD DNS → Authoritative DNS.
-   [x] Memahami perbedaan BIND dan Unbound.
-   [x] Menjalankan BIND dan Unbound pada satu mesin menggunakan port
    berbeda.
-   [x] Mengonfigurasi interface dan port Unbound.
-   [x] Menggunakan `unbound-checkconf`.
-   [x] Memeriksa service menggunakan `systemctl`.
-   [x] Memeriksa listening port menggunakan `ss`.
-   [x] Melakukan DNS query menggunakan `dig`.
-   [x] Memahami forwarding query dari Unbound ke BIND.
-   [x] Mengenal DNSSEC.
-   [x] Mengenal DNSKEY, DS, RRSIG, dan Root Trust Anchor.
-   [x] Memahami fungsi KSK.
-   [x] Memahami masalah perubahan Root KSK 2017 ke KSK 2024.
-   [x] Mendiagnosis `SERVFAIL` akibat kegagalan validasi DNSSEC.
-   [x] Memahami fungsi `+cdflag` untuk diagnosis.
-   [x] Memahami fungsi `unbound-anchor`.
-   [x] Memperbarui Root Trust Anchor.
-   [x] Memverifikasi DNSSEC menggunakan flag `ad`.

### Kesimpulan

Unbound bertugas melakukan recursive DNS resolution, sedangkan BIND
dapat bertugas sebagai Authoritative DNS Server.

DNSSEC memberikan mekanisme validasi terhadap jawaban DNS menggunakan
digital signature dan public key.

Agar Unbound dapat memvalidasi DNSSEC, Unbound membutuhkan Root Trust
Anchor yang sesuai dan selalu diperbarui.

Masalah `SERVFAIL` yang ditemukan bukan karena Unbound tidak bisa
melakukan recursive lookup, melainkan karena trust anchor lokal belum
memiliki KSK-2024 yang dibutuhkan untuk memvalidasi Root DNSKEY RRset.

------------------------------------------------------------------------

# Part 6 --- Authoritative DNS Server --- BIND9

### Posisi belajar saat ini

**Materi:** DNS (Domain Name System)\
**Topik:** Authoritative DNS Server menggunakan BIND9\
**OS:** Ubuntu 24.04\
**Domain:** `lab.test`\
**Status:** Selesai

### 1. Mengenal Authoritative DNS Server

Authoritative DNS Server adalah DNS Server yang memiliki informasi resmi
mengenai DNS records dari suatu domain atau zone.

Contohnya, kita memiliki domain lokal:

``` text
lab.test
```

Kemudian kita memiliki beberapa DNS records:

  Hostname         IP Address
  ---------------- --------------
  lab.test         192.168.1.10
  ns1.lab.test     127.0.0.1
  www.lab.test     192.168.1.10
  api.lab.test     192.168.1.20
  admin.lab.test   192.168.1.30

Ketika client meminta IP address dari `www.lab.test`, Authoritative DNS
Server akan memberikan jawaban berdasarkan DNS records yang tersimpan di
dalam zone file.

Berbeda dengan Recursive DNS Resolver, Authoritative DNS Server tidak
bertugas mencari jawaban melalui Root DNS Server dan TLD DNS Server.

### 2. Mengenal BIND9

BIND (Berkeley Internet Name Domain) adalah software DNS Server yang
dapat digunakan sebagai:

-   Authoritative DNS Server.
-   Recursive DNS Resolver.
-   Caching DNS Server.
-   Primary DNS Server.
-   Secondary DNS Server.

Dalam lab ini, BIND digunakan sebagai **Primary Authoritative DNS
Server**.

Artinya, BIND menyimpan dan mengelola DNS records untuk domain
`lab.test`.

### 3. Instalasi BIND9

Install package yang diperlukan:

``` bash
sudo apt update
sudo apt install bind9 bind9-utils dnsutils
```

Penjelasan package:

  Package         Fungsi
  --------------- ---------------------------------------------
  `bind9`         Menjalankan DNS Server
  `bind9-utils`   Menyediakan utility untuk administrasi BIND
  `dnsutils`      Menyediakan tool seperti `dig`

#### Memeriksa service

``` bash
sudo systemctl status bind9
```

Melihat apakah BIND sedang listening pada port 53:

``` bash
sudo ss -lnup | grep ':53'
```

Port `53` merupakan port standar DNS.

### 4. Mengenal Struktur Konfigurasi BIND

File konfigurasi BIND berada di:

``` text
/etc/bind/
```

Beberapa file penting:

  File                         Fungsi
  ---------------------------- --------------------------
  `named.conf`                 Konfigurasi utama BIND
  `named.conf.options`         Konfigurasi global
  `named.conf.local`           Konfigurasi zone lokal
  `named.conf.default-zones`   Konfigurasi default zone

Dalam lab ini, kita menggunakan dua file utama:

``` text
/etc/bind/named.conf.local
/etc/bind/db.lab.test
```

File pertama digunakan untuk mendaftarkan zone.

File kedua digunakan untuk menyimpan DNS records dari zone tersebut.

### 5. Membuat Forward Zone

Forward Zone digunakan untuk menerjemahkan hostname menjadi IP address.

Contoh:

``` text
www.lab.test → 192.168.1.10
```

Pertama, buka file:

``` bash
sudo nano /etc/bind/named.conf.local
```

Tambahkan konfigurasi:

``` conf
zone "lab.test" {
    type master;
    file "/etc/bind/db.lab.test";
};
```

Penjelasan:

  ------------------------------------------------------------------------
  Konfigurasi         Fungsi
  ------------------- ----------------------------------------------------
  `zone "lab.test"`   Menentukan nama domain atau zone

  `type master`       Menentukan BIND sebagai primary server untuk zone

  `file`              Menentukan lokasi zone file
  ------------------------------------------------------------------------

Setelah itu, buat zone file:

``` bash
sudo nano /etc/bind/db.lab.test
```

Isi dengan konfigurasi berikut:

``` dns
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

### 6. Memahami DNS Records

#### A Record

A Record digunakan untuk menghubungkan hostname dengan IPv4 address.

Contoh:

``` dns
www IN A 192.168.1.10
```

Artinya:

``` text
www.lab.test → 192.168.1.10
```

#### NS Record

NS Record digunakan untuk menentukan nameserver yang authoritative untuk
suatu zone.

Contoh:

``` dns
@ IN NS ns1.lab.test.
```

Artinya, `ns1.lab.test` merupakan nameserver untuk zone `lab.test`.

#### SOA Record

SOA (Start of Authority) adalah record yang menyimpan informasi utama
mengenai suatu zone.

Contoh:

``` dns
@ IN SOA ns1.lab.test. admin.lab.test. (
    2026112501
    3600
    1800
    604800
    86400
)
```

Penjelasan:

  -------------------------------------------------------------------------
  Field               Fungsi
  ------------------- -----------------------------------------------------
  `ns1.lab.test.`     Primary nameserver untuk zone

  `admin.lab.test.`   Email administrator, ditulis dengan `.` menggantikan
                      `@`

  Serial              Versi zone

  Refresh             Interval secondary server memeriksa perubahan zone

  Retry               Interval mencoba kembali jika pemeriksaan gagal

  Expire              Batas waktu secondary menggunakan data zone lama

  Negative Cache TTL  Waktu caching untuk jawaban negatif
  -------------------------------------------------------------------------

#### Memahami Serial Number

Serial digunakan untuk mengetahui versi terbaru dari zone.

Contoh:

``` dns
2026112501
```

Format yang umum digunakan:

``` text
YYYYMMDDNN
```

Setiap kali DNS records berubah, serial harus dinaikkan.

Contoh:

``` text
2026112501
2026112502
2026112503
```

Secondary DNS Server menggunakan serial untuk mengetahui apakah zone
perlu diperbarui.

### 7. Mengonfigurasi BIND sebagai Authoritative-Only

Jika BIND hanya ingin digunakan sebagai Authoritative DNS Server,
nonaktifkan recursive resolution.

Buka:

``` bash
sudo nano /etc/bind/named.conf.options
```

Di dalam blok `options`, tambahkan:

``` conf
options {
    recursion no;
    allow-query { any; };
};
```

Catatan: Jika blok `options` sudah ada, tambahkan kedua directive
tersebut ke blok yang sama. Jangan membuat blok `options` kedua.

Penjelasan:

-   `recursion no`: BIND tidak melayani recursive DNS resolution.
-   `allow-query { any; }`: Mengizinkan query DNS dari client mana pun
    yang dapat menjangkau server.

Untuk lab lokal, aturan akses dapat dibuat lebih ketat sesuai jaringan
yang digunakan.

### 8. Validasi Konfigurasi

Sebelum melakukan restart, periksa konfigurasi terlebih dahulu.

#### Memeriksa konfigurasi utama

``` bash
sudo named-checkconf
```

Jika tidak ada output, berarti tidak ditemukan kesalahan konfigurasi.

#### Memeriksa zone file

``` bash
sudo named-checkzone lab.test /etc/bind/db.lab.test
```

Contoh hasil:

``` text
zone lab.test/IN: loaded serial 2026112501
OK
```

Artinya zone file berhasil dibaca dan valid.

### 9. Menjalankan BIND9

Restart service:

``` bash
sudo systemctl restart bind9
```

Periksa status:

``` bash
sudo systemctl status bind9
```

Melihat log jika terjadi error:

``` bash
sudo journalctl -u bind9 -n 50 --no-pager
```

### 10. Melakukan DNS Query Menggunakan dig

Sekarang kita dapat menguji DNS records yang sudah dibuat.

#### Memeriksa A Record

``` bash
dig @127.0.0.1 lab.test A
```

Memeriksa hostname lainnya:

``` bash
dig @127.0.0.1 www.lab.test A
dig @127.0.0.1 api.lab.test A
dig @127.0.0.1 admin.lab.test A
```

#### Memeriksa NS Record

``` bash
dig @127.0.0.1 lab.test NS
```

#### Memeriksa SOA Record

``` bash
dig @127.0.0.1 lab.test SOA
```

#### Menampilkan jawaban saja

``` bash
dig @127.0.0.1 www.lab.test A +short
```

Contoh output:

``` text
192.168.1.10
```

### 11. Memahami Flag AA

Ketika melakukan query terhadap Authoritative DNS Server, perhatikan
flag pada DNS response.

Contoh:

``` text
;; ->>HEADER<<- opcode: QUERY, status: NOERROR
;; flags: qr aa
```

Flag:

  Flag   Fungsi
  ------ --------------------------
  `qr`   Response dari DNS Server
  `aa`   Authoritative Answer

Flag `aa` menunjukkan bahwa DNS Server memberikan jawaban authoritative
untuk zone tersebut.

Untuk menguji bahwa BIND memberikan jawaban authoritative tanpa
melakukan recursive resolution:

``` bash
dig @127.0.0.1 lab.test SOA +norecurse
```

Perhatikan apakah response memiliki flag `aa`.

### 12. Memahami Alur DNS Query

Misalnya client ingin mendapatkan IP address dari:

``` text
www.lab.test
```

Alur sederhananya:

``` text
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

BIND tidak perlu menghubungi Root DNS Server atau TLD DNS Server untuk
menjawab query tersebut karena BIND sudah memiliki data zone `lab.test`.

### 13. Hubungan BIND dengan Unbound

Dalam lab kita, BIND dan Unbound menjalankan fungsi berbeda.

  Software   Fungsi                     Port
  ---------- -------------------------- ------
  BIND       Authoritative DNS Server   53
  Unbound    Recursive DNS Resolver     5353

Jika Unbound ingin mendapatkan DNS records dari BIND, kita dapat
menggunakan `forward-zone`.

Contoh konfigurasi pada Unbound:

``` conf
forward-zone:
    name: "lab.test"
    forward-addr: 127.0.0.1@53
```

Alurnya:

``` text
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

``` bash
dig @127.0.0.1 -p 5353 www.lab.test A
```

Dengan konfigurasi tersebut, client dapat meminta DNS record lokal
melalui Unbound, sedangkan BIND tetap menjadi sumber authoritative untuk
zone `lab.test`.

### 14. Catatan Penting

#### Perbedaan Forward Zone dan Reverse Zone

Forward Zone:

``` text
Hostname → IP Address
```

Contoh:

``` text
www.lab.test → 192.168.1.10
```

Reverse Zone:

``` text
IP Address → Hostname
```

Contoh:

``` text
192.168.1.10 → www.lab.test
```

Reverse Zone menggunakan PTR Record dan nama zone khusus seperti:

``` text
1.168.192.in-addr.arpa
```

Reverse Zone merupakan konfigurasi tambahan dan tidak wajib untuk
membuat Forward Zone berfungsi.

#### Catatan mengenai IP Address ns1

Pada lab ini, `ns1.lab.test` menggunakan:

``` text
127.0.0.1
```

Alamat tersebut hanya dapat dijangkau dari komputer itu sendiri melalui
loopback.

Jika nameserver ingin diakses oleh komputer lain di jaringan, gunakan IP
address jaringan server yang dapat dijangkau oleh client, bukan
`127.0.0.1`.

------------------------------------------------------------------------

### Detail Materi yang Sudah Dipelajari

-   [x] Mengenal fungsi Authoritative DNS Server.
-   [x] Mengenal BIND9.
-   [x] Menginstal BIND9 pada Ubuntu.
-   [x] Memahami struktur konfigurasi BIND.
-   [x] Memahami fungsi `named.conf.local`.
-   [x] Membuat Forward Zone.
-   [x] Membuat dan mengelola zone file.
-   [x] Memahami A Record.
-   [x] Memahami NS Record.
-   [x] Memahami SOA Record.
-   [x] Memahami TTL.
-   [x] Memahami Serial Number.
-   [x] Mengonfigurasi BIND sebagai Authoritative-Only.
-   [x] Memvalidasi konfigurasi menggunakan `named-checkconf`.
-   [x] Memvalidasi zone file menggunakan `named-checkzone`.
-   [x] Mengelola service menggunakan `systemctl`.
-   [x] Memeriksa log menggunakan `journalctl`.
-   [x] Melakukan DNS query menggunakan `dig`.
-   [x] Memahami flag `aa`.
-   [x] Memahami perbedaan Forward Zone dan Reverse Zone.
-   [x] Memahami hubungan BIND dengan Unbound.

### Kesimpulan

BIND9 sebagai Authoritative DNS Server bertugas menyimpan dan memberikan
DNS records untuk domain atau zone yang dikelolanya.

Zone file merupakan tempat penyimpanan DNS records seperti A, NS, dan
SOA.

Ketika client meminta DNS record untuk domain yang dikelola BIND, BIND
dapat langsung memberikan jawaban berdasarkan data zone yang
dimilikinya.

Dalam lab ini, BIND bertindak sebagai Authoritative DNS Server untuk
`lab.test`, sedangkan Unbound bertindak sebagai Recursive DNS Resolver.

### Referensi

-   Ubuntu Server Documentation --- Domain Name Service (DNS):
    https://ubuntu.com/server/docs/service-domain-name-service-dns/
-   Ubuntu Server Documentation --- DNSSEC:
    https://ubuntu.com/server/docs/how-to/networking/install-dnssec/
-   Ubuntu Manpage --- named-checkzone:
    https://manpages.ubuntu.com/manpages/noble/man1/named-checkzone.1.html

------------------------------------------------------------------------

# Part 7 --- DNS Zone, SOA, NS, dan Zone Transfer (AXFR)

### 1. Mental Model Utama

Ketika melakukan investigasi terhadap sebuah DNS zone, alur dasarnya:

``` text
Hostname / Domain
       ↓
Find SOA
       ↓
Identify DNS Zone
       ↓
Find NS
       ↓
Identify Authoritative Nameserver
       ↓
Query Authoritative Server
       ↓
Check "aa"
       ↓
AXFR
       ↓
   ┌───┴─────┐
Allowed     Denied
   ↓           ↓
Zone Data   Transfer failed
```

Hal penting:

``` text
Authoritative Nameserver
          ≠
     AXFR Allowed
```

Sebuah DNS server dapat authoritative terhadap sebuah zone tetapi tetap
menolak zone transfer.

------------------------------------------------------------------------

## 2. Apa Itu DNS Zone?

DNS zone adalah bagian dari DNS namespace yang dikelola sebagai satu
unit administratif.

Contoh:

``` text
hackycorp.com
```

dapat menjadi sebuah zone.

Tetapi:

``` text
z.hackycorp.com
```

juga dapat menjadi zone terpisah apabila didelegasikan.

Mental model:

``` text
hackycorp.com
│
├── www.hackycorp.com
├── mail.hackycorp.com
│
└── z.hackycorp.com
        │
        └── Can be a separate delegated zone
```

Jika `z.hackycorp.com` menjadi zone sendiri, zone tersebut dapat
mempunyai:

``` text
SOA sendiri
NS sendiri
Authoritative server sendiri
AXFR policy sendiri
```

------------------------------------------------------------------------

## 3. Apa Itu SOA?

**SOA = Start of Authority**

SOA adalah DNS record yang berisi informasi administratif utama mengenai
sebuah DNS zone.

Contoh:

``` text
z.hackycorp.com. 604800 IN SOA ns1.hackycorp.com. ns1.hackycorp.com. 2 604800 86400 2419200 604800
```

Format umum:

``` text
ZONE IN SOA MNAME RNAME SERIAL REFRESH RETRY EXPIRE MINIMUM
```

Untuk contoh di atas:

``` text
ZONE    = z.hackycorp.com.
MNAME   = ns1.hackycorp.com.
RNAME   = ns1.hackycorp.com.
SERIAL  = 2
REFRESH = 604800
RETRY   = 86400
EXPIRE  = 2419200
MINIMUM = 604800
```

Mental model:

``` text
DNS Zone
   ↓
z.hackycorp.com
   ↓
SOA Record
   ↓
Administrative information
about the zone
```

SOA adalah **DNS record**, bukan DNS server.

------------------------------------------------------------------------

## 4. Field di Dalam SOA

SOA mempunyai beberapa field penting:

``` text
SOA
 │
 ├── MNAME
 ├── RNAME
 ├── SERIAL
 ├── REFRESH
 ├── RETRY
 ├── EXPIRE
 └── MINIMUM
```

### MNAME

MNAME adalah primary/master nameserver yang dicantumkan dalam metadata
SOA.

Contoh:

``` text
SOA ns1.hackycorp.com. ns1.hackycorp.com. 2 ...
    ↑
   MNAME
```

Maka:

``` text
MNAME = ns1.hackycorp.com
```

Mental model:

``` text
SOA
 ↓
MNAME
 ↓
Primary/master nameserver
listed in the SOA metadata
```

MNAME **tidak boleh langsung dianggap sebagai daftar seluruh
authoritative nameserver**.

Untuk mengetahui authoritative nameserver yang dipublikasikan untuk
zone, lihat `NS` record.

------------------------------------------------------------------------

### RNAME

Field setelah MNAME adalah RNAME.

``` text
SOA ns1.hackycorp.com. ns1.hackycorp.com. 2 ...
                       ↑
                      RNAME
```

RNAME merepresentasikan kontak administrator zone menggunakan format
DNS.

------------------------------------------------------------------------

### SERIAL

Contoh:

``` text
SERIAL = 2
```

Serial menunjukkan versi data zone.

Ketika zone diperbarui, serial biasanya ikut diperbarui sehingga
secondary server dapat mengetahui bahwa tersedia versi zone yang lebih
baru.

Mental model:

``` text
Zone version 1
     ↓
Zone changed
     ↓
Serial increased
     ↓
Secondary detects newer version
```

------------------------------------------------------------------------

### REFRESH

Menentukan interval secondary nameserver untuk memeriksa apakah terdapat
versi zone yang lebih baru.

------------------------------------------------------------------------

### RETRY

Jika refresh gagal, secondary server menunggu interval ini sebelum
mencoba kembali.

------------------------------------------------------------------------

### EXPIRE

Menentukan berapa lama secondary dapat mempertahankan data zone ketika
tidak berhasil melakukan refresh dari primary.

------------------------------------------------------------------------

### MINIMUM

Pada DNS modern, field ini digunakan sebagai nilai yang berkaitan dengan
**negative caching TTL**.

Contohnya ketika resolver mendapatkan informasi bahwa suatu nama/record
tidak ada.

------------------------------------------------------------------------

## 5. SOA MNAME vs NS

Ini merupakan perbedaan penting.

Misalnya:

``` text
SOA:
z.hackycorp.com. IN SOA ns1.hackycorp.com. ...
```

Maka:

``` text
MNAME
 ↓
ns1.hackycorp.com
```

Tetapi kita juga mendapatkan:

``` text
AUTHORITY SECTION:

z.hackycorp.com. IN NS z.hackycorp.com.
```

Maka NS record mengatakan:

``` text
Zone
 ↓
z.hackycorp.com
 ↓
NS
 ↓
z.hackycorp.com
```

Keduanya memiliki fungsi berbeda.

``` text
                z.hackycorp.com
                       │
                    DNS Zone
                       │
             ┌─────────┴─────────┐
             ↓                   ↓
            SOA                  NS
             ↓                   ↓
           MNAME          Authoritative NS
             ↓                   ↓
ns1.hackycorp.com       z.hackycorp.com
```

Mental model:

``` text
SOA → information about the zone
NS  → nameservers serving the zone
```

Lebih spesifik:

``` text
SOA MNAME
    ↓
"Which server is listed as the
 primary/master in SOA metadata?"
```

sedangkan:

``` text
NS
 ↓
"Which nameservers are authoritative
 for this zone?"
```

------------------------------------------------------------------------

## 6. Membaca AUTHORITY SECTION

Contoh:

``` text
;; AUTHORITY SECTION:
z.hackycorp.com. 604800 IN NS z.hackycorp.com.
```

Strukturnya:

``` text
z.hackycorp.com. 604800 IN NS z.hackycorp.com.
       │          │    │  │          │
       │          │    │  │          └── Nameserver
       │          │    │  └───────────── Record type
       │          │    └──────────────── Internet class
       │          └───────────────────── TTL
       └──────────────────────────────── Zone
```

Artinya:

``` text
Zone
 ↓
z.hackycorp.com
 ↓
Authoritative NS
 ↓
z.hackycorp.com
```

------------------------------------------------------------------------

## 7. Membaca ADDITIONAL SECTION

Contoh:

``` text
;; ADDITIONAL SECTION:
z.hackycorp.com. 604800 IN A 51.158.147.132
```

Ini memberikan IP address untuk nameserver tersebut.

Mental model:

``` text
Zone
 ↓
z.hackycorp.com
 ↓
NS
 ↓
z.hackycorp.com
 ↓
A
 ↓
51.158.147.132
```

Sekarang kita mengetahui:

``` text
DNS Zone
    ↓
z.hackycorp.com

Authoritative Nameserver
    ↓
z.hackycorp.com

IP Address
    ↓
51.158.147.132
```

------------------------------------------------------------------------

## 8. Memverifikasi Authoritative Server

Kita dapat query server tersebut secara langsung:

``` bash
# Query the authoritative nameserver directly
dig @z.hackycorp.com z.hackycorp.com SOA
```

Atau menggunakan IP:

``` bash
# Query the authoritative nameserver by IP address
dig @51.158.147.132 z.hackycorp.com SOA
```

Perhatikan flag:

``` text
flags: qr aa ...
```

`aa` berarti:

``` text
Authoritative Answer
```

Mental model:

``` text
Client
  ↓
Direct DNS Query
  ↓
z.hackycorp.com
  ↓
Response
  ↓
aa flag
  ↓
Authoritative Answer
```

------------------------------------------------------------------------

## 9. Normal DNS Query vs AXFR

Query DNS biasa meminta record tertentu.

Contoh:

``` bash
# Query the A record
dig @z.hackycorp.com z.hackycorp.com A

# Query the NS record
dig @z.hackycorp.com z.hackycorp.com NS

# Query the SOA record
dig @z.hackycorp.com z.hackycorp.com SOA
```

Mental model:

``` text
Client
  ↓
DNS Query
  ↓
Authoritative Server
  ↓
Specific DNS Record
  ↓
Response
```

AXFR berbeda.

``` bash
# Attempt a zone transfer
dig @z.hackycorp.com z.hackycorp.com AXFR
```

AXFR meminta transfer seluruh zone.

``` text
Client
  ↓
AXFR
  ↓
Authoritative Server
  ↓
"Is this client allowed to transfer this zone?"
  ↓
Allowed / Denied
```

------------------------------------------------------------------------

## 10. Kenapa AXFR hackycorp.com Gagal?

Contoh:

``` bash
# Attempt a zone transfer
dig @ns-123-c.gandi.net hackycorp.com AXFR
```

Menghasilkan:

``` text
; Transfer failed.
```

Mental model:

``` text
hackycorp.com
      ↓
Authoritative Server
      ↓
ns-123-c.gandi.net
      ↓
AXFR hackycorp.com
      ↓
Zone Transfer Policy
      ↓
DENIED
      ↓
Transfer failed
```

Authoritative server tidak harus memberikan seluruh isi zone kepada
setiap client.

Jadi:

``` text
Authoritative
     ≠
AXFR Allowed
```

------------------------------------------------------------------------

## 11. Kenapa AXFR z.hackycorp.com Bisa Berhasil?

Command:

``` bash
# Attempt a zone transfer
dig axfr z.hackycorp.com @z.hackycorp.com
```

Secara konsep sama dengan:

``` bash
dig @z.hackycorp.com z.hackycorp.com AXFR
```

Strukturnya:

``` text
dig @SERVER ZONE TYPE
```

Sehingga:

``` text
SERVER = z.hackycorp.com
ZONE   = z.hackycorp.com
TYPE   = AXFR
```

Mental model:

``` text
Client
  ↓
AXFR z.hackycorp.com
  ↓
z.hackycorp.com
  ↓
Zone Transfer Policy
  ↓
ALLOWED
  ↓
Zone Records
```

Hal ini tidak bertentangan dengan AXFR `hackycorp.com` yang gagal.

Keduanya dapat merupakan zone berbeda:

``` text
hackycorp.com
      ↓
AXFR denied


z.hackycorp.com
      ↓
AXFR allowed
```

------------------------------------------------------------------------

## 12. Parent Zone dan Child Zone

Mental model:

``` text
hackycorp.com                 ← Parent zone
│
├── www.hackycorp.com
├── mail.hackycorp.com
│
└── z.hackycorp.com           ← Delegated child zone
        │
        └── Own authoritative DNS
```

Jika `z.hackycorp.com` didelegasikan menjadi zone sendiri:

``` text
hackycorp.com
       │
       │ delegation
       ↓
z.hackycorp.com
       │
       ├── SOA
       ├── NS
       ├── DNS records
       └── AXFR policy
```

Jadi parent dan child dapat memiliki kebijakan zone transfer berbeda.

------------------------------------------------------------------------

## 13. Zone "int"

Command:

``` bash
dig axfr int @z.hackycorp.com
```

dapat dibaca sebagai:

``` bash
dig @z.hackycorp.com int AXFR
```

Artinya:

``` text
SERVER = z.hackycorp.com
ZONE   = int
TYPE   = AXFR
```

Mental model:

``` text
Client
  ↓
Ask z.hackycorp.com
  ↓
AXFR zone "int"
  ↓
Does the server serve this zone?
  ↓
Is AXFR allowed?
  ↓
YES
  ↓
Return zone records
```

`int` di sini adalah nama zone yang diminta.

Jangan otomatis menganggap:

``` text
int
```

sama dengan:

``` text
int.z.hackycorp.com
```

Keduanya adalah nama DNS yang berbeda.

------------------------------------------------------------------------

## 14. Urutan Command Investigasi Zone

Contoh menggunakan `hackycorp.com`:

``` bash
# 1. Start with the domain
dig hackycorp.com

# 2. Find the SOA record to identify the DNS zone
dig hackycorp.com SOA

# 3. Find the authoritative nameservers for the zone
dig hackycorp.com NS

# 4. Resolve the authoritative nameserver IP address
dig ns-123-c.gandi.net A

# 5. Query the authoritative nameserver directly
dig @ns-123-c.gandi.net hackycorp.com SOA

# 6. Verify that the server returns an authoritative answer
dig @ns-123-c.gandi.net hackycorp.com A

# Check for the "aa" flag in the response

# 7. Attempt a zone transfer only when authorized
dig @ns-123-c.gandi.net hackycorp.com AXFR
```

Untuk child zone:

``` bash
# Query the child zone SOA record
dig z.hackycorp.com SOA

# Query the child zone NS record
dig z.hackycorp.com NS

# Query the child zone authoritative server directly
dig @z.hackycorp.com z.hackycorp.com SOA

# Verify the authoritative answer
dig @z.hackycorp.com z.hackycorp.com A

# Attempt the zone transfer only when authorized
dig @z.hackycorp.com z.hackycorp.com AXFR
```

------------------------------------------------------------------------

## 15. Mental Model SOA → NS → AXFR

``` text
Domain / Hostname
       ↓
SOA
       ↓
Identify Zone
       ↓
Inspect SOA Metadata
       │
       ├── MNAME
       ├── RNAME
       ├── SERIAL
       ├── REFRESH
       ├── RETRY
       ├── EXPIRE
       └── MINIMUM
       ↓
NS
       ↓
Authoritative Nameserver
       ↓
Resolve Nameserver IP
       ↓
Direct DNS Query
       ↓
Check "aa"
       ↓
AXFR
       ↓
Zone Transfer Policy
       ↓
 ┌─────┴─────┐
 ↓           ↓
Allowed     Denied
 ↓           ↓
Records    Transfer failed
```

------------------------------------------------------------------------

## 16. Mental Model yang Harus Diingat

### SOA

``` text
SOA
 ↓
Administrative information
about a DNS zone
```

SOA adalah **record**.

------------------------------------------------------------------------

### MNAME

``` text
SOA
 ↓
MNAME
 ↓
Primary/master nameserver
listed in SOA metadata
```

MNAME adalah **field di dalam SOA**.

------------------------------------------------------------------------

### NS

``` text
NS
 ↓
Which nameservers are authoritative
for this zone?
```

NS adalah record yang menunjukkan nameserver untuk zone.

------------------------------------------------------------------------

### A / AAAA

``` text
Nameserver
    ↓
A / AAAA
    ↓
IP Address
```

------------------------------------------------------------------------

### AA Flag

``` text
Direct Query
    ↓
Authoritative Server
    ↓
aa
    ↓
Authoritative Answer
```

------------------------------------------------------------------------

### AXFR

``` text
AXFR
 ↓
Request the entire DNS zone
 ↓
Server checks transfer policy
```

------------------------------------------------------------------------

## 17. Kesimpulan

Jangan menyamakan:

``` text
SOA
MNAME
NS
AXFR
```

Masing-masing mempunyai fungsi berbeda.

Mental modelnya:

``` text
DNS Zone
   │
   ├── SOA
   │     ↓
   │   Zone metadata
   │     ↓
   │   MNAME
   │
   ├── NS
   │     ↓
   │   Authoritative Nameservers
   │
   └── AXFR
         ↓
       Zone Transfer
```

Untuk kasus:

``` text
z.hackycorp.com
```

kita melihat:

``` text
SOA
 ↓
MNAME
 ↓
ns1.hackycorp.com
```

sementara NS record menunjukkan:

``` text
NS
 ↓
z.hackycorp.com
 ↓
51.158.147.132
```

Karena itu:

``` text
MNAME
   ≠
Automatically the complete NS list
```

Dan:

``` text
Authoritative Nameserver
          ≠
     AXFR Allowed
```

Urutan berpikir yang paling berguna adalah:

``` text
Find Zone
   ↓
Read SOA
   ↓
Understand MNAME
   ↓
Read NS
   ↓
Find Authoritative Nameserver
   ↓
Verify with "aa"
   ↓
Test AXFR only when authorized
```

------------------------------------------------------------------------
