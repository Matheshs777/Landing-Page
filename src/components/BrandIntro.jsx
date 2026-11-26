import { Reveal } from './ui/Reveal'
import { LineReveal } from './ui/LineReveal'
import { ModelViewer } from './three/ModelViewer'

const PRINCIPLES = [
  {
    index: '01',
    title: 'Reduction',
    text: 'We remove until only intent remains. What is left has to earn its place on the surface.',
  },
  {
    index: '02',
    title: 'Proportion',
    text: 'Every surface is measured against the whole, never against a trend or a single detail.',
  },
  {
    index: '03',
    title: 'Consequence',
    text: 'Nothing is decorative. Every decision carries a cost in mass, drag or material, and we account for it.',
  },
]

export function BrandIntro() {
  return (
    <section className="brand-intro section" id="brand">
      <div className="container">
        <Reveal>
          <p className="eyebrow">The marque</p>
        </Reveal>

        <div className="brand-intro__statement">
          <LineReveal
            as="h2"
            className="brand-intro__title"
            lines={['We build fewer things,', 'more carefully.']}
            emphasis={1}
          />
          <Reveal className="brand-intro__aside" delay={0.08}>
            <p>
              NOVARIS is a design-led performance marque working between Stuttgart and
              the wind tunnel. Two machines, one argument: restraint is the most
              expensive material.
            </p>
            <a className="text-link" href="#philosophy">
              Read the philosophy
              <span aria-hidden="true">→</span>
            </a>
          </Reveal>
        </div>

        <div className="brand-intro__grid">
          <Reveal className="brand-intro__media">
            <ModelViewer
              id="vx01"
              view="brand"
              className="brand-intro__viewer"
              label="Close studio view of the VX-01 rear deck and bodywork."
            />
            <p className="brand-intro__caption">
              VX-01, rear deck. Original livery, lit in the NOVARIS studio.
            </p>
          </Reveal>

          <ol className="principles">
            {PRINCIPLES.map((principle) => (
              <Reveal as="li" className="principle" key={principle.index} delay={0.05}>
                <span className="principle__index">{principle.index}</span>
                <div>
                  <h3 className="principle__title">{principle.title}</h3>
                  <p className="principle__text">{principle.text}</p>
                </div>
              </Reveal>
            ))}
          </ol>
        </div>
      </div>
    </section>
  )
}
