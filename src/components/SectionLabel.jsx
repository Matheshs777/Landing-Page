export function SectionLabel({ children, index }) {
  return (
    <div className="section-label">
      <span className="section-label__dot" aria-hidden="true" />
      <span>{children}</span>
      {index ? <span className="section-label__index">{index}</span> : null}
    </div>
  )
}
