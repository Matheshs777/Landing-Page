import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { useActiveSection } from '../hooks/useActiveSection'
import { EASE } from '../lib/motion'

const NAV_ITEMS = [
  { id: 'features', label: 'Features' },
  { id: 'sound', label: 'Sound' },
  { id: 'specs', label: 'Specs' },
  { id: 'preorder', label: 'Pre-order' },
]

export function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const active = useActiveSection(['features', 'sound', 'specs', 'preorder'])

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

  useEffect(() => {
    if (!open) return undefined
    const onKey = (event) => {
      if (event.key === 'Escape') setOpen(false)
    }
    const onResize = () => {
      if (window.innerWidth >= 980) setOpen(false)
    }
    window.addEventListener('keydown', onKey)
    window.addEventListener('resize', onResize)
    return () => {
      window.removeEventListener('keydown', onKey)
      window.removeEventListener('resize', onResize)
    }
  }, [open])

  const close = () => setOpen(false)

  return (
    <header className={`nav ${scrolled ? 'is-scrolled' : ''} ${open ? 'is-open' : ''}`}>
      <div className="nav__inner">
        <a className="nav__brand" href="#top" aria-label="PULSAR home" onClick={close}>
          PULSAR<span className="nav__brand-dot" aria-hidden="true" />
        </a>

        <nav className="nav__links" aria-label="Primary">
          {NAV_ITEMS.slice(0, 3).map((item) => (
            <a
              key={item.id}
              href={`#${item.id}`}
              className={`nav__link ${active === item.id ? 'is-active' : ''}`}
              aria-current={active === item.id ? 'location' : undefined}
            >
              {item.label}
            </a>
          ))}
        </nav>

        <a className="btn btn--primary btn--small nav__cta" href="#preorder">
          Pre-order
          <span className="btn__price">$89</span>
        </a>

        <button
          type="button"
          className={`nav__toggle ${open ? 'is-open' : ''}`}
          aria-label={open ? 'Close menu' : 'Open menu'}
          aria-expanded={open}
          aria-controls="mobile-menu"
          onClick={() => setOpen((value) => !value)}
        >
          <span />
          <span />
        </button>
      </div>

      <AnimatePresence>
        {open ? (
          <motion.div
            id="mobile-menu"
            className="nav__mobile"
            initial={{ opacity: 0, y: -14 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -14 }}
            transition={{ duration: 0.3, ease: EASE }}
          >
            <nav aria-label="Mobile">
              {NAV_ITEMS.map((item, index) => (
                <motion.a
                  key={item.id}
                  href={`#${item.id}`}
                  className={`nav__mobile-link ${active === item.id ? 'is-active' : ''}`}
                  aria-current={active === item.id ? 'location' : undefined}
                  onClick={close}
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.04 * index, duration: 0.34, ease: EASE }}
                >
                  <span className="nav__mobile-index">0{index + 1}</span>
                  {item.label}
                </motion.a>
              ))}
            </nav>
            <a className="btn btn--primary nav__mobile-cta" href="#preorder" onClick={close}>
              Pre-order for $89
            </a>
            <p className="nav__mobile-note">
              <span className="nav__mobile-dot" aria-hidden="true" />
              First batch: 1,000 pairs.
            </p>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </header>
  )
}
