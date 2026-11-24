import { Reveal } from './ui/Reveal'

export function VehicleIntro({ vehicle, number, facts }) {
  return (
    <header className="vintro">
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
            <span className="vintro__cue-line" aria-hidden="true" />
            <span>Scroll to enter the studio</span>
          </Reveal>
        </div>
      </div>
      <span className="vintro__ghost" aria-hidden="true">
        {number}
      </span>
    </header>
  )
}
