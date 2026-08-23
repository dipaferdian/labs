/**
### 1. `quarterly-revenue-pivot.sql`

**Konteks Bisnis:**
Tim *Business Intelligence* (BI) sedang membangun *dashboard* eksekutif. Sistem operasional menyimpan data pendapatan secara vertikal (satu baris per departemen per kuartal). Namun, alat visualisasi (seperti Tableau atau Looker) meminta format data mendatar (*wide format*), di mana metrik Q1 dan Q2 dipecah menjadi kolom terpisah yang saling berdampingan agar mudah dibandingkan. Tugasmu adalah melakukan proses "Pivot" untuk meratakan data tersebut.

### 2. SETUP DDL

Jalankan *script* ini di *environment* lokalmu:

```sql
CREATE TABLE quarterly_sales (
    id INT PRIMARY KEY,
    department VARCHAR(50),
    quarter VARCHAR(2),
    revenue INT
);

INSERT INTO quarterly_sales (id, department, quarter, revenue) VALUES
(1, 'IT', 'Q1', 1000),
(2, 'IT', 'Q2', 1500),
(3, 'Sales', 'Q1', 2000),
(4, 'Sales', 'Q2', 2500);

```

### 3. ANALISIS TEKNIS LANGSUNG

* **Struktur:** Tabel `quarterly_sales` berbentuk *Long Format* (memanjang ke bawah). Jika kita punya 4 kuartal, satu departemen akan memiliki 4 baris.
* **Logika Relasional:** Kita harus mengubah nilai yang ada di dalam kolom (*values* di kolom `quarter`) menjadi **nama kolom baru** (Q1, Q2).
* **Tantangan Sistem:** Di dalam *database engine* relasional standar, kolom bersifat statis. Mesin tidak tahu cara mengubah baris menjadi kolom secara ajaib. Di Fase 1 (metode konvensional kuno), kita harus memaksa mesin membentuk kolom baru dengan cara melakukan `LEFT JOIN` ke tabel yang sama berulang kali secara spesifik untuk setiap kuartal.

### 4. SIMULASI DATA MANUAL & CONTOH OUTPUT PER TAHAP

**Contoh Output Fase 1 - TAHAP 1 (Membangun Kerangka Unik):**
Sebelum kita bisa menggabungkan data Q1 dan Q2, kita butuh "tulang punggung" (*spine*) berupa daftar departemen yang unik.

| department |
| --- |
| IT |
| Sales |

**Contoh Output Fase 1 - TAHAP 2 (Final - Self Join Berulang):**
Setelah memiliki kerangka, kita tempelkan (*join*) tabel asli dua kali. Satu khusus untuk data Q1, satu lagi khusus untuk data Q2.

| department | q1_revenue | q2_revenue |
| --- | --- | --- |
| IT | 1000 | 1500 |
| Sales | 2000 | 2500 |

---

### 5. FASE 1: PENYELESAIAN DASAR (Konvensional - Multiple Self-Joins)

Kita mulai dengan merangkai metode *brute-force* yang sering dipakai *engineer* zaman dulu sebelum ada fungsi agregasi bersyarat.

**Tugas FASE 1 - TAHAP 1:**
Tulis *query* `SELECT` sederhana pada tabel `quarterly_sales` untuk menghasilkan kerangka dasar (hanya 1 kolom `department`).

* Gunakan klausa `DISTINCT` agar nama departemen tidak ganda.
* (Opsional) Urutkan secara alfabet menggunakan `ORDER BY`.

Silakan kirimkan kueri Fase 1 - Tahap 1 milikmu, dan kita akan jadikan ini sebagai CTE di tahap selanjutnya!
*/

SELECT * from quarterly_sales

# step 1
select DISTINCT department from quarterly_sales

# step 2

with dept_spine as ( select DISTINCT department from quarterly_sales )
select 
dept_spine.department,
q1.revenue as q1_revenue,
q2.revenue as q2_revenue
from dept_spine
left join quarterly_sales q1 on dept_spine.department = q1.department and q1.quarter = 'Q1'
left join quarterly_sales q2 on dept_spine.department = q2.department and q2.quarter = 'Q2'

/*
 optimization
*/

# step 1
SELECT 
department,
MAX(
    CASE 
        WHEN quarter = 'Q1' THEN revenue
    END
)  as q1_revenue,
MAX(
    CASE 
        WHEN quarter = 'Q2' THEN revenue
    END
)  as q2_revenue
from quarterly_sales
GROUP BY department
ORDER BY department

