import { useState } from 'react'
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
  const [viewId, setViewId] = useState('three-quarter')

  return (
    <section id="automobile" className="vehicle-block">
      <VehicleIntro vehicle={CAR} number="01" facts={FACTS} />
      <Stage vehicle={CAR} />

      <StatBand
        index="02"
        label="Performance"
        title="The numbers follow the form."
        text="A naturally aspirated flat-six, a six-speed sequential gearbox and a chassis tuned around a single idea: the car should feel smaller the faster it goes. Everything below is a concept target, stated without theatre."
        viewerId="vx01"
        view="performance"
        mediaLabel="The VX-01 front wheel, brake and lower bodywork in the studio."
        stats={CAR.stats}
        footnote="VX-01 concept targets. Not measured production figures."
      />

      <Configurator
        id="configurator"
        index="03"
        vehicle={CAR}
        viewId={viewId}
        onSelect={setViewId}
        title="Original finish. Five views."
        lead="The VX-01 is shown exactly as the model was authored — livery, materials and surface detail included. Choose a camera, not a colour."
        note="No material is overridden anywhere on this site. Glass, carbon, rubber, lamps and interior trim render from the GLB's own textures."
      />
    </section>
  )
}
