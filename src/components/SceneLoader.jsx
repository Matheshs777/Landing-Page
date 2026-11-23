export function SceneLoader({ label = 'Loading product' }) {
  return (
    <div className="scene-loader" role="status" aria-label={label}>
      <span className="scene-loader__ring" aria-hidden="true" />
      <span className="scene-loader__dot" aria-hidden="true" />
      <span className="scene-loader__label">{label}</span>
    </div>
  )
}
