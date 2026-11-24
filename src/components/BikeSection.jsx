import { BIKE } from '../config/vehicles'
import { useConfigurator } from '../hooks/ConfiguratorContext'
import { VehicleIntro } from './VehicleIntro'
import { Stage } from './Stage'
import { StatBand } from './StatBand'
import { Configurator } from './Configurator'

const FACTS = [
  { label: 'Capacity', value: '999 cc inline-four' },
  { label: 'Output', value: '214 hp target' },
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
        text="A stressed-member inline four, a short side silencer and a tail that ends where the seat ends. The R-01 is designed to be understood at a glance, then rewarded on the second look."
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
        title="Five paints. One purpose."
        lead="The R-01 is offered in five finishes. Each keeps the black secondary panel and the same mechanical hardware, so the livery never argues with the engineering."
        note="Paint updates the fairing panels only. The black secondary panel is intentional and stays fixed. Engine castings, frame, brakes, tyres and lamps are untouched."
      />
    </section>
  )
}
