import {
  Component,
  Suspense,
  lazy,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import { BIKE, CAR } from '../../config/vehicles'
import { resolveCamera } from '../../scenes/vehicle'
import { useOnScreen } from '../../hooks/useNearViewport'
import { useMediaQuery } from '../../hooks/useMediaQuery'
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion'

const ViewerCanvas = lazy(() => import('./ViewerCanvas'))

const FALLBACK =
  'This browser could not start WebGL, so the live 3D studio is unavailable.'

/**
 * The single 3D viewer used everywhere on the site.
 *
 * The shell is cheap; the three.js chunk only loads once a viewer comes near
 * the viewport. Every instance shares the same GLB (useGLTF cache) and clones
 * it, uses the same studio rig, and renders the file's original materials.
 */
export function ModelViewer({
  id,
  view = 'three-quarter',
  progress = null,
  controls = null,
  interactive = false,
  autoRotate = false,
  scroll = false,
  className = '',
  quality,
  label,
  onReady,
}) {
  const frameRef = useRef(null)
  const localControls = useRef({ yaw: 0, zoom: 1 })
  const activeControls = controls ?? localControls
  const [loaded, setLoaded] = useState(false)
  const [failed, setFailed] = useState(false)
  const [attempt, setAttempt] = useState(0)
  const near = useOnScreen(frameRef, '520px')
  const visible = useOnScreen(frameRef, '80px')
  const compact = useMediaQuery('(max-width: 820px)')
  const reduced = usePrefersReducedMotion()
  const vehicle = id === 'r01' ? BIKE : CAR
  const [supported] = useState(hasWebGL)

  const resolvedQuality = quality ?? (compact ? 'low' : 'high')
  const camera = useMemo(
    () => resolveCamera(vehicle, view) ?? vehicle.presets[1].camera,
    [vehicle, view],
  )
  const shouldRotate = autoRotate && !reduced
  const shouldFloat = (interactive || shouldRotate || scroll) && !reduced
  const live = visible && !reduced

  useEffect(() => {
    setLoaded(false)
    setFailed(false)
  }, [id, attempt])

  if (!supported) {
    return (
      <ViewerFallback
        className={className}
        message={FALLBACK}
        label={label ?? `${vehicle.fullName} 3D studio`}
      />
    )
  }

  return (
    <div
      className={`model-viewer ${className}`}
      ref={frameRef}
      data-loaded={loaded}
      role="img"
      aria-label={
        label ??
        `${vehicle.fullName}, ${String(view).replace('-', ' ')} view, rendered live in the NOVARIS studio.`
      }
    >
      {near ? (
        <ViewerBoundary
          key={`${id}-${attempt}`}
          fallback={
            <ViewerFallback
              className="model-viewer__inline-fallback"
              message="The 3D model could not be loaded. Check your connection and try again."
              label={label ?? `${vehicle.fullName} 3D studio`}
              onRetry={() => setAttempt((value) => value + 1)}
            />
          }
          onError={() => setFailed(true)}
        >
          <Suspense fallback={null}>
            <ViewerCanvas
              id={id}
              camera={camera}
              chapters={vehicle.chapters}
              progress={scroll ? progress : null}
              controls={activeControls}
              autoRotate={shouldRotate}
              float={shouldFloat}
              quality={resolvedQuality}
              compact={compact}
              live={live}
              onReady={() => {
                setLoaded(true)
                onReady?.()
              }}
            />
          </Suspense>
        </ViewerBoundary>
      ) : (
        <div className="model-viewer__placeholder" aria-hidden="true" />
      )}

      {!loaded && !failed ? (
        <div className="model-viewer__loader" role="status" aria-live="polite">
          <span className="model-viewer__loader-label">Preparing the studio</span>
          <span className="model-viewer__loader-track" aria-hidden="true">
            <span />
          </span>
        </div>
      ) : null}

      {failed ? (
        <ViewerFallback
          className="model-viewer__inline-fallback"
          message="The 3D studio stopped responding."
          label={label ?? `${vehicle.fullName} 3D studio`}
          onRetry={() => setAttempt((value) => value + 1)}
        />
      ) : null}
    </div>
  )
}

function ViewerFallback({ className = '', message, label, onRetry }) {
  return (
    <div
      className={`model-viewer model-viewer--fallback ${className}`}
      role="img"
      aria-label={label}
    >
      <div className="model-viewer__fallback-inner">
        <span className="model-viewer__fallback-mark" aria-hidden="true" />
        <p>{message}</p>
        {onRetry ? (
          <button type="button" className="btn btn--ghost" onClick={onRetry}>
            Retry the studio
          </button>
        ) : null}
      </div>
    </div>
  )
}

class ViewerBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { failed: false }
  }

  static getDerivedStateFromError() {
    return { failed: true }
  }

  componentDidCatch(error) {
    if (import.meta.env.DEV) console.warn('3D viewer error:', error)
    this.props.onError?.()
  }

  render() {
    if (this.state.failed) return this.props.fallback
    return this.props.children
  }
}

function hasWebGL() {
  if (typeof window === 'undefined') return false
  try {
    const canvas = document.createElement('canvas')
    return Boolean(
      window.WebGLRenderingContext &&
        (canvas.getContext('webgl2') || canvas.getContext('webgl')),
    )
  } catch {
    return false
  }
}
