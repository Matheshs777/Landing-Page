import { AnimatePresence, motion } from 'framer-motion'
import { useColorway } from '../hooks/ColorwayContext'
import { SectionLabel } from './SectionLabel'
import { Reveal } from './Reveal'
import { SceneBoundary } from './SceneBoundary'
import { SceneFallback } from './SceneFallback'
import { SceneSlot } from './SceneSlot'
import { LazyProductScene } from './LazyProductScene'
import { EASE } from '../lib/motion'

export function ColorSelector() {
  const { colorId, setColorId, colorway, colorways } = useColorway()
  const activeIndex = colorways.findIndex((finish) => finish.id === colorId)

  return (
    <section className="colors" id="colors" aria-labelledby="colors-title">
      <div className="container colors__inner">
        <Reveal className="colors__head">
          <SectionLabel index="04">Finish</SectionLabel>
          <h2 className="section-head__title colors__title" id="colors-title">
            Pick your pair.
          </h2>
          <p className="colors__lede">
            Three finishes. Same quiet. Choose one and the 3D model changes with it —
            housing, ear tip and case.
          </p>
        </Reveal>

        <div className="colors__stage">
          <div
            className="colors__stage-inner"
            style={{ '--finish-glow': hexToRgba(colorway.bud, 0.16) }}
          >
            <span className="stage__fig" aria-hidden="true">
              Finish 0{activeIndex + 1} — 03
            </span>
            <span className="stage__ring" aria-hidden="true" />
            <span className="stage-plinth" aria-hidden="true" />

            <SceneBoundary fallback={<SceneFallback />}>
              <SceneSlot className="colors__scene" label="Loading finish preview">
                <LazyProductScene colorway={colorway} mode="color" dark />
              </SceneSlot>
            </SceneBoundary>

            <p className="stage__caption">
              <span className="stage__caption-dot" aria-hidden="true" />
              Pulsar Buds One — {colorway.name}
            </p>
          </div>
        </div>

        <div className="colors__finishes">
          <div className="finishes" role="group" aria-label="Choose a finish">
            {colorways.map((finish, index) => (
              <button
                key={finish.id}
                type="button"
                className={`finish ${finish.id === colorId ? 'is-active' : ''}`}
                style={{ '--swatch': finish.swatch }}
                aria-pressed={finish.id === colorId}
                onClick={() => setColorId(finish.id)}
              >
                <span className="finish__dot" aria-hidden="true" />
                <span className="finish__name">{finish.name}</span>
                <span className="finish__meta" aria-hidden="true">
                  0{index + 1}
                </span>
              </button>
            ))}
          </div>

          <div className="colors__detail" aria-live="polite">
            <AnimatePresence mode="wait">
              <motion.p
                key={colorway.id}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.24, ease: EASE }}
              >
                <span className="colors__detail-name">{colorway.name}.</span>{' '}
                {colorway.description}
              </motion.p>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  )
}

function hexToRgba(hex, alpha) {
  const clean = hex.replace('#', '')
  const full = clean.length === 3 ? clean.split('').map((char) => char + char).join('') : clean
  const value = Number.parseInt(full, 16)
  const red = (value >> 16) & 255
  const green = (value >> 8) & 255
  const blue = value & 255
  return `rgba(${red}, ${green}, ${blue}, ${alpha})`
}
