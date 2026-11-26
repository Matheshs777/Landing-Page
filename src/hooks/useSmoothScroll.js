import { useEffect } from 'react'
import Lenis from 'lenis'
import { gsap, ScrollTrigger } from '../lib/gsap'
import { usePrefersReducedMotion } from './usePrefersReducedMotion'

/**
 * Lenis smooth scrolling, driven by GSAP's ticker so ScrollTrigger and the
 * camera rigs stay in sync. Disabled entirely under reduced motion, where the
 * browser's native scrolling is the correct behaviour.
 */
export function useSmoothScroll() {
  const reduced = usePrefersReducedMotion()

  useEffect(() => {
    if (reduced) return undefined

    const lenis = new Lenis({
      duration: 1.05,
      smoothWheel: true,
      wheelMultiplier: 0.9,
      touchMultiplier: 1.1,
      syncTouch: false,
    })

    const onScroll = () => ScrollTrigger.update()
    lenis.on('scroll', onScroll)

    const tick = (time) => lenis.raf(time * 1000)
    gsap.ticker.add(tick)
    gsap.ticker.lagSmoothing(0)

    const onClick = (event) => {
      const anchor = event.target.closest?.('a[href^="#"]')
      if (!anchor) return
      const hash = anchor.getAttribute('href')
      if (!hash || hash === '#') return
      const target = document.querySelector(hash)
      if (!target) return
      event.preventDefault()
      lenis.scrollTo(target, { offset: -72 })
    }
    document.addEventListener('click', onClick)

    window.__lenis = lenis
    ScrollTrigger.refresh()

    return () => {
      document.removeEventListener('click', onClick)
      gsap.ticker.remove(tick)
      lenis.off('scroll', onScroll)
      lenis.destroy()
      delete window.__lenis
    }
  }, [reduced])
}

/** Scroll to the top on route changes, or to the hash target on first load. */
export function scrollToRoute(location) {
  const lenis = window.__lenis
  if (location.hash) {
    const target = document.querySelector(location.hash)
    if (target) {
      if (lenis) lenis.scrollTo(target, { offset: -72, immediate: true })
      else target.scrollIntoView()
      return
    }
  }
  if (lenis) lenis.scrollTo(0, { immediate: true })
  else window.scrollTo(0, 0)
}
