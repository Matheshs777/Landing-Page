import { useEffect, useRef, useState } from 'react'
import { ScrollTrigger } from '../lib/gsap'

/**
 * Drives a sticky 3D stage from scroll position.
 *
 * Returns a progress ref the camera reads inside the render loop (no React
 * re-render per frame) and the active chapter index for the overlay copy.
 * The trigger is killed on unmount so StrictMode double-mounts stay clean.
 */
export function useScrollStage(ref, count, onProgress) {
  const progress = useRef(0)
  const [index, setIndex] = useState(0)
  const callback = useRef(onProgress)
  callback.current = onProgress

  useEffect(() => {
    const element = ref.current
    if (!element) return undefined

    const trigger = ScrollTrigger.create({
      trigger: element,
      start: 'top top',
      end: 'bottom bottom',
      onUpdate(self) {
        progress.current = self.progress
        callback.current?.(self.progress)
        const next = Math.min(
          count - 1,
          Math.max(0, Math.floor(self.progress * count)),
        )
        setIndex((previous) => (previous === next ? previous : next))
      },
      onRefresh(self) {
        progress.current = self.progress
      },
    })

    return () => trigger.kill()
  }, [ref, count])

  return { progress, index }
}
