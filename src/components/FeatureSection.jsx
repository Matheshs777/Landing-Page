import { useEffect, useRef, useState } from 'react'
import { useColorway } from '../hooks/ColorwayContext'
import { SectionLabel } from './SectionLabel'
import { Reveal } from './Reveal'
import { SceneBoundary } from './SceneBoundary'
import { SceneFallback } from './SceneFallback'
import { SceneSlot } from './SceneSlot'
import { LazyProductScene } from './LazyProductScene'

const FEATURES = [
  {
    title: '42 Hours. Seriously.',
    text: 'Nine hours in the earbuds, thirty-three more in the case. A 10-minute charge gives you 2 hours of music.',
    meta: ['9 h buds', '33 h case', '10 min = 2 h'],
  },
  {
    title: 'Quiet on demand.',
    text: 'Four mics and a hybrid ANC chip cancel up to 38 dB of engine hum, train noise and open-office chatter.',
    meta: ['Hybrid ANC', '4 mics', '38 dB'],
  },
  {
    title: 'No lag. No excuses.',
    text: 'Low-latency mode drops delay to 45 ms, so video and games stay in sync.',
    meta: ['45 ms', 'Game mode'],
  },
  {
    title: 'Calls that sound like you.',
    text: 'Beamforming microphones and wind reduction keep your voice clear on a busy street.',
    meta: ['Beamforming', 'Wind reduction'],
  },
]

/**
 * The product stays pinned while the four claims scroll past it. The active
 * claim is decided by whichever one is nearest the reading line, not by a
 * fixed scroll percentage, so it behaves correctly at every viewport height.
 */
export function FeatureSection() {
  const { colorway } = useColorway()
  const listRef = useRef(null)
  const [active, setActive] = useState(0)

  useEffect(() => {
    const nodes = Array.from(listRef.current?.querySelectorAll('[data-feature]') ?? [])
    if (!nodes.length) return undefined

    let frame = 0
    const measure = () => {
      frame = 0
      const anchor = window.innerHeight * 0.42
      let best = 0
      let bestDistance = Infinity

      nodes.forEach((node, index) => {
        const rect = node.getBoundingClientRect()
        const center = rect.top + rect.height / 2
        const distance = Math.abs(center - anchor)
        if (distance < bestDistance) {
          bestDistance = distance
          best = index
        }
      })

      setActive(best)
    }

    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(measure)
    }

    measure()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)

    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [])

  return (
    <section className="features" id="features" aria-labelledby="features-title">
      <div className="container">
        <Reveal className="section-head">
          <div>
            <SectionLabel index="01">Features</SectionLabel>
            <h2 className="section-head__title" id="features-title">
              Four things that matter.
            </h2>
          </div>
          <p className="section-head__text">
            Battery, noise, latency, calls. In that order, because that is the order
            you notice them.
          </p>
        </Reveal>

        <div className="features__body">
          <div className="features__stage">
            <div className="features__stage-inner">
              <span className="stage__fig" aria-hidden="true">
                Fig. 01 — View 0{active + 1}
              </span>
              <span className="stage__ring" aria-hidden="true" />
              <span className="stage-plinth" aria-hidden="true" />

              <SceneBoundary fallback={<SceneFallback />}>
                <SceneSlot className="features__scene" label="Loading product view">
                  <LazyProductScene
                    colorway={colorway}
                    mode="feature"
                    activeFeature={active}
                  />
                </SceneSlot>
              </SceneBoundary>

              <p className="stage__caption">
                <span className="stage__caption-dot" aria-hidden="true" />
                Pulsar Buds One — Series 01
              </p>
            </div>
          </div>

          <div className="features__list" ref={listRef}>
            {FEATURES.map((feature, index) => (
              <article
                className={`feature ${active === index ? 'is-active' : ''}`}
                data-feature
                key={feature.title}
                aria-labelledby={`feature-title-${index}`}
              >
                <span className="feature__index" aria-hidden="true">
                  0{index + 1}
                </span>
                <div className="feature__head">
                  <h3 className="feature__title" id={`feature-title-${index}`}>
                    {feature.title}
                  </h3>
                </div>
                <p className="feature__text">{feature.text}</p>
                <ul className="feature__meta" aria-label="Key figures">
                  {feature.meta.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
