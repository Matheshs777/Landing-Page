import { useEffect, useState } from 'react'

/**
 * Picks the section currently under the reading line. Works with nested
 * sections (the configurator lives inside the automobile chapter), because it
 * compares absolute document offsets rather than intersection ratios.
 */
export function useActiveSection(ids) {
  const [active, setActive] = useState(ids[0] ?? '')

  useEffect(() => {
    let frame = 0

    const update = () => {
      frame = 0
      const marker = window.scrollY + window.innerHeight * 0.34
      let bestId = ids[0]
      let bestTop = -Infinity

      for (const id of ids) {
        const element = document.getElementById(id)
        if (!element) continue
        const top = element.getBoundingClientRect().top + window.scrollY
        if (top <= marker && top > bestTop) {
          bestTop = top
          bestId = id
        }
      }

      setActive((previous) => (previous === bestId ? previous : bestId))
    }

    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(update)
    }

    update()
    window.addEventListener('scroll', schedule, { passive: true })
    window.addEventListener('resize', schedule)
    return () => {
      if (frame) cancelAnimationFrame(frame)
      window.removeEventListener('scroll', schedule)
      window.removeEventListener('resize', schedule)
    }
  }, [ids])

  return active
}
