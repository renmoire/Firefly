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

## Cara menjalankan

```bash
npm install      # sekali saja, saat pertama kali download project
npm run dev      # menjalankan di localhost untuk development
npm run build    # membuat versi final siap upload (folder dist/)
```

Buka link yang muncul di terminal (biasanya `http://localhost:5173`).

## Cara mengubah konten

- **Tambah/ubah video** → edit `src/data/appearances.js`, tinggal tambah satu object baru di array, tidak perlu sentuh kode komponen.
- **Ubah foto slideshow** → edit `src/data/moments.js`.
- **Ubah teks di Hero** (judul, deskripsi) → edit `src/components/Hero.jsx`.
- **Ubah warna/font global** → edit variabel di `src/index.css` bagian `:root`.

## Kenapa strukturnya begini? (untuk yang baru belajar React)

- **Komponen** = potongan UI yang berdiri sendiri. Tiap section halaman (Hero, Moments, Appearances) jadi file `.jsx` sendiri, supaya kalau ada bug atau mau ubah satu bagian, kamu tidak perlu bingung mencari di file yang panjang.
- **`useState`** dipakai untuk menyimpan "apa yang sedang ditampilkan sekarang" (misalnya slide ke berapa, halaman pagination ke berapa). Setiap kali nilai ini berubah, React otomatis menggambar ulang tampilan — kamu tidak perlu manual `classList.add/remove` seperti di vanilla JS.
- **`useEffect`** dipakai untuk hal-hal yang terjadi "di luar" tampilan biasa, seperti menyalakan timer (`setInterval`) saat komponen pertama muncul, dan mematikannya saat komponen hilang.
- **`data/`** dipisah dari komponen supaya konten (video, foto) tidak tercampur dengan logic tampilan. Ini praktik umum di project React yang lebih besar.

## Deploy

Project ini bisa langsung di-deploy ke Vercel atau Netlify — cukup hubungkan repo GitHub-nya, mereka akan otomatis menjalankan `npm run build` dan mempublikasikan folder `dist/`.

### ⚠️ Penting sebelum upload ke GitHub

**Jangan pernah upload folder `node_modules` ke GitHub.** Folder ini isinya ratusan paket yang otomatis di-install lewat `npm install`, ukurannya besar (puluhan-ratusan MB), dan kalau di-upload ulang manual (drag-and-drop di browser), izin "executable" pada beberapa file di dalamnya bisa rusak — ini yang menyebabkan error seperti:

```
sh: line 1: /vercel/path0/node_modules/.bin/vite: Permission denied
Error: Command "npm run build" exited with 126
```

File `.gitignore` di project ini sudah diatur supaya `node_modules` otomatis diabaikan oleh git — **tapi ini hanya berlaku kalau kamu upload lewat `git push`**, bukan lewat upload manual/drag-and-drop di GitHub web (karena `.gitignore` cuma dibaca oleh command `git`, bukan oleh halaman upload GitHub).

**Cara upload yang aman:**
1. Pakai `git` dari terminal (`git add .` → `git commit` → `git push`), supaya `.gitignore` benar-benar bekerja, **atau**
2. Kalau upload manual lewat browser, pastikan folder `node_modules` **tidak ikut di-drag** sama sekali — cukup upload `src/`, `public/`, `index.html`, `package.json`, `package-lock.json`, `vite.config.js`, dan `.gitignore`.

Vercel akan menjalankan `npm install` sendiri di server mereka, jadi `node_modules` versi kamu tidak pernah dibutuhkan di GitHub.
