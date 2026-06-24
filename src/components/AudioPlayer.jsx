import { useEffect, useRef, useState } from "react";
import "./AudioPlayer.css";

function AudioPlayer() {
  const audioRef = useRef(null);
  const canvasRef = useRef(null);
  const analyserRef = useRef(null);
  const audioContextRef = useRef(null); // tambahan: simpan context juga

  const [isMuted, setIsMuted] = useState(true);
  const [volume, setVolume] = useState(0.6);

  // ---- Bagian 1: Setup Web Audio API ----
  useEffect(() => {
    const audio = audioRef.current;

    // PENTING: kalau analyser udah pernah dibuat (misal karena StrictMode
    // menjalankan efek ini dua kali), jangan buat ulang — cukup pakai yang lama.
    if (analyserRef.current) return;

    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const source = audioContext.createMediaElementSource(audio);
    const analyser = audioContext.createAnalyser();

    analyser.fftSize = 128;
    source.connect(analyser);
    analyser.connect(audioContext.destination);

    analyserRef.current = analyser;
    audioContextRef.current = audioContext;

    audio.muted = true;
    audio.addEventListener("canplay", () => {
      audio.play().catch(() => {});
    });

    analyser.fftSize = 128;
    analyser.smoothingTimeConstant = 0.85; // ← tambahkan baris ini
    source.connect(analyser);

    // Tidak ada cleanup yang menutup audioContext di sini —
    // karena kalau StrictMode unmount-mount ulang, context yang sama
    // masih kita pakai lagi lewat pengecekan di atas.
  }, []);

  // ---- Bagian 2: Gambar ulang area smooth, terus-menerus ----
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    let animationId;

    const draw = () => {
      const analyser = analyserRef.current;
      if (!analyser) {
        animationId = requestAnimationFrame(draw);
        return;
      }

      const bufferLength = analyser.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);
      analyser.getByteFrequencyData(dataArray);

      const width = canvas.width;
      const height = canvas.height;
      ctx.clearRect(0, 0, width, height);

      // Ambil titik tengah tiap segmen, supaya kurva yang dibuat
      // quadraticCurveTo punya titik kontrol yang pas (lihat penjelasan di bawah)
      const points = Array.from(dataArray).map((value, i) => ({
        x: (i / (bufferLength - 1)) * width,
        y: height - (value / 255) * height,
      }));

      ctx.beginPath();
      ctx.moveTo(points[0].x, height); // mulai dari dasar kiri
      ctx.lineTo(points[0].x, points[0].y);

      // quadraticCurveTo melengkungkan garis lewat titik tengah antara
      // dua titik data, jadi hasilnya halus, bukan zig-zag tajam.
      for (let i = 0; i < points.length - 1; i++) {
        const current = points[i];
        const next = points[i + 1];
        const midX = (current.x + next.x) / 2;
        const midY = (current.y + next.y) / 2;
        ctx.quadraticCurveTo(current.x, current.y, midX, midY);
      }
      ctx.lineTo(points[points.length - 1].x, points[points.length - 1].y);
      ctx.lineTo(points[points.length - 1].x, height); // turun ke dasar kanan
      ctx.closePath();

      // Gradient: lebih terang di puncak, makin transparan ke dasar
      const gradient = ctx.createLinearGradient(0, 0, 0, height);
      gradient.addColorStop(0, "rgba(255, 177, 92, 0.85)");
      gradient.addColorStop(1, "rgba(255, 177, 92, 0.05)");

      ctx.fillStyle = gradient;
      ctx.fill();

      animationId = requestAnimationFrame(draw);
    };

    draw();
    return () => cancelAnimationFrame(animationId);
  }, []);

  // ---- Bagian 3: Kontrol volume & mute ----
  useEffect(() => {
    audioRef.current.volume = volume;
  }, [volume]);

  const toggleMute = () => {
    const audio = audioRef.current;
    const nextMuted = !isMuted;
    audio.muted = nextMuted;
    setIsMuted(nextMuted);

    if (!nextMuted && audio.paused) {
      audio.play().catch(() => {});
    }
  };

  return (
    <div className="audio-player">
      <audio ref={audioRef} src="/assets/iicsohfb.mp3" loop />

      <button
        className="audio-player__mute"
        onClick={toggleMute}
        aria-label={isMuted ? "Unmute" : "Mute"}
      >
        {isMuted ? "🔇" : "🔊"}
      </button>

      <input
        className="audio-player__volume"
        type="range"
        min="0"
        max="1"
        step="0.01"
        value={volume}
        onChange={(e) => setVolume(Number(e.target.value))}
        aria-label="Volume"
      />

      <canvas ref={canvasRef} className="audio-player__canvas" width="600" height="40" />
    </div>
  );
}

export default AudioPlayer;