import { SectionHead } from './ui/SectionHead'
import { VehicleViewer } from './VehicleViewer'
import { Reveal } from './ui/Reveal'

export function Configurator({
  id,
  vehicle,
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
              label={`${vehicle.name} / Original finish`}
              title={title}
              text={lead}
            />
          </Reveal>

          <Reveal className="config__selection" delay={0.08}>
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
          <VehicleViewer vehicle={vehicle} />
          <p className="config__caption">
            {vehicle.fullName} — original finish. Concept materials, studio lighting.
          </p>
        </Reveal>
      </div>
    </section>
  )
}
