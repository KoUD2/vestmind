'use client';
import useScrollProgress from '@/shared/lib/useScrollProgress';
import { BookAuditProvider, BookAuditModal } from '@/features/book-audit';
import Header from '@/widgets/header';
import Hero from '@/widgets/hero';
import TrustStrip from '@/widgets/trust-strip';
import Problem from '@/widgets/problem';
import WhyNow from '@/widgets/why-now';
import HowWeWork from '@/widgets/how-we-work';
import Services from '@/widgets/services';
import WhyUs from '@/widgets/why-us';
import Proof from '@/widgets/proof';
import WhoFor from '@/widgets/who-for';
import Security from '@/widgets/security';
import Faq from '@/widgets/faq';
import FinalCta from '@/widgets/final-cta';
import Footer from '@/widgets/footer';

export default function LandingPage() {
  const progressRef = useScrollProgress();

  return (
    <BookAuditProvider>
    <div style={{ position: 'relative', overflowX: 'hidden' }}>
      <div
        ref={progressRef}
        aria-hidden="true"
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          height: '2px',
          width: '0',
          background: '#a8763e',
          zIndex: 60,
          transition: 'width 0.1s linear',
        }}
      />
      <Header />
      <main id="top">
        <Hero />
        <TrustStrip />
        <Problem />
        <WhyNow />
        <HowWeWork />
        <Services />
        <WhyUs />
        <Proof />
        <WhoFor />
        <Security />
        <Faq />
        <FinalCta />
      </main>
      <Footer />
      <BookAuditModal />
    </div>
    </BookAuditProvider>
  );
}
