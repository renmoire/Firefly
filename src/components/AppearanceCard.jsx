function AppearanceCard({ entry, className = "", style }) {
  return (
    <div className={`appearance-card ${className}`} style={style}>
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