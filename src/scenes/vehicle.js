import { useMemo } from 'react'
import { useGLTF } from '@react-three/drei'
import { SkeletonUtils } from 'three-stdlib'
import * as THREE from 'three'
import { VEHICLES } from '../config/vehicles'

/**
 * One authoritative GLB per vehicle, loaded once and cloned per viewer.
 *
 * Nothing here touches materials. The only transform applied is a uniform
 * scale to the real-world length declared in config (the automobile file is
 * authored at roughly 1:96), plus centring on X/Z and seating the lowest
 * point on the studio floor. Geometry, UVs, textures and material values are
 * exactly as authored in the GLB.
 */
export function useVehicleModel(id) {
  const vehicle = VEHICLES[id]
  useGLTF.preload(vehicle.modelUrl, '/draco/')
  const { scene } = useGLTF(vehicle.modelUrl, '/draco/')

  return useMemo(() => {
    const root = SkeletonUtils.clone(scene)

    let box = new THREE.Box3().setFromObject(root)
    const size = box.getSize(new THREE.Vector3())
    const longest = Math.max(size.x, size.z)
    if (vehicle.length && longest > 0) {
      const factor = vehicle.length / longest
      if (Math.abs(factor - 1) > 0.001) {
        root.scale.setScalar(factor)
        root.updateMatrixWorld(true)
        box = new THREE.Box3().setFromObject(root)
      }
    }

    const center = box.getCenter(new THREE.Vector3())

    root.traverse((object) => {
      if (!object.isMesh) return
      object.castShadow = true
      object.receiveShadow = false
    })

    return {
      root,
      vehicle,
      offset: [-center.x, -box.min.y, -center.z],
    }
  }, [scene, vehicle])
}

useGLTF.preload(VEHICLES.car.modelUrl, '/draco/')

/** Resolve a named view against the vehicle's authored camera list. */
export function resolveCamera(vehicle, view) {
  if (!view) return null
  if (typeof view === 'object') return view
  if (vehicle.views?.[view]) return vehicle.views[view]
  const preset = vehicle.presets.find((item) => item.id === view)
  if (preset) return preset.camera
  const chapter = vehicle.chapters.find((item) => item.id === view)
  if (chapter) return chapter.camera
  return vehicle.presets[0]?.camera ?? null
}
