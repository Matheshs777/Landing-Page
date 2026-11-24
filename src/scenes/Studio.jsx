import { useEffect, useMemo } from 'react'
import { ContactShadows, Environment, Lightformer, MeshReflectorMaterial } from '@react-three/drei'
import * as THREE from 'three'

/**
 * A photographic studio built from area lights rather than a downloaded HDR.
 * Warm key, cool fill, a champagne rim, and one soft overhead box.
 * Reflections are only enabled for the high-quality desktop path.
 */
export function Studio({ quality = 'high' }) {
  const low = quality === 'low'
  const alphaMap = useMemo(createRadialAlpha, [])

  useEffect(() => () => alphaMap.dispose(), [alphaMap])

  return (
    <>
      <fog attach="fog" args={['#060708', 15, 34]} />
      <ambientLight intensity={0.16} />
      <directionalLight position={[5, 7, 4]} intensity={2.4} color="#FFF4E6" />
      <directionalLight position={[-6, 3, -4]} intensity={0.85} color="#AFC3D2" />
      <directionalLight position={[-4, 2.4, 5]} intensity={0.45} color="#C6A97E" />
      <spotLight
        position={[1, 9, 2]}
        angle={0.5}
        penumbra={1}
        intensity={1.4}
        color="#FFFFFF"
        distance={26}
      />

      <Environment resolution={low ? 96 : 192} frames={1}>
        <color attach="background" args={['#08090A']} />
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
          intensity={3.2}
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
          intensity={0.9}
          position={[0, -3.5, 2]}
          scale={5}
          color="#C6A97E"
        />
      </Environment>

      {low ? (
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
          <circleGeometry args={[11, 64]} />
          <meshStandardMaterial
            color="#08090A"
            roughness={0.46}
            metalness={0.4}
            envMapIntensity={0.5}
            transparent
            opacity={0.96}
            alphaMap={alphaMap}
            depthWrite={false}
          />
        </mesh>
      ) : (
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
          <circleGeometry args={[11, 96]} />
          <MeshReflectorMaterial
            resolution={512}
            blur={[420, 140]}
            mixBlur={1.1}
            mixStrength={2.6}
            mirror={0.42}
            depthScale={1.1}
            minDepthThreshold={0.4}
            maxDepthThreshold={1.4}
            color="#08090A"
            metalness={0.62}
            roughness={0.86}
            envMapIntensity={0.35}
          />
        </mesh>
      )}

      <ContactShadows
        position={[0, 0.012, 0]}
        opacity={0.8}
        scale={14}
        blur={2.6}
        far={4.8}
        resolution={low ? 128 : 256}
        frames={Infinity}
        color="#000000"
      />

      {/* turntable reference ring */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, 0]}>
        <ringGeometry args={[5.4, 5.415, 160]} />
        <meshBasicMaterial color="#C6A97E" transparent opacity={0.16} depthWrite={false} />
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
    size * 0.1,
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
