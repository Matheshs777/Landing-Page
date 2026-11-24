import { useRef, useState } from 'react'

/**
 * Horizontal drag turns the vehicle on its turntable. Vertical gestures are
 * left to the browser, so the page still scrolls naturally on touch devices.
 */
export function useDragControls(controls, sensitivity = 0.006) {
  const drag = useRef(null)
  const [dragging, setDragging] = useState(false)

  const onPointerDown = (event) => {
    if (event.pointerType === 'mouse' && event.button !== 0) return
    if (event.target.closest('a, button, input, select, textarea, [data-no-drag]')) return
    drag.current = {
      id: event.pointerId,
      x: event.clientX,
      yaw: controls.current?.yaw ?? 0,
    }
    event.currentTarget.setPointerCapture?.(event.pointerId)
    setDragging(true)
  }

  const onPointerMove = (event) => {
    const state = drag.current
    if (!state || state.id !== event.pointerId) return
    controls.current.yaw = state.yaw + (event.clientX - state.x) * sensitivity
  }

  const end = (event) => {
    if (drag.current?.id !== event.pointerId) return
    drag.current = null
    setDragging(false)
  }

  return {
    dragging,
    handlers: {
      onPointerDown,
      onPointerMove,
      onPointerUp: end,
      onPointerCancel: end,
      onPointerLeave: end,
    },
  }
}
