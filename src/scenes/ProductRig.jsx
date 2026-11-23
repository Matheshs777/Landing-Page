import { useEffect, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { EarbudModel } from './EarbudModel'
import { ChargingCase } from './ChargingCase'

const FEATURE_ANGLES = [0.4, 1.5, 2.5, 3.55]

/**
 * The product composition: a closed case on the plinth with the pair of buds
 * presented around it. One rig handles all three stages — a slow studio turn
 * in the hero, a scroll-linked turn while the product stays pinned, and a
 * slightly larger turntable in the finish picker.
 */
export function ProductRig({
  colorway,
  mode = 'hero',
  activeFeature = 0,
  scrollProgress,
  dragRef,
  reducedMotion = false,
}) {
  const group = useRef(null)
  const baseScale = mode === 'color' ? 1.08 : mode === 'feature' ? 0.98 : 1.02

  useEffect(() => {
    if (mode === 'feature' && dragRef.current) {
      dragRef.current.targetY = FEATURE_ANGLES[activeFeature] ?? 0.4
    }
  }, [activeFeature, dragRef, mode])

  useFrame((state, delta) => {
    if (!group.current || !dragRef.current) return
    const dt = Math.min(delta, 0.05)
    const drag = dragRef.current
    const time = state.clock.elapsedTime

    if (!reducedMotion) {
      if (mode === 'feature') {
        drag.targetY = THREE.MathUtils.damp(
          drag.targetY,
          FEATURE_ANGLES[activeFeature] ?? 0.4,
          4,
          dt,
        )
      } else if (!drag.active) {
        drag.targetY += dt * 0.16
      }
    }

    const float = reducedMotion ? 0 : Math.sin(time * 0.72) * 0.03
    const scroll = scrollProgress?.get?.() ?? 0
    const idleTurn = mode === 'feature' && !reducedMotion ? Math.sin(time * 0.42) * 0.03 : 0

    group.current.rotation.y = THREE.MathUtils.damp(
      group.current.rotation.y,
      drag.targetY + idleTurn,
      5,
      dt,
    )
    group.current.rotation.x = THREE.MathUtils.damp(
      group.current.rotation.x,
      drag.targetX + (mode === 'feature' ? 0.06 : 0.02),
      5,
      dt,
    )
    group.current.rotation.z = THREE.MathUtils.damp(
      group.current.rotation.z,
      mode === 'hero' ? -0.015 : 0.01,
      5,
      dt,
    )
    group.current.position.y = THREE.MathUtils.damp(
      group.current.position.y,
      float + scroll * 0.3,
      5,
      dt,
    )
    group.current.scale.setScalar(baseScale * (1 - scroll * 0.04))
  })

  return (
    <group ref={group} position={[0, 0, 0]}>
      <group position={[0, 0.12, 0]}>
        {/* charging case, grounded on the plinth */}
        <group position={[0.08, -0.5, -0.1]} rotation={[0.04, -0.3, 0]} scale={0.98}>
          <ChargingCase colorway={colorway} />
        </group>

        {/* front bud, turned so the face and stem both read */}
        <group
          position={[-1.02, 0.2, 0.62]}
          rotation={[0.12, 0.85, -0.16]}
          scale={0.62}
        >
          <EarbudModel colorway={colorway} />
        </group>

        {/* second bud, tucked behind the case */}
        <group
          position={[0.99, 0.58, -0.52]}
          rotation={[0.06, -0.72, 0.14]}
          scale={0.55}
        >
          <EarbudModel colorway={colorway} />
        </group>
      </group>
    </group>
  )
}
