import { useEffect, useState } from "react";
import { useScrollReveal } from "../hooks/useScrollReveal";
import moments from "../data/moments";
import "./Moments.css";

function Moments() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const containerRef = useScrollReveal();

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % moments.length);
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="moments" ref={containerRef}>
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

      <div className="moments__text reveal">
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