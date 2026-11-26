import { useEffect } from 'react'

const BASE = 'NOVARIS — Beyond the Machine'

/** Keeps the document title in step with the route without a head manager. */
export function useDocumentTitle(title) {
  useEffect(() => {
    document.title = title ? `${title} — NOVARIS` : BASE
  }, [title])
}
