import { useMemo, useState } from "react";
import { useScrollReveal } from "../hooks/useScrollReveal";
import appearances from "../data/appearances";
import AppearanceCard from "./AppearanceCard";
import "./Appearances.css";

const ITEMS_PER_PAGE = 3;

// Versi React dari logic pagination yang dulu di script.js (showpage()).
// Bedanya: dulu kita ubah `display: none/flex` tiap kartu lewat DOM langsung.
// Sekarang kita hitung dulu "kartu mana saja yang harus tampil di halaman ini"
// dengan slice(), lalu React yang merender ulang hanya kartu-kartu itu.
function Appearances() {
  const [page, setPage] = useState(1);
  const totalPages = Math.ceil(appearances.length / ITEMS_PER_PAGE);

  const visibleEntries = useMemo(() => {
    const start = (page - 1) * ITEMS_PER_PAGE;
    return appearances.slice(start, start + ITEMS_PER_PAGE);
  }, [page]);

  return (
    <section className="appearances" id="appearances">
      <div className="appearances__header">
        <span className="hero__eyebrow">Archive · Public Appearances</span>
        <h2 className="appearances__title">Firefly's Appearances</h2>
        <h3 className="appearances__nihon">ファイアフライの記録</h3>
      </div>

      <div className="appearances__grid">
        {visibleEntries.map((entry) => (
          <AppearanceCard key={entry.id} entry={entry} />
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
