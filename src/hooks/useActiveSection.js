import { useEffect, useState } from 'react'

/**
 * Tracks which section owns the reading position. Uses the top third of the
 * viewport so a section becomes active as it settles under the nav.
 */
export function useActiveSection(ids, { rootMargin = '-32% 0px -58% 0px' } = {}) {
  const [active, setActive] = useState(ids[0] ?? '')

  useEffect(() => {
    if (typeof IntersectionObserver === 'undefined') return
    const elements = ids
      .map((id) => document.getElementById(id))
      .filter(Boolean)
    if (!elements.length) return

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)
        if (visible[0]) setActive(visible[0].target.id)
      },
      { rootMargin, threshold: [0, 0.15, 0.4, 0.75] },
    )

    elements.forEach((element) => observer.observe(element))
    return () => observer.disconnect()
  }, [ids, rootMargin])

  return active
}
