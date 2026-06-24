import { useEffect, useRef, useState } from "react";
import Hero from "./components/Hero";
import Moments from "./components/Moments";
import Appearances from "./components/Appearances";
import AudioPlayer from "./components/AudioPlayer";

// App.jsx sengaja dibuat tipis — hanya menyusun urutan section.
// Semua logic dan tampilan detail ada di masing-masing komponennya sendiri.
// Ini yang dimaksud "component-based": tiap bagian halaman jadi unit mandiri
// yang bisa kamu pindah, hapus, atau duplikasi tanpa merusak bagian lain.

function App() {
  const audioRef = useRef(null);
  const [isMuted, setIsMuted] = useState(true);

  // Mulai play dalam keadaan bisu begitu halaman dibuka — ini diizinkan browser
  useEffect(() => {
    audioRef.current.muted = true;
    audioRef.current.play().catch(() => {});
  }, []);

  // Begitu user berinteraksi sedikit pun, baru nyalakan suaranya
  useEffect(() => {
  const unmute = () => {
    const audio = audioRef.current;
    audio.muted = false;
    setIsMuted(false);

    // Kalau ternyata sempat ke-pause oleh browser, paksa play lagi di sini —
    // titik ini ('unmute') terjadi tepat saat user klik, jadi browser pasti izinkan.
    if (audio.paused) {
      audio.play().catch(() => {});
    }

    window.removeEventListener("click", unmute);
    window.removeEventListener("scroll", unmute);
    window.removeEventListener("keydown", unmute);
  };

  window.addEventListener("click", unmute);
  window.addEventListener("scroll", unmute);
  window.addEventListener("keydown", unmute);

  return () => {
    window.removeEventListener("click", unmute);
    window.removeEventListener("scroll", unmute);
    window.removeEventListener("keydown", unmute);
  };
}, []);

  return (
    <main>
      <audio ref={audioRef} src="/assets/iicsohfb.mp3" loop />
      <Hero />
      <Moments />
      <Appearances />
      <AudioPlayer />
    </main>
  );
}

export default App;