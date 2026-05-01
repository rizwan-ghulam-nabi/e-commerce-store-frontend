'use client';
import Hero from './components/landing/Hero';
import DealsSection from './components/landing/DealsSection';
import FeaturedProducts from './components/products/FeaturedProducts';
import Testimonials from './components/landing/Testimonials';
import StoreLocation from './components/landing/StoreLocation';

export default function Home() {
  return (
    <main className="relative min-h-screen overflow-x-hidden">
      {/* Background */}
      <div className="fixed inset-0 w-full h-full -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-[#AC9CC9] via-[#5D4785] to-[#463663]">
          <div className="absolute top-10 md:top-20 left-5 md:left-10 w-64 h-64 md:w-96 md:h-96 bg-[#70C285]/20 rounded-full blur-[80px] md:blur-[120px] animate-float"></div>
          <div className="absolute bottom-10 md:bottom-20 right-5 md:right-10 w-64 h-64 md:w-96 md:h-96 bg-[#3D8F52]/20 rounded-full blur-[80px] md:blur-[120px] animate-float-delayed"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] md:w-[500px] md:h-[500px] bg-[#9a8f97]/15 rounded-full blur-[100px] md:blur-[140px]"></div>
        </div>
      </div>

      <div className="relative z-10">
        
        {/* ===== HERO - FULL WIDTH ===== */}
        <section className="pb-8 md:pb-10">
          <Hero />
        </section>

        {/* ===== CONTENT - CONTAINED WIDTH ===== */}
        <div className="px-4 sm:px-6 md:px-8 lg:px-12 max-w-[1440px] mx-auto">
          
          {/* 2. DEALS */}
          <DealsSection />

          {/* 3. FEATURED PRODUCTS */}
          <section className="py-12 sm:py-16 md:py-20 relative">
            <div className="absolute inset-0 bg-gradient-to-r from-[#AC9CC9]/10 to-[#5D4785]/10 rounded-2xl sm:rounded-3xl -mx-4 sm:-mx-6 md:mx-0"></div>
            <div className="relative">
              <FeaturedProducts />
            </div>
          </section>
        </div>

        {/* ===== TESTIMONIALS - FULL WIDTH ===== */}
        <Testimonials />

        {/* ===== STORE LOCATION - FULL WIDTH ===== */}
        <StoreLocation />
      </div>

      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translate(0, 0) scale(1); opacity: 0.3; }
          50% { transform: translate(20px, -15px) scale(1.05); opacity: 0.5; }
        }
        @keyframes float-delayed {
          0%, 100% { transform: translate(0, 0) scale(1); opacity: 0.3; }
          50% { transform: translate(-15px, 20px) scale(1.05); opacity: 0.5; }
        }
        .animate-float { animation: float 8s ease-in-out infinite; }
        .animate-float-delayed { animation: float-delayed 10s ease-in-out infinite; }
        
        @media (prefers-reduced-motion: reduce) {
          .animate-float, .animate-float-delayed { animation: none; opacity: 0.2; }
        }
      `}</style>
    </main>
  );
}