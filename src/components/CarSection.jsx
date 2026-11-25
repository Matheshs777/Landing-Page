import { CAR } from '../config/vehicles'
import { useConfigurator } from '../hooks/ConfiguratorContext'
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
  const { carPaint, setCarPaintId } = useConfigurator()

  return (
    <section id="automobile" className="vehicle-block">
      <VehicleIntro vehicle={CAR} number="01" facts={FACTS} />
      <Stage vehicle={CAR} paint={carPaint} />

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
        paint={carPaint}
        onSelect={setCarPaintId}
        title="Six paints. One body."
        lead="Every VX-01 study is finished in the same six colours. Choose a body colour; the carbon, glass, lenses and hardware stay exactly as designed."
        note="Paint updates the body panels only. Glass, wheels, brakes, lamps and interior trim are untouched, because those materials are part of the engineering, not the finish."
      />
    </section>
  )
}
