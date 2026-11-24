import { useRef } from 'react'

export function PaintPicker({ paints, activeId, onSelect, label }) {
  const buttons = useRef([])

  const onKeyDown = (event, index) => {
    const keys = ['ArrowRight', 'ArrowDown', 'ArrowLeft', 'ArrowUp', 'Home', 'End']
    if (!keys.includes(event.key)) return
    event.preventDefault()
    let next = index
    if (event.key === 'ArrowRight' || event.key === 'ArrowDown') {
      next = (index + 1) % paints.length
    } else if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') {
      next = (index - 1 + paints.length) % paints.length
    } else if (event.key === 'Home') {
      next = 0
    } else if (event.key === 'End') {
      next = paints.length - 1
    }
    onSelect(paints[next].id)
    buttons.current[next]?.focus()
  }

  return (
    <div className="paints" role="radiogroup" aria-label={label}>
      {paints.map((paint, index) => {
        const active = paint.id === activeId
        return (
          <button
            key={paint.id}
            ref={(element) => {
              buttons.current[index] = element
            }}
            type="button"
            role="radio"
            aria-checked={active}
            tabIndex={active ? 0 : -1}
            className={`paint ${active ? 'is-active' : ''}`}
            onClick={() => onSelect(paint.id)}
            onKeyDown={(event) => onKeyDown(event, index)}
          >
            <span
              className="paint__swatch"
              style={{ '--swatch': paint.swatch }}
              aria-hidden="true"
            />
            <span className="paint__text">
              <span className="paint__name">{paint.name}</span>
              <span className="paint__finish">{paint.finish}</span>
            </span>
            <span className="paint__tick" aria-hidden="true" />
          </button>
        )
      })}
    </div>
  )
}
