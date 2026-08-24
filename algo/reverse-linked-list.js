/**
---

### 📜 `reverse-linked-list.js`

**Skenario & Struktur Data:**
Dalam Linked List, data tidak disimpan di satu tempat yang bersebelahan. Data disimpan di dalam "Simpul" (*Node*). Setiap *Node* memiliki dua hal:

1. `val` (Nilai/Isi datanya).
2. `next` (Petunjuk arah/alamat ke *Node* selanjutnya).

Ini adalah cetak birunya di JavaScript:

```javascript
// Kamu tidak perlu menulis ini, ini hanya agar kamu tahu bentuk datanya
class ListNode {
    constructor(val = 0, next = null) {
        this.val = val;
        this.next = next;
    }
}

```

**Tugasmu:**
Diberikan *Node* pertama (disebut `head`) dari sebuah *Linked List*. Tugasmu adalah **memutar balik (reverse)** seluruh arah petunjuknya, lalu mengembalikan *Node* yang tadinya berada di paling ujung akhir sebagai `head` yang baru!

**🧪 Test Cases:**

* **Kasus 1:**
* `input = 1 -> 2 -> 3 -> 4 -> 5 -> null`
* *Target Output =* `5 -> 4 -> 3 -> 2 -> 1 -> null`


* **Kasus 2:**
* `input = 1 -> 2 -> null`
* *Target Output =* `2 -> 1 -> null`


* **Kasus 3:**
* `input = null` (List kosong)
* *Target Output =* `null`



---

### 🗺️ Analogi: Permainan Petunjuk Harta Karun (Scavenger Hunt)

Bayangkan kamu sedang bermain petunjuk harta karun. Kamu menemukan **Peti 1**. Di dalamnya ada Koin Emas, dan secarik surat yang berbunyi: *"Lanjutkan ke Peti 2"*.
Di Peti 2 ada surat: *"Lanjutkan ke Peti 3"*.
Di Peti 3 ada surat: *"Selesai (Null)"*.

Tugasmu sebagai panitia adalah **memutar balik rute ini**. Jika seseorang membuka Peti 3, suratnya harus menyuruh mereka ke Peti 2.

**Tantangannya:** Kamu hanya punya dua tangan dan saku celana. Kamu tidak bisa melihat semua peti sekaligus dari atas (seperti melihat Array). Kamu hanya tahu lokasi peti *saat ini* dan peti *selanjutnya* dari surat yang kamu baca.

Jika kamu langsung menghapus tulisan di surat Peti 1 (yang tadinya menunjuk ke Peti 2) menjadi menunjuk ke *belakang*, **kamu akan kehilangan alamat Peti 2 selamanya!** Rantainya putus.

---

### 🚶‍♂️ Simulasi Manual

Bagaimana cara manusia melakukannya tanpa memutuskan rantai?
Gunakan tiga konsep di otakmu/sakumu:
`sebelumnya` (Previous), `sekarang` (Current), dan `selanjutnya` (Next).

Mari kita putar balik: **`1 -> 2 -> 3 -> null`**

*Awal:*

* `sebelumnya = null` (Karena sebelum Peti 1 tidak ada apa-apa).
* `sekarang = Peti 1`.

**Langkah 1 (Berdiri di Peti 1):**

1. **Amankan Rute:** Baca surat di Peti 1, dan simpan lokasinya di saku `selanjutnya`. (`selanjutnya = Peti 2`). *Aman! Sekarang kita tidak akan tersesat.*
2. **Putar Balik Surat:** Hapus surat di Peti 1. Ganti arahnya menunjuk ke `sebelumnya`. (Surat Peti 1 sekarang menunjuk ke `null`).
3. **Maju:** Kamu (sebagai panitia) melangkah maju.
* `sebelumnya` sekarang adalah peti yang baru saja kamu kerjakan (Peti 1).
* `sekarang` kamu berpindah ke peti yang tadi kamu simpan di sakumu (Peti 2).



**Langkah 2 (Berdiri di Peti 2):**

1. **Amankan Rute:** Baca surat Peti 2. Simpan lokasinya di saku. (`selanjutnya = Peti 3`).
2. **Putar Balik Surat:** Ubah surat Peti 2 menjadi menunjuk ke `sebelumnya` (yaitu Peti 1).
3. **Maju:**
* `sebelumnya` maju menjadi Peti 2.
* `sekarang` berpindah ke Peti 3.



**Langkah 3 (Berdiri di Peti 3):**

1. **Amankan Rute:** Baca surat Peti 3. Simpan di saku. (`selanjutnya = null`).
2. **Putar Balik Surat:** Ubah surat Peti 3 menjadi menunjuk ke `sebelumnya` (Peti 2).
3. **Maju:**
* `sebelumnya` maju menjadi Peti 3.
* `sekarang` berpindah ke `null`.



**Selesai!** Karena `sekarang` sudah menyentuh ujung jalan (`null`), permainan berhenti. Peti terakhir yang kamu modifikasi adalah `sebelumnya` (Peti 3). Itulah `head` baru yang harus kamu berikan kepada bosmu!

---

### 🧩 Hint Efisiensi & Logika (Fokus $O(n)$ dan $O(1)$)

Algoritma yang kita simulasikan ini adalah metode paling efisien di dunia untuk membalikkan *Linked List*.

* **Time Complexity $O(n)$:** Kita hanya mendatangi setiap Peti tepat satu kali.
* **Space Complexity $O(1)$:** Kita sama sekali tidak membuat *Linked List* baru atau peti baru. Kita memodifikasinya di tempat (*in-place*) dan hanya menggunakan tiga variabel bantuan (`prev`, `curr`, `nextTemp`).

**Kerangka Kerjamu:**

1. Siapkan variabel `prev` (diisi `null`) dan `curr` (diisi `head` / titik awal).
2. Gunakan `while` loop yang terus berjalan selama `curr` belum menyentuh `null` (artinya masih ada peti).
3. Di dalam loop, lakukan 4 langkah tarian persis seperti simulasi di atas (Amankan rute ➔ Putar balik panah ➔ Majukan `prev` ➔ Majukan `curr`). Ingat urutannya sangat krusial!
4. Akhiri dengan mengembalikan variabel yang memegang *Node* terakhir.

Silakan racik logikanya, *Engineer*!
 */

/**
 * @param {ListNode} head
 * @return {ListNode}
 */

class Node {
  constructor(val = 0, next = null) {
    this.val = val;
    this.next = next;
  }
}

function compute(head) {
  let prev = null;
  let current = head;
  while (current != null) {
    let nextTemp = current.next;
    current.next = prev;
    prev = current;
    current = nextTemp;
  }

  return prev;
}

const node1 = new Node(1);
const node2 = new Node(2);
const node3 = new Node(3);

node1.next = node2;
node2.next = node3;

console.log(compute(node1));
