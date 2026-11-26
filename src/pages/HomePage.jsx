import { useDocumentTitle } from '../hooks/useDocumentTitle'
import { Hero } from '../components/Hero'
import { Ticker } from '../components/ui/Ticker'
import { BrandIntro } from '../components/BrandIntro'
import { CarSection } from '../components/CarSection'
import { BikeSection } from '../components/BikeSection'
import { Specs } from '../components/Specs'
import { Gallery } from '../components/Gallery'
import { Philosophy } from '../components/Philosophy'
import { Finale } from '../components/Finale'

export function HomePage() {
  useDocumentTitle()

  return (
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
  )
}
