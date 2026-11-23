import { useRef } from 'react'
import { motion, useReducedMotion, useScroll } from 'framer-motion'
import { useColorway } from '../hooks/ColorwayContext'
import { SceneBoundary } from './SceneBoundary'
import { SceneFallback } from './SceneFallback'
import { SceneSlot } from './SceneSlot'
import { LazyProductScene } from './LazyProductScene'
import { EASE } from '../lib/motion'

const META = [
  ['42 h', 'Battery'],
  ['38 dB', 'ANC depth'],
  ['45 ms', 'Game mode'],
  ['IPX4', 'Water resistance'],
]

export function Hero() {
  const heroRef = useRef(null)
  const reduced = useReducedMotion()
  const { colorway } = useColorway()
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start'],
  })

  const container = {
    hidden: {},
    show: { transition: { staggerChildren: 0.06, delayChildren: 0.1 } },
  }
  const item = {
    hidden: { opacity: 0, y: 18 },
    show: { opacity: 1, y: 0, transition: { duration: 0.55, ease: EASE } },
  }

  return (
    <section className="hero" id="top" ref={heroRef} aria-labelledby="hero-title">
      <div className="hero__backdrop" aria-hidden="true">
        <span className="hero__halo" />
        <span className="hero__grid" />
      </div>

      <div className="container hero__inner">
        <motion.div
          className="hero__copy"
          variants={container}
          initial={reduced ? false : 'hidden'}
          animate="show"
        >
          <motion.p className="hero__kicker" variants={item}>
            <span className="hero__kicker-dot" aria-hidden="true" />
            Pulsar Buds One
            <span className="hero__kicker-sep" aria-hidden="true">
              /
            </span>
            Series 01
          </motion.p>

          <motion.h1 className="hero__title" id="hero-title" variants={item}>
            <span>Hear everything.</span>
            <span>Except the noise.</span>
          </motion.h1>

          <motion.p className="hero__sub" variants={item}>
            Pulsar Buds One pair hybrid noise cancelling with 42 hours of battery,
            at a price that makes sense.
          </motion.p>

          <motion.div className="hero__actions" variants={item}>
            <a className="btn btn--primary" href="#preorder">
              Pre-order for $89
              <ArrowIcon />
            </a>
            <a className="btn btn--ghost" href="#sound">
              <PlayIcon />
              Hear the difference
            </a>
          </motion.div>

          <motion.p className="hero__launch" variants={item}>
            <span className="hero__launch-dot" aria-hidden="true" />
            First batch: 1,000 pairs.
          </motion.p>
        </motion.div>

        <motion.div
          className="hero__visual"
          initial={reduced ? false : { opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, delay: 0.22, ease: EASE }}
        >
          <div className="hero__stage">
            <span className="stage-plinth" aria-hidden="true" />
            <SceneBoundary fallback={<SceneFallback />}>
              <SceneSlot className="hero__scene" label="Loading Pulsar Buds One">
                <LazyProductScene
                  colorway={colorway}
                  mode="hero"
                  scrollProgress={scrollYProgress}
                  dark
                />
              </SceneSlot>
            </SceneBoundary>
          </div>

          <p className="hero__product-caption">
            <span className="hero__product-dot" aria-hidden="true" />
            Pulsar Buds One
            <span className="hero__product-slash" aria-hidden="true">
              /
            </span>
            <span aria-live="polite">{colorway.name}</span>
          </p>

          <span className="hero__edition" aria-hidden="true">
            Series 01 — $89
          </span>
        </motion.div>

        <div className="hero__meta">
          {META.map(([value, label]) => (
            <div className="hero__meta-item" key={label}>
              <span className="hero__meta-value">{value}</span>
              <span className="hero__meta-label">{label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function ArrowIcon() {
  return (
    <svg className="icon" viewBox="0 0 20 20" aria-hidden="true">
      <path
        d="M4 10h11M11 5l5 5-5 5"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function PlayIcon() {
  return (
    <svg className="icon" viewBox="0 0 20 20" aria-hidden="true">
      <circle cx="10" cy="10" r="8.4" fill="none" stroke="currentColor" strokeWidth="1.2" opacity=".55" />
      <path d="M8.2 6.6 14 10l-5.8 3.4z" fill="currentColor" />
    </svg>
  )
}
