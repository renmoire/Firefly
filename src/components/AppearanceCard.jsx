// Komponen kecil khusus untuk satu kartu video.
// Memecah UI jadi komponen kecil seperti ini memudahkan kalau nanti
// kamu mau ubah tampilan satu kartu saja, tanpa menyentuh logic grid/pagination.
function AppearanceCard({ entry }) {
  return (
    <div className="appearance-card">
      <span className="appearance-card__date">{entry.date}</span>

      <a
        href={entry.url}
        target="_blank"
        rel="noopener noreferrer"
        className="appearance-card__link"
      >
        <div className="appearance-card__thumb">
          <img src={entry.thumbnail} alt={entry.title} loading="lazy" />
          <span className="appearance-card__play" aria-hidden="true" />
        </div>
      </a>

      <h3 className="appearance-card__title">{entry.title}</h3>
    </div>
  );
}

export default AppearanceCard;
