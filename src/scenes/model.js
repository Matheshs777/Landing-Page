import { useLayoutEffect, useMemo } from 'react'
import { useGLTF } from '@react-three/drei'
import { SkeletonUtils } from 'three-stdlib'
import * as THREE from 'three'

/**
 * Loads a vehicle once, clones it for this canvas, centres it on X/Z and
 * drops the lowest point to the floor. Materials are cloned so two canvases
 * can hold different paint without bleeding into each other.
 */
export function usePreparedModel(vehicle) {
  const { scene } = useGLTF(vehicle.modelUrl)

  return useMemo(() => {
    const root = SkeletonUtils.clone(scene)
    const box = new THREE.Box3().setFromObject(root)
    const center = box.getCenter(new THREE.Vector3())

    root.traverse((object) => {
      if (!object.isMesh) return
      object.castShadow = true
      object.receiveShadow = false
      const next = (material) => {
        const cloned = material.clone()
        cloned.envMapIntensity = 1.15
        return cloned
      }
      object.material = Array.isArray(object.material)
        ? object.material.map(next)
        : next(object.material)
    })

    return {
      root,
      offset: [-center.x, -box.min.y, -center.z],
    }
  }, [scene])
}

/**
 * Applies a paint study only to materials the model actually exposes as body
 * paint. Glass, rubber, chrome, steel, lenses and trim are left untouched.
 */
export function applyPaint(root, vehicle, paint) {
  if (!root || !paint) return
  root.traverse((object) => {
    if (!object.isMesh) return
    const materials = Array.isArray(object.material) ? object.material : [object.material]
    for (const material of materials) {
      if (!material?.name) continue
      const entry = vehicle.paintMaterials.find((item) =>
        typeof item === 'string' ? item === material.name : item.name === material.name,
      )
      if (!entry) continue
      const role = typeof entry === 'string' ? 'main' : entry.role

      if (role === 'main') {
        material.color.set(paint.color)
        material.metalness = paint.metalness
        material.roughness = paint.roughness
      } else if (role === 'accent') {
        material.color.set(paint.accent)
        material.metalness = Math.max(0.25, paint.metalness - 0.15)
        material.roughness = Math.min(0.42, paint.roughness + 0.08)
      } else {
        material.color.set(paint.dark ?? '#0B0C0E')
        material.metalness = 0.35
        material.roughness = 0.24
      }

      if ('clearcoat' in material) {
        material.clearcoat = 1
        material.clearcoatRoughness = 0.055
      }
      material.envMapIntensity = 1.25
      material.needsUpdate = true
    }
  })
}

/** Applies the paint synchronously so the model never flashes its source livery. */
export function useVehiclePaint(root, vehicle, paint) {
  useLayoutEffect(() => {
    applyPaint(root, vehicle, paint)
  }, [root, vehicle, paint])
}
