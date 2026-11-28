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
import { resolveCamera } from '../../config/views'
import { useOnScreen } from '../../hooks/useNearViewport'
import { useMediaQuery } from '../../hooks/useMediaQuery'
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion'

const ViewerCanvas = lazy(() => import('./ViewerCanvas'))

const MESSAGES = {
  unsupported:
    'This browser could not start WebGL, so the live 3D studio is unavailable.',
  context:
    'The 3D studio lost its graphics context. Too many live views can exhaust the GPU; close another tab or try again.',
  load: 'The 3D model could not be loaded. Check your connection and try again.',
}

/**
 * The single 3D viewer used everywhere on the site.
 *
 * The shell is cheap. A Canvas is mounted only while its frame is close to the
 * viewport and is disposed as soon as it leaves, so a long page never keeps a
 * pile of WebGL contexts alive. Every mounted instance shares the same GLB
 * (useGLTF cache), uses the same studio rig, and renders the file's authored
 * materials without overrides.
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
  poster,
  onReady,
}) {
  const frameRef = useRef(null)
  const localControls = useRef({ yaw: 0, zoom: 1 })
  const activeControls = controls ?? localControls
  const [loaded, setLoaded] = useState(false)
  const [failure, setFailure] = useState(null)
  const [attempt, setAttempt] = useState(0)
  const [armed, setArmed] = useState(false)
  const [posterFailed, setPosterFailed] = useState(false)
  const inView = useOnScreen(frameRef, '240px')
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
  // A continuous idle rotation is a desktop luxury: on compact screens it
  // keeps the GPU awake for no legibility gain, so the still frame wins.
  const shouldRotate = autoRotate && !reduced && !compact
  const shouldFloat = (interactive || shouldRotate || scroll) && !reduced
  const live = visible && (shouldFloat || scroll)
  const posterSrc = poster ?? vehicle.poster

  // Let the first paint (headline, consent copy, text) settle before three.js
  // and the GLB compete for the main thread.
  useEffect(() => {
    if (!inView) return undefined
    let idle
    let timer
    if (typeof window.requestIdleCallback === 'function') {
      idle = window.requestIdleCallback(() => setArmed(true), { timeout: 900 })
    } else {
      timer = window.setTimeout(() => setArmed(true), 300)
    }
    return () => {
      if (idle) window.cancelIdleCallback(idle)
      if (timer) window.clearTimeout(timer)
    }
  }, [inView])

  // A viewer that scrolls away gives its context back. The GLB stays cached,
  // so returning to it is a rebuild, not a re-download.
  useEffect(() => {
    if (inView) return
    setLoaded(false)
    setFailure(null)
  }, [inView])

  useEffect(() => {
    setLoaded(false)
    setFailure(null)
  }, [id, attempt])

  const retry = () => {
    setFailure(null)
    setLoaded(false)
    setAttempt((value) => value + 1)
  }

  if (!supported) {
    return (
      <div
        className={`model-viewer model-viewer--still ${className}`}
        role="img"
        aria-label={
          label ??
          `${vehicle.fullName}, still studio image. Live 3D is unavailable in this browser.`
        }
      >
        {posterSrc && !posterFailed ? (
          <img
            className="model-viewer__poster model-viewer__poster--still"
            src={posterSrc}
            alt=""
            aria-hidden="true"
            decoding="async"
            draggable="false"
            onError={() => setPosterFailed(true)}
          />
        ) : (
          <div className="model-viewer__placeholder" aria-hidden="true" />
        )}
        <p className="model-viewer__still-note">
          Still image <span aria-hidden="true">/</span> live 3D needs WebGL
        </p>
      </div>
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
      {posterSrc && !posterFailed && !loaded ? (
        <img
          className="model-viewer__poster"
          src={posterSrc}
          alt=""
          aria-hidden="true"
          decoding="async"
          draggable="false"
          onError={() => setPosterFailed(true)}
        />
      ) : (
        <div className="model-viewer__placeholder" aria-hidden="true" />
      )}

      {failure ? (
        <ViewerFallback
          className="model-viewer__inline-fallback"
          message={MESSAGES[failure] ?? MESSAGES.load}
          label={label ?? `${vehicle.fullName} 3D studio`}
          onRetry={retry}
        />
      ) : inView && armed ? (
        <ViewerBoundary
          key={`${id}-${attempt}`}
          fallback={
            <ViewerFallback
              className="model-viewer__inline-fallback"
              message={MESSAGES.load}
              label={label ?? `${vehicle.fullName} 3D studio`}
              onRetry={retry}
            />
          }
          onError={() => setFailure('load')}
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
              onError={() => setFailure('context')}
              onReady={() => {
                setLoaded(true)
                onReady?.()
              }}
            />
          </Suspense>
        </ViewerBoundary>
      ) : null}

      {inView && armed && !loaded && !failure ? (
        <div className="model-viewer__loader" role="status" aria-live="polite">
          <span className="model-viewer__loader-label">Preparing the studio</span>
          <span className="model-viewer__loader-track" aria-hidden="true">
            <span />
          </span>
        </div>
      ) : null}
    </div>
  )
}

function ViewerFallback({ className = '', message, label, onRetry }) {
  return (
    <div
      className={`model-viewer model-viewer--fallback ${className}`}
      role="group"
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

// One probe for the whole page. Creating a canvas per viewer was itself
// exhausting the browser's context budget before any model had loaded.
let webglSupport = null

function hasWebGL() {
  if (webglSupport !== null) return webglSupport
  if (typeof window === 'undefined') return false
  try {
    const canvas = document.createElement('canvas')
    const gl =
      window.WebGLRenderingContext &&
      (canvas.getContext('webgl2') || canvas.getContext('webgl'))
    webglSupport = Boolean(gl)
    gl?.getExtension('WEBGL_lose_context')?.loseContext()
  } catch {
    webglSupport = false
  }
  return webglSupport
}
