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
  return (
    <section id="superbike" className="vehicle-block">
      <VehicleIntro vehicle={BIKE} number="02" facts={FACTS} />
      <Stage vehicle={BIKE} />

      <StatBand
        index="05"
        label="Motorcycle engineering"
        title="Everything visible. Nothing wasted."
        text="A stressed-member 90° V-twin, a short side silencer and a tail that ends where the seat ends. The R-01 is designed to be understood at a glance, then rewarded on the second look."
        image="/images/bike-engine.webp"
        alt="Engine, frame spar and exhaust detail of the R-01 superbike."
        stats={BIKE.stats}
        footnote="R-01 concept targets. Not measured production figures."
      />

      <Configurator
        id="bike-configurator"
        index="06"
        vehicle={BIKE}
        title="Original model finish."
        lead="The R-01 keeps the colors and materials authored in its 3D model in every view."
        note="Fairing, engine, frame, brakes and lamps are shown as supplied."
      />
    </section>
  )
}
