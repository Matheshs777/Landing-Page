import { ColorwayProvider } from './hooks/ColorwayContext'
import { Navbar } from './components/Navbar'
import { Hero } from './components/Hero'
import { FeatureSection } from './components/FeatureSection'
import { SoundExperience } from './components/SoundExperience'
import { Specifications } from './components/Specifications'
import { ColorSelector } from './components/ColorSelector'
import { Testimonials } from './components/Testimonials'
import { PreOrder } from './components/PreOrder'
import { Footer } from './components/Footer'

export default function App() {
  return (
    <ColorwayProvider>
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <Navbar />
      <main id="main">
        <Hero />
        <FeatureSection />
        <SoundExperience />
        <Specifications />
        <ColorSelector />
        <Testimonials />
        <PreOrder />
      </main>
      <Footer />
    </ColorwayProvider>
  )
}
