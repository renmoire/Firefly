import { useEffect, useState } from "react";
import "./Hero.css";

// useState + useEffect dipakai di sini buat ganti class "fade" setelah
// gambar selesai dimuat — versi vanilla JS dulu pakai window.addEventListener("load"),
// di React kita lakukan hal yang sama lewat efek samping (side effect) saat komponen tampil.
function Hero() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Delay kecil supaya transisi fade-in terlihat, bukan langsung muncul.
    const timer = setTimeout(() => setIsVisible(true), 150);
    return () => clearTimeout(timer);
  }, []);

  return (
    <section className="hero" id="hero">
      <div className="hero__embers" aria-hidden="true">
        {Array.from({ length: 18 }).map((_, i) => (
          <span key={i} className="ember" style={{ "--i": i }} />
        ))}
      </div>

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
