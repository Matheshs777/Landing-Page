import { Suspense } from 'react'
import { BIKE, CAR } from '../config/vehicles'
import { VehicleCanvas } from '../scenes/lazy'

/**
 * Development-only capture view used to produce the studio stills that back
 * the hero, gallery and no-WebGL fallbacks. Not linked from the site.
 */

const CAPTURES = {
  car: {
    hero: { position: [6.9, 1.4, 5.9], target: [0, 0.52, 0] },
    brand: { position: [-4.9, 1.12, 3.1], target: [-1.1, 0.6, 0] },
    finale: { position: [-5.7, 1.5, 4.7], target: [0, 0.55, 0] },
  },
  bike: {
    hero: { position: [2.8, 1.25, 3.1], target: [0, 0.55, 0] },
    philosophy: { position: [3.3, 1.45, 3.2], target: [0, 0.56, 0] },
  },
}

export function RenderStudio() {
  const params = new URLSearchParams(window.location.search)
  const vehicle = params.get('render') === 'bike' ? BIKE : CAR
  const paint =
    vehicle.paints.find((item) => item.id === params.get('paint')) ??
    vehicle.paints.find((item) => item.id === vehicle.defaultPaint) ??
    vehicle.paints[0]
  const view = params.get('view') ?? 'hero'
  const camera =
    CAPTURES[vehicle.id]?.[view] ??
    (view === 'hero'
      ? vehicle.heroCamera
      : vehicle.presets.find((item) => item.id === view)?.camera ??
        vehicle.chapters.find((item) => item.id === view)?.camera ??
        vehicle.heroCamera)

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
