import { useEffect, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import { RoundedBox } from '@react-three/drei'
import * as THREE from 'three'

/**
 * Procedural Pulsar Buds One earbud.
 *
 * A soft pebble housing, a small recessed acoustic face, a short integrated
 * silicone tip and a slim stem. Built from primitives so it ships without a
 * GLB and still reads as a manufactured object rather than a floating shape.
 */
export function EarbudModel({ colorway }) {
  const speakerTexture = useMemo(createSpeakerTexture, [])

  const materials = useMemo(
    () => ({
      bud: new THREE.MeshPhysicalMaterial({
        color: colorway.bud,
        roughness: 0.58,
        metalness: 0.02,
        clearcoat: 0.22,
        clearcoatRoughness: 0.55,
        envMapIntensity: 1,
      }),
      tip: new THREE.MeshPhysicalMaterial({
        color: colorway.tip,
        roughness: 0.9,
        metalness: 0,
        clearcoat: 0,
        envMapIntensity: 0.4,
      }),
      trim: new THREE.MeshStandardMaterial({
        color: '#BFC1BD',
        roughness: 0.3,
        metalness: 0.8,
        envMapIntensity: 1.05,
      }),
      dark: new THREE.MeshStandardMaterial({
        color: '#141516',
        roughness: 0.46,
        metalness: 0.3,
      }),
      face: new THREE.MeshStandardMaterial({
        map: speakerTexture,
        roughness: 0.62,
        metalness: 0.18,
      }),
      led: new THREE.MeshStandardMaterial({
        color: '#28B99A',
        emissive: '#28B99A',
        emissiveIntensity: 2,
        roughness: 0.25,
        toneMapped: false,
      }),
    }),
    [speakerTexture],
  )

  const target = useMemo(
    () => ({
      bud: new THREE.Color(colorway.bud),
      tip: new THREE.Color(colorway.tip),
    }),
    [colorway],
  )

  useFrame((_, delta) => {
    const alpha = 1 - Math.exp(-6 * Math.min(delta, 0.05))
    materials.bud.color.lerp(target.bud, alpha)
    materials.tip.color.lerp(target.tip, alpha)
  })

  useEffect(
    () => () => {
      speakerTexture.dispose()
      Object.values(materials).forEach((material) => material.dispose())
    },
    [materials, speakerTexture],
  )

  return (
    <group>
      {/* pebble housing */}
      <mesh
        position={[0, 0.3, 0]}
        scale={[1, 0.92, 0.82]}
        material={materials.bud}
        castShadow
      >
        <sphereGeometry args={[0.6, 48, 48]} />
      </mesh>

      {/* recessed acoustic face */}
      <mesh
        position={[0, 0.3, 0.49]}
        rotation={[Math.PI / 2, 0, 0]}
        material={materials.bud}
      >
        <cylinderGeometry args={[0.29, 0.29, 0.06, 48]} />
      </mesh>
      <mesh
        position={[0, 0.3, 0.516]}
        rotation={[Math.PI / 2, 0, 0]}
        material={materials.face}
      >
        <cylinderGeometry args={[0.245, 0.245, 0.014, 48]} />
      </mesh>
      <mesh position={[0, 0.3, 0.513]} material={materials.trim}>
        <torusGeometry args={[0.258, 0.009, 10, 48]} />
      </mesh>

      {/* touch line under the face */}
      <mesh position={[0, 0.055, 0.44]} rotation={[Math.PI / 2.2, 0, 0]} material={materials.dark}>
        <torusGeometry args={[0.3, 0.006, 6, 32, Math.PI]} />
      </mesh>

      {/* silicone ear tip */}
      <group position={[0, 0.29, -0.46]} rotation={[0, 0, 0]}>
        <mesh
          rotation={[Math.PI / 2, 0, 0]}
          position={[0, 0, -0.1]}
          material={materials.tip}
          castShadow
        >
          <cylinderGeometry args={[0.28, 0.2, 0.34, 40, 1, true]} />
        </mesh>
        <mesh position={[0, 0, -0.27]} material={materials.tip} castShadow>
          <torusGeometry args={[0.2, 0.042, 12, 40]} />
        </mesh>
        <mesh position={[0, 0, -0.285]} material={materials.dark}>
          <circleGeometry args={[0.172, 32]} />
        </mesh>
        <mesh position={[0, 0, -0.283]} material={materials.trim}>
          <torusGeometry args={[0.174, 0.005, 8, 36]} />
        </mesh>
      </group>

      {/* slim stem */}
      <RoundedBox
        args={[0.27, 1.02, 0.24]}
        radius={0.12}
        smoothness={4}
        position={[0, -0.45, -0.03]}
        rotation={[0.02, 0, -0.055]}
        material={materials.bud}
        castShadow
      />

      {/* stem base, seam and mic slots */}
      <mesh position={[0, -0.93, -0.035]} material={materials.dark}>
        <cylinderGeometry args={[0.118, 0.118, 0.04, 24]} />
      </mesh>
      <mesh position={[0, -0.905, -0.035]} rotation={[Math.PI / 2, 0, 0]} material={materials.trim}>
        <torusGeometry args={[0.12, 0.006, 8, 28]} />
      </mesh>
      <mesh position={[0, -0.68, 0.088]} material={materials.dark}>
        <boxGeometry args={[0.09, 0.022, 0.01]} />
      </mesh>
      <mesh position={[0, -0.58, 0.09]} material={materials.dark}>
        <boxGeometry args={[0.055, 0.014, 0.008]} />
      </mesh>

      {/* stem / housing seam */}
      <mesh position={[0, -0.02, -0.03]} rotation={[Math.PI / 2, 0, 0]} material={materials.dark}>
        <torusGeometry args={[0.155, 0.006, 8, 32]} />
      </mesh>

      {/* status LED */}
      <mesh position={[0, -0.83, 0.088]} material={materials.led}>
        <sphereGeometry args={[0.022, 16, 16]} />
      </mesh>
      <pointLight
        position={[0, -0.83, 0.15]}
        color="#28B99A"
        intensity={0.08}
        distance={0.5}
      />
    </group>
  )
}

/**
 * A woven driver grille, drawn once into a canvas texture. The fine
 * concentric rings read as a real acoustic mesh at product scale.
 */
function createSpeakerTexture() {
  const size = 512
  const canvas = document.createElement('canvas')
  canvas.width = size
  canvas.height = size
  const ctx = canvas.getContext('2d')

  const gradient = ctx.createRadialGradient(size / 2, size / 2, 12, size / 2, size / 2, size / 2)
  gradient.addColorStop(0, '#3A3C3E')
  gradient.addColorStop(0.66, '#232527')
  gradient.addColorStop(1, '#101112')
  ctx.fillStyle = gradient
  ctx.beginPath()
  ctx.arc(size / 2, size / 2, size / 2, 0, Math.PI * 2)
  ctx.fill()

  ctx.strokeStyle = 'rgba(191, 193, 189, 0.22)'
  ctx.lineWidth = 1
  for (let radius = 30; radius < 236; radius += 15) {
    ctx.beginPath()
    ctx.arc(size / 2, size / 2, radius, 0, Math.PI * 2)
    ctx.stroke()
  }

  ctx.fillStyle = 'rgba(241, 240, 235, 0.18)'
  for (let i = 0; i < 420; i += 1) {
    const angle = Math.random() * Math.PI * 2
    const radius = Math.random() * 220
    const x = size / 2 + Math.cos(angle) * radius
    const y = size / 2 + Math.sin(angle) * radius
    ctx.fillRect(x, y, 1.4, 1.4)
  }

  const texture = new THREE.CanvasTexture(canvas)
  texture.colorSpace = THREE.SRGBColorSpace
  texture.anisotropy = 4
  return texture
}
