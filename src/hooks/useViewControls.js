const clamp = (value, min, max) => Math.min(max, Math.max(min, value))

/** Zoom and reset helpers shared by the stage and the configurator viewer. */
export function useViewControls(controls, { min = 0.55, max = 1.65 } = {}) {
  const setZoom = (factor) => {
    if (!controls.current) return
    controls.current.zoom = clamp(controls.current.zoom * factor, min, max)
  }

  const reset = () => {
    if (!controls.current) return
    controls.current.zoom = 1
    controls.current.yaw = 0
  }

  const onKeyDown = (event) => {
    if (!controls.current) return
    switch (event.key) {
      case 'ArrowLeft':
        event.preventDefault()
        controls.current.yaw -= 0.18
        break
      case 'ArrowRight':
        event.preventDefault()
        controls.current.yaw += 0.18
        break
      case '+':
      case '=':
        event.preventDefault()
        setZoom(0.86)
        break
      case '-':
      case '_':
        event.preventDefault()
        setZoom(1.16)
        break
      case '0':
        event.preventDefault()
        reset()
        break
      default:
        break
    }
  }

  return {
    zoomIn: () => setZoom(0.86),
    zoomOut: () => setZoom(1.16),
    reset,
    onKeyDown,
  }
}
