import { Suspense, useRef, useState } from 'react'
import { useNearViewport, useOnScreen } from '../hooks/useNearViewport'
import { useMediaQuery } from '../hooks/useMediaQuery'
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion'
import { useDragControls } from '../hooks/useDragControls'
import { useViewControls } from '../hooks/useViewControls'
import { VehicleCanvas } from '../scenes/lazy'
import { ErrorBoundary } from './ui/ErrorBoundary'

/** Smaller, always-available studio used beside each configurator. */
export function VehicleViewer({ vehicle, paint }) {
  const frameRef = useRef(null)
  const controls = useRef({ yaw: 0, zoom: 1 })
  const [loaded, setLoaded] = useState(false)
  const near = useNearViewport(frameRef, '600px')
  const visible = useOnScreen(frameRef, '120px')
  const reduced = usePrefersReducedMotion()
  const compact = useMediaQuery('(max-width: 820px)')
  const quality = compact ? 'low' : 'high'
  const { handlers, dragging } = useDragControls(controls)
  const view = useViewControls(controls)

  return (
    <div
      className={`viewer ${dragging ? 'is-dragging' : ''}`}
      ref={frameRef}
      {...handlers}
    >
      <img
        className="viewer__poster"
        src={vehicle.poster}
        alt={`${vehicle.fullName} studio view.`}
        loading="lazy"
        decoding="async"
        width="1600"
        height="1000"
      />

      {near && !reduced ? (
        <div className="viewer__canvas" data-ready={loaded}>
          <ErrorBoundary fallback={null}>
            <Suspense fallback={null}>
              <VehicleCanvas
                vehicle={vehicle}
                paint={paint}
                still={vehicle.presets[1].camera}
                controls={controls}
                active={visible}
                quality={quality}
                onReady={() => setLoaded(true)}
              />
            </Suspense>
          </ErrorBoundary>
        </div>
      ) : null}

      <div className="viewer__chrome">
        <span className="viewer__badge">{paint.name}</span>
        <span className="viewer__hint">
          <span aria-hidden="true">↔</span> Drag to rotate
        </span>
        <div className="viewer__zoom" role="group" aria-label="Zoom controls" data-no-drag>
          <button type="button" onClick={view.zoomOut} aria-label="Zoom out">
            −
          </button>
          <button type="button" onClick={view.zoomIn} aria-label="Zoom in">
            +
          </button>
          <button type="button" onClick={view.reset} aria-label="Reset view">
            Reset
          </button>
        </div>
      </div>

      {!loaded && !reduced ? (
        <div className="viewer__loading" role="status" aria-live="polite">
          <span className="viewer__loading-line" />
        </div>
      ) : null}
    </div>
  )
}
