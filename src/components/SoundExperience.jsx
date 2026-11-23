import { useEffect, useRef, useState } from 'react'
import { useInView, useReducedMotion } from 'framer-motion'
import { SectionLabel } from './SectionLabel'
import { Reveal } from './Reveal'
import { useTestTone } from '../hooks/useTestTone'

const MODES = {
  off: {
    label: 'ANC off',
    target: 78,
    detail: 1.15,
    headline: 'Everything gets through.',
    caption: 'Full spectrum — engine hum, rail noise, the room.',
  },
  on: {
    label: 'ANC on',
    target: 26,
    detail: 0.34,
    headline: 'Quiet, engaged.',
    caption: 'Hybrid ANC — up to 38 dB of steady low-frequency noise.',
  },
}

export function SoundExperience() {
  const [mode, setMode] = useState('off')
  const { playing, toggle } = useTestTone()
  const current = MODES[mode]

  return (
    <section className="sound" id="sound" aria-labelledby="sound-title">
      <div className="container">
        <Reveal className="section-head section-head--dark">
          <div>
            <SectionLabel index="02">Sound</SectionLabel>
            <h2 className="section-head__title" id="sound-title">
              Hear the difference.
            </h2>
          </div>
          <p className="section-head__text">
            Switch ANC off and on. The line gets thinner because the low-frequency
            noise is being cancelled — in the product, not in this browser.
          </p>
        </Reveal>

        <Reveal className="sound__panel" delay={0.08}>
          <div className="sound__panel-head">
            <p className="sound__panel-label">ANC demo / live waveform</p>
            <div className="segmented" role="group" aria-label="Noise cancelling mode">
              {Object.entries(MODES).map(([key, value]) => (
                <button
                  key={key}
                  type="button"
                  className={`segmented__btn ${mode === key ? 'is-active' : ''}`}
                  aria-pressed={mode === key}
                  onClick={() => setMode(key)}
                >
                  {value.label}
                </button>
              ))}
            </div>
          </div>

          <Waveform mode={mode} playing={playing} />

          <div className="sound__footer">
            <p className="sound__caption" aria-live="polite">
              <strong>{current.headline}</strong>
              <span>{current.caption}</span>
            </p>
            <button
              type="button"
              className="btn btn--ghost btn--small sound__tone"
              onClick={toggle}
              aria-pressed={playing}
            >
              {playing ? <StopIcon /> : <PlayIcon />}
              {playing ? 'Stop tone' : 'Play test tone'}
            </button>
          </div>
        </Reveal>

        <p className="sound__disclaimer">
          Demonstration interface only. PULSAR does not cancel noise through your
          browser, and the test tone is a simple two-note chime.
        </p>
      </div>
    </section>
  )
}

/**
 * The waveform is generated per frame from a few summed sines. ANC on lowers
 * the amplitude and strips the high-frequency detail; the amplitude is damped
 * so switching modes glides instead of snapping.
 */
function Waveform({ mode, playing }) {
  const reduced = useReducedMotion()
  const containerRef = useRef(null)
  const inView = useInView(containerRef, { margin: '120px 0px' })
  const pathRef = useRef(null)
  const ghostRef = useRef(null)
  const amplitudeRef = useRef(MODES[mode].target)

  const config = MODES[mode]
  const initialPath = buildPath(1.2, config.target, config.detail)

  useEffect(() => {
    const target = config.target * (playing ? 1.28 : 1)
    const detail = config.detail

    if (reduced) {
      pathRef.current?.setAttribute('d', buildPath(1.4, target, detail))
      ghostRef.current?.setAttribute('d', buildPath(2.8, target * 1.26, detail))
      return undefined
    }

    if (!inView) return undefined

    let frame = 0
    let previous = performance.now()
    let time = 0

    const tick = (now) => {
      const delta = Math.min((now - previous) / 1000, 0.05)
      previous = now
      time += delta

      amplitudeRef.current += (target - amplitudeRef.current) * Math.min(1, delta * 4)
      pathRef.current?.setAttribute('d', buildPath(time, amplitudeRef.current, detail))
      ghostRef.current?.setAttribute(
        'd',
        buildPath(time + 1.6, amplitudeRef.current * 1.26, detail),
      )

      frame = requestAnimationFrame(tick)
    }

    frame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame)
  }, [config, inView, playing, reduced])

  return (
    <div className="waveform" ref={containerRef} aria-hidden="true">
      <div className="waveform__axis">
        <span>0 dB</span>
        <span>-20</span>
        <span>-40</span>
        <span>-60</span>
      </div>
      <svg
        className="waveform__svg"
        viewBox="0 0 1000 240"
        preserveAspectRatio="none"
        focusable="false"
      >
        <path
          ref={ghostRef}
          className="waveform__path waveform__ghost"
          d={initialPath}
        />
        <path ref={pathRef} className="waveform__path" d={initialPath} />
      </svg>
    </div>
  )
}

function buildPath(time, amplitude, detail) {
  const points = 150
  const width = 1000
  const middle = 120
  let path = ''

  for (let i = 0; i <= points; i += 1) {
    const progress = i / points
    const envelope = Math.pow(Math.sin(Math.PI * progress), 1.4)
    const wave =
      Math.sin(progress * Math.PI * 6 + time * 1.8) * 0.55 +
      Math.sin(progress * Math.PI * 15 - time * 2.7) * 0.27 +
      Math.sin(progress * Math.PI * 29 + time * 1.2) * 0.12 * detail
    const jitter =
      Math.sin(i * 12.9898 + time * 8.4) * Math.sin(i * 4.1 - time * 3.2) * 0.09 * detail
    const x = (progress * width).toFixed(1)
    const y = (middle - (wave + jitter) * amplitude * envelope).toFixed(1)
    path += `${i === 0 ? 'M' : 'L'}${x} ${y}`
  }

  return path
}

function PlayIcon() {
  return (
    <svg className="icon" viewBox="0 0 20 20" aria-hidden="true">
      <circle cx="10" cy="10" r="8.4" fill="none" stroke="currentColor" strokeWidth="1.2" opacity=".5" />
      <path d="M8.2 6.6 14 10l-5.8 3.4z" fill="currentColor" />
    </svg>
  )
}

function StopIcon() {
  return (
    <svg className="icon" viewBox="0 0 20 20" aria-hidden="true">
      <circle cx="10" cy="10" r="8.4" fill="none" stroke="currentColor" strokeWidth="1.2" opacity=".5" />
      <rect x="7.4" y="7.4" width="5.2" height="5.2" rx="1" fill="currentColor" />
    </svg>
  )
}
