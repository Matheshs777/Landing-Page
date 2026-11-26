import { LegalPage } from '../components/legal/LegalPage'

export function Credits() {
  return (
    <LegalPage
      eyebrow="Legal"
      title="Asset Credits"
      intro="The models, licences and imagery behind the NOVARIS concept studies."
      updated="26 November 2026"
    >
      <h2>Vehicle models</h2>
      <p>
        Both vehicles are third-party glTF assets, supplied for this study and served
        locally. They are rendered with their original materials; no livery, texture
        or colour is overridden anywhere on the site.
      </p>

      <table className="legal__table">
        <thead>
          <tr>
            <th scope="col">Asset</th>
            <th scope="col">Creator</th>
            <th scope="col">Licence</th>
            <th scope="col">Source</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>
              <strong>2024 Porsche 992 GT3 R</strong>
              <br />
              VX-01 study
            </td>
            <td>Dave Love (Tyler_Dave)</td>
            <td>
              <a
                href="https://creativecommons.org/licenses/by/4.0/"
                target="_blank"
                rel="noreferrer noopener"
              >
                CC BY 4.0
              </a>
            </td>
            <td>
              <a
                href="https://sketchfab.com/3d-models/2024-porsche-992-gt3-r-b76c9b2ae2d548c3869426eac4ab8a19"
                target="_blank"
                rel="noreferrer noopener"
              >
                Sketchfab
              </a>
            </td>
          </tr>
          <tr>
            <td>
              <strong>Sports Bike</strong>
              <br />
              R-01 study
            </td>
            <td>Futurealiti</td>
            <td>
              <a
                href="https://creativecommons.org/licenses/by/4.0/"
                target="_blank"
                rel="noreferrer noopener"
              >
                CC BY 4.0
              </a>
            </td>
            <td>
              <a
                href="https://sketchfab.com/3d-models/sports-bike-a80259b859c842d5824c25c61e0fc421"
                target="_blank"
                rel="noreferrer noopener"
              >
                Sketchfab
              </a>
            </td>
          </tr>
        </tbody>
      </table>

      <h2>Attribution</h2>
      <p>
        CC BY 4.0 requires credit to the creator, a link to the licence, and an
        indication of any changes. This page provides the credit and links. The models
        were compressed for delivery (Draco geometry, WebP textures) and uniformly
        scaled at runtime to their stated real-world length; no surface or material
        was altered.
      </p>

      <h2>Trademarks and livery</h2>
      <p>
        The CC BY 4.0 licence covers the model author's copyright. It does not grant
        rights to the real-world trademarks visible in the livery. The VX-01 model
        carries Porsche, Manthey, DHL, Goodyear, Pirelli and E-TECH marks; the R-01
        model carries manufacturer and sponsor marks of its own.
      </p>
      <p>
        NOVARIS is fictional and is not associated with any of those companies. This
        build is a non-commercial design study. Before any public or commercial launch,
        one of the following is required:
      </p>
      <ul>
        <li>clear the trademarks with the rights holders, or</li>
        <li>
          replace the livery texture with a neutral one while keeping the model's body
          colour and geometry, or
        </li>
        <li>remove the logo decals and keep the base paint, subject to the licence.</li>
      </ul>
      <p>
        Per the brief for this pass, the model is presented unmodified and the issue is
        documented rather than silently edited.
      </p>

      <h2>Imagery</h2>
      <p>
        Every vehicle view on the site is rendered live in the browser from these two
        files. There is no third-party vehicle photography. The social-sharing image is
        a placeholder render from the same studio.
      </p>

      <h2>Typography and software</h2>
      <ul>
        <li>Bodoni Moda — SIL Open Font License 1.1, via Google Fonts.</li>
        <li>Inter Tight — SIL Open Font License 1.1, via Google Fonts.</li>
        <li>three.js, React Three Fiber, drei — MIT licence.</li>
        <li>GSAP, Framer Motion, Lenis — their respective licences.</li>
      </ul>
    </LegalPage>
  )
}
