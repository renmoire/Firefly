import { useEffect, useRef, useState } from "react";
import "./LoadingScreen.css";

/**
 * Props:
 *   onMorphStart — dipanggil tepat saat morph dimulai
 *                  → App set stage "morphing", main masih hidden tapi
 *                    background sudah #0b0907 (tidak ada flash)
 *   onDone       — dipanggil setelah morph + sedikit buffer
 *                  → App set stage "done", main jadi visible
 */
function LoadingScreen({ onMorphStart, onDone }) {
  const canvasRef  = useRef(null);
  const nameRef    = useRef(null);
  const overlayRef = useRef(null);
  const [phase, setPhase] = useState("in");

  // ── Ember particles ──────────────────────────────────────────────
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx    = canvas.getContext("2d");
    let animId;

    const resize = () => {
      canvas.width  = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const EMBER   = "rgba(255, 177, 92,";
    const EMBER_L = "rgba(255, 230, 180,";
    const rand    = (a, b) => Math.random() * (b - a) + a;

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
        p.wobble  += p.wobbleSpeed;
        p.x += p.vx + Math.sin(p.wobble) * p.wobbleAmp;
        p.y += p.vy;
        if (p.y < -0.05) Object.assign(p, makeSpark(), { y: rand(0.9, 1.05), opacity: 0 });
        const px = p.x * W, py = p.y * H;
        const g  = ctx.createRadialGradient(px, py, 0, px, py, p.r);
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

  // ── Timing ───────────────────────────────────────────────────────
  useEffect(() => {
    const t = setTimeout(() => setPhase("morph"), 1600);
    return () => clearTimeout(t);
  }, []);

  // ── Morph execution ──────────────────────────────────────────────
  useEffect(() => {
    if (phase !== "morph") return;

    // Beritahu App bahwa morph dimulai — App set background #0b0907
    onMorphStart?.();

    const nameEl    = nameRef.current;
    const overlayEl = overlayRef.current;
    if (!nameEl || !overlayEl) return;

    const target   = document.querySelector(".hero__title");
    const fromRect = nameEl.getBoundingClientRect();
    const toRect   = target?.getBoundingClientRect() ?? {
      top: 160, left: 80,
      width: fromRect.width * 0.6,
      height: fromRect.height * 0.6,
    };

    const dx    = toRect.left + toRect.width  / 2 - (fromRect.left + fromRect.width  / 2);
    const dy    = toRect.top  + toRect.height / 2 - (fromRect.top  + fromRect.height / 2);
    const scale = ((toRect.width / fromRect.width) + (toRect.height / fromRect.height)) / 2;

    const DURATION = 700;
    const EASING   = "cubic-bezier(0.4, 0, 0.2, 1)";

    // Nama morph ke hero__title
    nameEl.animate(
      [
        { transform: "translate(0,0) scale(1)",                      opacity: 1 },
        { transform: `translate(${dx}px,${dy}px) scale(${scale})`,   opacity: 0 },
      ],
      { duration: DURATION, easing: EASING, fill: "forwards" }
    );

    // Background overlay fade — tapi ke #0b0907 bukan transparan,
    // supaya tidak ada momen di mana body putih kelihatan
    overlayEl.animate(
      [
        { opacity: 1 },
        { opacity: 0 },
      ],
      { duration: DURATION, easing: "ease-in", fill: "forwards" }
    );

    // Elemen pendamping fade lebih cepat
    overlayEl.querySelectorAll(".ls-fade").forEach((el) => {
      el.animate(
        [{ opacity: 1 }, { opacity: 0 }],
        { duration: DURATION * 0.45, easing: "ease-in", fill: "forwards" }
      );
    });

    // onDone dipanggil tepat saat overlay sudah opacity:0
    // — main langsung visible tanpa jeda, tidak ada frame kosong
    const t = setTimeout(onDone, DURATION);
    return () => clearTimeout(t);
  }, [phase, onMorphStart, onDone]);

  return (
    <div
      ref={overlayRef}
      className="loading-screen"
      aria-hidden="true"
    >
      <canvas ref={canvasRef} className="loading-screen__canvas" />

      <div className="loading-screen__content">
        <p className="loading-screen__eyebrow ls-fade">
          AR-26710 · Stellaron Hunter
        </p>
        <h1 ref={nameRef} className="loading-screen__name">
          Firefly
        </h1>
        <p className="loading-screen__kanji ls-fade">ホタル</p>
        <div className="loading-screen__line ls-fade" />
      </div>
    </div>
  );
}

export default LoadingScreen;