import { useRef } from 'react'
import { SectionHead } from './ui/SectionHead'
import { Reveal } from './ui/Reveal'
import { ViewPicker } from './ui/ViewPicker'
import { ModelViewer } from './three/ModelViewer'
import { useDragControls } from '../hooks/useDragControls'
import { useViewControls } from '../hooks/useViewControls'

const viewerId = (vehicle) => (vehicle.id === 'car' ? 'vx01' : 'r01')

/**
 * A viewer-led configurator. The model is shown in its original finish; the
 * only choice is the camera, because touching paint would break that promise.
 */
export function Configurator({
  id,
  vehicle,
  viewId,
  onSelect,
  index,
  title,
  lead,
  note,
}) {
  const controls = useRef({ yaw: 0, zoom: 1 })
  const { handlers, dragging } = useDragControls(controls)
  const view = useViewControls(controls)
  const active = vehicle.presets.find((item) => item.id === viewId) ?? vehicle.presets[0]

  return (
    <section className="config section" id={id}>
      <div className="container config__grid">
        <div className="config__panel">
          <Reveal>
            <SectionHead
              index={index}
              label={`${vehicle.name} / Studio`}
              title={title}
              text={lead}
            />
          </Reveal>

          <Reveal delay={0.05}>
            <ViewPicker
              views={vehicle.presets}
              activeId={active.id}
              onSelect={onSelect}
              label={`${vehicle.fullName} camera view`}
            />
          </Reveal>

          <Reveal className="config__selection" delay={0.08}>
            <span className="config__chip config__chip--original" aria-hidden="true" />
            <div>
              <p className="config__paint">Original finish</p>
              <p className="config__finish">Unmodified model materials</p>
            </div>
          </Reveal>

          <Reveal as="p" className="config__note" delay={0.1}>
            {note}
          </Reveal>

          <Reveal className="config__actions" delay={0.12}>
            <a className="btn btn--solid" href="#engineering">
              View specifications
            </a>
            <a
              className="btn btn--ghost"
              href={`mailto:studio@novaris.example?subject=${encodeURIComponent(
                `${vehicle.fullName} concept study`,
              )}`}
            >
              Request the study
            </a>
          </Reveal>
        </div>

        <Reveal className="config__viewer" delay={0.06}>
          <div
            className={`viewer ${dragging ? 'is-dragging' : ''}`}
            {...handlers}
            aria-label={`${vehicle.fullName} 3D viewer. Drag to rotate.`}
          >
            <ModelViewer
              id={viewerId(vehicle)}
              view={active.camera}
              controls={controls}
              interactive
              className="viewer__model"
              label={`${vehicle.fullName}, ${active.label.toLowerCase()} view, original finish.`}
            />
            <div className="viewer__chrome">
              <span className="viewer__badge">{active.label}</span>
              <span className="viewer__hint">
                <span aria-hidden="true">↔</span> Drag to rotate
              </span>
              <div
                className="viewer__zoom"
                role="group"
                aria-label="Zoom controls"
                data-no-drag
              >
                <button type="button" onClick={view.zoomOut} aria-label="Zoom out">
                  −
                </button>
                <button type="button" onClick={view.zoomIn} aria-label="Zoom in">
                  +
                </button>
                <button type="button" onClick={view.reset} aria-label="Reset view">
                  Reset
                </button>
              </div>
            </div>
          </div>
          <p className="config__caption">
            {vehicle.fullName} — original finish, studio lighting. Drag to turn the
            model; scroll drives the stage above.
          </p>
        </Reveal>
      </div>
    </section>
  )
}
