import { Reveal } from './ui/Reveal'

export function Finale() {
  return (
    <section className="finale" id="finale">
      <div className="finale__media">
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
        <Reveal as="h2" className="finale__title" delay={0.05} distance={34}>
          The next machine is already
          <br />
          <em>in the studio.</em>
        </Reveal>
        <Reveal className="finale__actions" delay={0.1}>
          <a className="btn btn--solid" href="#configurator">
            Configure the VX-01
          </a>
          <a className="btn btn--ghost" href="#bike-configurator">
            Configure the R-01
          </a>
        </Reveal>
      </div>
      <p className="finale__mark" aria-hidden="true">
        NOVARIS
      </p>
    </section>
  )
}
