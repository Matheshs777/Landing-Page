import { Link } from 'react-router-dom'
import { BrandMark } from '../components/ui/BrandMark'
import { useDocumentTitle } from '../hooks/useDocumentTitle'

export function ErrorPage({
  code = '404',
  eyebrow = 'Not found',
  title = 'This road is not on the map.',
  message = 'The page you asked for does not exist, or it has moved since the last studio update.',
  showReload = false,
}) {
  useDocumentTitle(code === '404' ? 'Page not found' : 'Unexpected error')

  return (
    <main id="main" className="status-page">
      <div className="container status-page__inner">
        <BrandMark height={30} />
        <p className="status-page__code" aria-hidden="true">
          {code}
        </p>
        <p className="eyebrow">{eyebrow}</p>
        <h1>{title}</h1>
        <p className="status-page__message">{message}</p>
        <div className="status-page__actions">
          <Link className="btn btn--solid" to="/">
            Back to the studio
          </Link>
          {showReload ? (
            <button
              type="button"
              className="btn btn--ghost"
              onClick={() => window.location.reload()}
            >
              Reload the page
            </button>
          ) : (
            <Link className="btn btn--ghost" to="/#configurator">
              View the cars
            </Link>
          )}
        </div>
      </div>
    </main>
  )
}
