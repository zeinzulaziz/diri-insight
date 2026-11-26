# Diri Insight

Alat refleksi diri berbahasa Indonesia: 70 pertanyaan pilihan ganda, delapan dimensi, dan narasi hasil yang panjang. Dibuat tanpa framework, tanpa build step, dan tanpa server.

## Menjalankan

Buka `index.html` langsung di browser. Semua fitur inti bekerja lewat `file://`.

Kalau ingin memakai server lokal:

```bash
python3 -m http.server 8000
```

Lalu buka `http://localhost:8000`.

## Struktur

```
index.html            Struktur halaman: landing, kuis, loading, hasil, dialog
assets/styles.css     Tema terang/gelap, layout responsif, gaya cetak
assets/questions.js   70 pertanyaan, 9 bagian, metadata 8 dimensi
assets/engine.js      Skor, sinyal perilaku, archetype, narasi, ekspor teks
assets/app.js         Routing hash, kuis, localStorage, grafik, unduh, cetak
```

Urutan skrip: Chart.js (CDN), `questions.js`, `engine.js`, `app.js`. Semuanya `defer`.

## Fitur

- 70 pertanyaan dalam 9 bagian, satu pertanyaan per layar.
- Progres, jawaban, dan posisi terakhir tersimpan di `localStorage`.
- Urutan opsi diacak per percobaan, tetapi jawaban disimpan sebagai indeks asli sehingga tetap stabil setelah reload.
- Delapan skor dimensi: radar Chart.js dan daftar batang sebagai alternatif.
- Enam bagian narasi (sekitar 820-1.000 kata) dan empat latihan konkret.
- Unduh hasil sebagai `.txt`, cetak atau simpan sebagai PDF.
- Mode gelap yang mengikuti preferensi sistem, bisa diganti manual.
- Navigasi keyboard: `1`-`5` memilih, `Enter` lanjut, panah untuk berpindah opsi.
- Tanpa akun, tanpa pengiriman jawaban ke server.

## Data dan privasi

Jawaban hanya disimpan di browser perangkat ini dengan kunci `diri-insight:v1:*`. Tidak ada backend. Menghapus data situs di browser atau menekan "Mulai dari awal" akan menghapusnya.

Skor dihitung relatif terhadap jawaban sendiri, bukan norma populasi, dan bukan diagnosis. Narasi memakai "kamu" dan tidak memberi label klinis.

## Verifikasi yang sudah dilakukan

- `node --check` untuk `questions.js`, `engine.js`, dan `app.js`.
- 503 profil uji (semua tinggi, semua rendah, acak): 6 bagian, 4 latihan, 821-1.004 kata, tanpa kalimat atau paragraf yang berulang.
- Uji browser headless Chrome: 70 pertanyaan terjawab, hasil tampil, radar tergambar, tanpa error console.
- Alur keluar kuis lalu lanjut dari panel resume, serta reload di tengah kuis: jawaban dan urutan opsi tetap sama.
- Lebar 320 px, 390 px, dan desktop: tidak ada overflow horizontal.
- Media cetak: landing, tombol aksi, dan radar disembunyikan; batang skor tetap tampil. PDF 6 halaman.
- Unduhan `.txt` terverifikasi sebagai berkas nyata (sekitar 9 KB).
- Kontras teks utama dan teks sekunder diperiksa untuk kedua tema.

## Batasan

- Chart.js dan Google Fonts dimuat dari CDN. Tanpa jaringan, grafik diganti daftar batang dan font memakai fallback sistem.
- Hasil tidak disinkronkan antarperangkat.
- Ini alat refleksi, bukan pengganti konsultasi psikologis.
