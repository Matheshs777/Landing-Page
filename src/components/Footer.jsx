export function Footer() {
  return (
    <footer className="footer">
      <div className="container footer__inner">
        <div className="footer__brand-wrap">
          <a className="footer__brand" href="#top" aria-label="PULSAR home">
            PULSAR<span className="footer__brand-dot" aria-hidden="true" />
          </a>
          <p className="footer__meta">
            Pulsar Buds One / Series 01
            <br />
            $89 — First batch: 1,000 pairs
          </p>
        </div>

        <nav className="footer__links" aria-label="Footer">
          <a href="#features">Features</a>
          <a href="#sound">Sound</a>
          <a href="#specs">Specs</a>
          <a href="#preorder">Pre-order</a>
          <a href="#top">Top</a>
        </nav>

        <p className="footer__note">
          © 2026 Pulsar Audio.
          <br />
          A fictional product concept.
        </p>
      </div>
    </footer>
  )
}
