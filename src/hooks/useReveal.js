import { useEffect, useRef, useState } from 'react'

/**
 * IntersectionObserver reveal with a hard failsafe.
 *
 * If the observer never fires — a zero-height parent, a print view, an old
 * browser, a layout shift — the content is shown anyway after a short delay.
 * Nothing on the site is allowed to stay invisible.
 */
export function useReveal({
  once = true,
  rootMargin = '0px 0px -6% 0px',
  threshold = 0.12,
  fallbackDelay = 2400,
} = {}) {
  const ref = useRef(null)
  const [shown, setShown] = useState(false)

  useEffect(() => {
    const element = ref.current
    if (!element) return undefined

    if (typeof IntersectionObserver === 'undefined') {
      setShown(true)
      return undefined
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue
          setShown(true)
          if (once) observer.disconnect()
        }
      },
      { rootMargin, threshold },
    )
    observer.observe(element)

    const timer = window.setTimeout(() => setShown(true), fallbackDelay)

    return () => {
      observer.disconnect()
      window.clearTimeout(timer)
    }
  }, [once, rootMargin, threshold, fallbackDelay])

  return [ref, shown]
}
