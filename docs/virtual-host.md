# Virtual Host Enumeration

## 1. Apa itu Virtual Host Enumeration?

Virtual Host Enumeration adalah teknik untuk menemukan website atau aplikasi lain yang berjalan pada server yang sama dengan memanfaatkan perbedaan nilai HTTP `Host`.

Satu IP address dapat menjalankan beberapa website dengan domain berbeda.

Contoh:

```text
51.158.147.132
    |
    |-- www.hackycorp.com
    |-- admin.hackycorp.com
    |-- api.hackycorp.com
    |-- dev.hackycorp.com
```

Semua domain tersebut dapat mengarah ke IP address yang sama.

Server menggunakan informasi hostname untuk menentukan website mana yang harus ditampilkan.

Proses pemilihan website ini disebut Virtual Host.

Tujuan Virtual Host Enumeration adalah menemukan hostname yang belum diketahui dengan mencoba berbagai kemungkinan nama domain.

## 2. Bagaimana Virtual Host Bekerja?

Ketika client mengakses website melalui HTTP atau HTTPS, server menerima informasi hostname.

Untuk HTTP, informasi tersebut dikirim melalui header `Host`.

Contoh:

```http
GET / HTTP/1.1
Host: www.hackycorp.com
```

Server membaca nilai `Host`, kemudian menentukan website yang sesuai.

Jika kita mengubah nilai `Host` menjadi:

```http
GET / HTTP/1.1
Host: admin.hackycorp.com
```

Server mungkin akan memberikan website yang berbeda.

Inilah dasar dari Virtual Host Enumeration.

## 3. Menyiapkan Daftar Hostname

Sebelum melakukan enumeration, kita membutuhkan daftar kemungkinan hostname yang akan diuji.

Contoh isi file `vhosts.txt`:

```text
admin.hackycorp.com
api.hackycorp.com
dev.hackycorp.com
staging.hackycorp.com
test.hackycorp.com
internal.hackycorp.com
```

Daftar tersebut disebut Wordlist.

Kita dapat membuatnya secara manual atau menggunakan wordlist yang sudah tersedia.

## 4. Menentukan IP Address Server

Kita perlu mengetahui IP address server yang menjadi target pengujian.

Gunakan:

```bash
dig +short www.hackycorp.com
```

Contoh hasil:

```text
51.158.147.132
```

Simpan IP tersebut ke dalam variabel:

```bash
ip="51.158.147.132"
```

Variabel ini akan digunakan untuk mengarahkan koneksi ke server yang sama selama pengujian.

## 5. Menguji Hostname Secara Langsung

Salah satu cara menguji hostname adalah menggunakan hostname tersebut langsung pada URL.

```bash
ip="51.158.147.132"
host="admin.hackycorp.com"

curl -k -i \
    --resolve "$host:443:$ip" \
    "https://$host/"
```

Penjelasan:

- `-k`: Melewati verifikasi TLS Certificate.
- `-i`: Menampilkan response headers dan response body.
- `--resolve`: Mengarahkan hostname dan port tertentu ke IP yang ditentukan.
- `$host`: Hostname yang sedang diuji.
- `$ip`: IP address server tujuan.

Pada cara ini, hostname yang digunakan untuk TLS SNI dan HTTP Host sama-sama berasal dari `$host`.

```text
URL:        https://admin.hackycorp.com/
SNI:        admin.hackycorp.com
HTTP Host:  admin.hackycorp.com
IP:         51.158.147.132
```

Namun, cara ini tidak selalu berhasil menemukan virtual host.

## 6. Mengubah HTTP Host Tanpa Mengubah SNI

Pada pengujian HackyCorp, kita menemukan bahwa cara sebelumnya tidak berhasil menemukan hostname yang dicari.

Hasilnya berbeda ketika kita mempertahankan hostname pada URL dan hanya mengubah HTTP Host.

Perintah yang berhasil:

```bash
ip="51.158.147.132"
host="admin.hackycorp.com"

curl -k -i \
    --resolve "www.hackycorp.com:443:$ip" \
    -H "Host: $host" \
    https://www.hackycorp.com/
```

Perhatikan perbedaannya:

```text
URL:        https://www.hackycorp.com/
SNI:        www.hackycorp.com
HTTP Host:  admin.hackycorp.com
IP:         51.158.147.132
```

Pada cara ini:

1. `curl` mengakses URL `www.hackycorp.com`.
2. `--resolve` mengarahkan koneksi ke IP `51.158.147.132`.
3. TLS handshake menggunakan SNI `www.hackycorp.com`.
4. Setelah TLS terbentuk, `curl` mengirim HTTP request.
5. Header `Host` diubah menjadi `admin.hackycorp.com`.
6. Server menerima HTTP Host tersebut dan dapat memilih virtual host yang sesuai.

**Mengapa cara ini berhasil?**

Karena kita tidak mengubah hostname yang digunakan ketika TLS handshake. Kita hanya mengubah hostname pada HTTP request.

Dengan demikian, kita dapat menguji virtual host HTTP sambil mempertahankan SNI yang sama.

## 7. Perbedaan Kedua Metode

| Informasi | Metode pertama     | Metode kedua       |
| --------- | ------------------ | ------------------ |
| URL       | Candidate hostname | www.hackycorp.com  |
| SNI       | Candidate hostname | www.hackycorp.com  |
| HTTP Host | Candidate hostname | Candidate hostname |
| IP        | 51.158.147.132     | 51.158.147.132     |

Perbedaan utamanya adalah nilai SNI.

- Metode pertama mengubah SNI dan HTTP Host sekaligus.
- Metode kedua mempertahankan SNI dan hanya mengubah HTTP Host.

Perbedaan ini penting karena server dapat memiliki konfigurasi TLS dan virtual host HTTP yang berbeda.

## 8. Membuat Script Enumeration

Kita dapat mengotomatisasi pengujian menggunakan Bash.

Contoh berikut menggunakan file `vhosts.txt` yang berisi hostname lengkap.

```bash
#!/bin/bash

set -u

ip="51.158.147.132"
base_host="www.hackycorp.com"
wordlist="/home/dipaferdian/works/personal/labs/wordlists/vhosts.txt"

while IFS= read -r host || [[ -n "$host" ]]; do
    host="${host//$'\r'/}"

    [[ -z "$host" ]] && continue

    echo "========================================"
    echo "Testing: $host"
    echo "========================================"

    curl -k -sS \
        --connect-timeout 5 \
        --max-time 15 \
        --resolve "$base_host:443:$ip" \
        -H "Host: $host" \
        -i \
        "https://$base_host/"

    echo ""
    echo "Tested host: $host"
    echo ""

done < "$wordlist"

echo "Enumeration completed."
```

### Penjelasan bagian script

**Variabel IP**

```bash
ip="51.158.147.132"
```

Menyimpan IP address server tujuan.

**Hostname utama**

```bash
base_host="www.hackycorp.com"
```

Hostname ini dipertahankan pada URL dan SNI selama pengujian.

**Wordlist**

```bash
wordlist="/home/dipaferdian/works/personal/labs/wordlists/vhosts.txt"
```

Lokasi file yang berisi daftar hostname yang akan diuji.

**Membaca wordlist**

```bash
while IFS= read -r host || [[ -n "$host" ]]; do
```

Membaca setiap baris dari file dan menyimpan nilainya ke variabel `host`.

**Menghapus carriage return**

```bash
host="${host//$'\r'/}"
```

Menghapus karakter carriage return yang mungkin muncul jika file menggunakan format Windows (CRLF).

**Melewati baris kosong**

```bash
[[ -z "$host" ]] && continue
```

Jika baris kosong, script akan melanjutkan ke baris berikutnya.

**Mengirim request**

```bash
curl -k -sS \
    --connect-timeout 5 \
    --max-time 15 \
    --resolve "$base_host:443:$ip" \
    -H "Host: $host" \
    -i \
    "https://$base_host/"
```

Bagian ini mengirim request ke server dengan SNI tetap menggunakan `www.hackycorp.com`, tetapi HTTP Host berubah mengikuti setiap hostname dalam wordlist.

## 9. Memahami Hasil Enumeration

Setiap hostname yang diuji dapat menghasilkan response berbeda.

Contoh:

```http
HTTP/1.1 200 OK
Server: nginx
Content-Type: text/html
```

Atau:

```http
HTTP/1.1 404 Not Found
Server: nginx
```

Perhatikan beberapa hal ketika membaca hasil:

- **Status Code:** Apakah server memberikan `200`, `301`, `403`, atau `404`?
- **Response Body:** Apakah konten website berbeda?
- **Content-Length:** Apakah ukuran response berbeda?
- **Response Headers:** Apakah ada header yang menunjukkan konfigurasi atau aplikasi berbeda?

Jangan langsung menganggap setiap response `200 OK` sebagai virtual host yang valid.

Server bisa saja memberikan halaman default yang sama untuk hostname yang tidak dikenal.

Bandingkan hasil dengan hostname utama dan hostname acak yang diperkirakan tidak tersedia. Perbedaan response dapat menjadi petunjuk untuk investigasi lebih lanjut.

## 10. Hal yang Perlu Diingat

1. Satu IP address dapat menjalankan banyak virtual host.
2. DNS dan Virtual Host adalah dua mekanisme yang berbeda.
3. Hostname tidak harus memiliki DNS record sendiri agar HTTP Host dapat diuji pada server tertentu.
4. SNI digunakan ketika TLS handshake berlangsung.
5. HTTP Host dikirim setelah TLS handshake.
6. `curl -k` melewati verifikasi certificate, bukan mematikan SNI.
7. `--resolve` mengarahkan hostname tertentu ke IP yang ditentukan tanpa mengubah hostname pada URL.
8. `-H "Host: ..."` digunakan untuk mengubah HTTP Host.

## 11. Kesimpulan

Virtual Host Enumeration dilakukan dengan mencoba berbagai hostname melalui HTTP Host untuk menemukan website lain yang berjalan pada server yang sama.

Pada pengujian HackyCorp, metode yang berhasil adalah mempertahankan SNI menggunakan:

```bash
--resolve "www.hackycorp.com:443:$ip"
```

Kemudian mengubah HTTP Host menggunakan:

```bash
-H "Host: $host"
```

Kombinasi keduanya memungkinkan kita menguji virtual host HTTP tanpa mengubah hostname yang digunakan pada TLS handshake.

Selalu lakukan pengujian hanya pada server dan domain yang memang diizinkan untuk diuji.
