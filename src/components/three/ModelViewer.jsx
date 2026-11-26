import { Component, Suspense, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { useProgress } from '@react-three/drei'
import * as THREE from 'three'
import { Studio } from '../../scenes/Studio'
import { resolveCamera, useVehicleModel } from '../../scenes/vehicle'
import { BIKE, CAR } from '../../config/vehicles'
import { useOnScreen } from '../../hooks/useNearViewport'
import { useMediaQuery } from '../../hooks/useMediaQuery'
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion'

const FALLBACK =
  'This browser could not start WebGL, so the live 3D studio is unavailable.'

/**
 * The single 3D viewer used everywhere on the site.
 *
 * - one GLB per vehicle, shared through useGLTF's cache and cloned per viewer
 * - original materials, textures and colours, with no overrides
 * - the same studio lighting rig in every instance
 * - mounted only near the viewport, and paused when off-screen
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
  const near = useOnScreen(frameRef, '480px')
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
        `${vehicle.fullName}, ${view.replace('-', ' ')} view, rendered live in the NOVARIS studio.`
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
            <Canvas
              dpr={[1, compact ? 1.5 : 1.8]}
              className="scene-canvas"
              gl={{
                alpha: true,
                antialias: true,
                powerPreference: 'high-performance',
                preserveDrawingBuffer: false,
              }}
              camera={{
                fov: 32,
                near: 0.08,
                far: 90,
                position: camera.position,
              }}
              frameloop={visible && !reduced ? 'always' : 'demand'}
              resize={{ scroll: false, debounce: { scroll: 40, resize: 80 } }}
              onCreated={({ gl }) => {
                gl.toneMapping = THREE.ACESFilmicToneMapping
                gl.toneMappingExposure = 1.06
                gl.domElement.addEventListener('webglcontextlost', (event) => {
                  event.preventDefault()
                  setFailed(true)
                })
              }}
            >
              <Studio quality={resolvedQuality} live={shouldFloat} />
              <Vehicle id={id} controls={activeControls} autoRotate={shouldRotate} />
              <CameraRig
                vehicle={vehicle}
                view={camera}
                progress={scroll ? progress : null}
                controls={activeControls}
                float={shouldFloat}
              />
              <Ready
                onReady={() => {
                  setLoaded(true)
                  onReady?.()
                }}
              />
            </Canvas>
          </Suspense>
        </ViewerBoundary>
      ) : (
        <div className="model-viewer__placeholder" aria-hidden="true" />
      )}

      {!loaded && !failed ? <ViewerLoader /> : null}

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

function Vehicle({ id, controls, autoRotate }) {
  const { root, vehicle, offset } = useVehicleModel(id)
  const group = useRef()

  useFrame((_, delta) => {
    if (!group.current) return
    const dt = Math.min(delta, 0.05)
    const state = controls?.current
    if (autoRotate && state) state.yaw += dt * 0.085
    group.current.rotation.y = THREE.MathUtils.damp(
      group.current.rotation.y,
      state?.yaw ?? 0,
      6,
      dt,
    )
  })

  return (
    <group ref={group}>
      <group rotation-y={vehicle.baseYaw ?? 0}>
        <group position={offset}>
          <primitive object={root} />
        </group>
      </group>
    </group>
  )
}

function CameraRig({ vehicle, view, progress, controls, float }) {
  const { camera } = useThree()
  const aspect = useThree((state) => state.size.width / state.size.height)
  const target = useRef(new THREE.Vector3(0, 0.55, 0))
  const desiredPosition = useMemo(() => new THREE.Vector3(), [])
  const desiredTarget = useMemo(() => new THREE.Vector3(), [])
  const first = useRef(true)
  const clock = useRef(0)

  useLayoutEffect(() => {
    camera.position.set(...view.position)
    target.current.set(...view.target)
    camera.lookAt(target.current)
    first.current = false
  }, [camera, view])

  useFrame((_, delta) => {
    if (!camera) return
    const dt = Math.min(delta, 0.05)

    let position = view.position
    let lookAt = view.target

    if (progress?.current != null) {
      const list = vehicle.chapters
      const raw = progress.current * list.length - 0.5
      const p = THREE.MathUtils.clamp(raw, 0, list.length - 1)
      const index = Math.floor(p)
      const fraction = p - index
      const eased = fraction * fraction * (3 - 2 * fraction)
      const a = list[index].camera
      const b = list[Math.min(index + 1, list.length - 1)].camera
      position = [
        THREE.MathUtils.lerp(a.position[0], b.position[0], eased),
        THREE.MathUtils.lerp(a.position[1], b.position[1], eased),
        THREE.MathUtils.lerp(a.position[2], b.position[2], eased),
      ]
      lookAt = [
        THREE.MathUtils.lerp(a.target[0], b.target[0], eased),
        THREE.MathUtils.lerp(a.target[1], b.target[1], eased),
        THREE.MathUtils.lerp(a.target[2], b.target[2], eased),
      ]
    }

    desiredPosition.set(...position)
    desiredTarget.set(...lookAt)

    const fit = aspect < 0.85 ? 1.55 : aspect < 1.15 ? 1.32 : aspect < 1.55 ? 1.08 : 1
    const zoom = THREE.MathUtils.clamp((controls?.current?.zoom ?? 1) * fit, 0.5, 2.1)
    desiredPosition.sub(desiredTarget).multiplyScalar(zoom).add(desiredTarget)

    if (float) {
      clock.current += dt
      desiredPosition.x += Math.sin(clock.current * 0.32) * 0.045
      desiredPosition.y += Math.cos(clock.current * 0.27) * 0.03
    }

    const ease = first.current ? 1 : 1 - Math.exp(-dt * 4)
    camera.position.lerp(desiredPosition, ease)
    camera.position.y = Math.max(camera.position.y, 0.16)
    target.current.lerp(desiredTarget, ease)
    camera.lookAt(target.current)
  })

  return null
}

function Ready({ onReady }) {
  const done = useRef(onReady)
  done.current = onReady
  useEffect(() => {
    done.current?.()
  }, [])
  return null
}

function ViewerLoader() {
  const progress = useProgress((state) => state.progress)
  return (
    <div className="model-viewer__loader" role="status" aria-live="polite">
      <span className="model-viewer__loader-label">
        {progress > 0 ? `Loading studio ${Math.round(progress)}%` : 'Preparing the studio'}
      </span>
      <span className="model-viewer__loader-track" aria-hidden="true">
        <span style={{ transform: `scaleX(${Math.max(0.04, progress / 100)})` }} />
      </span>
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
