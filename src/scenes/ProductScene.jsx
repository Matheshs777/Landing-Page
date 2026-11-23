import { Suspense, useId, useRef } from 'react'
import { Canvas } from '@react-three/fiber'
import { useInView, useReducedMotion } from 'framer-motion'
import { Lighting } from './Lighting'
import { ProductRig } from './ProductRig'
import { SceneFallback } from '../components/SceneFallback'

/**
 * Shared 3D stage. Pointer drag and arrow keys rotate the product.
 *
 * The canvas is transparent so each section supplies its own studio
 * background. Rendering pauses when the stage leaves the viewport, which
 * keeps three separate product views affordable on a long page.
 */
export function ProductScene({
  colorway,
  mode = 'hero',
  activeFeature = 0,
  scrollProgress,
  dark = false,
  className = '',
}) {
  const reducedMotion = useReducedMotion()
  const rootRef = useRef(null)
  const inView = useInView(rootRef, { margin: '160px 0px' })
  const hintId = useId()

  const dragRef = useRef({
    active: false,
    lastX: 0,
    lastY: 0,
    targetY: mode === 'feature' ? 0.35 : 0.7,
    targetX: 0.04,
  })

  const handlePointerDown = (event) => {
    if (event.pointerType === 'mouse' && event.button !== 0) return
    const drag = dragRef.current
    drag.active = true
    drag.lastX = event.clientX
    drag.lastY = event.clientY
    event.currentTarget.setPointerCapture?.(event.pointerId)
  }

  const handlePointerMove = (event) => {
    const drag = dragRef.current
    if (!drag.active) return
    const dx = event.clientX - drag.lastX
    const dy = event.clientY - drag.lastY
    drag.targetY += dx * 0.0075
    drag.targetX = Math.max(-0.32, Math.min(0.46, drag.targetX + dy * 0.004))
    drag.lastX = event.clientX
    drag.lastY = event.clientY
  }

  const handlePointerUp = (event) => {
    const drag = dragRef.current
    drag.active = false
    event.currentTarget.releasePointerCapture?.(event.pointerId)
  }

  const handleKeyDown = (event) => {
    const drag = dragRef.current
    const step = 0.22
    if (event.key === 'ArrowLeft') {
      drag.targetY -= step
      event.preventDefault()
    } else if (event.key === 'ArrowRight') {
      drag.targetY += step
      event.preventDefault()
    } else if (event.key === 'ArrowUp') {
      drag.targetX = Math.max(-0.32, drag.targetX - step * 0.5)
      event.preventDefault()
    } else if (event.key === 'ArrowDown') {
      drag.targetX = Math.min(0.46, drag.targetX + step * 0.5)
      event.preventDefault()
    }
  }

  return (
    <div
      ref={rootRef}
      className={`product-scene ${className}`}
      role="group"
      tabIndex={0}
      aria-label="Interactive 3D model of Pulsar Buds One. Drag, or use the arrow keys, to rotate the product."
      aria-describedby={hintId}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
      onLostPointerCapture={() => {
        dragRef.current.active = false
      }}
      onKeyDown={handleKeyDown}
    >
      <Canvas
        fallback={<SceneFallback />}
        dpr={[1, 1.5]}
        frameloop={inView ? 'always' : 'demand'}
        gl={{ alpha: true, antialias: true, powerPreference: 'high-performance' }}
        camera={{ position: [0, 0.6, 7], fov: 32, near: 0.1, far: 50 }}
        onCreated={({ gl }) => {
          gl.setClearColor(0x000000, 0)
        }}
        style={{ width: '100%', height: '100%' }}
      >
        <Suspense fallback={null}>
          <Lighting dark={dark} />
          <ProductRig
            colorway={colorway}
            mode={mode}
            activeFeature={activeFeature}
            scrollProgress={scrollProgress}
            dragRef={dragRef}
            reducedMotion={Boolean(reducedMotion)}
          />
        </Suspense>
      </Canvas>

      <span className="scene-hint" aria-hidden="true">
        <span className="scene-hint__dot" />
        Drag to rotate
      </span>
      <span className="sr-only" id={hintId}>
        Use the left and right arrow keys to rotate the product. Use the up and down
        arrow keys to tilt it.
      </span>
    </div>
  )
}
