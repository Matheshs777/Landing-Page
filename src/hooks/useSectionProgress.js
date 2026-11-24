import { useEffect, useRef } from 'react'

/**
 * Normalised progress through a tall section, from the moment its top reaches
 * the top of the viewport to the moment its bottom reaches the bottom.
 * The value lives in a ref so the 3D camera can read it without re-rendering.
 */
export function useSectionProgress(ref, enabled = true) {
  const progress = useRef(0)

  useEffect(() => {
    if (!enabled) return
    let frame = 0

    const update = () => {
      frame = 0
      const element = ref.current
      if (!element) return
      const rect = element.getBoundingClientRect()
      const distance = rect.height - window.innerHeight
      progress.current =
        distance > 0 ? Math.min(1, Math.max(0, -rect.top / distance)) : 0
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
  }, [ref, enabled])

  return progress
}
