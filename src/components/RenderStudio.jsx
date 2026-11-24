import { Suspense } from 'react'
import { BIKE, CAR } from '../config/vehicles'
import { VehicleCanvas } from '../scenes/lazy'

/**
 * Development-only capture view used to produce the studio stills that back
 * the hero, gallery and no-WebGL fallbacks. Not linked from the site.
 */
export function RenderStudio() {
  const params = new URLSearchParams(window.location.search)
  const vehicle = params.get('render') === 'bike' ? BIKE : CAR
  const paint =
    vehicle.paints.find((item) => item.id === params.get('paint')) ??
    vehicle.paints.find((item) => item.id === vehicle.defaultPaint) ??
    vehicle.paints[0]
  const view = params.get('view') ?? 'hero'
  const camera =
    view === 'hero'
      ? vehicle.heroCamera
      : vehicle.presets.find((item) => item.id === view)?.camera ??
        vehicle.chapters.find((item) => item.id === view)?.camera ??
        vehicle.heroCamera

  return (
    <div className="render-studio">
      <Suspense fallback={null}>
        <VehicleCanvas
          vehicle={vehicle}
          paint={paint}
          still={camera}
          active
          quality="high"
          onReady={() => {
            window.setTimeout(() => {
              document.documentElement.dataset.renderReady = 'true'
            }, 600)
          }}
        />
      </Suspense>
    </div>
  )
}
