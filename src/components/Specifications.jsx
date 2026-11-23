import { SectionLabel } from './SectionLabel'
import { Reveal } from './Reveal'

const STATS = [
  ['42 h', 'Total battery'],
  ['38 dB', 'ANC depth'],
  ['45 ms', 'Game latency'],
  ['4.6 g', 'Per bud'],
]

const SPECS = [
  ['Drivers', '11 mm dynamic'],
  ['ANC', 'Hybrid, up to 38 dB'],
  ['Battery', '9h + 33h case'],
  ['Charging', 'USB-C, 10 min = 2h'],
  ['Latency', '45 ms game mode'],
  ['Water resistance', 'IPX4'],
  ['Bluetooth', '5.3'],
  ['Weight', '4.6g per bud'],
]

export function Specifications() {
  return (
    <section className="specs" id="specs" aria-labelledby="specs-title">
      <div className="container">
        <Reveal className="section-head">
          <div>
            <SectionLabel index="03">Specifications</SectionLabel>
            <h2 className="section-head__title" id="specs-title">
              The numbers.
            </h2>
          </div>
          <p className="section-head__text">
            Manufacturer ratings. ANC on, volume at 60%, 23°C. No lab theatre.
          </p>
        </Reveal>

        <div className="specs__stats">
          {STATS.map(([value, label]) => (
            <div className="spec-stat" key={label}>
              <span className="spec-stat__value">{value}</span>
              <span className="spec-stat__label">{label}</span>
            </div>
          ))}
        </div>

        <div className="specs__body">
          <div className="specs__intro">
            <p className="specs__note">
              Pulsar Buds One
              <br />
              Series 01 — $89
            </p>
            <p className="specs__note specs__note--muted">
              Hybrid ANC, Bluetooth 5.3 and a case that fits a coat pocket. The
              earbuds are IPX4, so sweat and light rain are fine — swimming is not.
            </p>
          </div>

          <table className="specs__table">
            <caption className="sr-only">Pulsar Buds One technical specifications</caption>
            <tbody>
              {SPECS.map(([label, value]) => (
                <tr key={label}>
                  <th scope="row">{label}</th>
                  <td>{value}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  )
}
