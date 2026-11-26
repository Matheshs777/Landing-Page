import { LegalPage } from '../components/legal/LegalPage'
import { useConsent } from '../hooks/useConsent'

export function Cookies() {
  const { openSettings, choice } = useConsent()

  return (
    <LegalPage
      eyebrow="Legal"
      title="Cookie Policy"
      intro="A short list, because this site uses very little storage."
      updated="26 November 2026"
    >
      <h2>What is stored</h2>
      <p>
        This site does not use advertising or cross-site tracking cookies. It stores
        one local-storage key, <code>novaris.consent.v1</code>, containing your consent
        choice. That entry is essential to respect your decision.
      </p>

      <table className="legal__table">
        <thead>
          <tr>
            <th scope="col">Name</th>
            <th scope="col">Type</th>
            <th scope="col">Purpose</th>
            <th scope="col">Duration</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>
              <code>novaris.consent.v1</code>
            </td>
            <td>Local storage, essential</td>
            <td>Remembers your consent categories</td>
            <td>Until cleared</td>
          </tr>
          <tr>
            <td>
              <code>__novarisAnalytics</code>
            </td>
            <td>In-memory flag, optional</td>
            <td>Marks that analytics consent was given</td>
            <td>This visit</td>
          </tr>
        </tbody>
      </table>

      <h2>Analytics and preferences</h2>
      <p>
        Both categories are off by default. In this build the analytics hook is a
        placeholder that sends nothing off-device; it exists so the consent flow is
        real rather than decorative.
      </p>

      <h2>Managing your choice</h2>
      <p>
        Your current choice:{' '}
        <strong>
          {choice
            ? `analytics ${choice.analytics ? 'on' : 'off'}, preferences ${
                choice.preferences ? 'on' : 'off'
              }`
            : 'not set'}
        </strong>
        .
      </p>
      <p>
        <button type="button" className="btn btn--ghost" onClick={openSettings}>
          Open cookie settings
        </button>
      </p>
      <p>
        You can also block or delete storage in your browser settings. Essential
        storage is only used to remember this choice, so the site continues to work
        without it.
      </p>
    </LegalPage>
  )
}
