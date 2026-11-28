import { useEffect, useRef } from 'react'
import { gsap } from '../lib/gsap'
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion'
import { ModelViewer } from './three/ModelViewer'
import { CAR } from '../config/vehicles'

export function Hero() {
  const root = useRef(null)
  const media = useRef(null)
  const content = useRef(null)
  const reduced = usePrefersReducedMotion()

  useEffect(() => {
    if (reduced) return undefined

    const context = gsap.context(() => {
      const timeline = gsap.timeline({
        defaults: { ease: 'power3.out' },
        delay: 0.15,
      })

      timeline
        .from('[data-hero="eyebrow"]', { autoAlpha: 0, y: 14, duration: 0.8 })
        .from(
          '[data-hero="line"]',
          { yPercent: 112, duration: 1.25, stagger: 0.09 },
          '-=0.45',
        )
        .from(
          '[data-hero="support"]',
          { autoAlpha: 0, y: 18, duration: 0.9 },
          '-=0.75',
        )
        .from(
          '[data-hero="actions"] > *',
          { autoAlpha: 0, y: 16, duration: 0.8, stagger: 0.07 },
          '-=0.6',
        )
        .from(
          '[data-hero="foot"] > *',
          { autoAlpha: 0, y: 12, duration: 0.7, stagger: 0.06 },
          '-=0.55',
        )
        .from(
          '.hero__rail-line',
          { scaleY: 0, duration: 1.4, transformOrigin: 'top' },
          '-=0.9',
        )
        .from(media.current, { scale: 1.06, autoAlpha: 0, duration: 1.6 }, 0)

      gsap.to(content.current, {
        yPercent: -7,
        autoAlpha: 0.25,
        ease: 'none',
        scrollTrigger: {
          trigger: root.current,
          start: 'top top',
          end: 'bottom top',
          scrub: true,
        },
      })

      gsap.to(media.current, {
        yPercent: 6,
        scale: 1.04,
        ease: 'none',
        scrollTrigger: {
          trigger: root.current,
          start: 'top top',
          end: 'bottom top',
          scrub: true,
        },
      })

      gsap.to('.hero__title', {
        yPercent: -10,
        ease: 'none',
        scrollTrigger: {
          trigger: root.current,
          start: 'top top',
          end: 'bottom top',
          scrub: 0.6,
        },
      })
    }, root)

    return () => context.revert()
  }, [reduced])

  const onPointerMove = (event) => {
    if (reduced || !root.current || event.pointerType !== 'mouse') return
    const rect = root.current.getBoundingClientRect()
    const x = (event.clientX - rect.left) / rect.width
    const y = (event.clientY - rect.top) / rect.height
    root.current.style.setProperty('--gx', `${x * 100}%`)
    root.current.style.setProperty('--gy', `${y * 100}%`)
    root.current.style.setProperty('--px', `${(x - 0.5) * 2}`)
    root.current.style.setProperty('--py', `${(y - 0.5) * 2}`)
  }

  return (
    <section className="hero" id="home" ref={root} onPointerMove={onPointerMove}>
      <div className="hero__media" ref={media}>
        <ModelViewer
          id="vx01"
          view="hero"
          poster={CAR.heroPoster}
          autoRotate
          className="hero__viewer"
          label="The NOVARIS VX-01 concept automobile, turning slowly in a dark studio."
        />
      </div>
      <div className="hero__scrim" aria-hidden="true" />
      <div className="hero__glow" aria-hidden="true" />
      <div className="hero__grain" aria-hidden="true" />

      <div className="hero__rail" aria-hidden="true">
        <span>VX-01</span>
        <span className="hero__rail-line" />
        <span>R-01</span>
      </div>

      <div className="hero__content container" ref={content}>
        <p className="eyebrow" data-hero="eyebrow">
          NOVARIS — Concept studies MMXXVII
        </p>

        <h1 className="hero__title">
          <span className="hero__line-mask">
            <span className="hero__line" data-hero="line">
              BEYOND
            </span>
          </span>
          <span className="hero__line-mask">
            <span className="hero__line" data-hero="line">
              THE MACHINE.
            </span>
          </span>
        </h1>

        <p className="hero__support" data-hero="support">
          Precision engineered. Emotion driven. Designed for what comes next.
        </p>

        <div className="hero__actions" data-hero="actions">
          <a className="btn btn--solid" href="#automobile">
            DISCOVER THE AUTOMOBILE
          </a>
          <a className="btn btn--ghost" href="#brand">
            EXPLORE THE BRAND
          </a>
        </div>
      </div>

      <div className="hero__foot container" data-hero="foot">
        <div className="hero__foot-item">
          <span className="hero__foot-index">01</span>
          <span>VX-01 — Automobile</span>
        </div>
        <div className="hero__foot-item hero__foot-item--mid">
          <span className="hero__foot-index">02</span>
          <span>R-01 — Superbike</span>
        </div>
        <div className="hero__foot-item hero__foot-item--end">
          <span>Stuttgart, DE</span>
          <a className="hero__scroll" href="#brand">
            <span>Scroll</span>
            <span className="hero__scroll-line" aria-hidden="true" />
          </a>
        </div>
      </div>
    </section>
  )
}
