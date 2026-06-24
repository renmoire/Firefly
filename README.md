# Firefly — Character Archive (React)

Versi React dari project Firefly. Dibangun dengan **React + Vite**.

## Struktur project

```
firefly-react/
├── public/
│   └── assets/          ← semua gambar & gif karakter
├── src/
│   ├── components/      ← satu file = satu bagian halaman
│   │   ├── Hero.jsx          (bagian atas, gambar karakter besar)
│   │   ├── Hero.css
│   │   ├── Moments.jsx       (slideshow foto otomatis)
│   │   ├── Moments.css
│   │   ├── Appearances.jsx   (grid video + pagination)
│   │   ├── Appearances.css
│   │   └── AppearanceCard.jsx (satu kartu video)
│   ├── data/             ← isi konten, dipisah dari tampilan
│   │   ├── appearances.js    (daftar video)
│   │   └── moments.js        (daftar foto slideshow)
│   ├── App.jsx           ← menyusun urutan semua section
│   ├── main.jsx          ← titik masuk React (jangan diubah)
│   └── index.css         ← warna & font global (design tokens)
├── index.html
└── package.json
```

## Cara mengubah konten

- **Tambah/ubah video** → edit `src/data/appearances.js`, tinggal tambah satu object baru di array, tidak perlu sentuh kode komponen.
- **Ubah foto slideshow** → edit `src/data/moments.js`.
- **Ubah teks di Hero** (judul, deskripsi) → edit `src/components/Hero.jsx`.
- **Ubah warna/font global** → edit variabel di `src/index.css` bagian `:root`.

## Kenapa strukturnya begini?

- **Komponen** = potongan UI yang berdiri sendiri. Tiap section halaman (Hero, Moments, Appearances) jadi file `.jsx` sendiri, supaya kalau ada bug atau mau ubah satu bagian, kamu tidak perlu bingung mencari di file yang panjang.
- **`useState`** dipakai untuk menyimpan "apa yang sedang ditampilkan sekarang" (misalnya slide ke berapa, halaman pagination ke berapa). Setiap kali nilai ini berubah, React otomatis menggambar ulang tampilan — kamu tidak perlu manual `classList.add/remove` seperti di vanilla JS.
- **`useEffect`** dipakai untuk hal-hal yang terjadi "di luar" tampilan biasa, seperti menyalakan timer (`setInterval`) saat komponen pertama muncul, dan mematikannya saat komponen hilang.
- **`data/`** dipisah dari komponen supaya konten (video, foto) tidak tercampur dengan logic tampilan. Ini praktik umum di project React yang lebih besar.