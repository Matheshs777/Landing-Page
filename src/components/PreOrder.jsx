import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { SectionLabel } from './SectionLabel'
import { Reveal } from './Reveal'
import { EASE } from '../lib/motion'

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/

export function PreOrder() {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState('idle')
  const [message, setMessage] = useState('')
  const [shake, setShake] = useState(false)
  const inputRef = useRef(null)
  const submitTimer = useRef(0)
  const shakeTimer = useRef(0)

  useEffect(
    () => () => {
      window.clearTimeout(submitTimer.current)
      window.clearTimeout(shakeTimer.current)
    },
    [],
  )

  const triggerShake = () => {
    setShake(false)
    window.clearTimeout(shakeTimer.current)
    window.requestAnimationFrame(() => {
      setShake(true)
      shakeTimer.current = window.setTimeout(() => setShake(false), 380)
    })
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    if (status === 'loading') return

    const value = email.trim()
    if (!EMAIL_PATTERN.test(value)) {
      setStatus('error')
      setMessage("That email doesn't look right. Try again.")
      triggerShake()
      window.requestAnimationFrame(() => inputRef.current?.focus())
      return
    }

    setStatus('loading')
    setMessage('')
    window.clearTimeout(submitTimer.current)
    submitTimer.current = window.setTimeout(() => {
      setStatus('success')
    }, 1100)
  }

  const reset = () => {
    setStatus('idle')
    setMessage('')
    setEmail('')
    window.requestAnimationFrame(() => inputRef.current?.focus())
  }

  const loading = status === 'loading'

  return (
    <section className="preorder" id="preorder" aria-labelledby="preorder-title">
      <div className="container">
        <Reveal className="preorder__panel">
          <div className="preorder__copy">
            <SectionLabel index="06">Pre-order</SectionLabel>
            <h2 className="preorder__title" id="preorder-title">
              The first 1,000 pairs ship in March.
            </h2>
            <p className="preorder__text">
              Reserve yours with your email. We'll send a payment link when your pair
              is ready to ship.
            </p>
            <p className="preorder__fineprint">
              <span className="preorder__fineprint-dot" aria-hidden="true" />
              A fictional product concept, built as an interface demo.
            </p>
          </div>

          <div className="preorder__form-wrap">
            {status === 'success' ? (
              <motion.div
                className="preorder__success"
                role="status"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, ease: EASE }}
              >
                <svg className="preorder__check" viewBox="0 0 32 32" aria-hidden="true">
                  <circle
                    cx="16"
                    cy="16"
                    r="15"
                    fill="none"
                    stroke="currentColor"
                    strokeOpacity=".3"
                  />
                  <path
                    className="preorder__check-path"
                    d="M9 16.6l4.5 4.5L23 11.4"
                    pathLength="1"
                  />
                </svg>
                <div>
                  <p className="preorder__success-title">
                    You're in. Check your inbox for the next step.
                  </p>
                  <p className="preorder__success-note">
                    Demo only — no email was sent and no payment has been taken.
                  </p>
                </div>
                <button type="button" className="preorder__reset" onClick={reset}>
                  Reserve another email
                </button>
              </motion.div>
            ) : (
              <form
                className={`preorder__form ${shake ? 'is-shaking' : ''} ${
                  status === 'error' ? 'is-error' : ''
                }`}
                onSubmit={handleSubmit}
                noValidate
                aria-busy={loading}
              >
                <label className="preorder__label" htmlFor="preorder-email">
                  Email address
                </label>
                <div className="preorder__row">
                  <input
                    ref={inputRef}
                    id="preorder-email"
                    className="preorder__input"
                    type="email"
                    name="email"
                    value={email}
                    onChange={(event) => {
                      setEmail(event.target.value)
                      if (status === 'error') {
                        setStatus('idle')
                        setMessage('')
                      }
                    }}
                    placeholder="you@example.com"
                    autoComplete="email"
                    inputMode="email"
                    aria-invalid={status === 'error'}
                    aria-describedby="preorder-status"
                    required
                  />
                  <button
                    type="submit"
                    className="btn btn--primary preorder__submit"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <span className="preorder__spinner" aria-hidden="true" />
                        Reserving…
                      </>
                    ) : (
                      'Reserve my pair'
                    )}
                  </button>
                </div>
                <p
                  className="preorder__status"
                  id="preorder-status"
                  role="status"
                  aria-live="polite"
                >
                  {message}
                </p>
                <p className="preorder__small">
                  One email at launch. No card details. This demo stores nothing.
                </p>
              </form>
            )}
          </div>
        </Reveal>
      </div>
    </section>
  )
}
