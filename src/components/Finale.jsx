import { useEffect, useRef } from 'react'
import { gsap } from '../lib/gsap'
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion'
import { Reveal } from './ui/Reveal'
import { LineReveal } from './ui/LineReveal'

export function Finale() {
  const root = useRef(null)
  const media = useRef(null)
  const mark = useRef(null)
  const reduced = usePrefersReducedMotion()

  useEffect(() => {
    if (reduced || !root.current) return undefined
    const context = gsap.context(() => {
      gsap.fromTo(
        media.current,
        { scale: 1.12, yPercent: -2 },
        {
          scale: 1,
          yPercent: 2,
          ease: 'none',
          scrollTrigger: {
            trigger: root.current,
            start: 'top bottom',
            end: 'bottom top',
            scrub: true,
          },
        },
      )

      gsap.fromTo(
        mark.current,
        { xPercent: 4, autoAlpha: 0.25 },
        {
          xPercent: -4,
          autoAlpha: 0.7,
          ease: 'none',
          scrollTrigger: {
            trigger: root.current,
            start: 'top bottom',
            end: 'bottom top',
            scrub: true,
          },
        },
      )
    }, root)

    return () => context.revert()
  }, [reduced])

  return (
    <section className="finale" id="finale" ref={root}>
      <div className="finale__media" ref={media}>
        <img
          src="/images/finale.webp"
          alt="The VX-01 concept automobile seen from the rear three-quarter in a dark studio."
          loading="lazy"
          decoding="async"
          width="1920"
          height="1080"
        />
      </div>
      <div className="finale__scrim" aria-hidden="true" />
      <div className="container finale__content">
        <Reveal>
          <p className="eyebrow">Concept studies MMXXVII</p>
        </Reveal>
        <LineReveal
          className="finale__title"
          lines={['The next machine is already', 'in the studio.']}
          emphasis={1}
        />
        <Reveal className="finale__actions" delay={0.1}>
          <a className="btn btn--solid" href="#configurator">
            Configure the VX-01
          </a>
          <a className="btn btn--ghost" href="#bike-configurator">
            Configure the R-01
          </a>
        </Reveal>
      </div>
      <p className="finale__mark" aria-hidden="true" ref={mark}>
        NOVARIS
      </p>
    </section>
  )
}
