import { useEffect, useRef, useState } from "react";
import "./AudioPlayer.css";

function AudioPlayer() {
  const audioRef = useRef(null);
  const canvasRef = useRef(null);
  const analyserRef = useRef(null);

  const [isMuted, setIsMuted] = useState(true);
  const [volume, setVolume] = useState(0.6);

  // ---- Bagian 1: Setup Web Audio API ----
  // Ini hanya boleh dijalankan SEKALI, karena menyambungkan elemen <audio>
  // ke AnalyserNode tidak bisa dilakukan dua kali pada elemen yang sama.
  useEffect(() => {
    const audio = audioRef.current;

    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const source = audioContext.createMediaElementSource(audio);
    const analyser = audioContext.createAnalyser();

    analyser.fftSize = 128; // semakin besar, semakin detail garisnya (tapi lebih berat)
    source.connect(analyser);
    analyser.connect(audioContext.destination); // supaya suara tetap keluar ke speaker

    analyserRef.current = analyser;

    // Coba play dalam keadaan bisu begitu siap
    audio.muted = true;
    audio.addEventListener("canplay", () => {
      audio.play().catch(() => {});
    });

    return () => audioContext.close();
  }, []);

  // ---- Bagian 2: Gambar ulang garis terus-menerus ----
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

      ctx.beginPath();
      const sliceWidth = width / bufferLength;

      dataArray.forEach((value, i) => {
        // value: 0–255 → diubah jadi tinggi garis (px) dari tengah
        const barHeight = (value / 255) * height;
        const x = i * sliceWidth;
        const y = height - barHeight;

        if (i === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      });

      ctx.strokeStyle = "#ffb15c"; // warna ember, sesuai tema
      ctx.lineWidth = 2;
      ctx.stroke();

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