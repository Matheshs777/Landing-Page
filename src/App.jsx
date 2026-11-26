import { useEffect } from 'react'
import { BrowserRouter, Route, Routes, useLocation } from 'react-router-dom'
import { Nav } from './components/Nav'
import { Footer } from './components/Footer'
import { CookieConsent } from './components/CookieConsent'
import { AppErrorBoundary } from './components/AppErrorBoundary'
import { ConsentProvider } from './hooks/useConsent'
import { useSmoothScroll, scrollToRoute } from './hooks/useSmoothScroll'
import { ScrollTrigger } from './lib/gsap'
import { HomePage } from './pages/HomePage'
import { Privacy } from './pages/Privacy'
import { Cookies } from './pages/Cookies'
import { Credits } from './pages/Credits'
import { NotFound } from './pages/NotFound'

function ScrollManager() {
  const location = useLocation()

  useEffect(() => {
    scrollToRoute(location)
    const timer = window.setTimeout(() => ScrollTrigger.refresh(), 220)
    return () => window.clearTimeout(timer)
  }, [location])

  return null
}

export default function App() {
  useSmoothScroll()

  useEffect(() => {
    const refresh = () => ScrollTrigger.refresh()
    document.fonts?.ready.then(refresh)
    window.addEventListener('load', refresh)
    return () => window.removeEventListener('load', refresh)
  }, [])

  return (
    <ConsentProvider>
      <BrowserRouter>
        <a className="skip-link" href="#main">
          Skip to content
        </a>
        <ScrollManager />
        <AppErrorBoundary>
          <Nav />
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/privacy" element={<Privacy />} />
            <Route path="/cookies" element={<Cookies />} />
            <Route path="/credits" element={<Credits />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
          <Footer />
        </AppErrorBoundary>
        <CookieConsent />
      </BrowserRouter>
    </ConsentProvider>
  )
}
