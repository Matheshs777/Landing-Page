import { useEffect, useRef } from 'react'
import { gsap } from '../../lib/gsap'
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion'

/**
 * Editorial line reveal: each line sits in its own mask and rises into place.
 * Used for the large statements, where a simple fade would feel too quiet.
 */
export function LineReveal({
  as: Tag = 'h2',
  lines = [],
  emphasis = -1,
  className = '',
  delay = 0,
}) {
  const ref = useRef(null)
  const reduced = usePrefersReducedMotion()

  useEffect(() => {
    const element = ref.current
    if (!element || reduced) return undefined

    const context = gsap.context(() => {
      gsap.from(element.querySelectorAll('[data-line-inner]'), {
        yPercent: 112,
        opacity: 0,
        duration: 1.25,
        delay,
        stagger: 0.1,
        ease: 'power4.out',
        scrollTrigger: { trigger: element, start: 'top 88%', once: true },
      })
    }, element)

    return () => context.revert()
  }, [reduced, delay])

  return (
    <Tag ref={ref} className={`line-reveal ${className}`}>
      {lines.map((line, index) => (
        <span className="line-reveal__mask" key={`${line}-${index}`}>
          <span className="line-reveal__inner" data-line-inner>
            {index === emphasis ? <em>{line}</em> : line}
          </span>
        </span>
      ))}
    </Tag>
  )
}
