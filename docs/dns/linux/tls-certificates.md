# TLS Certificates dan SNI (Server Name Indication)

## 1. Apa itu TLS Certificate?

Ketika browser atau `curl` mengakses website menggunakan HTTPS, server akan mengirimkan TLS Certificate kepada client.

Certificate berfungsi sebagai bukti identitas server.

Client memeriksa certificate untuk memastikan:

- Certificate diterbitkan oleh Certificate Authority (CA) yang dipercaya.
- Certificate masih valid dan belum kedaluwarsa.
- Nama domain pada certificate sesuai dengan hostname yang diakses.
- Rantai certificate (certificate chain) dapat diverifikasi.

Contohnya:

```text
Client
  |
  | HTTPS Request
  v
Server
  |
  | TLS Certificate
  v
Client verifies certificate
```

## 2. Apa itu Certificate Authority (CA)?

Certificate Authority adalah pihak yang menerbitkan atau menandatangani certificate digital.

Contoh CA:

- Let's Encrypt
- DigiCert
- GlobalSign
- Sectigo

Client memiliki daftar CA yang dipercaya. Daftar ini disebut **CA Store**.

Ketika server mengirimkan certificate, client memeriksa apakah certificate tersebut dapat dipercaya berdasarkan CA Store yang dimilikinya.

## 3. Apa itu SNI (Server Name Indication)?

SNI adalah informasi hostname yang dikirimkan oleh client ketika proses TLS handshake.

SNI membantu server mengetahui domain mana yang ingin diakses oleh client.

Hal ini penting karena satu IP address dapat menjalankan banyak website dengan domain berbeda.

Contoh:

```text
51.158.147.132
    |
    |-- www.hackycorp.com
    |
    |-- admin.hackycorp.com
    |
    |-- api.hackycorp.com
```

Ketika beberapa domain menggunakan IP yang sama, server perlu mengetahui domain tujuan sebelum mengirimkan certificate yang sesuai.

Di sinilah SNI digunakan.

### Alur SNI

```text
Client
  |
  | 1. TLS ClientHello
  |    SNI: www.hackycorp.com
  |
  v
Server
  |
  | 2. Membaca hostname dari SNI
  |
  | 3. Memilih TLS Certificate
  |
  v
Client
  |
  | 4. Menerima certificate
  |
  | 5. Memverifikasi certificate
  |
  v
TLS Connection
```

SNI dikirim ketika TLS handshake berlangsung, sebelum HTTP request dikirimkan.

## 4. Apa Perbedaan SNI dan HTTP Host?

Keduanya sama-sama membawa informasi hostname, tetapi digunakan pada tahap yang berbeda.

| SNI                                                       | HTTP Host                                              |
| --------------------------------------------------------- | ------------------------------------------------------ |
| Digunakan pada TLS handshake                              | Digunakan pada HTTP request                            |
| Dikirim sebelum HTTP request                              | Dikirim setelah TLS berhasil terbentuk                 |
| Membantu server memilih TLS configuration dan certificate | Membantu server memilih website atau virtual host HTTP |

Contoh HTTP request:

```http
GET / HTTP/1.1
Host: admin.hackycorp.com
```

Pada contoh ini, HTTP Host adalah `admin.hackycorp.com`.

Sementara itu, SNI dapat tetap menggunakan `www.hackycorp.com`.

Artinya, SNI dan HTTP Host tidak harus selalu sama.

## 5. Mengapa curl Bisa Tetap Mengakses Website dengan -k?

Secara default, `curl` melakukan verifikasi TLS Certificate.

Misalnya:

```bash
curl -v https://www.hackycorp.com/
```

Jika certificate tidak dapat diverifikasi, `curl` akan menghentikan koneksi dan menampilkan error.

Salah satu contohnya:

```text
SSL certificate problem:
unable to get local issuer certificate
```

Artinya, `curl` tidak dapat membangun rantai kepercayaan certificate menggunakan CA Store yang tersedia.

### Menggunakan -k

```bash
curl -k -v https://www.hackycorp.com/
```

Opsi `-k` merupakan singkatan dari `--insecure`.

Opsi ini membuat `curl` melewati pemeriksaan certificate dan tetap melanjutkan koneksi.

Penting untuk dipahami:

**`-k` tidak menghilangkan TLS Certificate dari server. `-k` hanya melewati proses verifikasi certificate oleh client.**

Server tetap mengirimkan certificate ketika TLS handshake berlangsung.

Perbedaannya:

Tanpa `-k`:

```text
Client
  |
  | TLS Handshake
  v
Server sends certificate
  |
  v
Client verifies certificate
  |
  | Verification failed
  v
Connection aborted
```

Dengan `-k`:

```text
Client
  |
  | TLS Handshake
  v
Server sends certificate
  |
  v
Client skips certificate verification
  |
  v
TLS connection continues
  |
  v
HTTP request
```

Jadi, koneksi masih menggunakan TLS dan komunikasi tetap dienkripsi, tetapi client tidak lagi memastikan bahwa server benar-benar memiliki identitas yang sesuai dengan certificate tersebut.

Hal ini membuat koneksi rentan terhadap serangan Man-in-the-Middle (MITM).

## 6. Praktik pada HackyCorp

Pada pengujian sebelumnya, kita menggunakan:

```bash
curl -vkI https://www.hackycorp.com
```

Hasil yang ditemukan:

```text
* Connected to www.hackycorp.com
* SSL connection using TLSv1.2
* Server certificate:
* subject: CN=hackycorp.com
* issuer: Let's Encrypt; CN=YR2
* SSL certificate verify result:
  unable to get local issuer certificate (20), continuing anyway
```

Kemudian server memberikan:

```http
HTTP/1.1 200 OK
Server: nginx
```

### Apa yang terjadi?

1. `curl` berhasil terhubung ke IP server.
2. TLS handshake berlangsung.
3. Server mengirimkan certificate.
4. `curl` menemukan masalah ketika memverifikasi certificate.
5. Karena menggunakan `-k`, `curl` melanjutkan koneksi.
6. TLS berhasil digunakan untuk mengirim HTTP request.
7. Server memberikan HTTP response `200 OK`.

Artinya, masalah certificate verification tidak selalu berarti server tidak bisa diakses.

## 7. Mengapa SNI Tetap Berfungsi Ketika Menggunakan -k?

Perhatikan perintah berikut:

```bash
curl -k -v https://www.hackycorp.com/
```

Ada dua proses berbeda:

- SNI digunakan ketika TLS handshake untuk memberi tahu server hostname tujuan.
- `-k` digunakan untuk melewati verifikasi certificate setelah server mengirimkan certificate.

Dengan demikian:

```text
SNI:
www.hackycorp.com
       |
       v
Server selects certificate
       |
       v
Client receives certificate
       |
       v
-k skips certificate verification
       |
       v
TLS connection continues
```

Jadi, `-k` tidak menonaktifkan SNI.

## 8. Praktik: Melihat Certificate Tanpa Melewati Verifikasi

Untuk melihat informasi certificate dan proses TLS:

```bash
curl -vI https://www.hackycorp.com/
```

Untuk melihat proses TLS tetapi melewati verifikasi certificate:

```bash
curl -k -vI https://www.hackycorp.com/
```

Perbedaan utamanya adalah penggunaan `-k`.

- `-v`: menampilkan informasi koneksi, TLS, dan request.
- `-I`: hanya meminta HTTP response headers.
- `-k`: melewati verifikasi certificate.

## 9. Hubungan SNI dengan Virtual Host Enumeration

Pembahasan SNI menjadi penting ketika melakukan virtual host enumeration.

Misalnya, kita ingin menguji:

```text
admin.hackycorp.com
```

Ada dua cara yang berbeda.

### Cara pertama: Mengubah hostname URL

```bash
ip="51.158.147.132"
host="admin.hackycorp.com"

curl -k -i \
    --resolve "$host:443:$ip" \
    "https://$host/"
```

Dalam cara ini:

```text
SNI:        admin.hackycorp.com
HTTP Host:  admin.hackycorp.com
```

### Cara kedua: Mempertahankan SNI dan mengubah HTTP Host

```bash
ip="51.158.147.132"
host="admin.hackycorp.com"

curl -k -i \
    --resolve "www.hackycorp.com:443:$ip" \
    -H "Host: $host" \
    https://www.hackycorp.com/
```

Dalam cara ini:

```text
SNI:        www.hackycorp.com
HTTP Host:  admin.hackycorp.com
```

Cara kedua berhasil menemukan virtual host pada pengujian kita sebelumnya.

Mengapa?

Karena hostname yang digunakan untuk TLS handshake tetap `www.hackycorp.com`, sedangkan HTTP Host yang dikirimkan adalah `admin.hackycorp.com`.

Dengan demikian, kita dapat menguji pemilihan virtual host pada lapisan HTTP tanpa mengubah hostname yang digunakan pada TLS handshake.

## 10. Kesimpulan

Ada tiga hal yang perlu dibedakan:

1. **SNI**: Memberi tahu server hostname tujuan ketika TLS handshake berlangsung.
2. **TLS Certificate**: Digunakan untuk membuktikan identitas server.
3. **Certificate Verification**: Proses client memeriksa apakah certificate dapat dipercaya dan sesuai dengan hostname.

Sedangkan:

```bash
curl -k
```

Tidak menghapus certificate dan tidak mematikan SNI. Opsi tersebut hanya melewati pemeriksaan certificate oleh client.

Gunakan `-k` hanya untuk eksperimen atau pengujian yang memang memerlukannya. Untuk penggunaan normal dan production, verifikasi certificate sebaiknya tetap diaktifkan.
