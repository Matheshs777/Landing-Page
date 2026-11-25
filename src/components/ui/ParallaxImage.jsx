import { useEffect, useRef } from 'react'
import { gsap } from '../../lib/gsap'
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion'

/**
 * Slow image drift inside a fixed frame. Wrapper clips, image overscales so
 * the movement never reveals an edge.
 */
export function ParallaxImage({ src, alt, className = '', imgClassName = '', amount = 6, ...rest }) {
  const frame = useRef(null)
  const image = useRef(null)
  const reduced = usePrefersReducedMotion()

  useEffect(() => {
    if (reduced || !frame.current || !image.current) return undefined
    const context = gsap.context(() => {
      gsap.fromTo(
        frame.current,
        { clipPath: 'inset(9% 7% 9% 7%)' },
        {
          clipPath: 'inset(0% 0% 0% 0%)',
          duration: 1.35,
          ease: 'power3.out',
          scrollTrigger: { trigger: frame.current, start: 'top 90%', once: true },
        },
      )

      gsap.fromTo(
        image.current,
        { yPercent: -amount },
        {
          yPercent: amount,
          ease: 'none',
          scrollTrigger: {
            trigger: frame.current,
            start: 'top bottom',
            end: 'bottom top',
            scrub: true,
          },
        },
      )
    }, frame.current)
    return () => context.revert()
  }, [reduced, amount])

  return (
    <figure ref={frame} className={`parallax ${className}`}>
      <img
        ref={image}
        className={`parallax__img ${imgClassName}`}
        src={src}
        alt={alt}
        loading="lazy"
        decoding="async"
        {...rest}
      />
    </figure>
  )
}
