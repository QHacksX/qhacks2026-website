'use client'

import React from 'react'
import Image from 'next/image'
import { motion } from 'framer-motion'

// Placeholder sponsors data
const SPONSORS = [
  { name: 'Amazon', logo: '/sponsors/Amazon.svg' },
  { name: 'AMD', logo: '/sponsors/AMD.svg' },
  { name: 'AssemblyAI', logo: '/sponsors/AssemblyAI.svg' },
  { name: 'Axure', logo: '/sponsors/Axure.svg' },
  { name: 'Bayun', logo: '/sponsors/Bayun.svg' },
  { name: 'BMO', logo: '/sponsors/BMO.svg' },
  { name: 'Bounce', logo: '/sponsors/Bounce.svg' },
]

// Noise overlay component to be reused
const NoiseOverlay = ({ className = "", opacity = "opacity-[1]" }) => (
  <div 
    className={`absolute inset-0 pointer-events-none z-20 ${opacity} mix-blend-overlay ${className}`}
    style={{ 
      backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='1.7' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
      filter: 'contrast(140%) brightness(100%)' 
    }}
  />
)

const FilmSprockets = () => (
  <>
    <NoiseOverlay />
    {/* Top Sprockets */}
    <div className="absolute top-1 left-0 right-0 h-2 md:h-4 w-full flex space-x-4 px-2 overflow-hidden z-20">
       <div className="w-full h-full bg-[repeating-linear-gradient(90deg,transparent,transparent_12px,white_12px,white_20px)] opacity-80 mix-blend-overlay" />
    </div>
    {/* Bottom Sprockets */}
    <div className="absolute bottom-1 left-0 right-0 h-2 md:h-4 w-full flex space-x-4 px-2 overflow-hidden z-20">
       <div className="w-full h-full bg-[repeating-linear-gradient(90deg,transparent,transparent_12px,white_12px,white_20px)] opacity-80 mix-blend-overlay" />
    </div>
  </>
)

const Sponsors2 = () => {
  return (
    <section className="relative w-full min-h-screen md:min-h-[120vh] bg-[#0a0a0a] overflow-hidden flex flex-col items-center justify-center py-12 md:py-24">
      
      {/* Cinematic Background with Heavy Noise */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        {/* Carousel Background Image */}
        <Image
          src="/sponsors-assets/carousel-background.jpg"
          alt="Carousel Background"
          fill
          sizes="100vw"
          className="object-cover"
          quality={100}
          priority
        />
        
        {/* Dark overlay to ensure text readability */}
        <div className="absolute inset-0 bg-black/50" />
        
        {/* Vignette */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.8)_100%)]" />
        
        <NoiseOverlay className="z-0" />
      </div>

      {/* Paper Decorations - Absolute Positioned */}
      
      {/* "Interested in Partnering?" - Top Right */}
      <div className="absolute top-10 right-[5%] z-20 hidden md:block rotate-3 transform hover:scale-105 transition-transform duration-500">
        <div className="relative w-[300px] h-[150px] bg-[#f0f0e0] p-6 shadow-xl rotate-1 border-2 border-[#E3C676]/20">
            <NoiseOverlay />
            {/* Paper Texture */}
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/paper.png')] opacity-50"></div>
            {/* Tape */}
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-24 h-8 bg-[#E3C676]/90 -rotate-2 backdrop-blur-sm transform skew-x-12 shadow-md"></div>
            
            <h3 className="font-mono text-2xl font-black text-black mb-2 leading-tight relative z-10">
              Interested in<br/>
              <span className="text-[#d4b255] drop-shadow-sm">Partnering?</span>
            </h3>
            <p className="font-mono text-xs text-neutral-700 mb-2 relative z-10">
                Contact us at:<br/>
                <span className="font-bold bg-[#E3C676]/20 px-1">partnerships@qhacks.io</span>
            </p>
        </div>
      </div>

      {/* "Honouring our Current Sponsors" - Center/Top */}
      <div className="relative z-20 mb-12 transform -rotate-1">
        <div className="bg-[#f5f5f0] p-4 px-8 md:p-6 md:px-12 shadow-2xl border-4 border-[#E3C676] max-w-2xl mx-auto relative">
             <NoiseOverlay />
             {/* Paper Texture */}
             <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/paper.png')] opacity-30"></div>
             {/* Washi Tape */}
             <div className="absolute -top-3 left-6 w-20 h-6 md:-top-4 md:left-12 md:w-32 md:h-8 bg-[#E3C676] -rotate-1 opacity-90 mask-image-tape shadow-lg"></div>
             <div className="absolute -bottom-3 right-6 w-20 h-6 md:-bottom-4 md:right-12 md:w-32 md:h-8 bg-[#E3C676] rotate-1 opacity-90 mask-image-tape shadow-lg"></div>

             <h2 className="text-3xl md:text-6xl font-black text-black font-mono tracking-tighter uppercase text-center relative z-10" style={{ textShadow: '2px 2px 0px rgba(0,0,0,0.1)' }}>
                Honouring our <br/>
                <span className="bg-black text-[#E3C676] px-4 py-1 transform -skew-x-6 inline-block mt-2 shadow-[4px_4px_0px_rgba(227,198,118,0.5)]">
                  Current Sponsors
                </span>
             </h2>
        </div>
      </div>



      {/* Film Strip Carousel 1 */}
      <div className="w-full relative py-4 rotate-[-6deg] scale-110 transform-gpu my-4 z-10">
         
         <div 
            className="flex overflow-hidden relative z-10 bg-black/90 border-y-4 md:border-y-8 border-black shadow-[0_10px_30px_rgba(0,0,0,0.5)]"
         >
            <FilmSprockets />
            
            <motion.div 
              className="flex items-center"
              animate={{ x: ["0%", "-50%"] }}
              transition={{ repeat: Infinity, ease: "linear", duration: 40 }}
            >
              {[...SPONSORS, ...SPONSORS, ...SPONSORS].map((sponsor, idx) => (
                <div key={`row1-${idx}`} className="relative flex-shrink-0 w-[160px] h-[100px] md:w-[320px] md:h-[200px] p-4 md:p-8 flex items-center justify-center border-r-4 border-black bg-[#111] group overflow-hidden">
                   <NoiseOverlay className="z-30 transition-opacity duration-300 group-hover:opacity-0" />
                   {/* Golden Hover Overlay Card */}
                   <div className="absolute inset-0 bg-[#E3C676]/10 opacity-0 group-hover:opacity-100 transition-all duration-500 pointer-events-none z-10">
                      {/* Golden Border */}
                      <div className="absolute inset-2 md:inset-4 border border-[#E3C676] scale-95 group-hover:scale-100 transition-transform duration-500"></div>
                      {/* Glow */}
                      <div className="absolute inset-0 bg-gradient-to-tr from-[#E3C676]/20 to-transparent"></div>
                   </div>

                  {/* Frame Number */}
                  <span className="absolute top-1 right-1 md:top-2 md:right-2 font-mono text-[8px] md:text-[10px] text-neutral-600 group-hover:text-[#E3C676] transition-colors duration-300">#{idx + 124}</span>
                  <span className="absolute bottom-1 left-1 md:bottom-2 md:left-2 font-mono text-[8px] md:text-[10px] text-neutral-600 group-hover:text-[#E3C676] transition-colors duration-300">KODAK 400</span>
                  
                  {/* Content */}
                  <div className="w-full h-full flex items-center justify-center z-20 p-0">
                     {sponsor.logo ? (
                        <div className="relative w-full h-full transform group-hover:scale-110 transition-transform duration-500">
                           <Image
                              src={sponsor.logo}
                              alt={sponsor.name}
                              fill
                              className="object-contain grayscale opacity-70 group-hover:opacity-100 group-hover:grayscale-0 transition-all duration-500"
                           />
                        </div>
                     ) : (
                        <span className="text-white font-bold text-sm md:text-2xl uppercase tracking-widest font-mono group-hover:text-[#E3C676] group-hover:scale-110 transition-all duration-500">
                           {sponsor.name}
                        </span>
                     )}
                  </div>
                </div>
              ))}
            </motion.div>
         </div>
      </div>

      {/* "Honouring our Past Sponsors" - Bottom Left */}
      <div className="relative z-20 mb-8 block md:absolute md:bottom-20 md:left-[5%] md:mb-0 -rotate-2 transform hover:scale-105 transition-transform duration-500">
        <div className="relative w-[90%] max-w-[350px] mx-auto md:w-[350px] bg-[#f0f0e0] p-6 shadow-xl border-2 border-[#E3C676]/20">
            <NoiseOverlay />
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/paper.png')] opacity-50"></div>
            <div className="absolute -top-3 right-10 w-24 h-8 bg-[#E3C676]/90 rotate-2 backdrop-blur-sm transform skew-x-12 shadow-md"></div>
            
            <h3 className="font-mono text-2xl font-black text-black mb-4 relative z-10">
              Honouring our <span className="text-[#d4b255]">Past Sponsors</span>
            </h3>
            <p className="font-mono text-xs text-neutral-700 leading-relaxed relative z-10">
                By partnering with <span className="font-bold text-[#b39646]">QHacks</span>, you will not only empower the next generation of leaders but also contribute to creating an inclusive and equitable future for the industry.
            </p>
        </div>
      </div>

      {/* Film Strip Carousel 2 */}
      <div className="w-full relative py-4 rotate-[4deg] scale-110 transform-gpu my-4 z-0">
         
         <div 
            className="flex overflow-hidden relative z-10 bg-black/90 border-y-4 md:border-y-8 border-black shadow-[0_10px_30px_rgba(0,0,0,0.5)]"
         >
            <FilmSprockets />

            <motion.div 
              className="flex items-center"
              animate={{ x: ["-50%", "0%"] }}
              transition={{ repeat: Infinity, ease: "linear", duration: 45 }}
            >
              {[...SPONSORS, ...SPONSORS, ...SPONSORS].map((sponsor, idx) => (
                <div key={`row2-${idx}`} className="relative flex-shrink-0 w-[160px] h-[100px] md:w-[320px] md:h-[200px] p-4 md:p-8 flex items-center justify-center border-r-4 border-black bg-[#111] group overflow-hidden">
                   <NoiseOverlay className="z-30 transition-opacity duration-300 group-hover:opacity-0" />
                   {/* Golden Hover Overlay Card */}
                   <div className="absolute inset-0 bg-[#E3C676]/10 opacity-0 group-hover:opacity-100 transition-all duration-500 pointer-events-none z-10">
                      {/* Golden Border */}
                      <div className="absolute inset-2 md:inset-4 border border-[#E3C676] scale-95 group-hover:scale-100 transition-transform duration-500"></div>
                      {/* Glow */}
                      <div className="absolute inset-0 bg-gradient-to-tr from-[#E3C676]/20 to-transparent"></div>
                   </div>

                   <span className="absolute top-1 right-1 md:top-2 md:right-2 font-mono text-[8px] md:text-[10px] text-neutral-600 group-hover:text-[#E3C676] transition-colors duration-300">#{idx + 842}</span>
                   <span className="absolute bottom-1 left-1 md:bottom-2 md:left-2 font-mono text-[8px] md:text-[10px] text-neutral-600 group-hover:text-[#E3C676] transition-colors duration-300">PORTRA 800</span>

                  <div className="w-full h-full flex items-center justify-center z-20 p-0">
                     {sponsor.logo ? (
                        <div className="relative w-full h-full transform group-hover:scale-110 transition-transform duration-500">
                           <Image
                              src={sponsor.logo}
                              alt={sponsor.name}
                              fill
                              className="object-contain grayscale opacity-70 group-hover:opacity-100 group-hover:grayscale-0 transition-all duration-500"
                           />
                        </div>
                     ) : (
                        <span className="text-white font-bold text-sm md:text-2xl uppercase tracking-widest font-mono group-hover:text-[#E3C676] group-hover:scale-110 transition-all duration-500">
                           {sponsor.name}
                        </span>
                     )}
                  </div>
                </div>
              ))}
            </motion.div>
         </div>
      </div>

    </section>
  )
}

export default Sponsors2
