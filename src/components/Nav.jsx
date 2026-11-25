import { useEffect, useState } from 'react'
import { AnimatePresence, motion, useScroll, useSpring } from 'framer-motion'
import { BRAND } from '../config/brand'
import { useActiveSection } from '../hooks/useActiveSection'
import { useBodyScrollLock } from '../hooks/useBodyScrollLock'
import { BrandMark } from './ui/BrandMark'

const OBSERVED = [
  'home',
  'automobile',
  'superbike',
  'configurator',
  'bike-configurator',
  'engineering',
  'brand',
  'philosophy',
]

const NAV_ITEMS = BRAND.nav

export function Nav() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const active = useActiveSection(OBSERVED)
  const { scrollYProgress } = useScroll()
  const progress = useSpring(scrollYProgress, {
    stiffness: 140,
    damping: 30,
    mass: 0.25,
  })
  useBodyScrollLock(open)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    if (!open) return undefined
    const onKey = (event) => {
      if (event.key === 'Escape') setOpen(false)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  const activeId =
    active === 'bike-configurator'
      ? 'configurator'
      : active === 'philosophy'
        ? 'brand'
        : active

  return (
    <>
      <header className={`nav ${scrolled || open ? 'nav--solid' : ''}`}>
        <div className="nav__inner">
          <a className="nav__brand" href="#home" aria-label="NOVARIS, back to top">
            <BrandMark height={24} />
            <span className="nav__wordmark">{BRAND.name}</span>
          </a>

          <nav className="nav__links" aria-label="Primary">
            {NAV_ITEMS.map((item) => (
              <a
                key={item.id}
                className={`nav__link ${activeId === item.id ? 'is-active' : ''}`}
                href={item.href}
                aria-current={activeId === item.id ? 'true' : undefined}
              >
                {item.label}
              </a>
            ))}
          </nav>

          <div className="nav__aside">
            <a className="nav__cta" href="#footer">
              Enquire
              <span aria-hidden="true">↗</span>
            </a>
            <button
              type="button"
              className="nav__toggle"
              aria-expanded={open}
              aria-controls="mobile-menu"
              aria-label={open ? 'Close menu' : 'Open menu'}
              onClick={() => setOpen((value) => !value)}
            >
              <span className="nav__toggle-line" />
              <span className="nav__toggle-line" />
            </button>
          </div>
        </div>
        <div className="nav__rule" aria-hidden="true" />
        <motion.span
          className="nav__progress"
          style={{ scaleX: progress }}
          aria-hidden="true"
        />
      </header>

      <AnimatePresence>
        {open ? (
          <motion.div
            id="mobile-menu"
            className="menu"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          >
            <nav className="menu__nav" aria-label="Mobile">
              {NAV_ITEMS.map((item, index) => (
                <motion.a
                  key={item.id}
                  href={item.href}
                  className={`menu__link ${activeId === item.id ? 'is-active' : ''}`}
                  onClick={() => setOpen(false)}
                  initial={{ opacity: 0, y: 18 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.06 + index * 0.05, duration: 0.5 }}
                >
                  <span className="menu__index">0{index + 1}</span>
                  {item.label}
                </motion.a>
              ))}
            </nav>
            <div className="menu__foot">
              <p>{BRAND.contact.location}</p>
              <a href={`mailto:${BRAND.contact.email}`}>{BRAND.contact.email}</a>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  )
}
