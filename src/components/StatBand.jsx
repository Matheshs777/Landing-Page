import { ParallaxImage } from './ui/ParallaxImage'
import { Reveal } from './ui/Reveal'
import { CountUp } from './ui/CountUp'

export function StatBand({ index, label, title, text, image, alt, stats, footnote }) {
  return (
    <section className="band section" aria-label={`${label} of the concept`}>
      <div className="container">
        <div className="band__grid">
          <div className="band__copy">
            <Reveal>
              <p className="eyebrow">
                <span className="eyebrow__index">{index}</span> {label}
              </p>
            </Reveal>
            <Reveal as="h2" className="band__title" delay={0.04}>
              {title}
            </Reveal>
            <Reveal as="p" className="band__text" delay={0.08}>
              {text}
            </Reveal>
          </div>
          <Reveal className="band__media" delay={0.08}>
            <ParallaxImage src={image} alt={alt} amount={4} />
          </Reveal>
        </div>

        <dl className="stats">
          {stats.map((stat, statIndex) => (
            <Reveal as="div" className="stat" key={stat.label} delay={statIndex * 0.04}>
              <dt className="stat__label">{stat.label}</dt>
              <dd className="stat__value">
                <CountUp value={stat.value} />
                <span className="stat__unit">{stat.unit}</span>
              </dd>
            </Reveal>
          ))}
        </dl>

        {footnote ? <p className="band__footnote">{footnote}</p> : null}
      </div>
    </section>
  )
}
