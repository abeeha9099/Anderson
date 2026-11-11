import { ContactSection } from './components/contact/ContactSection';
import { Footer } from './components/layout/Footer';
import { Header } from './components/layout/Header';
import { MobileActionBar } from './components/layout/MobileActionBar';
import { AttorneyIntro } from './components/sections/AttorneyIntro';
import { Hero } from './components/sections/Hero';
import { PracticeAreas } from './components/sections/PracticeAreas';
import { ServiceAreas } from './components/sections/ServiceAreas';
import { Testimonials } from './components/sections/Testimonials';
import { TrustBar } from './components/sections/TrustBar';
import { WhyChoose } from './components/sections/WhyChoose';
import { useReveal } from './hooks/useReveal';
import { ContactProvider } from './state/ContactContext';

export function App() {
  useReveal();
  return (
    <ContactProvider>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[100] focus:rounded-md focus:bg-white focus:px-5 focus:py-3 focus:font-display focus:font-semibold focus:text-navy focus:shadow-panel"
      >
        Skip to content
      </a>
      <Header />
      <main id="main" tabIndex={-1} className="focus:outline-none">
        <Hero />
        <TrustBar />
        <PracticeAreas />
        <AttorneyIntro />
        <WhyChoose />
        <Testimonials />
        <ContactSection />
        <ServiceAreas />
      </main>
      <Footer />
      <MobileActionBar />
    </ContactProvider>
  );
}
