import { useEffect, useRef } from 'react'
import { gsap } from '../lib/gsap'
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion'
import { Reveal } from './ui/Reveal'

export function VehicleIntro({ vehicle, number, facts }) {
  const root = useRef(null)
  const ghost = useRef(null)
  const cue = useRef(null)
  const reduced = usePrefersReducedMotion()

  useEffect(() => {
    if (reduced || !root.current) return undefined
    const context = gsap.context(() => {
      gsap.fromTo(
        ghost.current,
        { yPercent: -8 },
        {
          yPercent: 8,
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
        cue.current,
        { scaleX: 0 },
        {
          scaleX: 1,
          duration: 1.2,
          ease: 'power3.out',
          transformOrigin: 'left',
          scrollTrigger: { trigger: cue.current, start: 'top 92%', once: true },
        },
      )
    }, root)

    return () => context.revert()
  }, [reduced])

  return (
    <header className="vintro" ref={root}>
      <div className="container vintro__grid">
        <div className="vintro__lead">
          <Reveal>
            <p className="eyebrow">
              {vehicle.intro.eyebrow} — {vehicle.year}
            </p>
          </Reveal>
          <Reveal as="h2" className="vintro__name" delay={0.04} distance={32}>
            {vehicle.name}
          </Reveal>
          <Reveal className="vintro__kind" delay={0.08}>
            {vehicle.kind}
          </Reveal>
        </div>

        <div className="vintro__copy">
          <Reveal as="h3" className="vintro__headline" delay={0.1}>
            {vehicle.intro.title}
          </Reveal>
          <Reveal as="p" className="vintro__text" delay={0.14}>
            {vehicle.intro.text}
          </Reveal>
          <Reveal as="dl" className="vintro__facts" delay={0.18}>
            {facts.map((fact) => (
              <div className="vintro__fact" key={fact.label}>
                <dt>{fact.label}</dt>
                <dd>{fact.value}</dd>
              </div>
            ))}
          </Reveal>
          <Reveal className="vintro__cue" delay={0.22}>
            <span className="vintro__cue-line" aria-hidden="true" ref={cue} />
            <span>Scroll to enter the studio</span>
          </Reveal>
        </div>
      </div>
      <span className="vintro__ghost" aria-hidden="true" ref={ghost}>
        {number}
      </span>
    </header>
  )
}
