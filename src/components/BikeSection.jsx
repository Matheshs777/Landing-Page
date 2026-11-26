import { useState } from 'react'
import { BIKE } from '../config/vehicles'
import { VehicleIntro } from './VehicleIntro'
import { Stage } from './Stage'
import { StatBand } from './StatBand'
import { Configurator } from './Configurator'

const FACTS = [
  { label: 'Capacity', value: '1,198 cc V-twin' },
  { label: 'Output', value: '200 hp target' },
  { label: 'Status', value: 'Concept study' },
]

export function BikeSection() {
  const [viewId, setViewId] = useState('three-quarter')

  return (
    <section id="superbike" className="vehicle-block">
      <VehicleIntro vehicle={BIKE} number="02" facts={FACTS} />
      <Stage vehicle={BIKE} />

      <StatBand
        index="05"
        label="Motorcycle engineering"
        title="Everything visible. Nothing wasted."
        text="A stressed-member 90° V-twin, a short side silencer and a tail that ends where the seat ends. The R-01 is designed to be understood at a glance, then rewarded on the second look."
        viewerId="r01"
        view="engineering"
        mediaLabel="Engine, frame spar and exhaust detail of the R-01 superbike."
        stats={BIKE.stats}
        footnote="R-01 concept targets. Not measured production figures."
      />

      <Configurator
        id="bike-configurator"
        index="06"
        vehicle={BIKE}
        viewId={viewId}
        onSelect={setViewId}
        title="Original finish. Five views."
        lead="The R-01 is shown exactly as the model was authored. The fairing, rims, engine castings and hardware render from the file's own materials."
        note="No material is overridden anywhere on this site. Paint, chrome, rubber and glass come straight from the GLB."
      />
    </section>
  )
}
