import { useEffect, useRef, useState } from "react";
import "./Hero.css";

// Canvas-based ambient particles menggantikan .hero__embers CSS
// Tiga jenis partikel bercampur: bokeh (orb besar blur), dust (titik kecil shimmer), petal (drift diagonal)
function AmbientCanvas() {
  const canvasRef = useRef(null);

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

    // ── Warna dari CSS vars, hardcode di sini karena canvas tidak bisa baca CSS var ──
    const EMBER_300 = "rgba(255, 177, 92,";   // --ember-300
    const EMBER_100 = "rgba(255, 230, 180,";  // --ember-100

    // ── Generator partikel ──
    const randRange = (min, max) => Math.random() * (max - min) + min;

    // BOKEH — bola besar, sangat transparan, melayang perlahan ke segala arah
    const makeBokeh = () => ({
      type: "bokeh",
      x: randRange(0, 1),
      y: randRange(0, 1),
      r: randRange(18, 48),
      opacity: randRange(0.03, 0.09),
      opacityTarget: randRange(0.03, 0.09),
      opacitySpeed: randRange(0.0003, 0.0008),
      vx: randRange(-0.00008, 0.00008),
      vy: randRange(-0.00012, -0.00004), // cenderung naik tapi lambat
    });

    // DUST — titik kecil, berkedip (shimmer), nyaris tidak bergerak
    const makeDust = () => ({
      type: "dust",
      x: randRange(0, 1),
      y: randRange(0, 1),
      r: randRange(0.8, 2.2),
      opacity: 0,
      opacityTarget: randRange(0.2, 0.7),
      opacitySpeed: randRange(0.002, 0.006),
      vx: randRange(-0.00003, 0.00003),
      vy: randRange(-0.00006, -0.00001),
      color: Math.random() > 0.4 ? EMBER_300 : EMBER_100,
    });

    // PETAL — partikel sedang, drift diagonal dari bawah-kanan ke atas-kiri
    const makePetal = (fromBottom = false) => ({
      type: "petal",
      x: randRange(0.3, 1.1),
      y: fromBottom ? randRange(0.9, 1.1) : randRange(0, 1),
      r: randRange(2.5, 5),
      opacity: fromBottom ? 0 : randRange(0.1, 0.4),
      opacityTarget: randRange(0.15, 0.45),
      opacitySpeed: randRange(0.0008, 0.002),
      vx: randRange(-0.00018, -0.00006),  // gerak ke kiri
      vy: randRange(-0.00016, -0.00006),  // naik
      wobble: 0,
      wobbleSpeed: randRange(0.008, 0.02),
      wobbleAmp: randRange(0.0002, 0.0006),
      color: Math.random() > 0.5 ? EMBER_300 : EMBER_100,
    });

    // Inisialisasi partikel
    const particles = [
      ...Array.from({ length: 7 }, () => makeBokeh()),
      ...Array.from({ length: 28 }, () => makeDust()),
      ...Array.from({ length: 10 }, () => makePetal(false)),
    ];

    const draw = () => {
      const W = canvas.width;
      const H = canvas.height;
      ctx.clearRect(0, 0, W, H);

      for (const p of particles) {
        // Update opacity (breathe / shimmer)
        const diff = p.opacityTarget - p.opacity;
        if (Math.abs(diff) < 0.005) {
          // Flip target
          p.opacityTarget =
            p.type === "dust"
              ? randRange(0.05, 0.7)
              : p.type === "petal"
              ? randRange(0.1, 0.45)
              : randRange(0.03, 0.09);
        }
        p.opacity += diff * (p.type === "dust" ? 0.04 : 0.012);
        p.opacity = Math.max(0, Math.min(1, p.opacity));

        // Update posisi
        if (p.type === "petal") {
          p.wobble += p.wobbleSpeed;
          p.x += p.vx + Math.sin(p.wobble) * p.wobbleAmp;
          p.y += p.vy;
        } else {
          p.x += p.vx;
          p.y += p.vy;
        }

        // Wrap / recycle partikel yang keluar layar
        if (p.x < -0.05 || p.x > 1.05 || p.y < -0.1) {
          if (p.type === "bokeh") {
            Object.assign(p, makeBokeh(), { y: randRange(0.8, 1.1) });
          } else if (p.type === "dust") {
            Object.assign(p, makeDust(), { y: randRange(0.7, 1.05), opacity: 0 });
          } else {
            Object.assign(p, makePetal(true));
          }
          continue;
        }

        const px = p.x * W;
        const py = p.y * H;

        ctx.save();
        ctx.globalAlpha = p.opacity;

        if (p.type === "bokeh") {
          // Bokeh: blur halus via shadow
          const grad = ctx.createRadialGradient(px, py, 0, px, py, p.r);
          grad.addColorStop(0, `${EMBER_300} 0.5)`);
          grad.addColorStop(1, `${EMBER_300} 0)`);
          ctx.beginPath();
          ctx.arc(px, py, p.r, 0, Math.PI * 2);
          ctx.fillStyle = grad;
          ctx.fill();
        } else if (p.type === "dust") {
          // Dust: titik dengan glow kecil
          ctx.shadowColor = `${p.color} 1)`;
          ctx.shadowBlur = 4;
          ctx.beginPath();
          ctx.arc(px, py, p.r, 0, Math.PI * 2);
          ctx.fillStyle = `${p.color} 1)`;
          ctx.fill();
        } else {
          // Petal: bulat sedikit lebih besar, soft glow
          const grad = ctx.createRadialGradient(px, py, 0, px, py, p.r);
          grad.addColorStop(0, `${p.color} 0.9)`);
          grad.addColorStop(0.5, `${p.color} 0.4)`);
          grad.addColorStop(1, `${p.color} 0)`);
          ctx.shadowColor = `${p.color} 1)`;
          ctx.shadowBlur = 6;
          ctx.beginPath();
          ctx.arc(px, py, p.r, 0, Math.PI * 2);
          ctx.fillStyle = grad;
          ctx.fill();
        }

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

  return (
    <canvas
      ref={canvasRef}
      className="hero__ambient"
      aria-hidden="true"
    />
  );
}

function Hero() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 150);
    return () => clearTimeout(timer);
  }, []);

  return (
    <section className="hero" id="hero">
      {/* Canvas ambient menggantikan .hero__embers */}
      <AmbientCanvas />

      <div className="hero__bio">
        <span className="hero__eyebrow">AR-26710 · Stellaron Hunter</span>
        <h1 className="hero__title">Firefly</h1>
        <h2 className="hero__nihon">ホタル</h2>
        <p className="hero__desc">
          A girl who calls Glamoth home, carrying both a fragile body and an
          unbreakable wish to see the world burn bright before it ends.
        </p>
        <button className="hero__cta" type="button">
          <span className="hero__cta-icon">♪</span> Play Voice Line
        </button>
      </div>

      <div className="hero__char">
        <img
          className={isVisible ? "fade" : ""}
          src="/assets/h11.png"
          alt="Firefly character artwork"
        />
      </div>
    </section>
  );
}

export default Hero;