import { Reveal } from './ui/Reveal'
import { SectionHead } from './ui/SectionHead'

const ITEMS = [
  {
    id: 'vx01',
    src: '/images/gallery/vx01-side.jpg',
    alt: 'VX-01 concept automobile, side profile in the studio.',
    title: 'VX-01, side profile',
    meta: 'Studio 01 / Exterior',
    span: 'wide',
  },
  {
    id: 'r01',
    src: '/images/gallery/r01-detail.jpg',
    alt: 'R-01 superbike front-end and fairing detail.',
    title: 'R-01, detail',
    meta: 'Studio 02 / Mechanical',
    span: 'tall',
  },
  {
    id: 'vx01',
    src: '/images/gallery/vx01-detail.jpg',
    alt: 'Forged wheel, brake and bodywork detail of the VX-01.',
    title: 'VX-01, wheel and brake',
    meta: 'Studio 01 / Hardware',
    span: 'tall',
  },
  {
    id: 'r01',
    src: '/images/gallery/r01-side.jpg',
    alt: 'R-01 concept superbike, side profile in the studio.',
    title: 'R-01, side profile',
    meta: 'Studio 02 / Exterior',
    span: 'wide',
  },
  {
    id: 'vx01',
    src: '/images/gallery/vx01-rear.jpg',
    alt: 'Rear diffuser, wing and tail light of the VX-01.',
    title: 'VX-01, rear',
    meta: 'Studio 01 / Aerodynamics',
    span: 'wide',
  },
  {
    id: 'r01',
    src: '/images/gallery/r01-front.jpg',
    alt: 'Front fairing and headlight of the R-01.',
    title: 'R-01, front',
    meta: 'Studio 02 / Front end',
    span: 'tall',
  },
]

export function Gallery() {
  return (
    <section className="gallery section" id="gallery">
      <div className="container">
        <Reveal>
          <SectionHead
            index="08"
            label="Gallery"
            title="Under the same light."
            text="Both studies are rendered in one studio, with one lighting rig, from the same two model files used across the site."
          />
        </Reveal>

        <div className="gallery__grid">
          {ITEMS.map((item, index) => (
            <Reveal
              as="figure"
              className={`gallery__item gallery__item--${item.span}`}
              key={`${item.id}-${item.title}`}
              delay={(index % 3) * 0.06}
            >
              <img
                src={item.src}
                alt={item.alt}
                width="1280"
                height="800"
                loading="lazy"
                decoding="async"
              />
              <figcaption className="gallery__caption">
                <span>{item.title}</span>
                <span>{item.meta}</span>
              </figcaption>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
