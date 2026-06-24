import { useEffect, useRef, useState } from "react";

// Hook sederhana: true begitu elemen yang ditunjuk ref pertama kali
// masuk viewport, lalu tetap true selamanya (tidak reset).
export function useInView(threshold = 0.15) {
  const ref = useRef(null);
  const [isInView, setIsInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.unobserve(el); // cukup sekali, tidak perlu pantau terus
        }
      },
      { threshold }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold]);

  return [ref, isInView];
}