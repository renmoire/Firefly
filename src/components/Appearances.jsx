import { useMemo, useState } from "react";
import { useScrollReveal } from "../hooks/useScrollReveal";
import { useInView } from "../hooks/useInView";
import appearances from "../data/appearances";
import AppearanceCard from "./AppearanceCard";
import "./Appearances.css";

const ITEMS_PER_PAGE = 3;

function Appearances() {
  const [page, setPage] = useState(1);
  const totalPages = Math.ceil(appearances.length / ITEMS_PER_PAGE);
  const containerRef = useScrollReveal();
  const [gridRef, gridInView] = useInView(0.1);

  const visibleEntries = useMemo(() => {
    const start = (page - 1) * ITEMS_PER_PAGE;
    return appearances.slice(start, start + ITEMS_PER_PAGE);
  }, [page]);

  return (
    <section className="appearances" id="appearances" ref={containerRef}>
      <div className="appearances__header reveal">
        <span className="hero__eyebrow">Archive · Public Appearances</span>
        <h2 className="appearances__title">Firefly's Appearances</h2>
        <h3 className="appearances__nihon">ファイアフライの記録</h3>
      </div>

      {/* key={page} membuat React menganggap grid ini elemen baru tiap ganti
          halaman, supaya animasi card-in terpicu ulang. gridInView memastikan
          animasi itu hanya boleh jalan SETELAH section ini pernah terlihat —
          jadi tidak "kelar duluan" sebelum sempat di-scroll ke situ. */}
      <div className="appearances__grid" key={page} ref={gridRef}>
        {visibleEntries.map((entry, index) => (
          <AppearanceCard
            key={entry.id}
            entry={entry}
            className={gridInView ? "card-in" : "card-pending"}
            style={{ "--card-i": index }}
          />
        ))}
      </div>

      <div className="appearances__pagination">
        <button
          type="button"
          onClick={() => setPage((p) => Math.max(1, p - 1))}
          disabled={page === 1}
          aria-label="Previous page"
        >
          ←
        </button>
        <span className="appearances__page-info">
          {page} / {totalPages}
        </span>
        <button
          type="button"
          onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
          disabled={page === totalPages}
          aria-label="Next page"
        >
          →
        </button>
      </div>
    </section>
  );
}

export default Appearances;