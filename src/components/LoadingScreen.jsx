import { useEffect, useRef, useState } from "react";
import "./LoadingScreen.css";

/**
 * Props:
 *   onDone — dipanggil setelah loading screen selesai fade out sepenuhnya
 */
function LoadingScreen({ onFadeOutStart, onDone }) {
  const canvasRef = useRef(null);
  const overlayRef = useRef(null);
  const [phase, setPhase] = useState("in");

  // ── Ember particles (tidak diubah) ──────────────────────────────────
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    let animId;

    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const EMBER = "rgba(255, 177, 92,";
    const EMBER_L = "rgba(255, 230, 180,";
    const rand = (a, b) => Math.random() * (b - a) + a;

    const makeSpark = () => ({
      x: rand(0.3, 0.7), y: rand(0.5, 1.1),
      r: rand(1, 3.2),
      opacity: 0, opacityTarget: rand(0.4, 0.9),
      vx: rand(-0.00015, 0.00015),
      vy: rand(-0.0006, -0.0002),
      wobble: rand(0, Math.PI * 2),
      wobbleSpeed: rand(0.01, 0.025),
      wobbleAmp: rand(0.0003, 0.0008),
      color: Math.random() > 0.4 ? EMBER : EMBER_L,
    });

    const sparks = Array.from({ length: 22 }, makeSpark);

    const draw = () => {
      const W = canvas.width, H = canvas.height;
      ctx.clearRect(0, 0, W, H);
      for (const p of sparks) {
        const diff = p.opacityTarget - p.opacity;
        if (Math.abs(diff) < 0.01) p.opacityTarget = rand(0.1, 0.9);
        p.opacity += diff * 0.03;
        p.wobble += p.wobbleSpeed;
        p.x += p.vx + Math.sin(p.wobble) * p.wobbleAmp;
        p.y += p.vy;
        if (p.y < -0.05) Object.assign(p, makeSpark(), { y: rand(0.9, 1.05), opacity: 0 });
        const px = p.x * W, py = p.y * H;
        const g = ctx.createRadialGradient(px, py, 0, px, py, p.r);
        g.addColorStop(0, `${p.color} ${p.opacity.toFixed(2)})`);
        g.addColorStop(1, `${p.color} 0)`);
        ctx.save();
        ctx.shadowColor = `${p.color} 1)`; ctx.shadowBlur = 8;
        ctx.beginPath(); ctx.arc(px, py, p.r, 0, Math.PI * 2);
        ctx.fillStyle = g; ctx.fill();
        ctx.restore();
      }
      animId = requestAnimationFrame(draw);
    };
    draw();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", resize);
    };
  }, []);

  // ── Timing: tunggu sebentar, lalu mulai fade out ────────────────────
  useEffect(() => {
    const t = setTimeout(() => setPhase("out"), 1800);
    return () => clearTimeout(t);
  }, []);

  // ── Fade out: seluruh overlay, lalu baru kasih tau App ─────────────
  useEffect(() => {
    if (phase !== "out") return;

    onFadeOutStart?.(); // ← tambahkan baris ini, sebelum animate()

    const overlayEl = overlayRef.current;
    const DURATION = 600;

    const animation = overlayEl.animate(
      [{ opacity: 1 }, { opacity: 0 }],
      { duration: DURATION, easing: "ease-in", fill: "forwards" }
    );

    animation.onfinish = () => onDone?.();
  }, [phase, onFadeOutStart, onDone]);

  return (
    <div ref={overlayRef} className="loading-screen" aria-hidden="true">
      <canvas ref={canvasRef} className="loading-screen__canvas" />

      <div className="loading-screen__content">
        <p className="loading-screen__eyebrow">AR-26710 · Stellaron Hunter</p>
        <h1 className="loading-screen__name">Firefly</h1>
        <p className="loading-screen__kanji">ホタル</p>
        <div className="loading-screen__line" />
      </div>
    </div>
  );
}

export default LoadingScreen;