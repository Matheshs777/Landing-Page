import { useEffect, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import { RoundedBox } from '@react-three/drei'
import * as THREE from 'three'

/**
 * Procedural charging case: a substantial lower shell and lid with a fine
 * separation seam, a metal hinge barrel, a USB-C port, a charging indicator
 * and a debossed wordmark. The shell colour follows the selected finish.
 */
export function ChargingCase({ colorway }) {
  const brandTexture = useMemo(createBrandTexture, [])

  const materials = useMemo(
    () => ({
      shell: new THREE.MeshPhysicalMaterial({
        color: colorway.case,
        roughness: 0.62,
        metalness: 0.08,
        clearcoat: 0.22,
        clearcoatRoughness: 0.62,
        envMapIntensity: 1.15,
      }),
      edge: new THREE.MeshStandardMaterial({
        color: colorway.caseEdge,
        roughness: 0.42,
        metalness: 0.32,
      }),
      trim: new THREE.MeshStandardMaterial({
        color: '#BFC1BD',
        roughness: 0.26,
        metalness: 0.84,
        envMapIntensity: 1.15,
      }),
      dark: new THREE.MeshStandardMaterial({
        color: '#0B0C0D',
        roughness: 0.5,
        metalness: 0.3,
      }),
      led: new THREE.MeshStandardMaterial({
        color: '#28B99A',
        emissive: '#28B99A',
        emissiveIntensity: 1.5,
        roughness: 0.25,
        toneMapped: false,
      }),
      glow: new THREE.MeshBasicMaterial({
        color: '#28B99A',
        transparent: true,
        opacity: 0.09,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
        toneMapped: false,
      }),
      brand: new THREE.MeshBasicMaterial({
        map: brandTexture,
        transparent: true,
        opacity: 0.55,
        depthWrite: false,
        toneMapped: false,
      }),
    }),
    [brandTexture],
  )

  const target = useMemo(
    () => ({
      shell: new THREE.Color(colorway.case),
      edge: new THREE.Color(colorway.caseEdge),
    }),
    [colorway],
  )

  useFrame((_, delta) => {
    const alpha = 1 - Math.exp(-6 * Math.min(delta, 0.05))
    materials.shell.color.lerp(target.shell, alpha)
    materials.edge.color.lerp(target.edge, alpha)
  })

  useEffect(
    () => () => {
      brandTexture.dispose()
      Object.values(materials).forEach((material) => material.dispose())
    },
    [brandTexture, materials],
  )

  return (
    <group>
      {/* lower shell */}
      <RoundedBox
        args={[2.4, 0.78, 1.6]}
        radius={0.3}
        smoothness={4}
        position={[0, -0.3, 0]}
        material={materials.shell}
        castShadow
        receiveShadow
      />

      {/* lid */}
      <RoundedBox
        args={[2.4, 0.55, 1.6]}
        radius={0.26}
        smoothness={4}
        position={[0, 0.37, 0]}
        material={materials.shell}
        castShadow
        receiveShadow
      />

      {/* lid separation seam */}
      <mesh position={[0, 0.092, 0]} material={materials.dark}>
        <boxGeometry args={[2.25, 0.014, 1.48]} />
      </mesh>
      <mesh position={[0, 0.103, 0]} material={materials.edge}>
        <boxGeometry args={[2.18, 0.006, 1.42]} />
      </mesh>

      {/* hinge barrel */}
      <mesh
        position={[0, 0.09, -0.79]}
        rotation={[0, 0, Math.PI / 2]}
        material={materials.trim}
      >
        <cylinderGeometry args={[0.055, 0.055, 2.0, 20]} />
      </mesh>
      <mesh
        position={[-1.01, 0.09, -0.79]}
        rotation={[0, 0, Math.PI / 2]}
        material={materials.edge}
      >
        <cylinderGeometry args={[0.075, 0.075, 0.06, 20]} />
      </mesh>
      <mesh
        position={[1.01, 0.09, -0.79]}
        rotation={[0, 0, Math.PI / 2]}
        material={materials.edge}
      >
        <cylinderGeometry args={[0.075, 0.075, 0.06, 20]} />
      </mesh>

      {/* charging indicator */}
      <mesh position={[0, -0.1, 0.807]} material={materials.led}>
        <sphereGeometry args={[0.038, 16, 16]} />
      </mesh>
      <mesh position={[0, -0.1, 0.807]} material={materials.dark}>
        <torusGeometry args={[0.058, 0.009, 8, 28]} />
      </mesh>
      <mesh position={[0, -0.1, 0.82]} material={materials.glow}>
        <sphereGeometry args={[0.09, 12, 12]} />
      </mesh>
      <pointLight
        position={[0, -0.1, 0.92]}
        color="#28B99A"
        intensity={0.14}
        distance={0.8}
      />

      {/* USB-C port */}
      <mesh position={[0, -0.62, 0.807]} material={materials.trim}>
        <boxGeometry args={[0.4, 0.11, 0.03]} />
      </mesh>
      <RoundedBox
        args={[0.35, 0.075, 0.035]}
        radius={0.028}
        smoothness={3}
        position={[0, -0.62, 0.824]}
        material={materials.dark}
      />

      {/* debossed wordmark on the lid */}
      <mesh position={[0, 0.649, 0]} rotation={[-Math.PI / 2, 0, 0]} material={materials.brand}>
        <planeGeometry args={[1.15, 0.285]} />
      </mesh>
    </group>
  )
}

/**
 * Wordmark texture. Letter-spaced mono type, kept faint so it reads as a
 * deboss rather than a printed sticker.
 */
function createBrandTexture() {
  const canvas = document.createElement('canvas')
  canvas.width = 512
  canvas.height = 128
  const ctx = canvas.getContext('2d')
  ctx.clearRect(0, 0, canvas.width, canvas.height)
  ctx.fillStyle = 'rgba(241, 240, 235, 0.9)'
  ctx.font = '500 38px "JetBrains Mono", monospace'
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  if ('letterSpacing' in ctx) ctx.letterSpacing = '12px'
  ctx.fillText('PULSAR', canvas.width / 2, canvas.height / 2 + 2)

  const texture = new THREE.CanvasTexture(canvas)
  texture.colorSpace = THREE.SRGBColorSpace
  texture.anisotropy = 4
  return texture
}
