import { useRef } from 'react'

/** Camera view picker, keyboard-operable like a radio group. */
export function ViewPicker({ views, activeId, onSelect, label }) {
  const buttons = useRef([])

  const onKeyDown = (event, index) => {
    const keys = ['ArrowRight', 'ArrowDown', 'ArrowLeft', 'ArrowUp', 'Home', 'End']
    if (!keys.includes(event.key)) return
    event.preventDefault()
    let next = index
    if (event.key === 'ArrowRight' || event.key === 'ArrowDown') {
      next = (index + 1) % views.length
    } else if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') {
      next = (index - 1 + views.length) % views.length
    } else if (event.key === 'Home') {
      next = 0
    } else if (event.key === 'End') {
      next = views.length - 1
    }
    onSelect(views[next].id)
    buttons.current[next]?.focus()
  }

  return (
    <div className="views" role="radiogroup" aria-label={label}>
      {views.map((view, index) => {
        const active = view.id === activeId
        return (
          <button
            key={view.id}
            ref={(element) => {
              buttons.current[index] = element
            }}
            type="button"
            role="radio"
            aria-checked={active}
            tabIndex={active ? 0 : -1}
            className={`view-chip ${active ? 'is-active' : ''}`}
            onClick={() => onSelect(view.id)}
            onKeyDown={(event) => onKeyDown(event, index)}
          >
            <span className="view-chip__index" aria-hidden="true">
              0{index + 1}
            </span>
            <span className="view-chip__label">{view.label}</span>
            <span className="view-chip__tick" aria-hidden="true" />
          </button>
        )
      })}
    </div>
  )
}
