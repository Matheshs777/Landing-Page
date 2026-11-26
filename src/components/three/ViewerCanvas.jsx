import { Suspense, useLayoutEffect, useMemo, useRef } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import { Studio } from '../../scenes/Studio'
import { useVehicleModel } from '../../scenes/vehicle'

/**
 * The heavy half of the viewer: three.js, the studio rig and the camera.
 * Loaded as its own chunk the first time a viewer comes near the viewport.
 */
export default function ViewerCanvas({
  id,
  camera,
  chapters,
  progress = null,
  controls = null,
  autoRotate = false,
  float = false,
  quality = 'high',
  compact = false,
  live = true,
  onReady,
  onError,
}) {
  return (
    <Canvas
      dpr={[1, compact ? 1.5 : 1.8]}
      className="scene-canvas"
      gl={{
        alpha: true,
        antialias: true,
        powerPreference: 'high-performance',
        preserveDrawingBuffer: false,
      }}
      camera={{ fov: 32, near: 0.08, far: 90, position: camera.position }}
      frameloop={live ? 'always' : 'demand'}
      resize={{ scroll: false, debounce: { scroll: 40, resize: 80 } }}
      onCreated={({ gl }) => {
        gl.toneMapping = THREE.ACESFilmicToneMapping
        gl.toneMappingExposure = 1.06
        gl.domElement.addEventListener('webglcontextlost', (event) => {
          event.preventDefault()
          onError?.()
        })
      }}
    >
      <Suspense fallback={null}>
        <Studio quality={quality} live={float} />
        <Vehicle id={id} controls={controls} autoRotate={autoRotate} />
        <CameraRig
          camera={camera}
          chapters={chapters}
          progress={progress}
          controls={controls}
          float={float}
        />
        <Ready onReady={onReady} />
      </Suspense>
    </Canvas>
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
          <primitive object={root} dispose={null} />
        </group>
      </group>
    </group>
  )
}

function CameraRig({ camera: view, chapters, progress, controls, float }) {
  const { camera } = useThree()
  const aspect = useThree((state) => state.size.width / state.size.height)
  const target = useRef(new THREE.Vector3(0, 0.55, 0))
  const desiredPosition = useMemo(() => new THREE.Vector3(), [])
  const desiredTarget = useMemo(() => new THREE.Vector3(), [])
  const clock = useRef(0)
  const primed = useRef(false)

  // Seat the first frame exactly on the requested view, then let the rig
  // interpolate smoothly whenever the view changes.
  useLayoutEffect(() => {
    if (primed.current) return
    primed.current = true
    target.current.set(...view.target)
    camera.lookAt(target.current)
  }, [camera, view])

  useFrame((_, delta) => {
    if (!camera) return
    const dt = Math.min(delta, 0.05)

    let position = view.position
    let lookAt = view.target

    if (progress?.current != null && chapters?.length) {
      const raw = progress.current * chapters.length - 0.5
      const p = THREE.MathUtils.clamp(raw, 0, chapters.length - 1)
      const index = Math.floor(p)
      const fraction = p - index
      const eased = fraction * fraction * (3 - 2 * fraction)
      const a = chapters[index].camera
      const b = chapters[Math.min(index + 1, chapters.length - 1)].camera
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

    const ease = 1 - Math.exp(-dt * 4)
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
  useLayoutEffect(() => {
    done.current?.()
  }, [])
  return null
}
