import { useEffect, useRef } from 'react'
import { gsap } from '../../lib/gsap'
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion'

/** Counts a figure up when it enters view, preserving its formatting. */
export function CountUp({ value, className = '' }) {
  const ref = useRef(null)
  const reduced = usePrefersReducedMotion()
  const target = Number(value.replace(/,/g, ''))
  const decimals = value.includes('.') ? value.split('.')[1].length : 0

  useEffect(() => {
    const element = ref.current
    if (!element || reduced || !Number.isFinite(target)) return undefined

    const format = (number) =>
      number.toLocaleString('en-US', {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
      })

    element.textContent = format(0)
    const counter = { value: 0 }
    const context = gsap.context(() => {
      gsap.to(counter, {
        value: target,
        duration: 1.8,
        ease: 'power2.out',
        onUpdate: () => {
          element.textContent = format(counter.value)
        },
        scrollTrigger: { trigger: element, start: 'top 94%', once: true },
      })
    }, element)

    return () => context.revert()
  }, [reduced, target, decimals])

  return (
    <span ref={ref} className={className} aria-label={value}>
      {value}
    </span>
  )
}
