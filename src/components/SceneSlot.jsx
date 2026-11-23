import { Suspense, useRef } from 'react'
import { useInView } from 'framer-motion'
import { SceneLoader } from './SceneLoader'

/**
 * Delays mounting a WebGL canvas until it is near the viewport.
 * Keeps the first paint light and avoids three contexts on load.
 */
export function SceneSlot({ children, className = '', label }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '320px 0px' })

  return (
    <div ref={ref} className={`scene-slot ${className}`}>
      {inView ? (
        <Suspense fallback={<SceneLoader label={label} />}>{children}</Suspense>
      ) : (
        <SceneLoader label={label} />
      )}
    </div>
  )
}
