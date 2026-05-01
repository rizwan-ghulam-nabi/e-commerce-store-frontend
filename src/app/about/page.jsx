// app/about/page.jsx
'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import Link from 'next/link';

const stats = [
  { number: '10K+', label: 'Happy Customers', icon: '😊' },
  { number: '5K+', label: 'Products Sold', icon: '📦' },
  { number: '99%', label: 'Satisfaction Rate', icon: '⭐' },
  { number: '24/7', label: 'Support Available', icon: '🎧' },
];

const teamMembers = [
  {
    name: 'Sheikh Rizwan',
    role: 'Founder & Creator',
    image: null,
    initials: 'SR',
    color: 'from-[#70C285] to-[#3D8F52]',
    bio: 'Full Stack Web Developer & AI Vibe Coder. Building the future of e-commerce with cutting-edge technology.',
    highlight: true,
    badge: 'Founder',
    expertise: ['Next.js', 'Node.js', 'AI/ML', 'MongoDB'],
  },
  {
    name: 'Shahmeer',
    role: 'Co-Founder',
    image: null,
    initials: 'SH',
    color: 'from-violet-500 to-purple-600',
    bio: 'Expert in PHP and creating realistic WordPress applications. Bringing robust backend solutions to life.',
    highlight: true,
    badge: 'Co-Founder',
    expertise: ['PHP', 'WordPress', 'Laravel', 'MySQL'],
  },
  {
    name: 'Saif Ali',
    role: 'Creator & Design',
    image: null,
    initials: 'SA',
    color: 'from-cyan-500 to-blue-600',
    bio: 'Flutter expert and mobile app specialist. Creating seamless cross-platform experiences with beautiful designs.',
    highlight: true,
    badge: 'Creator',
    expertise: ['Flutter', 'Dart', 'Firebase', 'Mobile Apps'],
  },
  {
    name: 'Usman',
    role: 'UI Expert & MERN Developer',
    image: null,
    initials: 'US',
    color: 'from-amber-500 to-orange-600',
    bio: 'UI/UX expert and MERN stack specialist. Crafting stunning interfaces with powerful full-stack solutions.',
    highlight: true,
    badge: 'Creator',
    expertise: ['React', 'MongoDB', 'Express', 'Node.js'],
  },
];

const values = [
  {
    title: 'Quality First',
    description: 'We never compromise on product quality. Every item is carefully selected and tested.',
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
      </svg>
    ),
  },
  {
    title: 'Customer Focus',
    description: 'Your satisfaction is our priority. We go above and beyond to serve you better.',
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
      </svg>
    ),
  },
  {
    title: 'Fast Delivery',
    description: 'Quick and reliable shipping across Pakistan. Get your orders at your doorstep.',
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12" />
      </svg>
    ),
  },
];

const timeline = [
  {
    year: '2020',
    title: 'The Beginning',
    description: 'RS-Commerce was founded by Sheikh Rizwan in Faisalabad with a vision to revolutionize e-commerce in Pakistan.',
    icon: '🚀',
  },
  {
    year: '2021',
    title: 'Growth & Expansion',
    description: 'Shahmeer joined as Co-Founder with PHP expertise. Saif Ali brought Flutter mobile development skills.',
    icon: '📈',
  },
  {
    year: '2022',
    title: 'Design & Full-Stack Excellence',
    description: 'Usman joined as UI Expert & MERN Developer, completing our dream team of tech innovators.',
    icon: '🎨',
  },
  {
    year: '2023',
    title: 'Digital Transformation',
    description: 'Leveraged AI, full-stack development, mobile apps, and creative design for a seamless shopping experience.',
    icon: '💻',
  },
  {
    year: '2024',
    title: 'Market Leader',
    description: 'Became one of the most trusted e-commerce stores in Faisalabad with 10,000+ happy customers.',
    icon: '🏆',
  },
];

function AnimatedSection({ children, className = '', delay = 0 }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
      transition={{ duration: 0.8, delay, ease: 'easeOut' }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

function getBadgeColor(name) {
  if (name === 'Sheikh Rizwan') return 'bg-gradient-to-r from-[#70C285] to-[#3D8F52]';
  if (name === 'Shahmeer') return 'bg-gradient-to-r from-violet-500 to-purple-600';
  if (name === 'Saif Ali') return 'bg-gradient-to-r from-cyan-500 to-blue-600';
  if (name === 'Usman') return 'bg-gradient-to-r from-amber-500 to-orange-600';
  return '';
}

function getBorderColor(name) {
  if (name === 'Sheikh Rizwan') return 'border-[#70C285]/20 hover:border-[#70C285]/50 bg-gradient-to-b from-[#70C285]/5 to-transparent';
  if (name === 'Shahmeer') return 'border-violet-500/20 hover:border-violet-500/50 bg-gradient-to-b from-violet-500/5 to-transparent';
  if (name === 'Saif Ali') return 'border-cyan-500/20 hover:border-cyan-500/50 bg-gradient-to-b from-cyan-500/5 to-transparent';
  if (name === 'Usman') return 'border-amber-500/20 hover:border-amber-500/50 bg-gradient-to-b from-amber-500/5 to-transparent';
  return 'border-white/10 hover:border-[#70C285]/30';
}

function getRingColor(name) {
  if (name === 'Sheikh Rizwan') return 'ring-[#70C285]/20';
  if (name === 'Shahmeer') return 'ring-violet-500/20';
  if (name === 'Saif Ali') return 'ring-cyan-500/20';
  if (name === 'Usman') return 'ring-amber-500/20';
  return '';
}

function getTextColor(name) {
  if (name === 'Sheikh Rizwan') return 'text-[#70C285]';
  if (name === 'Shahmeer') return 'text-violet-400';
  if (name === 'Saif Ali') return 'text-cyan-400';
  if (name === 'Usman') return 'text-amber-400';
  return 'text-gray-400';
}

export default function AboutPage() {
  return (
    <main className="relative min-h-screen bg-[#0A0A0A] overflow-hidden">
      {/* Background Effects */}
      <div className="fixed inset-0 w-full h-full -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-[#AC9CC9]/20 via-[#5D4785]/20 to-[#463663]/20">
          <div className="absolute top-20 left-10 w-96 h-96 bg-[#70C285]/10 rounded-full blur-[120px] animate-float" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-[#3D8F52]/10 rounded-full blur-[120px] animate-float-delayed" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[#9a8f97]/10 rounded-full blur-[140px]" />
        </div>
      </div>

      <div className="relative z-10">
        {/* Hero Section */}
        <section className="relative px-4 sm:px-6 lg:px-8 py-20 md:py-32">
          <div className="max-w-7xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#70C285]/10 border border-[#70C285]/20 text-[#70C285] text-sm mb-6">
                <span className="w-2 h-2 bg-[#70C285] rounded-full animate-pulse" />
                Our Story
              </span>
              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6">
                About{' '}
                <span className="bg-gradient-to-r from-[#70C285] to-[#3D8F52] bg-clip-text text-transparent">
                  RS-Commerce
                </span>
              </h1>
              <p className="text-gray-400 text-lg sm:text-xl max-w-3xl mx-auto leading-relaxed">
                We&apos;re on a mission to provide quality products with exceptional service 
                to customers across Pakistan. Our journey started in Faisalabad with a 
                simple idea: make great products accessible to everyone.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="relative px-4 sm:px-6 lg:px-8 py-16">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
              {stats.map((stat, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  whileHover={{ scale: 1.05 }}
                  className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 text-center hover:border-[#70C285]/30 transition-all group"
                >
                  <div className="text-3xl mb-3 group-hover:scale-110 transition-transform">{stat.icon}</div>
                  <div className="text-2xl sm:text-3xl font-bold text-white mb-1">{stat.number}</div>
                  <div className="text-gray-400 text-sm">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Our Story Section */}
        <section className="relative px-4 sm:px-6 lg:px-8 py-16 md:py-24">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
              <AnimatedSection>
                <div>
                  <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">
                    From Faisalabad to{' '}
                    <span className="bg-gradient-to-r from-[#70C285] to-[#3D8F52] bg-clip-text text-transparent">
                      Your Doorstep
                    </span>
                  </h2>
                  <div className="space-y-4 text-gray-400 leading-relaxed">
                    <p>
                      Founded in 2020 by <span className="text-white font-semibold">Sheikh Rizwan</span>, a visionary 
                      Full Stack Web Developer and AI Vibe Coder, RS-Commerce began as a small store near Super 
                      Ideal Bakers in Faisalabad.
                    </p>
                    <p>
                      <span className="text-white font-semibold">Shahmeer</span> joined as Co-Founder, bringing 
                      expert PHP and WordPress development skills to build robust backend solutions.
                    </p>
                    <p>
                      <span className="text-white font-semibold">Saif Ali</span>, our Flutter expert, revolutionized 
                      our mobile presence with beautiful cross-platform applications.
                    </p>
                    <p>
                      <span className="text-white font-semibold">Usman</span> completed our dream team as UI Expert 
                      & MERN Stack Developer, crafting stunning interfaces with powerful full-stack solutions.
                    </p>
                  </div>
                  <div className="mt-8">
                    <Link
                      href="/contact"
                      className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#70C285] to-[#3D8F52] text-black font-semibold rounded-xl hover:shadow-lg hover:shadow-[#70C285]/25 transition-all"
                    >
                      Get in Touch
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                      </svg>
                    </Link>
                  </div>
                </div>
              </AnimatedSection>

              <AnimatedSection delay={0.2}>
                <div className="relative">
                  <div className="aspect-square bg-gradient-to-br from-[#70C285]/10 to-[#3D8F52]/10 rounded-3xl border border-white/5 flex items-center justify-center overflow-hidden p-6">
                    <div className="text-center space-y-5 w-full">
                      {/* Four Founders Display */}
                      <div className="grid grid-cols-2 gap-4">
                        {/* Sheikh Rizwan */}
                        <div className="flex flex-col items-center gap-2">
                          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#70C285] to-[#3D8F52] flex items-center justify-center text-white text-lg font-bold shadow-lg shadow-[#70C285]/20">
                            SR
                          </div>
                          <div>
                            <div className="text-white text-sm font-bold">Sheikh Rizwan</div>
                            <div className="text-[#70C285] text-xs font-medium">Founder & Creator</div>
                          </div>
                        </div>
                        
                        {/* Shahmeer */}
                        <div className="flex flex-col items-center gap-2">
                          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center text-white text-lg font-bold shadow-lg shadow-violet-500/20">
                            SH
                          </div>
                          <div>
                            <div className="text-white text-sm font-bold">Shahmeer</div>
                            <div className="text-violet-400 text-xs font-medium">Co-Founder</div>
                          </div>
                        </div>
                        
                        {/* Saif Ali */}
                        <div className="flex flex-col items-center gap-2">
                          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-white text-lg font-bold shadow-lg shadow-cyan-500/20">
                            SA
                          </div>
                          <div>
                            <div className="text-white text-sm font-bold">Saif Ali</div>
                            <div className="text-cyan-400 text-xs font-medium">Flutter Expert</div>
                          </div>
                        </div>
                        
                        {/* Usman */}
                        <div className="flex flex-col items-center gap-2">
                          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center text-white text-lg font-bold shadow-lg shadow-amber-500/20">
                            US
                          </div>
                          <div>
                            <div className="text-white text-sm font-bold">Usman</div>
                            <div className="text-amber-400 text-xs font-medium">UI & MERN Expert</div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="border-t border-white/10 pt-4">
                        <p className="text-gray-500 text-xs leading-relaxed">
                          Together, we combine AI, Full-Stack Web, Mobile Apps, and UI/UX design 
                          to create the best shopping experience for you.
                        </p>
                      </div>
                    </div>
                  </div>
                  {/* Decorative elements */}
                  <div className="absolute -top-4 -right-4 w-24 h-24 bg-[#70C285]/20 rounded-full blur-xl" />
                  <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-amber-500/20 rounded-full blur-xl" />
                </div>
              </AnimatedSection>
            </div>
          </div>
        </section>

        {/* Timeline Section */}
        <section className="relative px-4 sm:px-6 lg:px-8 py-16 md:py-24">
          <div className="max-w-7xl mx-auto">
            <AnimatedSection>
              <div className="text-center mb-16">
                <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">Our Journey</h2>
                <p className="text-gray-400 max-w-2xl mx-auto">
                  The milestones that shaped RS-Commerce
                </p>
              </div>
            </AnimatedSection>

            <div className="relative">
              {/* Timeline Line */}
              <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-px bg-gradient-to-b from-[#70C285]/30 via-[#3D8F52]/30 to-transparent hidden md:block" />

              <div className="space-y-8 md:space-y-12">
                {timeline.map((item, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    className={`flex flex-col md:flex-row items-center gap-6 ${
                      index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'
                    }`}
                  >
                    <div className={`flex-1 ${index % 2 === 0 ? 'md:text-right' : 'md:text-left'}`}>
                      <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:border-[#70C285]/30 transition-all">
                        <div className="text-[#70C285] text-sm font-bold mb-2">{item.year}</div>
                        <h3 className="text-white text-lg font-bold mb-2">{item.title}</h3>
                        <p className="text-gray-400 text-sm">{item.description}</p>
                      </div>
                    </div>
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#70C285]/20 to-[#3D8F52]/20 border-2 border-[#70C285]/50 flex items-center justify-center text-2xl flex-shrink-0 z-10">
                      {item.icon}
                    </div>
                    <div className="flex-1 hidden md:block" />
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Values Section */}
        <section className="relative px-4 sm:px-6 lg:px-8 py-16 md:py-24">
          <div className="max-w-7xl mx-auto">
            <AnimatedSection>
              <div className="text-center mb-16">
                <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">Our Values</h2>
                <p className="text-gray-400 max-w-2xl mx-auto">
                  The principles that guide everything we do
                </p>
              </div>
            </AnimatedSection>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {values.map((value, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.15 }}
                  whileHover={{ y: -5 }}
                  className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 hover:border-[#70C285]/30 transition-all group"
                >
                  <div className="w-14 h-14 rounded-xl bg-[#70C285]/10 flex items-center justify-center text-[#70C285] mb-6 group-hover:scale-110 transition-transform">
                    {value.icon}
                  </div>
                  <h3 className="text-xl font-bold text-white mb-3">{value.title}</h3>
                  <p className="text-gray-400 leading-relaxed">{value.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Team Section */}
        <section className="relative px-4 sm:px-6 lg:px-8 py-16 md:py-24">
          <div className="max-w-7xl mx-auto">
            <AnimatedSection>
              <div className="text-center mb-16">
                <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">Meet Our Dream Team</h2>
                <p className="text-gray-400 max-w-2xl mx-auto">
                  Four experts united by a passion for technology and customer satisfaction
                </p>
              </div>
            </AnimatedSection>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {teamMembers.map((member, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  whileHover={{ y: -8 }}
                  className={`relative bg-white/5 backdrop-blur-sm border rounded-2xl p-6 text-center transition-all group ${getBorderColor(member.name)}`}
                >
                  {member.highlight && member.badge && (
                    <div className={`absolute -top-3 left-1/2 transform -translate-x-1/2 text-black text-xs font-bold px-3 py-1 rounded-full ${getBadgeColor(member.name)}`}>
                      {member.badge}
                    </div>
                  )}
                  <div className={`w-20 h-20 rounded-full bg-gradient-to-br ${member.color} flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4 group-hover:scale-110 transition-transform shadow-lg ${getRingColor(member.name)}`}>
                    {member.initials}
                  </div>
                  <h3 className="text-white font-bold text-lg mb-1">{member.name}</h3>
                  <p className={`text-sm font-medium mb-3 ${getTextColor(member.name)}`}>
                    {member.role}
                  </p>
                  <p className="text-gray-400 text-sm leading-relaxed mb-4">{member.bio}</p>
                  
                  {/* Expertise Tags */}
                  <div className="flex flex-wrap justify-center gap-2">
                    {member.expertise.map((skill, i) => (
                      <span key={i} className={`text-xs px-2 py-1 rounded-full bg-white/5 border border-white/10 ${getTextColor(member.name)}`}>
                        {skill}
                      </span>
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Tech Stack Section */}
        <section className="relative px-4 sm:px-6 lg:px-8 py-16 md:py-24">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="relative bg-gradient-to-br from-[#1A1A1A] to-[#111] border border-white/10 rounded-3xl p-8 sm:p-12 overflow-hidden"
            >
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,_rgba(112,194,133,0.1)_0%,_transparent_50%)]" />
              <div className="relative text-center">
                <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
                  Powered by Diverse Expertise
                </h2>
                <p className="text-gray-400 max-w-2xl mx-auto mb-8">
                  Our team combines multiple technologies to create exceptional experiences
                </p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto">
                  {[
                    { name: 'AI & Full-Stack', icon: '🤖', desc: 'Sheikh Rizwan', color: 'hover:border-[#70C285]/30' },
                    { name: 'PHP & WordPress', icon: '🐘', desc: 'Shahmeer', color: 'hover:border-violet-500/30' },
                    { name: 'Flutter Mobile', icon: '📱', desc: 'Saif Ali', color: 'hover:border-cyan-500/30' },
                    { name: 'MERN & UI/UX', icon: '🎨', desc: 'Usman', color: 'hover:border-amber-500/30' },
                  ].map((tech, i) => (
                    <div key={i} className={`bg-white/5 rounded-xl p-4 hover:bg-white/[0.07] transition-all border border-transparent ${tech.color}`}>
                      <div className="text-2xl mb-2">{tech.icon}</div>
                      <div className="text-white text-sm font-medium">{tech.name}</div>
                      <div className="text-gray-500 text-xs">{tech.desc}</div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="relative px-4 sm:px-6 lg:px-8 py-16 md:py-24">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="relative bg-gradient-to-br from-[#70C285]/10 to-[#3D8F52]/10 border border-[#70C285]/20 rounded-3xl p-8 sm:p-12 text-center overflow-hidden"
            >
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,_rgba(112,194,133,0.15)_0%,_transparent_50%)]" />
              <div className="relative">
                <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
                  Ready to Experience the Difference?
                </h2>
                <p className="text-gray-400 max-w-2xl mx-auto mb-8">
                  Join thousands of satisfied customers who trust RS-Commerce for their needs.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link
                    href="/products"
                    className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-[#70C285] to-[#3D8F52] text-black font-semibold rounded-xl hover:shadow-lg hover:shadow-[#70C285]/25 transition-all"
                  >
                    Shop Now
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </Link>
                  <Link
                    href="/contact"
                    className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white/5 border border-white/10 text-white font-semibold rounded-xl hover:border-[#70C285]/30 hover:bg-white/[0.07] transition-all"
                  >
                    Contact Us
                  </Link>
                </div>
              </div>
            </motion.div>
          </div>
        </section>
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