import { useEffect, useRef } from 'react'
import { useReveal } from '../../hooks/useReveal'
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion'

/** Counts a figure up when it enters view, preserving its formatting. */
export function CountUp({ value, className = '' }) {
  const [ref, shown] = useReveal({ threshold: 0.4 })
  const reduced = usePrefersReducedMotion()
  const target = Number(value.replace(/,/g, ''))
  const decimals = value.includes('.') ? value.split('.')[1].length : 0
  const frame = useRef(0)

  useEffect(() => {
    const element = ref.current
    if (!element || !Number.isFinite(target)) return undefined

    const format = (number) =>
      number.toLocaleString('en-US', {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
      })

    if (reduced || !shown) return undefined

    const start = performance.now()
    const duration = 1600
    element.textContent = format(0)

    const tick = (now) => {
      const t = Math.min(1, (now - start) / duration)
      const eased = 1 - Math.pow(1 - t, 3)
      element.textContent = format(target * eased)
      if (t < 1) frame.current = requestAnimationFrame(tick)
    }
    frame.current = requestAnimationFrame(tick)

    return () => cancelAnimationFrame(frame.current)
  }, [shown, reduced, target, decimals, ref])

  return (
    <span ref={ref} className={className} aria-label={value}>
      {value}
    </span>
  )
}
