import { useLayoutEffect, useMemo } from 'react'
import { useGLTF } from '@react-three/drei'
import { SkeletonUtils } from 'three-stdlib'
import * as THREE from 'three'

/**
 * Loads a vehicle once, clones it for this canvas, centres it on X/Z and
 * drops the lowest point to the floor.
 *
 * The supplied GLB is used exactly as authored: no decal removal, no livery
 * replacement. Materials are cloned per canvas so two views can hold different
 * paint studies, and each clone keeps a snapshot of its source values so the
 * "Original finish" option can restore the file's own materials byte-for-byte
 * in appearance.
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
        cloned.userData.novarisBase = {
          map: cloned.map,
          color: cloned.color.clone(),
          metalness: cloned.metalness,
          roughness: cloned.roughness,
          clearcoat: 'clearcoat' in cloned ? cloned.clearcoat : null,
          clearcoatRoughness:
            'clearcoatRoughness' in cloned ? cloned.clearcoatRoughness : null,
        }
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
 * A paint marked `original` restores the model's own materials instead.
 */
export function applyPaint(root, vehicle, paint) {
  if (!root || !paint) return
  const restore = paint.original === true

  root.traverse((object) => {
    if (!object.isMesh) return
    const materials = Array.isArray(object.material) ? object.material : [object.material]
    for (const material of materials) {
      if (!material?.name) continue
      const base = material.userData?.novarisBase

      if (restore) {
        if (!base) continue
        material.map = base.map
        material.color.copy(base.color)
        material.metalness = base.metalness
        material.roughness = base.roughness
        if (base.clearcoat !== null && 'clearcoat' in material) {
          material.clearcoat = base.clearcoat
          material.clearcoatRoughness = base.clearcoatRoughness
        }
        material.needsUpdate = true
        continue
      }

      const entry = vehicle.paintMaterials.find((item) =>
        typeof item === 'string' ? item === material.name : item.name === material.name,
      )
      if (!entry) continue
      const role = typeof entry === 'string' ? 'main' : entry.role

      if (role === 'main') {
        material.map = null
        material.color.set(paint.color)
        material.metalness = Math.min(paint.metalness, 0.5)
        material.roughness = Math.max(paint.roughness, 0.24)
      } else if (role === 'accent') {
        material.map = null
        material.color.set(paint.accent)
        material.metalness = Math.max(0.25, paint.metalness - 0.15)
        material.roughness = Math.min(0.42, paint.roughness + 0.08)
      } else {
        material.map = null
        material.color.set(paint.dark ?? '#0B0C0E')
        material.metalness = 0.35
        material.roughness = 0.24
      }

      if ('clearcoat' in material) {
        material.clearcoat = 1
        material.clearcoatRoughness = 0.07
      }
      material.envMapIntensity = 1.12
      material.needsUpdate = true
    }
  })
}

/** Applies the paint synchronously so the model never flashes a stale finish. */
export function useVehiclePaint(root, vehicle, paint) {
  useLayoutEffect(() => {
    applyPaint(root, vehicle, paint)
  }, [root, vehicle, paint])
}
