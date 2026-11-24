import { PaintPicker } from './ui/PaintPicker'
import { SectionHead } from './ui/SectionHead'
import { VehicleViewer } from './VehicleViewer'
import { Reveal } from './ui/Reveal'

export function Configurator({
  id,
  vehicle,
  paint,
  onSelect,
  index,
  title,
  lead,
  note,
}) {
  return (
    <section className="config section" id={id}>
      <div className="container config__grid">
        <div className="config__panel">
          <Reveal>
            <SectionHead
              index={index}
              label={`${vehicle.name} / Configurator`}
              title={title}
              text={lead}
            />
          </Reveal>

          <Reveal delay={0.05}>
            <PaintPicker
              paints={vehicle.paints}
              activeId={paint.id}
              onSelect={onSelect}
              label={`${vehicle.fullName} body paint`}
            />
          </Reveal>

          <Reveal className="config__selection" delay={0.08}>
            <span
              className="config__chip"
              style={{ '--swatch': paint.swatch }}
              aria-hidden="true"
            />
            <div>
              <p className="config__paint">{paint.name}</p>
              <p className="config__finish">{paint.finish} — body panels only</p>
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
          <VehicleViewer vehicle={vehicle} paint={paint} />
          <p className="config__caption">
            {vehicle.fullName} — {paint.name.toLowerCase()}. Concept finish, studio
            lighting.
          </p>
        </Reveal>
      </div>
    </section>
  )
}
