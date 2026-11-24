export function SectionHead({ index, label, title, text, align = 'left', className = '' }) {
  return (
    <header className={`section-head section-head--${align} ${className}`}>
      <p className="section-head__label">
        {index ? <span className="section-head__index">{index}</span> : null}
        <span>{label}</span>
      </p>
      <h2 className="section-head__title">{title}</h2>
      {text ? <p className="section-head__text">{text}</p> : null}
    </header>
  )
}
