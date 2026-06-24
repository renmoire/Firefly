// Gambar untuk slideshow di section "Moments".
// objectPosition & transform meniru posisi crop yang dulu di-hardcode
// per-class (.f1, .f2, dst) di style.css lama — sekarang jadi data, bukan CSS terpisah.
const moments = [
  { id: 1, src: "/assets/she.png", objectPosition: "75% center" },
  { id: 2, src: "/assets/gorgeus.png", objectPosition: "30% center" },
  { id: 3, src: "/assets/so.png", objectPosition: "100% center" },
  { id: 4, src: "/assets/very.png", objectPosition: "45% center" },
  {
    id: 5,
    src: "/assets/smile.png",
    objectPosition: "70% center",
    transform: "scale(1.39) translateY(30px)",
  },
];

export default moments;