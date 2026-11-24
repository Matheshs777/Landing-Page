import { BRAND } from '../config/brand'
import { BrandMark } from './ui/BrandMark'

const EXPLORE = [
  { label: 'Automobile', href: '#automobile' },
  { label: 'Superbike', href: '#superbike' },
  { label: 'Configurator', href: '#configurator' },
  { label: 'Engineering', href: '#engineering' },
]

const DETAILS = [
  { label: 'Philosophy', href: '#philosophy' },
  { label: 'Gallery', href: '#gallery' },
  { label: 'Asset credits', href: '/models/ASSET_CREDITS.md', external: true },
]

export function Footer() {
  return (
    <footer className="footer" id="footer">
      <div className="container footer__top">
        <div className="footer__brand">
          <div className="footer__mark">
            <BrandMark height={34} />
            <p className="footer__wordmark">{BRAND.name}</p>
          </div>
          <p className="footer__tagline">{BRAND.tagline}</p>
          <p className="footer__note">
            Two concept studies, presented as a single design language.
          </p>
        </div>

        <div className="footer__columns">
          <div className="footer__column">
            <h3>Explore</h3>
            {EXPLORE.map((item) => (
              <a key={item.href} href={item.href}>
                {item.label}
              </a>
            ))}
          </div>

          <div className="footer__column">
            <h3>Studio</h3>
            <p>{BRAND.contact.location}</p>
            <a href={`mailto:${BRAND.contact.email}`}>{BRAND.contact.email}</a>
            <p>By appointment only</p>
          </div>

          <div className="footer__column">
            <h3>Details</h3>
            {DETAILS.map((item) => (
              <a
                key={item.href}
                href={item.href}
                {...(item.external
                  ? { target: '_blank', rel: 'noreferrer noopener' }
                  : {})}
              >
                {item.label}
              </a>
            ))}
          </div>
        </div>
      </div>

      <div className="container footer__legal">
        <p>
          © 2026 {BRAND.legal}. A fictional marque. Vehicles, specifications and
          availability are illustrative design studies, not a production programme.
        </p>
        <a className="footer__top-link" href="#home">
          Back to top <span aria-hidden="true">↑</span>
        </a>
      </div>
    </footer>
  )
}
