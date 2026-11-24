import { useEffect, useMemo } from 'react'
import { ContactShadows, Environment, Lightformer } from '@react-three/drei'
import * as THREE from 'three'

/**
 * A photographic studio built from area lights, not an HDR download.
 * Warm key, cool fill, a champagne rim and one soft overhead box.
 */
export function Studio({ quality = 'high' }) {
  const low = quality === 'low'
  const alphaMap = useMemo(createRadialAlpha, [])

  useEffect(() => () => alphaMap.dispose(), [alphaMap])

  return (
    <>
      <ambientLight intensity={0.18} />
      <directionalLight position={[5, 7, 4]} intensity={2.6} color="#FFF4E6" />
      <directionalLight position={[-6, 3, -4]} intensity={0.9} color="#AFC3D2" />
      <directionalLight position={[-4, 2.4, 5]} intensity={0.5} color="#C6A97E" />
      <spotLight
        position={[1, 9, 2]}
        angle={0.5}
        penumbra={1}
        intensity={1.6}
        color="#FFFFFF"
        distance={24}
      />

      <Environment resolution={low ? 128 : 256} frames={1}>
        <color attach="background" args={['#090A0B']} />
        <Lightformer
          form="rect"
          intensity={5}
          position={[0, 6, 2.5]}
          scale={[11, 3.5, 1]}
          color="#FFF6E8"
        />
        <Lightformer
          form="rect"
          intensity={2.2}
          position={[-7, 2, 3]}
          scale={[2, 9, 1]}
          color="#DCE7EE"
        />
        <Lightformer
          form="rect"
          intensity={3}
          position={[7, 2, -3]}
          scale={[2, 9, 1]}
          color="#FFFFFF"
        />
        <Lightformer
          form="rect"
          intensity={1.4}
          position={[0, 1.5, -7]}
          scale={[8, 2, 1]}
          color="#C6A97E"
        />
        <Lightformer
          form="ring"
          intensity={1}
          position={[0, -3.5, 2]}
          scale={5}
          color="#C6A97E"
        />
      </Environment>

      {/* floor, fading into the page background */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.02, 0]}>
        <circleGeometry args={[9.5, 72]} />
        <meshStandardMaterial
          color="#08090A"
          roughness={0.42}
          metalness={0.45}
          envMapIntensity={0.55}
          transparent
          opacity={0.94}
          alphaMap={alphaMap}
          depthWrite={false}
        />
      </mesh>

      <ContactShadows
        position={[0, 0.004, 0]}
        opacity={0.82}
        scale={13}
        blur={2.4}
        far={4.5}
        resolution={low ? 256 : 512}
        frames={1}
        color="#000000"
      />

      {/* turntable reference ring */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.006, 0]}>
        <ringGeometry args={[5.15, 5.17, 120]} />
        <meshBasicMaterial color="#C6A97E" transparent opacity={0.14} depthWrite={false} />
      </mesh>
    </>
  )
}

/** Soft round falloff so the studio floor has no visible edge. */
function createRadialAlpha() {
  const size = 256
  const canvas = document.createElement('canvas')
  canvas.width = size
  canvas.height = size
  const ctx = canvas.getContext('2d')
  const gradient = ctx.createRadialGradient(
    size / 2,
    size / 2,
    size * 0.12,
    size / 2,
    size / 2,
    size * 0.5,
  )
  gradient.addColorStop(0, '#FFFFFF')
  gradient.addColorStop(0.55, '#C8C8C8')
  gradient.addColorStop(1, '#000000')
  ctx.fillStyle = gradient
  ctx.fillRect(0, 0, size, size)
  const texture = new THREE.CanvasTexture(canvas)
  texture.colorSpace = THREE.NoColorSpace
  return texture
}
