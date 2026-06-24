import "./Footer.css";

function Footer() {
  return (
    <footer className="footer">
      <div className="footer__inner">
        <div className="footer__credit">
          <span className="footer__credit-title">Firefly — Character Archive</span>
          <p className="footer__credit-text">
            Character, artwork references, and footage belong to HoYoverse —
            Honkai: Star Rail. This is an unofficial fan archive.
          </p>
        </div>

        <div className="footer__links">
          <a 
            href="https://github.com/renmoire"
            target="_blank"
            rel="noopener noreferrer"
            className="footer__link"
            aria-label="GitHub"
          >
            <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
              <path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.44 9.8 8.21 11.39.6.11.82-.26.82-.58 0-.29-.01-1.04-.02-2.04-3.34.72-4.04-1.61-4.04-1.61-.55-1.39-1.34-1.76-1.34-1.76-1.09-.75.08-.73.08-.73 1.21.08 1.84 1.24 1.84 1.24 1.07 1.84 2.81 1.3 3.5.99.11-.78.42-1.3.76-1.6-2.67-.3-5.47-1.33-5.47-5.93 0-1.31.47-2.38 1.24-3.22-.12-.3-.54-1.52.12-3.18 0 0 1.01-.32 3.3 1.23.96-.27 1.98-.4 3-.4s2.04.13 3 .4c2.29-1.55 3.3-1.23 3.3-1.23.66 1.66.24 2.88.12 3.18.77.84 1.24 1.91 1.24 3.22 0 4.61-2.81 5.63-5.48 5.93.43.37.81 1.1.81 2.22 0 1.6-.01 2.89-.01 3.28 0 .32.22.7.83.58C20.56 21.79 24 17.3 24 12c0-6.63-5.37-12-12-12z" />
            </svg>
          </a>

          <a
            href="https://x.com/FoundationsofDK"
            target="_blank"
            rel="noopener noreferrer"
            className="footer__link"
            aria-label="X (Twitter)"
          >
            <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
              <path d="M18.9 1.6h3.7l-8.1 9.3 9.5 12.5h-7.4l-5.8-7.6-6.6 7.6H.5l8.7-10-9.1-11.8h7.6l5.3 7 6-7Zm-1.3 19.5h2L7.6 3.7H5.4l12.2 17.4Z" />
            </svg>
          </a>
        </div>
      </div>

      <p className="footer__bottom">
        Built with love · Not affiliated with HoYoverse
      </p>
    </footer>
  );
}

export default Footer;