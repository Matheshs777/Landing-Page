import { useEffect } from 'react'
import { ConfiguratorProvider } from './hooks/ConfiguratorContext'
import { Nav } from './components/Nav'
import { Hero } from './components/Hero'
import { Ticker } from './components/ui/Ticker'
import { BrandIntro } from './components/BrandIntro'
import { CarSection } from './components/CarSection'
import { BikeSection } from './components/BikeSection'
import { Specs } from './components/Specs'
import { Gallery } from './components/Gallery'
import { Philosophy } from './components/Philosophy'
import { Finale } from './components/Finale'
import { Footer } from './components/Footer'
import { RenderStudio } from './components/RenderStudio'
import { ScrollTrigger } from './lib/gsap'

const isRenderView =
  import.meta.env.DEV &&
  typeof window !== 'undefined' &&
  new URLSearchParams(window.location.search).has('render')

export default function App() {
  useEffect(() => {
    if (isRenderView) return undefined
    ScrollTrigger.config({ ignoreMobileResize: true })
    const refresh = () => ScrollTrigger.refresh()
    document.fonts?.ready.then(refresh)
    window.addEventListener('load', refresh)
    return () => window.removeEventListener('load', refresh)
  }, [])

  if (isRenderView) return <RenderStudio />

  return (
    <ConfiguratorProvider>
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <Nav />
      <main id="main">
        <Hero />
        <Ticker />
        <BrandIntro />
        <CarSection />
        <BikeSection />
        <Specs />
        <Gallery />
        <Philosophy />
        <Finale />
      </main>
      <Footer />
    </ConfiguratorProvider>
  )
}
