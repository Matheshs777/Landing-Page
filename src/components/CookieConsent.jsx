import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { useConsent } from '../hooks/useConsent'
import { EASE } from '../lib/motion'

/**
 * GDPR-style consent banner. Nothing non-essential runs until a choice is
 * stored; "Customize" exposes the individual categories.
 */
export function CookieConsent() {
  const { open, choice, save, closeSettings } = useConsent()
  const [customizing, setCustomizing] = useState(false)
  const [draft, setDraft] = useState({
    analytics: choice?.analytics ?? false,
    preferences: choice?.preferences ?? false,
  })

  const acceptAll = () => save({ analytics: true, preferences: true })
  const essentialOnly = () => save({ analytics: false, preferences: false })

  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          className="consent"
          role="dialog"
          aria-modal="false"
          aria-labelledby="consent-title"
          aria-describedby="consent-text"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 24 }}
          transition={{ duration: 0.45, ease: EASE }}
        >
          <div className="consent__inner">
            <div className="consent__copy">
              <p className="eyebrow" id="consent-title">
                Your privacy
              </p>
              <p id="consent-text">
                We use essential storage to remember this choice. Optional analytics
                stay off until you allow them. No advertising cookies are used on this
                concept site.
              </p>
            </div>

            {customizing ? (
              <div className="consent__options">
                <label className="consent__option">
                  <input type="checkbox" checked disabled />
                  <span>
                    <strong>Essential</strong>
                    <em>Required for the site to work. Always on.</em>
                  </span>
                </label>
                <label className="consent__option">
                  <input
                    type="checkbox"
                    checked={draft.analytics}
                    onChange={(event) =>
                      setDraft((current) => ({
                        ...current,
                        analytics: event.target.checked,
                      }))
                    }
                  />
                  <span>
                    <strong>Analytics</strong>
                    <em>Anonymous page-view counts. Off by default.</em>
                  </span>
                </label>
                <label className="consent__option">
                  <input
                    type="checkbox"
                    checked={draft.preferences}
                    onChange={(event) =>
                      setDraft((current) => ({
                        ...current,
                        preferences: event.target.checked,
                      }))
                    }
                  />
                  <span>
                    <strong>Preferences</strong>
                    <em>Remember viewing choices between visits.</em>
                  </span>
                </label>
              </div>
            ) : null}

            <div className="consent__actions">
              {customizing ? (
                <>
                  <button
                    type="button"
                    className="btn btn--solid"
                    onClick={() => save(draft)}
                  >
                    Save choices
                  </button>
                  <button
                    type="button"
                    className="btn btn--ghost"
                    onClick={() => setCustomizing(false)}
                  >
                    Back
                  </button>
                </>
              ) : (
                <>
                  <button type="button" className="btn btn--solid" onClick={acceptAll}>
                    Accept all
                  </button>
                  <button
                    type="button"
                    className="btn btn--ghost"
                    onClick={essentialOnly}
                  >
                    Essential only
                  </button>
                  <button
                    type="button"
                    className="btn btn--text"
                    onClick={() => setCustomizing(true)}
                  >
                    Customize
                  </button>
                </>
              )}
              <button
                type="button"
                className="consent__close"
                aria-label="Close consent banner"
                onClick={closeSettings}
              >
                ×
              </button>
            </div>
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  )
}
