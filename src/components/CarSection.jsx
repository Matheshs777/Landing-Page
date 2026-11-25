import { CAR } from '../config/vehicles'
import { VehicleIntro } from './VehicleIntro'
import { Stage } from './Stage'
import { StatBand } from './StatBand'
import { Configurator } from './Configurator'

const FACTS = [
  { label: 'Layout', value: 'Rear-engine / RWD' },
  { label: 'Output', value: '565 hp target' },
  { label: 'Status', value: 'Concept study' },
]

export function CarSection() {
  return (
    <section id="automobile" className="vehicle-block">
      <VehicleIntro vehicle={CAR} number="01" facts={FACTS} />
      <Stage vehicle={CAR} />

      <StatBand
        index="02"
        label="Performance"
        title="The numbers follow the form."
        text="A naturally aspirated flat-six, a six-speed sequential gearbox and a chassis tuned around a single idea: the car should feel smaller the faster it goes. Everything below is a concept target, stated without theatre."
        image="/images/car-wheel.webp"
        alt="Forged centre-lock wheel and carbon-ceramic brake of the VX-01."
        stats={CAR.stats}
        footnote="VX-01 concept targets. Not measured production figures."
      />

      <Configurator
        id="configurator"
        index="03"
        vehicle={CAR}
        title="Original model finish."
        lead="The VX-01 keeps the colors and materials authored in its 3D model in every view."
        note="Bodywork, carbon, glass, lenses and hardware are shown as supplied."
      />
    </section>
  )
}
