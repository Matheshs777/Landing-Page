import { useEffect } from 'react'

/** Locks body scroll without the page jumping as the scrollbar disappears. */
export function useBodyScrollLock(locked) {
  useEffect(() => {
    if (!locked) return
    const { body, documentElement } = document
    const scrollbar = window.innerWidth - documentElement.clientWidth
    const previousOverflow = body.style.overflow
    const previousPadding = body.style.paddingRight
    body.style.overflow = 'hidden'
    if (scrollbar > 0) body.style.paddingRight = `${scrollbar}px`
    return () => {
      body.style.overflow = previousOverflow
      body.style.paddingRight = previousPadding
    }
  }, [locked])
}
