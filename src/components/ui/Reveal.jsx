import { useEffect, useRef } from 'react'
import { gsap } from '../../lib/gsap'
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion'

/** Quiet scroll reveal. No bounce, no long delays. */
export function Reveal({
  as: Tag = 'div',
  children,
  className = '',
  delay = 0,
  distance = 26,
  ...rest
}) {
  const ref = useRef(null)
  const reduced = usePrefersReducedMotion()

  useEffect(() => {
    const element = ref.current
    if (!element || reduced) return undefined

    const context = gsap.context(() => {
      gsap.fromTo(
        element,
        { y: distance, autoAlpha: 0 },
        {
          y: 0,
          autoAlpha: 1,
          duration: 1.05,
          delay,
          ease: 'power3.out',
          scrollTrigger: { trigger: element, start: 'top 88%', once: true },
        },
      )
    }, element)

    return () => context.revert()
  }, [reduced, delay, distance])

  return (
    <Tag ref={ref} className={className} {...rest}>
      {children}
    </Tag>
  )
}
