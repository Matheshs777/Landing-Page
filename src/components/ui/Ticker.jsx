const PHRASES = [
  'Motion, considered',
  'VX-01',
  'Precision engineered',
  'R-01',
  'Emotion driven',
  'Stuttgart',
  'Designed for what comes next',
  'MMXXVII',
]

/**
 * A slow editorial ticker between the hero and the marque statement. Pure CSS
 * motion, duplicated once for a seamless loop, hidden from assistive tech.
 */
export function Ticker() {
  const group = (
    <span className="ticker__group" aria-hidden="true">
      {PHRASES.map((phrase) => (
        <span className="ticker__item" key={phrase}>
          {phrase}
          <span className="ticker__dot" />
        </span>
      ))}
    </span>
  )

  return (
    <div className="ticker">
      <div className="ticker__track">
        {group}
        {group}
      </div>
    </div>
  )
}
