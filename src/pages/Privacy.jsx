import { LegalPage } from '../components/legal/LegalPage'
import { BRAND } from '../config/brand'

export function Privacy() {
  return (
    <LegalPage
      eyebrow="Legal"
      title="Privacy Policy"
      intro="What this concept site stores, why it stores it, and how to remove it."
      updated="26 November 2026"
    >
      <h2>Who we are</h2>
      <p>
        {BRAND.legal} is a fictional design studio created for this concept study.
        There is no company behind it and no commercial service is offered. The
        contact address is illustrative.
      </p>

      <h2>What we collect</h2>
      <p>
        Nothing by default. The site has no account system, no checkout and no
        advertising. We do not ask for a name, an email address or a payment detail
        anywhere.
      </p>
      <ul>
        <li>
          <strong>Essential storage.</strong> One local-storage entry records your
          cookie choice so the banner does not reappear on every visit.
        </li>
        <li>
          <strong>Optional analytics.</strong> Only if you press “Accept all” or enable
          it under “Customize”. The placeholder analytics hook records an anonymous
          page view in memory; it sends nothing to a third party in this build.
        </li>
        <li>
          <strong>Optional preferences.</strong> Only if you enable them. These would
          remember viewing choices such as a camera angle between visits.
        </li>
      </ul>

      <h2>Hosting logs</h2>
      <p>
        A production host may keep standard server logs (IP address, user agent,
        requested URL) for security and reliability. That processing is controlled by
        the host, not by this site's code.
      </p>

      <h2>Your choices</h2>
      <p>
        Use “Cookie settings” in the footer at any time to change or withdraw consent.
        Clearing this site's data in your browser removes the stored choice and resets
        the banner. Because no analytics is active until you opt in, withdrawing
        consent stops it immediately.
      </p>

      <h2>Third parties</h2>
      <p>
        The site serves its two typefaces from its own origin. Model files and scripts
        are served from this site's own origin as well. No social embeds, trackers or
        advertising pixels are present.
      </p>

      <h2>Contact</h2>
      <p>
        Questions about this policy can be addressed to{' '}
        <a href={`mailto:${BRAND.contact.email}`}>{BRAND.contact.email}</a>. This is a
        demonstration address.
      </p>
    </LegalPage>
  )
}
