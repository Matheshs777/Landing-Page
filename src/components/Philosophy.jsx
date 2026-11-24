import { ParallaxImage } from './ui/ParallaxImage'
import { Reveal } from './ui/Reveal'

export function Philosophy() {
  return (
    <section className="philosophy section" id="philosophy">
      <div className="container">
        <Reveal>
          <p className="eyebrow">
            <span className="eyebrow__index">09</span> Philosophy
          </p>
        </Reveal>

        <Reveal as="h2" className="philosophy__statement" distance={34}>
          Speed is not the point.
          <br />
          <em>Control is.</em>
        </Reveal>

        <div className="philosophy__grid">
          <Reveal className="philosophy__media">
            <ParallaxImage
              src="/images/philosophy.webp"
              alt="The R-01 concept superbike in a low three-quarter studio view."
              amount={5}
            />
          </Reveal>

          <div className="philosophy__copy">
            <Reveal as="p" delay={0.04}>
              A fast car is easy. A car that feels composed at every speed is a
              different discipline. We tune steering, throttle map and sound together,
              because the driver experiences them as one thing.
            </Reveal>
            <Reveal as="p" delay={0.08}>
              The same applies to the motorcycle. Four wheels or two, the brief never
              changes: the machine should disappear, and the road should remain.
            </Reveal>
            <Reveal as="p" className="philosophy__quote" delay={0.12}>
              “We are not chasing a number. We are chasing the moment the machine stops
              asking questions.”
            </Reveal>
            <Reveal as="p" className="philosophy__signature" delay={0.16}>
              Elias Novak
              <span>Design Director, NOVARIS</span>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  )
}
