# DNS Zone Transfer (AXFR)

## 1. Mental Model Utama

Ketika melakukan investigasi terhadap sebuah DNS zone, alur dasarnya:

```text
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

```text
Authoritative Nameserver
          ≠
     AXFR Allowed
```

Sebuah DNS server dapat authoritative terhadap sebuah zone tetapi tetap menolak zone transfer.

---

# 2. Apa Itu DNS Zone?

DNS zone adalah bagian dari DNS namespace yang dikelola sebagai satu unit administratif.

Contoh:

```text
hackycorp.com
```

dapat menjadi sebuah zone.

Tetapi:

```text
z.hackycorp.com
```

juga dapat menjadi zone terpisah apabila didelegasikan.

Mental model:

```text
hackycorp.com
│
├── www.hackycorp.com
├── mail.hackycorp.com
│
└── z.hackycorp.com
        │
        └── Can be a separate delegated zone
```

Jika `z.hackycorp.com` menjadi zone sendiri, zone tersebut dapat mempunyai:

```text
SOA sendiri
NS sendiri
Authoritative server sendiri
AXFR policy sendiri
```

---

# 3. Apa Itu SOA?

**SOA = Start of Authority**

SOA adalah DNS record yang berisi informasi administratif utama mengenai sebuah DNS zone.

Contoh:

```text
z.hackycorp.com. 604800 IN SOA ns1.hackycorp.com. ns1.hackycorp.com. 2 604800 86400 2419200 604800
```

Format umum:

```text
ZONE IN SOA MNAME RNAME SERIAL REFRESH RETRY EXPIRE MINIMUM
```

Untuk contoh di atas:

```text
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

```text
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

---

# 4. Field di Dalam SOA

SOA mempunyai beberapa field penting:

```text
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

## MNAME

MNAME adalah primary/master nameserver yang dicantumkan dalam metadata SOA.

Contoh:

```text
SOA ns1.hackycorp.com. ns1.hackycorp.com. 2 ...
    ↑
   MNAME
```

Maka:

```text
MNAME = ns1.hackycorp.com
```

Mental model:

```text
SOA
 ↓
MNAME
 ↓
Primary/master nameserver
listed in the SOA metadata
```

MNAME **tidak boleh langsung dianggap sebagai daftar seluruh authoritative nameserver**.

Untuk mengetahui authoritative nameserver yang dipublikasikan untuk zone, lihat `NS` record.

---

## RNAME

Field setelah MNAME adalah RNAME.

```text
SOA ns1.hackycorp.com. ns1.hackycorp.com. 2 ...
                       ↑
                      RNAME
```

RNAME merepresentasikan kontak administrator zone menggunakan format DNS.

---

## SERIAL

Contoh:

```text
SERIAL = 2
```

Serial menunjukkan versi data zone.

Ketika zone diperbarui, serial biasanya ikut diperbarui sehingga secondary server dapat mengetahui bahwa tersedia versi zone yang lebih baru.

Mental model:

```text
Zone version 1
     ↓
Zone changed
     ↓
Serial increased
     ↓
Secondary detects newer version
```

---

## REFRESH

Menentukan interval secondary nameserver untuk memeriksa apakah terdapat versi zone yang lebih baru.

---

## RETRY

Jika refresh gagal, secondary server menunggu interval ini sebelum mencoba kembali.

---

## EXPIRE

Menentukan berapa lama secondary dapat mempertahankan data zone ketika tidak berhasil melakukan refresh dari primary.

---

## MINIMUM

Pada DNS modern, field ini digunakan sebagai nilai yang berkaitan dengan **negative caching TTL**.

Contohnya ketika resolver mendapatkan informasi bahwa suatu nama/record tidak ada.

---

# 5. SOA MNAME vs NS

Ini merupakan perbedaan penting.

Misalnya:

```text
SOA:
z.hackycorp.com. IN SOA ns1.hackycorp.com. ...
```

Maka:

```text
MNAME
 ↓
ns1.hackycorp.com
```

Tetapi kita juga mendapatkan:

```text
AUTHORITY SECTION:

z.hackycorp.com. IN NS z.hackycorp.com.
```

Maka NS record mengatakan:

```text
Zone
 ↓
z.hackycorp.com
 ↓
NS
 ↓
z.hackycorp.com
```

Keduanya memiliki fungsi berbeda.

```text
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

```text
SOA → information about the zone
NS  → nameservers serving the zone
```

Lebih spesifik:

```text
SOA MNAME
    ↓
"Which server is listed as the
 primary/master in SOA metadata?"
```

sedangkan:

```text
NS
 ↓
"Which nameservers are authoritative
 for this zone?"
```

---

# 6. Membaca AUTHORITY SECTION

Contoh:

```text
;; AUTHORITY SECTION:
z.hackycorp.com. 604800 IN NS z.hackycorp.com.
```

Strukturnya:

```text
z.hackycorp.com. 604800 IN NS z.hackycorp.com.
       │          │    │  │          │
       │          │    │  │          └── Nameserver
       │          │    │  └───────────── Record type
       │          │    └──────────────── Internet class
       │          └───────────────────── TTL
       └──────────────────────────────── Zone
```

Artinya:

```text
Zone
 ↓
z.hackycorp.com
 ↓
Authoritative NS
 ↓
z.hackycorp.com
```

---

# 7. Membaca ADDITIONAL SECTION

Contoh:

```text
;; ADDITIONAL SECTION:
z.hackycorp.com. 604800 IN A 51.158.147.132
```

Ini memberikan IP address untuk nameserver tersebut.

Mental model:

```text
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

```text
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

---

# 8. Memverifikasi Authoritative Server

Kita dapat query server tersebut secara langsung:

```bash
# Query the authoritative nameserver directly
dig @z.hackycorp.com z.hackycorp.com SOA
```

Atau menggunakan IP:

```bash
# Query the authoritative nameserver by IP address
dig @51.158.147.132 z.hackycorp.com SOA
```

Perhatikan flag:

```text
flags: qr aa ...
```

`aa` berarti:

```text
Authoritative Answer
```

Mental model:

```text
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

---

# 9. Normal DNS Query vs AXFR

Query DNS biasa meminta record tertentu.

Contoh:

```bash
# Query the A record
dig @z.hackycorp.com z.hackycorp.com A

# Query the NS record
dig @z.hackycorp.com z.hackycorp.com NS

# Query the SOA record
dig @z.hackycorp.com z.hackycorp.com SOA
```

Mental model:

```text
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

```bash
# Attempt a zone transfer
dig @z.hackycorp.com z.hackycorp.com AXFR
```

AXFR meminta transfer seluruh zone.

```text
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

---

# 10. Kenapa AXFR hackycorp.com Gagal?

Contoh:

```bash
# Attempt a zone transfer
dig @ns-123-c.gandi.net hackycorp.com AXFR
```

Menghasilkan:

```text
; Transfer failed.
```

Mental model:

```text
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

Authoritative server tidak harus memberikan seluruh isi zone kepada setiap client.

Jadi:

```text
Authoritative
     ≠
AXFR Allowed
```

---

# 11. Kenapa AXFR z.hackycorp.com Bisa Berhasil?

Command:

```bash
# Attempt a zone transfer
dig axfr z.hackycorp.com @z.hackycorp.com
```

Secara konsep sama dengan:

```bash
dig @z.hackycorp.com z.hackycorp.com AXFR
```

Strukturnya:

```text
dig @SERVER ZONE TYPE
```

Sehingga:

```text
SERVER = z.hackycorp.com
ZONE   = z.hackycorp.com
TYPE   = AXFR
```

Mental model:

```text
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

```text
hackycorp.com
      ↓
AXFR denied


z.hackycorp.com
      ↓
AXFR allowed
```

---

# 12. Parent Zone dan Child Zone

Mental model:

```text
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

```text
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

---

# 13. Zone "int"

Command:

```bash
dig axfr int @z.hackycorp.com
```

dapat dibaca sebagai:

```bash
dig @z.hackycorp.com int AXFR
```

Artinya:

```text
SERVER = z.hackycorp.com
ZONE   = int
TYPE   = AXFR
```

Mental model:

```text
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

```text
int
```

sama dengan:

```text
int.z.hackycorp.com
```

Keduanya adalah nama DNS yang berbeda.

---

# 14. Urutan Command Investigasi Zone

Contoh menggunakan `hackycorp.com`:

```bash
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

```bash
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

---

# 15. Mental Model SOA → NS → AXFR

```text
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

---

# 16. Mental Model yang Harus Diingat

## SOA

```text
SOA
 ↓
Administrative information
about a DNS zone
```

SOA adalah **record**.

---

## MNAME

```text
SOA
 ↓
MNAME
 ↓
Primary/master nameserver
listed in SOA metadata
```

MNAME adalah **field di dalam SOA**.

---

## NS

```text
NS
 ↓
Which nameservers are authoritative
for this zone?
```

NS adalah record yang menunjukkan nameserver untuk zone.

---

## A / AAAA

```text
Nameserver
    ↓
A / AAAA
    ↓
IP Address
```

---

## AA Flag

```text
Direct Query
    ↓
Authoritative Server
    ↓
aa
    ↓
Authoritative Answer
```

---

## AXFR

```text
AXFR
 ↓
Request the entire DNS zone
 ↓
Server checks transfer policy
```

---

# 17. Kesimpulan

Jangan menyamakan:

```text
SOA
MNAME
NS
AXFR
```

Masing-masing mempunyai fungsi berbeda.

Mental modelnya:

```text
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

```text
z.hackycorp.com
```

kita melihat:

```text
SOA
 ↓
MNAME
 ↓
ns1.hackycorp.com
```

sementara NS record menunjukkan:

```text
NS
 ↓
z.hackycorp.com
 ↓
51.158.147.132
```

Karena itu:

```text
MNAME
   ≠
Automatically the complete NS list
```

Dan:

```text
Authoritative Nameserver
          ≠
     AXFR Allowed
```

Urutan berpikir yang paling berguna adalah:

```text
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
