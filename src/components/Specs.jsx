import { useId, useState } from 'react'
import { motion } from 'framer-motion'
import { BIKE, CAR } from '../config/vehicles'
import { SectionHead } from './ui/SectionHead'
import { Reveal } from './ui/Reveal'
import { EASE } from '../lib/motion'

const TABS = [
  { id: 'car', label: 'VX-01', kind: 'Automobile', vehicle: CAR },
  { id: 'bike', label: 'R-01', kind: 'Superbike', vehicle: BIKE },
]

function groupSpecs(specs) {
  const groups = new Map()
  for (const spec of specs) {
    if (!groups.has(spec.group)) groups.set(spec.group, [])
    groups.get(spec.group).push(spec)
  }
  return [...groups.entries()]
}

export function Specs() {
  const [active, setActive] = useState('car')
  const baseId = useId()
  const vehicle = TABS.find((tab) => tab.id === active)?.vehicle ?? CAR
  const groups = groupSpecs(vehicle.specs)

  const onKeyDown = (event) => {
    if (event.key !== 'ArrowRight' && event.key !== 'ArrowLeft') return
    event.preventDefault()
    const index = TABS.findIndex((tab) => tab.id === active)
    const next =
      event.key === 'ArrowRight'
        ? (index + 1) % TABS.length
        : (index - 1 + TABS.length) % TABS.length
    setActive(TABS[next].id)
    document.getElementById(`${baseId}-tab-${TABS[next].id}`)?.focus()
  }

  return (
    <section className="specs section" id="engineering">
      <div className="container">
        <div className="specs__top">
          <Reveal>
            <SectionHead
              index="05"
              label="Engineering"
              title="Two machines, one set of rules."
              text="Every figure below is a concept target for a design study. They are stated plainly, because a concept should be able to explain itself."
            />
          </Reveal>

          <Reveal className="specs__switch" delay={0.06}>
            <div
              className="tabs"
              role="tablist"
              aria-label="Choose a vehicle"
              onKeyDown={onKeyDown}
            >
              {TABS.map((tab) => (
                <button
                  key={tab.id}
                  id={`${baseId}-tab-${tab.id}`}
                  type="button"
                  role="tab"
                  aria-selected={active === tab.id}
                  aria-controls={`${baseId}-panel-${tab.id}`}
                  tabIndex={active === tab.id ? 0 : -1}
                  className={`tab ${active === tab.id ? 'is-active' : ''}`}
                  onClick={() => setActive(tab.id)}
                >
                  <span className="tab__name">{tab.label}</span>
                  <span className="tab__kind">{tab.kind}</span>
                </button>
              ))}
            </div>
          </Reveal>
        </div>

        <motion.div
          className="specs__panel"
          role="tabpanel"
          id={`${baseId}-panel-${active}`}
          aria-labelledby={`${baseId}-tab-${active}`}
          key={active}
          initial="hidden"
          animate="show"
          variants={{
            hidden: { opacity: 0, y: 14 },
            show: {
              opacity: 1,
              y: 0,
              transition: { duration: 0.5, ease: EASE, staggerChildren: 0.035 },
            },
          }}
        >
          <div className="specs__heading">
            <h3>{vehicle.fullName}</h3>
            <p>
              {vehicle.kind} · {vehicle.year}
            </p>
          </div>

          <div className="specs__groups">
            {groups.map(([group, items]) => (
              <motion.div
                className="specs__group"
                key={group}
                variants={{
                  hidden: { opacity: 0, y: 12 },
                  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: EASE } },
                }}
              >
                <h4 className="specs__group-title">{group}</h4>
                <dl className="specs__list">
                  {items.map((item) => (
                    <motion.div
                      className="specs__row"
                      key={`${group}-${item.label}`}
                      variants={{
                        hidden: { opacity: 0, x: -8 },
                        show: {
                          opacity: 1,
                          x: 0,
                          transition: { duration: 0.4, ease: EASE },
                        },
                      }}
                    >
                      <dt>{item.label}</dt>
                      <dd>{item.value}</dd>
                    </motion.div>
                  ))}
                </dl>
              </motion.div>
            ))}
          </div>

          <p className="specs__disclaimer">
            Concept targets only. NOVARIS is a fictional marque and these vehicles do
            not represent a production programme.
          </p>
        </motion.div>
      </div>
    </section>
  )
}
