# Konsep dan Cara Kerja DNS Resolver di Linux

## 1. Gambaran Besar

Ketika aplikasi ingin mengakses hostname seperti:

```text
google.com
```

komputer membutuhkan IP address dari hostname tersebut.

Contoh:

```text
google.com
    ↓
142.250.x.x
```

Proses mengubah hostname menjadi IP address disebut **DNS resolution**.

Pada Ubuntu yang menggunakan `systemd-resolved`, alur umumnya:

```text
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

```text
192.168.8.1
1.1.1.1
8.8.8.8
```

---

# 2. systemd-resolved

`systemd-resolved` adalah service Linux yang menangani resolusi nama untuk sistem.

Cek status:

```bash
systemctl status systemd-resolved
```

Melihat konfigurasi DNS:

```bash
resolvectl status
```

Contoh:

```text
Link 3 (wlp0s20f3)
    Current DNS Server: 8.8.8.8
    DNS Servers: 192.168.8.1 1.1.1.1 8.8.8.8
```

`Current DNS Server` menunjukkan DNS server yang saat ini dipilih `systemd-resolved` untuk link tersebut.

---

# 3. Stub Resolver 127.0.0.53

Pada konfigurasi `systemd-resolved` dengan stub mode, `/etc/resolv.conf` biasanya berisi:

```text
nameserver 127.0.0.53
```

Cek dengan:

```bash
cat /etc/resolv.conf
```

`127.0.0.53` adalah local DNS stub milik `systemd-resolved`.

Secara sederhana:

```text
Application
    ↓
127.0.0.53:53
    ↓
systemd-resolved
    ↓
Upstream DNS Server
```

Misalnya upstream yang sedang digunakan:

```text
8.8.8.8:53
```

---

# 4. Cache pada systemd-resolved

Ketika menerima permintaan resolusi, `systemd-resolved` dapat menggunakan cache.

Contoh:

```text
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

Jika data masih tersedia dan valid di cache, tidak perlu melakukan query upstream baru.

Jika tidak tersedia, `systemd-resolved` dapat mengirim query ke DNS server upstream.

Cache dapat dibersihkan dengan:

```bash
sudo resolvectl flush-caches
```

---

# 5. resolvectl query

Command:

```bash
resolvectl query google.com
```

digunakan untuk meminta `systemd-resolved` melakukan resolusi nama.

Konsep:

```text
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

```bash
resolvectl query google.com
```

Hasilnya dapat berupa:

```text
google.com: 142.250.x.x
```

---

# 6. Cara Kerja dig google.com

Command:

```bash
dig google.com
```

tidak berarti `dig` secara otomatis menghubungi `8.8.8.8`.

`dig` melihat konfigurasi resolver, biasanya melalui:

```text
/etc/resolv.conf
```

Misalnya:

```bash
cat /etc/resolv.conf
```

menghasilkan:

```text
nameserver 127.0.0.53
```

Maka:

```bash
dig google.com
```

akan mengirim DNS query ke:

```text
127.0.0.53:53
```

Dalam konfigurasi ini, alamat tersebut adalah stub `systemd-resolved`.

Alurnya:

```text
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

```bash
dig google.com
```

mengikuti konfigurasi DNS resolver yang digunakan oleh `dig`.

---

# 7. dig dengan DNS Server Spesifik

Kita juga bisa menentukan DNS server secara langsung.

Contoh:

```bash
dig @8.8.8.8 google.com
```

`@8.8.8.8` berarti:

> Kirim DNS query langsung ke DNS server `8.8.8.8`.

Alurnya menjadi:

```text
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

Dengan begitu, `dig` tidak menggunakan nameserver default dari `/etc/resolv.conf` untuk query tersebut.

Perbandingan:

```text
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

```text
dig @8.8.8.8 google.com

dig
 ↓
8.8.8.8:53
```

---

# 8. Menentukan Port dengan dig

DNS standar menggunakan port:

```text
53
```

Kita juga dapat menentukan port sendiri.

Contoh Unbound berjalan pada:

```text
127.0.0.1:5353
```

Query:

```bash
dig @127.0.0.1 -p 5353 google.com
```

Artinya:

```text
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

Ini berguna ketika menjalankan DNS resolver sendiri pada port non-standar.

---

# 9. DNS Query dan Port 53

Contoh DNS query:

```text
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

```text
8.8.8.8:53
        |
        | UDP DNS Response
        v
192.168.8.100:52341
```

Yang perlu dibedakan:

```text
53
```

adalah **port DNS**.

Sedangkan:

```text
142.250.x.x
```

adalah contoh **IP address yang terdapat dalam jawaban DNS**.

Jadi port `53` bukan "IP address hasil dari google.com".

---

# 10. Browser Menggunakan System DNS

Dalam kondisi normal, browser dapat menggunakan mekanisme resolver sistem operasi.

Misalnya membuka:

```text
https://google.com
```

Secara konseptual:

```text
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

```text
google.com
    ↓
IP address
```

kemudian koneksi web:

```text
IP address:443
```

---

# 11. Browser dengan DNS over HTTPS (DoH)

Browser modern dapat menggunakan **DNS over HTTPS (DoH)**.

Jika browser menggunakan DoH secara langsung, query DNS tertentu dapat dilakukan oleh browser melalui koneksi HTTPS ke DoH resolver, bukan melalui DNS resolver sistem operasi.

Alurnya berubah dari:

```text
Browser
    ↓
System Resolver
    ↓
systemd-resolved
    ↓
DNS Server :53
```

menjadi secara konseptual:

```text
Browser
    |
    | HTTPS
    v
DoH Server :443
    |
    v
DNS Response
```

Jadi browser dapat melewati DNS resolver sistem operasi untuk resolusi yang ditangani oleh DoH.

Contoh konsep:

```text
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

Namun detail perilakunya bergantung pada browser, konfigurasi DoH, kebijakan sistem, dan fallback yang digunakan.

---

# 12. Perbedaan DNS Biasa dan DoH

DNS biasa:

```text
Browser/Application
       ↓
systemd-resolved
       ↓
DNS Server
       ↓
UDP/TCP 53
```

DNS over HTTPS:

```text
Browser
   ↓
HTTPS
   ↓
DoH Server
   ↓
Port 443
```

Karena DoH menggunakan HTTPS, DNS query tidak terlihat sebagai paket UDP/TCP port 53 biasa.

---

# 13. Mengamati DNS dengan tcpdump

Untuk melihat DNS biasa pada Wi-Fi:

```bash
sudo tcpdump -ni wlp0s20f3 'port 53'
```

Kemudian:

```bash
sudo resolvectl flush-caches
```

Lakukan query:

```bash
resolvectl query google.com
```

atau:

```bash
dig google.com
```

Kita dapat melihat paket seperti:

```text
192.168.8.x.52341 > 8.8.8.8.53
8.8.8.8.53 > 192.168.8.x.52341
```

Artinya:

```text
Client ephemeral port
        ↓
DNS Server port 53
        ↓
DNS Response
```

---

# 14. Mengapa DNS Browser Kadang Tidak Terlihat di Port 53?

Misalnya kita menjalankan:

```bash
sudo tcpdump -ni wlp0s20f3 'port 53'
```

kemudian membuka website tetapi tidak melihat DNS query.

Beberapa kemungkinan:

1. DNS answer sudah berada di cache.
2. Browser memiliki DNS cache sendiri.
3. `systemd-resolved` memiliki cache.
4. Browser menggunakan DNS over HTTPS.
5. Browser menggunakan koneksi/network state yang sudah ada.

Karena itu, tidak munculnya paket port 53 tidak otomatis berarti DNS tidak terjadi sama sekali.

---

# 15. Perbandingan Command

### Menggunakan systemd-resolved secara eksplisit

```bash
resolvectl query google.com
```

Konsep:

```text
resolvectl
    ↓
systemd-resolved
    ↓
cache / upstream DNS
```

---

### Menggunakan resolver dari konfigurasi dig

```bash
dig google.com
```

Konsep:

```text
dig
 ↓
/etc/resolv.conf
 ↓
configured nameserver
```

Jika:

```text
nameserver 127.0.0.53
```

maka:

```text
dig
 ↓
127.0.0.53
 ↓
systemd-resolved
```

---

### Query langsung ke Google Public DNS

```bash
dig @8.8.8.8 google.com
```

Konsep:

```text
dig
 ↓
8.8.8.8:53
```

Nameserver default dari `/etc/resolv.conf` tidak digunakan untuk query tersebut.

---

### Query langsung ke Unbound lokal

```bash
dig @127.0.0.1 -p 5353 google.com
```

Konsep:

```text
dig
 ↓
127.0.0.1:5353
 ↓
Unbound
```

---

### Browser menggunakan DoH

Konsep:

```text
Browser
 ↓
HTTPS :443
 ↓
DoH Resolver
```

Untuk resolusi yang dilakukan melalui DoH tersebut, browser tidak perlu mengirim query DNS biasa melalui `systemd-resolved`.

---

# 16. Ringkasan Mental Model

Hal paling penting untuk diingat:

```text
dig google.com
```

berarti:

```text
Gunakan resolver yang dikonfigurasi untuk dig
```

Sedangkan:

```text
dig @8.8.8.8 google.com
```

berarti:

```text
Kirim DNS query langsung ke 8.8.8.8
```

Sedangkan:

```text
resolvectl query google.com
```

berarti:

```text
Minta systemd-resolved melakukan resolusi
```

Dan browser normal yang menggunakan system DNS secara konseptual:

```text
Browser
 ↓
OS resolver
 ↓
systemd-resolved
 ↓
DNS resolver
```

Tetapi browser dengan DoH dapat melakukan:

```text
Browser
 ↓
DoH
 ↓
DNS provider melalui HTTPS :443
```

Sehingga DNS resolver sistem operasi dapat dilewati untuk query yang ditangani DoH.

---

# 17. Gambaran Lengkap Request Website

Tanpa DoH:

```text
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

```text
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

```text
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

Port `443` digunakan untuk **HTTPS**, dan juga dapat membawa DNS ketika menggunakan **DNS over HTTPS (DoH)**.
