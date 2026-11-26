import { Link } from 'react-router-dom'
import { BRAND } from '../config/brand'
import { useConsent } from '../hooks/useConsent'
import { BrandMark } from './ui/BrandMark'

const EXPLORE = [
  { label: 'Automobile', to: '/#automobile' },
  { label: 'Superbike', to: '/#superbike' },
  { label: 'Configurator', to: '/#configurator' },
  { label: 'Engineering', to: '/#engineering' },
]

const DETAILS = [
  { label: 'Philosophy', to: '/#philosophy' },
  { label: 'Gallery', to: '/#gallery' },
  { label: 'Asset credits', to: '/credits' },
  { label: 'Privacy policy', to: '/privacy' },
  { label: 'Cookie policy', to: '/cookies' },
]

export function Footer() {
  const { openSettings } = useConsent()

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
              <Link key={item.to} to={item.to}>
                {item.label}
              </Link>
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
              <Link key={item.to} to={item.to}>
                {item.label}
              </Link>
            ))}
            <button type="button" className="footer__link-button" onClick={openSettings}>
              Cookie settings
            </button>
          </div>
        </div>
      </div>

      <div className="container footer__legal">
        <p>
          © 2026 {BRAND.legal}. A fictional marque. Vehicles, specifications and
          availability are illustrative design studies, not a production programme.
        </p>
        <Link className="footer__top-link" to="/#home">
          Back to top <span aria-hidden="true">↑</span>
        </Link>
      </div>
    </footer>
  )
}
