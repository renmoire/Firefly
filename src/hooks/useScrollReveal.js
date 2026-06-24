import { useEffect, useRef } from "react";

/**
 * useScrollReveal — attach ke container element, semua child dengan
 * class "reveal" akan fade+slide in saat masuk viewport.
 *
 * @param {object} options
 * @param {string}  options.selector   - class target di dalam container (default: ".reveal")
 * @param {number}  options.threshold  - 0–1, seberapa banyak harus terlihat sebelum trigger (default: 0.15)
 * @param {number}  options.stagger    - delay antar elemen dalam ms (default: 80)
 */
export function useScrollReveal({
  selector = ".reveal",
  threshold = 0.15,
  stagger = 80,
} = {}) {
  const containerRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const elements = Array.from(container.querySelectorAll(selector));
    if (!elements.length) return;

    // Tambah index stagger sebagai CSS var
    elements.forEach((el, i) => {
      el.style.setProperty("--reveal-i", i);
    });

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const el = entry.target;
            const i = elements.indexOf(el);
            setTimeout(() => {
              el.classList.add("reveal--visible");
            }, i * stagger);
            observer.unobserve(el); // sekali reveal, tidak reset
          }
        });
      },
      { threshold }
    );

    elements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, [selector, threshold, stagger]);

  return containerRef;
}
