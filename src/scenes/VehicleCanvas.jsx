import { Suspense, useEffect, useLayoutEffect, useMemo, useRef } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import { Studio } from './Studio'
import { usePreparedModel, useVehiclePaint } from './model'

const DEFAULT_CONTROLS = { yaw: 0, zoom: 1 }

/**
 * One canvas for both stage and configurator use.
 *
 * `progress` is a ref written by ScrollTrigger. `preset` and `still` are
 * explicit camera definitions. Nothing here re-renders per frame.
 */
export default function VehicleCanvas({
  vehicle,
  paint,
  progress = null,
  preset = null,
  still = null,
  controls = null,
  active = true,
  quality = 'high',
  onReady,
}) {
  const handleReady = useRef(onReady)
  handleReady.current = onReady

  return (
    <Canvas
      className="scene-canvas"
      dpr={[1, quality === 'low' ? 1.4 : 1.8]}
      gl={{ alpha: true, antialias: true, powerPreference: 'high-performance' }}
      camera={{
        fov: 32,
        near: 0.08,
        far: 90,
        position: vehicle.heroCamera.position,
      }}
      frameloop={active ? 'always' : 'demand'}
      resize={{ scroll: false, debounce: { scroll: 40, resize: 80 } }}
      onCreated={({ gl }) => {
        gl.toneMapping = THREE.ACESFilmicToneMapping
        gl.toneMappingExposure = 1.06
      }}
    >
      <Suspense fallback={null}>
        <Studio quality={quality} />
        <Vehicle
          vehicle={vehicle}
          paint={paint}
          controls={controls}
          quality={quality}
        />
        <CameraRig
          vehicle={vehicle}
          progress={progress}
          preset={preset}
          still={still}
          controls={controls}
        />
        <Ready onReady={() => handleReady.current?.()} />
      </Suspense>
    </Canvas>
  )
}

function Vehicle({ vehicle, paint, controls }) {
  const { root, offset } = usePreparedModel(vehicle)
  useVehiclePaint(root, vehicle, paint)
  const group = useRef()

  useFrame((_, delta) => {
    if (!group.current) return
    const state = controls?.current ?? DEFAULT_CONTROLS
    const dt = Math.min(delta, 0.05)
    group.current.rotation.y = THREE.MathUtils.damp(
      group.current.rotation.y,
      state.yaw,
      7,
      dt,
    )
  })

  return (
    <group ref={group}>
      <group position={offset}>
        <primitive object={root} />
      </group>
    </group>
  )
}

function CameraRig({ vehicle, progress, preset, still, controls }) {
  const { camera } = useThree()
  const aspect = useThree((state) => state.size.width / state.size.height)
  const target = useRef(new THREE.Vector3(0, 0.55, 0))
  const desiredPosition = useMemo(() => new THREE.Vector3(), [])
  const desiredTarget = useMemo(() => new THREE.Vector3(), [])
  const first = useRef(true)

  const chapters = vehicle.chapters

  // Start exactly on the first framing rather than flying in from the default.
  useLayoutEffect(() => {
    const start = still ?? chapters[0].camera
    camera.position.set(...start.position)
    target.current.set(...start.target)
    camera.lookAt(target.current)
    first.current = false
  }, [camera, still, chapters])

  useFrame((_, delta) => {
    if (!camera) return
    const dt = Math.min(delta, 0.05)

    let position
    let lookAt

    if (still) {
      position = still.position
      lookAt = still.target
    } else if (preset) {
      position = preset.position
      lookAt = preset.target
    } else {
      const length = chapters.length
      const raw = (progress?.current ?? 0) * length - 0.5
      const p = THREE.MathUtils.clamp(raw, 0, length - 1)
      const index = Math.floor(p)
      const fraction = p - index
      const eased = fraction * fraction * (3 - 2 * fraction)
      const a = chapters[index].camera
      const b = chapters[Math.min(index + 1, length - 1)].camera

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

    // Pull back on narrow viewports so the whole vehicle stays in frame.
    const fit = aspect < 0.85 ? 1.55 : aspect < 1.15 ? 1.32 : aspect < 1.55 ? 1.08 : 1
    const zoom = THREE.MathUtils.clamp(
      (controls?.current?.zoom ?? 1) * fit,
      0.5,
      2.1,
    )
    desiredPosition.sub(desiredTarget).multiplyScalar(zoom).add(desiredTarget)

    const ease = first.current ? 1 : 1 - Math.exp(-dt * 3.2)
    camera.position.lerp(desiredPosition, ease)
    camera.position.y = Math.max(camera.position.y, 0.16)
    target.current.lerp(desiredTarget, ease)
    camera.lookAt(target.current)
  })

  return null
}

function Ready({ onReady }) {
  useEffect(() => {
    onReady()
  }, [onReady])
  return null
}
