'use client';
import HeroSection from './components/landing/Hero';  // Amazon-style hero with cards
import DealsSection from './components/landing/DealsSection';
import SalesSection from './components/landing/SalesSection';
import FeaturedProducts from './components/products/FeaturedProducts';
import Testimonials from './components/landing/Testimonials';
import StoreLocation from './components/landing/StoreLocation';

export default function Home() {
  return (
    <main className="relative min-h-screen">
      {/* Background */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-cyan-500/5 rounded-full blur-[120px]" />
      </div>

      <div className="relative">
        <HeroSection />           {/* Amazon-style banner with overlapping cards */}
        <DealsSection />          {/* Flash deals with timers */}
        <SalesSection />          {/* Long-term sales without timers */}
        <FeaturedProducts />
        <Testimonials />
        <StoreLocation />
      </div>
    </main>
  );
}