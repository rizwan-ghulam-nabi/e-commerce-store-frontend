'use client';

import { useState, useEffect, useRef } from 'react';

export default function StoreLocation() {
  const [activeTab, setActiveTab] = useState('info');
  const sectionRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);
  
  const location = {
    name: 'RS-Commerce',
    address: 'Near Super Ideal bakers',
    city: 'Faisalabad, Pakistan',
    phone: '+92 3037972606',
    email: 'RS-CommerceStore@gamil.com',
    workingHours: 'Mon-Sat: 9AM - 9PM | Sun: 11AM - 7PM',
    lat: 31.405349,
    lng: 73.104911,
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, []);

  return (
    <section ref={sectionRef} className="relative bg-[#0A0A0A] overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_30%,_rgba(112,194,133,0.08)_0%,_transparent_50%)]" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#70C285]/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#3D8F52]/5 rounded-full blur-3xl" />
      </div>

      <div className="relative px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16">
        {/* Header */}
        <div className={`py-16 md:py-20 transition-all duration-1000 transform ${
          isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
        }`}>
          <div className="text-center max-w-4xl mx-auto">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#70C285]/10 border border-[#70C285]/20 text-[#70C285] text-sm mb-6">
              <span className="w-2 h-2 bg-[#70C285] rounded-full animate-pulse" />
              We're Here For You
            </span>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4">
              Find Us in{' '}
              <span className="bg-gradient-to-r from-[#70C285] to-[#3D8F52] bg-clip-text text-transparent">
                Faisalabad
              </span>
            </h2>
            <p className="text-gray-400 text-lg">
              Experience our products firsthand at our flagship store. We're just around the corner from Super Ideal Bakers.
            </p>
          </div>
        </div>

        {/* Content - Full Width Grid with padding */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-0 pb-16 md:pb-20">
          {/* Left Column - Store Info */}
          <div className={`lg:col-span-2 transition-all duration-1000 delay-300 transform ${
            isVisible ? 'translate-x-0 opacity-100' : '-translate-x-20 opacity-0'
          }`}>
            <div className="bg-[#111] border border-white/5 rounded-3xl lg:rounded-r-none h-full">
              <div className="p-6 sm:p-8 lg:p-10 xl:p-12">
                {/* Store Name with Status */}
                <div className="flex items-center justify-between mb-8">
                  <h3 className="text-2xl md:text-3xl font-bold text-white">{location.name}</h3>
                  <div className="flex items-center gap-2 px-3 py-1.5 bg-green-500/10 border border-green-500/20 rounded-full">
                    <span className="w-2 h-2 bg-green-400 rounded-full" />
                    <span className="text-green-400 text-xs font-medium">Open</span>
                  </div>
                </div>

                {/* Quick Info Tabs */}
                <div className="flex gap-2 mb-8 bg-[#1A1A1A] rounded-xl p-1.5">
                  {['info', 'hours', 'contact'].map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={`flex-1 py-3 text-sm font-medium rounded-lg transition-all duration-300 ${
                        activeTab === tab
                          ? 'bg-[#70C285] text-black shadow-lg shadow-[#70C285]/20'
                          : 'text-gray-400 hover:text-white hover:bg-white/5'
                      }`}
                    >
                      {tab.charAt(0).toUpperCase() + tab.slice(1)}
                    </button>
                  ))}
                </div>

                {/* Tab Content */}
                <div className="min-h-[200px]">
                  {activeTab === 'info' && (
                    <div className="space-y-4 animate-slideUp">
                      <div className="flex items-start gap-4 p-4 bg-white/[0.02] rounded-xl hover:bg-white/[0.04] transition-colors">
                        <div className="w-12 h-12 rounded-xl bg-[#70C285]/10 flex items-center justify-center flex-shrink-0">
                          <svg className="w-6 h-6 text-[#70C285]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                          </svg>
                        </div>
                        <div>
                          <p className="text-white font-medium">{location.address}</p>
                          <p className="text-gray-400 text-sm">{location.city}</p>
                          <p className="text-gray-500 text-xs mt-1">Landmark: McDonald's near Gate wala</p>
                        </div>
                      </div>
                    </div>
                  )}

                  {activeTab === 'hours' && (
                    <div className="space-y-4 animate-slideUp">
                      {[
                        { day: 'Monday - Saturday', hours: '9:00 AM - 9:00 PM', active: true },
                        { day: 'Sunday', hours: '11:00 AM - 7:00 PM', active: false },
                      ].map((schedule, i) => (
                        <div key={i} className={`flex items-center justify-between p-4 rounded-xl transition-colors ${
                          schedule.active ? 'bg-[#70C285]/5 border border-[#70C285]/10' : 'bg-white/[0.02]'
                        }`}>
                          <span className="text-gray-300">{schedule.day}</span>
                          <span className={`font-medium ${schedule.active ? 'text-[#70C285]' : 'text-gray-400'}`}>
                            {schedule.hours}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}

                  {activeTab === 'contact' && (
                    <div className="space-y-4 animate-slideUp">
                      <a
                        href={`tel:${location.phone.replace(/\s/g, '')}`}
                        className="flex items-center gap-4 p-4 bg-white/[0.02] rounded-xl hover:bg-white/[0.04] transition-all group"
                      >
                        <div className="w-12 h-12 rounded-xl bg-[#70C285]/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                          <svg className="w-6 h-6 text-[#70C285]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
                          </svg>
                        </div>
                        <div>
                          <p className="text-white font-medium">{location.phone}</p>
                          <p className="text-gray-500 text-xs">Click to call</p>
                        </div>
                      </a>
                      <a
                        href={`mailto:${location.email}`}
                        className="flex items-center gap-4 p-4 bg-white/[0.02] rounded-xl hover:bg-white/[0.04] transition-all group"
                      >
                        <div className="w-12 h-12 rounded-xl bg-[#70C285]/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                          <svg className="w-6 h-6 text-[#70C285]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                          </svg>
                        </div>
                        <div>
                          <p className="text-white font-medium">{location.email}</p>
                          <p className="text-gray-500 text-xs">Click to email</p>
                        </div>
                      </a>
                    </div>
                  )}
                </div>

                {/* CTA Buttons */}
                <div className="grid grid-cols-2 gap-4 mt-8 pt-8 border-t border-white/5">
                  <a
                    href={`https://www.google.com/maps/dir/?api=1&destination=${location.lat},${location.lng}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group relative overflow-hidden bg-gradient-to-r from-[#70C285] to-[#3D8F52] text-black font-semibold py-4 px-6 rounded-xl text-center hover:shadow-lg hover:shadow-[#70C285]/25 transition-all"
                  >
                    <span className="relative z-10 flex items-center justify-center gap-2">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                      </svg>
                      Directions
                    </span>
                  </a>
                  <a
                    href={`tel:${location.phone.replace(/\s/g, '')}`}
                    className="group relative overflow-hidden bg-white/5 border border-white/10 text-white font-semibold py-4 px-6 rounded-xl text-center hover:border-[#70C285]/30 hover:bg-white/[0.07] transition-all"
                  >
                    <span className="relative z-10 flex items-center justify-center gap-2">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                      Call Now
                    </span>
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Map */}
          <div className={`lg:col-span-3 transition-all duration-1000 delay-500 transform ${
            isVisible ? 'translate-x-0 opacity-100' : 'translate-x-20 opacity-0'
          }`}>
            <div className="relative h-[400px] lg:h-full min-h-[500px] border border-white/5 rounded-3xl lg:rounded-l-none overflow-hidden">
              {/* Map iFrame */}
              <iframe
                width="100%"
                height="100%"
                frameBorder="0"
                scrolling="no"
                src={`https://www.openstreetmap.org/export/embed.html?bbox=${location.lng - 0.006},${location.lat - 0.006},${location.lng + 0.006},${location.lat + 0.006}&layer=mapnik&marker=${location.lat},${location.lng}`}
                className="grayscale hover:grayscale-0 transition-all duration-700"
                title="RS-Commerce Store Location"
              />
              
              {/* Map Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent pointer-events-none" />
              
              {/* Floating Card */}
              <div className="absolute top-6 left-6 bg-black/90 backdrop-blur-xl border border-white/10 rounded-2xl p-5 max-w-[220px] hover:scale-105 transition-transform duration-300">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-xl bg-[#70C285]/20 flex items-center justify-center">
                    <svg className="w-5 h-5 text-[#70C285]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                    </svg>
                  </div>
                  <div>
                    <span className="text-white text-sm font-bold block">RS-Commerce</span>
                    <span className="text-[#70C285] text-xs">📍 Store Location</span>
                  </div>
                </div>
                <p className="text-gray-400 text-xs leading-relaxed">{location.address}, {location.city}</p>
              </div>

              {/* Map Controls */}
              <div className="absolute bottom-6 right-6 flex gap-3">
                <a
                  href={`https://www.google.com/maps?q=${location.lat},${location.lng}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 bg-black/90 backdrop-blur-xl border border-white/10 text-white text-xs px-4 py-2.5 rounded-xl hover:bg-black hover:border-[#70C285]/30 transition-all"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm6.36 14.36c-1.17 1.17-2.7 1.82-4.36 1.82-3.31 0-6-2.69-6-6 0-1.66.65-3.19 1.82-4.36C11.99 7.65 13.52 7 15.18 7c3.31 0 6 2.69 6 6 0 1.66-.65 3.19-1.82 4.36z"/>
                  </svg>
                  Google Maps
                </a>
                <a
                  href={`https://www.waze.com/ul?ll=${location.lat}%2C${location.lng}&navigate=yes&zoom=17`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 bg-black/90 backdrop-blur-xl border border-white/10 text-white text-xs px-4 py-2.5 rounded-xl hover:bg-black hover:border-[#70C285]/30 transition-all"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2L2 22h20L12 2zm0 3.5l7.5 13.5h-15L12 5.5z"/>
                  </svg>
                  Waze
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(15px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-slideUp {
          animation: slideUp 0.6s ease-out;
        }
      `}</style>
    </section>
  );
}