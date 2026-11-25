# Mental Model — DNS Resolution Lintas Sistem Operasi

## 1. Konsep Universal

Mental model utama DNS:

```text
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

---

# 2. Linux dengan systemd-resolved

Pada Linux yang menggunakan `systemd-resolved`:

```text
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

```text
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

`systemd-resolved` adalah **implementasi Linux tertentu**, bukan bagian wajib dari DNS.

---

# 3. Sistem Operasi Lain

Sistem operasi lain memiliki komponen DNS resolver masing-masing.

Mental modelnya tetap:

```text
Application
    ↓
OS DNS Mechanism
    ↓
Configured DNS Resolver
    ↓
DNS Server
```

Yang berubah hanya bagian:

```text
OS DNS Mechanism
```

Contohnya secara konseptual:

```text
Linux
Application
    ↓
systemd-resolved
    ↓
DNS Server
```

```text
Windows
Application
    ↓
Windows DNS Client / Resolver
    ↓
DNS Server
```

```text
macOS
Application
    ↓
macOS Resolver
    ↓
DNS Server
```

Jadi jangan menghafal:

```text
DNS = systemd-resolved
```

Tetapi pahami:

```text
DNS Resolution
      ↓
memiliki implementasi berbeda
      ↓
tergantung Operating System
```

---

# 4. dig google.com

Command:

```bash
dig google.com
```

Mental model:

```text
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

```text
/etc/resolv.conf

nameserver 127.0.0.53
```

maka:

```text
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

---

# 5. dig @8.8.8.8 google.com

Jika DNS server ditentukan secara eksplisit:

```bash
dig @8.8.8.8 google.com
```

mental model berubah menjadi:

```text
dig
 ↓
8.8.8.8:53
 ↓
DNS Query
 ↓
DNS Response
```

Nameserver default dari konfigurasi resolver tidak digunakan untuk query tersebut.

Perbandingan:

```text
dig google.com

dig
 ↓
Resolver Configuration
 ↓
Default DNS Server
```

vs:

```text
dig @8.8.8.8 google.com

dig
 ↓
8.8.8.8:53
```

---

# 6. Browser Menggunakan System DNS

Jika browser menggunakan resolver sistem operasi:

```text
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

```text
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

```text
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

---

# 7. Browser Menggunakan DNS over HTTPS

Jika browser melakukan DNS over HTTPS (DoH) sendiri:

```text
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

Untuk query yang ditangani DoH tersebut, browser dapat melewati resolver DNS normal milik OS.

Perbandingan:

```text
System DNS

Browser
   ↓
OS Resolver
   ↓
DNS Server :53
```

vs:

```text
Browser DoH

Browser
   ↓
HTTPS
   ↓
DoH Resolver :443
```

---

# 8. Mental Model Request Website

Tanpa DoH:

```text
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

```text
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

---

# 9. Mental Model yang Harus Diingat

Jangan terlalu terikat pada nama software seperti:

```text
systemd-resolved
BIND
Unbound
```

Mulai dari konsep:

```text
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

```text
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

```text
Browser
    ↓
systemd-resolved
    ↓
8.8.8.8
```

Contoh resolver lokal:

```text
Application
    ↓
systemd-resolved
    ↓
Unbound
    ↓
DNS Infrastructure
```

Contoh browser DoH:

```text
Browser
    ↓
DoH
    ↓
DoH Provider
```

## Prinsip Utama

> Pelajari **konsep dan aliran datanya terlebih dahulu**, kemudian lihat software atau komponen apa yang mengimplementasikan setiap bagian.

Dengan begitu, ketika berpindah dari Linux ke Windows, macOS, container, server, atau cloud, nama komponennya dapat berubah tetapi mental model dasarnya tetap dapat digunakan.
