import { useEffect, useState } from "react";
import { useScrollReveal } from "../hooks/useScrollReveal";
import moments from "../data/moments";
import "./Moments.css";

// Ini versi React dari setInterval yang dulu di script.js.
// Bedanya: di React kita simpan "slide yang aktif sekarang" di state (currentIndex),
// lalu biarkan React yang menggambar ulang tampilan setiap kali state berubah —
// kita tidak lagi menambah/menghapus class secara manual lewat document.querySelector.
function Moments() {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % moments.length);
    }, 2500);

    // Cleanup: hentikan interval saat komponen dilepas, supaya tidak terus jalan
    // di background dan menyebabkan memory leak.
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="moments">
      <div className="moments__show">
        {moments.map((moment, index) => (
          <div
            key={moment.id}
            className={`moments__frame ${
              index === currentIndex ? "is-active" : ""
            }`}
          >
            <img
              src={moment.src}
              alt=""
              style={{
                objectPosition: moment.objectPosition,
                transform: moment.transform,
              }}
            />
          </div>
        ))}
      </div>

      <div className="moments__text">
        <span className="hero__eyebrow">Archive · Candid Moments</span>
        <h2 className="moments__title">Quiet Moments</h2>
        <p className="moments__desc">
          Between the missions and the fire, there are still mornings like
          this — soft, unguarded, hers alone.
        </p>
      </div>
    </section>
  );
}

export default Moments;
