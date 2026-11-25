import { useEffect, useRef } from 'react'
import { gsap } from '../lib/gsap'
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion'
import { Reveal } from './ui/Reveal'
import { SectionHead } from './ui/SectionHead'

const ITEMS = [
  {
    src: '/images/car-side.webp',
    alt: 'VX-01 concept automobile, side profile in the studio.',
    title: 'VX-01, side profile',
    meta: 'Studio 01 / Exterior',
    span: 'wide',
  },
  {
    src: '/images/bike-engine.webp',
    alt: 'R-01 superbike engine and frame detail.',
    title: 'R-01, engine detail',
    meta: 'Studio 02 / Mechanical',
    span: 'tall',
  },
  {
    src: '/images/car-wheel.webp',
    alt: 'Forged wheel and carbon-ceramic brake of the VX-01.',
    title: 'VX-01, forged wheel',
    meta: 'Studio 01 / Hardware',
    span: 'tall',
  },
  {
    src: '/images/bike-side.webp',
    alt: 'R-01 concept superbike, side profile in the studio.',
    title: 'R-01, side profile',
    meta: 'Studio 02 / Exterior',
    span: 'wide',
  },
  {
    src: '/images/car-rear.webp',
    alt: 'Rear diffuser and tail light of the VX-01.',
    title: 'VX-01, rear',
    meta: 'Studio 01 / Aerodynamics',
    span: 'wide',
  },
  {
    src: '/images/bike-front.webp',
    alt: 'Front fairing and headlight of the R-01.',
    title: 'R-01, front',
    meta: 'Studio 02 / Front end',
    span: 'tall',
  },
]

export function Gallery() {
  const grid = useRef(null)
  const reduced = usePrefersReducedMotion()

  useEffect(() => {
    if (reduced || !grid.current) return undefined
    const items = grid.current.querySelectorAll('.gallery__item')

    const context = gsap.context(() => {
      items.forEach((item, index) => {
        gsap.fromTo(
          item,
          {
            clipPath: 'inset(11% 7% 11% 7%)',
            y: 38,
            opacity: 0,
          },
          {
            clipPath: 'inset(0% 0% 0% 0%)',
            y: 0,
            opacity: 1,
            duration: 1.4,
            delay: (index % 3) * 0.07,
            ease: 'power3.out',
            scrollTrigger: { trigger: item, start: 'top 92%', once: true },
          },
        )
      })
    }, grid.current)

    return () => context.revert()
  }, [reduced])

  return (
    <section className="gallery section" id="gallery">
      <div className="container">
        <Reveal>
          <SectionHead
            index="06"
            label="Gallery"
            title="Under the same light."
            text="Both studies are photographed in one studio, with one lighting rig. The consistency is the point."
          />
        </Reveal>

        <div className="gallery__grid" ref={grid}>
          {ITEMS.map((item) => (
            <figure
              className={`gallery__item gallery__item--${item.span}`}
              key={item.src}
            >
              <img
                src={item.src}
                alt={item.alt}
                loading="lazy"
                decoding="async"
                width="1600"
                height="1000"
              />
              <figcaption className="gallery__caption">
                <span>{item.title}</span>
                <span>{item.meta}</span>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  )
}
