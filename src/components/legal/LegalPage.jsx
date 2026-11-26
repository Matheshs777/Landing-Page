import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { BRAND } from '../../config/brand'
import { useDocumentTitle } from '../../hooks/useDocumentTitle'

/** Shared shell for Privacy, Cookies and Asset Credits. */
export function LegalPage({ eyebrow, title, intro, updated, children }) {
  useDocumentTitle(title)

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  return (
    <main id="main" className="legal">
      <div className="container legal__inner">
        <nav className="legal__crumbs" aria-label="Breadcrumb">
          <Link to="/">Home</Link>
          <span aria-hidden="true">/</span>
          <span aria-current="page">{title}</span>
        </nav>

        <header className="legal__head">
          <p className="eyebrow">{eyebrow}</p>
          <h1>{title}</h1>
          <p className="legal__intro">{intro}</p>
          <p className="legal__updated">Last updated {updated}</p>
        </header>

        <div className="legal__body">{children}</div>

        <p className="legal__note">
          {BRAND.name} is a fictional marque. {BRAND.disclaimer}
        </p>

        <Link className="text-link legal__back" to="/">
          Back to the studio <span aria-hidden="true">→</span>
        </Link>
      </div>
    </main>
  )
}
