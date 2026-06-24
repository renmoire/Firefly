import { useEffect, useRef, useState } from "react";
import "./AudioPlayer.css";

function AudioPlayer() {
  const audioRef = useRef(null);
  const canvasRef = useRef(null);

  const [isMuted, setIsMuted] = useState(true);
  const [volume, setVolume] = useState(0.6);

  // ---- Bagian 1: Setup audio (tanpa Web Audio API / analyser) ----
  useEffect(() => {
    const audio = audioRef.current;
    audio.muted = true;
    audio.addEventListener("canplay", () => {
      audio.play().catch(() => {});
    });
  }, []);

  // ---- Bagian 1.5: Resolusi canvas mengikuti lebar layar ----
  useEffect(() => {
    const canvas = canvasRef.current;
    const resize = () => {
      canvas.width = canvas.clientWidth;
      canvas.height = canvas.clientHeight;
    };
    resize();
    window.addEventListener("resize", resize);
    return () => window.removeEventListener("resize", resize);
  }, []);

  // ---- Bagian 1.6: Auto-unmute saat ada aktivitas user ----
  useEffect(() => {
    const unmute = () => {
      const audio = audioRef.current;
      audio.muted = false;
      setIsMuted(false);
      if (audio.paused) audio.play().catch(() => {});
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

  // ---- Bagian 2: Smooth wave animasi (tanpa audio data) ----
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    let animationId;
    let startTime = null;

    // Konfigurasi gelombang — bisa bebas ditambah/dikurangi lapisannya
    const waves = [
      { amplitude: 0.38, frequency: 1.4, speed: 0.0007, phaseOffset: 0 },
      { amplitude: 0.22, frequency: 2.5, speed: 0.0011, phaseOffset: 1.2 },
      { amplitude: 0.14, frequency: 3.8, speed: 0.0009, phaseOffset: 2.7 },
    ];

    const draw = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const elapsed = timestamp - startTime;

      const width = canvas.width;
      const height = canvas.height;
      ctx.clearRect(0, 0, width, height);

      const numPoints = 120; // makin banyak = makin mulus

      // Hitung titik-titik Y dari gabungan semua gelombang
      const points = Array.from({ length: numPoints }, (_, i) => {
        const x = (i / (numPoints - 1)) * width;
        const t = i / (numPoints - 1); // 0..1

        // Superposisi semua gelombang
        const combinedY = waves.reduce((sum, w) => {
          return (
            sum +
            w.amplitude *
              Math.sin(t * Math.PI * 2 * w.frequency + elapsed * w.speed + w.phaseOffset)
          );
        }, 0);

        // combinedY berkisar -totalAmp..+totalAmp, petakan ke piksel
        // baseline: 65% dari bawah canvas; naik/turun dari situ
        const totalAmp = waves.reduce((s, w) => s + w.amplitude, 0);
        const baseline = height * 0.65;
        const y = baseline - (combinedY / totalAmp) * baseline * 0.75;

        return { x, y };
      });

      // Gambar path dengan kurva halus
      ctx.beginPath();
      ctx.moveTo(0, height); // pojok kiri bawah
      ctx.lineTo(points[0].x, points[0].y);

      for (let i = 0; i < points.length - 1; i++) {
        const cur = points[i];
        const nxt = points[i + 1];
        const midX = (cur.x + nxt.x) / 2;
        const midY = (cur.y + nxt.y) / 2;
        ctx.quadraticCurveTo(cur.x, cur.y, midX, midY);
      }

      ctx.lineTo(points[points.length - 1].x, points[points.length - 1].y);
      ctx.lineTo(width, height); // pojok kanan bawah
      ctx.closePath();

      // Gradient warna — sama seperti sebelumnya
      const gradient = ctx.createLinearGradient(0, 0, 0, height);
      gradient.addColorStop(0, "rgba(255, 177, 92, 0.75)");
      gradient.addColorStop(1, "rgba(255, 177, 92, 0.29)");

      ctx.fillStyle = gradient;
      ctx.fill();

      animationId = requestAnimationFrame(draw);
    };

    animationId = requestAnimationFrame(draw);
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
    if (!nextMuted && audio.paused) audio.play().catch(() => {});
  };

  return (
    <div className="audio-player">
      <audio ref={audioRef} src="/assets/iicsohfb.mp3" loop />

      <button
        className="audio-player__mute"
        onClick={toggleMute}
        aria-label={isMuted ? "Unmute" : "Mute"}
      >
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

      <canvas ref={canvasRef} className="audio-player__canvas" />
    </div>
  );
}

export default AudioPlayer;