import { BIKE } from '../config/vehicles'
import { useConfigurator } from '../hooks/ConfiguratorContext'
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
  const { bikePaint, setBikePaintId } = useConfigurator()

  return (
    <section id="superbike" className="vehicle-block">
      <VehicleIntro vehicle={BIKE} number="02" facts={FACTS} />
      <Stage vehicle={BIKE} paint={bikePaint} />

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
        paint={bikePaint}
        onSelect={setBikePaintId}
        title="Six finishes. One purpose."
        lead="The R-01 is presented exactly as supplied, or in one of five NOVARIS finishes. Each keeps the same mechanical hardware and structural parts, so the livery never argues with the engineering."
        note="Paint updates the fairing and wheel accents only. Engine castings, frame, brakes, tyres and lamps are untouched."
      />
    </section>
  )
}
