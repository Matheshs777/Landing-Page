/**
 * Pure camera lookup. Kept out of the three.js module so the viewer shell can
 * resolve a view without pulling the renderer into the initial bundle.
 */
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
