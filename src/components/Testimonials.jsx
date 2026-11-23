import { useState } from 'react'
import { SectionLabel } from './SectionLabel'
import { Reveal } from './Reveal'

const REVIEWS = [
  { quote: 'My commute got ten times quieter.', name: 'Aarav, student' },
  { quote: 'Battery lasted my whole work week.', name: 'Nisha, designer' },
  { quote: 'ANC at this price feels like cheating.', name: 'Kabir, podcaster' },
]

export function Testimonials() {
  const [paused, setPaused] = useState(false)

  return (
    <section
      className={`reviews ${paused ? 'is-paused' : ''}`}
      id="reviews"
      aria-labelledby="reviews-title"
    >
      <div className="container">
        <Reveal className="reviews__head">
          <div>
            <SectionLabel index="05">Reviews</SectionLabel>
            <h2 className="section-head__title reviews__title" id="reviews-title">
              What a week sounds like.
            </h2>
          </div>
          <div className="reviews__side">
            <p className="reviews__note">Three early units. Three honest weeks.</p>
            <button
              type="button"
              className="reviews__pause"
              aria-pressed={paused}
              onClick={() => setPaused((value) => !value)}
            >
              {paused ? 'Play reviews' : 'Pause reviews'}
            </button>
          </div>
        </Reveal>
      </div>

      <div className="reviews__viewport">
        <div className="reviews__track">
          {[0, 1].map((copy) => (
            <div
              className="reviews__group"
              key={copy}
              aria-hidden={copy === 1 ? 'true' : undefined}
            >
              {REVIEWS.map((review) => (
                <figure className="review" key={`${copy}-${review.name}`}>
                  <span className="review__mark" aria-hidden="true">
                    “
                  </span>
                  <blockquote className="review__quote">
                    <p>{review.quote}</p>
                  </blockquote>
                  <figcaption className="review__cite">{review.name}</figcaption>
                </figure>
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
