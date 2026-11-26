# Diri Insight

Alat refleksi diri berbasis web statis yang membantu memetakan delapan lapisan psikologis—mulai dari akar rasa aman masa kecil, kecerdasan emosional, pola komunikasi, batas diri, hingga strategi bertahan (*coping*) bawah sadar.

Hasil disajikan dalam bentuk peta visual (grafik radar), analisis naratif personal, latihan mingguan yang konkret, serta kartu ringkasan yang dapat diunduh.

## Fitur Utama

* **Dua Pilihan Kedalaman Tes:**
  * **Mode Lengkap (70 pertanyaan):** Pemetaan menyeluruh di 9 bagian (sekitar 15–25 menit).
  * **Mode Ringkas (27 pertanyaan inti):** Gambaran cepat dari 3 indikator utama di tiap bagian (sekitar 5–8 menit). Progres jawaban saling terhubung sehingga pengguna bisa melanjutkan dari mode ringkas ke mode lengkap kapan saja.
* **Delapan Dimensi Pemetaan:** Akar & Rasa Aman, Kesadaran Diri, Regulasi Emosi, Empati & Belas Kasih, Komunikasi & Asertivitas, Pola Pikir & Fleksibilitas, Batas Diri & Relasi, serta Ketahanan & Pemulihan.
* **Deteksi Pola & Sinyal Bawah Sadar:** Mengidentifikasi dinamika seperti *people-pleasing*, ruminasi, penghindaran konflik, kritik diri, hingga kesenjangan antara kesadaran kognitif dan respons tubuh (*high masking*).
* **100% Lokal & Privat:** Tanpa akun, tanpa basis data eksternal, dan tanpa pelacakan. Seluruh progres tersimpan otomatis di `localStorage` perangkat pengguna.
* **Ekspor & Berbagi:** Mendukung pengunduhan **Kartu Ringkasan Gambar (`.png`)**, laporan teks lengkap (`.txt`), serta tampilan ramah cetak / simpan PDF.
* **Aksesibilitas & Tema:** Mendukung mode terang dan gelap, navigasi keyboard penuh (`1–5`, `Enter`, panah kiri/kanan), serta pembaca layar (*ARIA live regions*).

## Struktur Berkas

```text
diri-insight/
├── index.html               # Struktur halaman utama, layar tes, dan layar hasil
├── README.md                # Dokumentasi proyek
└── assets/
    ├── styles.css           # Gaya tipografi editorial, tema terang/gelap, dan layout responsif
    ├── questions.js         # Bank 70 pertanyaan (27 ditandai core: true) & definisi 8 dimensi
    ├── engine.js            # Mesin skoring berbobot, deteksi sinyal, dan generator narasi
    ├── app.js               # Pengelola UI, rute hash, Chart.js radar, dan generator Share Card PNG
    ├── site.webmanifest     # Konfigurasi PWA / ikon aplikasi web
    └── favicon.* / og-*     # Aset ikon dan pratinjau media sosial
