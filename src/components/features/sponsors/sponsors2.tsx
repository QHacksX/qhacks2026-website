"use client";

import { motion } from "framer-motion";
import Link from "next/dist/client/link";
import Image from "next/image";

const UTM_PARAMS = new URLSearchParams({
  utm_source: "qhacks.io",
  utm_medium: "homepage",
  utm_campaign: "qhacks_2026",
});

const getSponsorUrl = (baseUrl: string) => {
  return `${baseUrl}?${UTM_PARAMS.toString()}`;
};

const SPONSORS = [
  { name: "AMS", logo: "/sponsors/AMS.png", url: "https://www.myams.org/" },
  { name: "AWAKE", logo: "/sponsors/AWAKE.jpg", url: "https://awakechocolate.com/" },
  { name: "Backboard IO", logo: "/sponsors/BackboardIO.png", url: "https://backboard.io/" },
  { name: "City of Kingston", logo: "/sponsors/Kingston.png", url: "https://www.cityofkingston.ca/" },
  { name: "Communications Security Establishment Canada", logo: "/sponsors/CSE.svg", url: "https://www.cse-cst.gc.ca/en" },
  { name: "COMPSA", logo: "/sponsors/COMPSA.png", url: "https://compsa.ca/" },
  { name: "DDQIC", logo: "/sponsors/DDQIC.svg", url: "https://www.queensu.ca/innovationcentre/" },
  { name: "DOSE", logo: "/sponsors/DOSE.webp", url: "https://dosejuice.com/" },
  { name: "Manulife", logo: "/sponsors/Manulife.jpg", url: "https://www.manulife.com/", wide: true },
  { name: "National Bank of Canada", logo: "/sponsors/NationalBank.png", url: "https://www.nbc.ca/" },
  { name: "Queen's School of Computing", logo: "/sponsors/Computing.png", url: "https://www.cs.queensu.ca/" },
];

const PAST_SPONSORS = [
  { name: "Amazon", logo: "/past-sponsors/Amazon.svg" },
  { name: "AMD", logo: "/past-sponsors/AMD.svg" },
  { name: "AssemblyAI", logo: "/past-sponsors/AssemblyAI.svg" },
  { name: "Axure", logo: "/past-sponsors/Axure.svg" },
  { name: "Bayun", logo: "/past-sponsors/Bayun.svg" },
  { name: "BMO", logo: "/past-sponsors/BMO.svg" },
  { name: "Bounce", logo: "/past-sponsors/Bounce.svg" },
  { name: "Github", logo: "/past-sponsors/github.svg" },
  { name: "IBM", logo: "/past-sponsors/IBM.svg" },
  { name: "OTPP", logo: "/past-sponsors/OTPP.svg" },
  { name: "QtGroup", logo: "/past-sponsors/QtGroup.png" },
  { name: "Scotiabank", logo: "/past-sponsors/Scotiabank.svg" },
];

const NoiseOverlay = ({ className = "", opacity = "opacity-[1]" }) => (
  <div
    className={`pointer-events-none absolute inset-0 z-20 ${opacity} mix-blend-overlay ${className}`}
    style={{
      backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='1.7' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
      filter: "contrast(140%) brightness(100%)",
    }}
  />
);

const FilmSprockets = () => (
  <>
    <NoiseOverlay />
    {/* Top Sprockets */}
    <div className="absolute top-1 right-0 left-0 z-20 flex h-2 w-full space-x-4 overflow-hidden px-2 md:h-4">
      <div className="h-full w-full bg-[repeating-linear-gradient(90deg,transparent,transparent_12px,white_12px,white_20px)] opacity-80 mix-blend-overlay" />
    </div>
    {/* Bottom Sprockets */}
    <div className="absolute right-0 bottom-1 left-0 z-20 flex h-2 w-full space-x-4 overflow-hidden px-2 md:h-4">
      <div className="h-full w-full bg-[repeating-linear-gradient(90deg,transparent,transparent_12px,white_12px,white_20px)] opacity-80 mix-blend-overlay" />
    </div>
  </>
);

const Sponsors = () => {
  return (
    <section
      id="sponsors"
      className="relative flex min-h-screen w-full flex-col items-center justify-center overflow-hidden bg-[#0a0a0a] py-10 md:py-16 lg:h-screen"
    >
      {/* Cinematic Background with Heavy Noise */}
      <div className="pointer-events-none absolute inset-0 z-0">
        <Image
          src="/sponsors-assets/carousel-background.jpg"
          alt="Carousel Background"
          fill
          sizes="100vw"
          className="object-cover"
          loading="lazy"
          placeholder="blur"
          blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAgGBgcGBQgHBwcJCQgKDBQNDAsLDBkSEw8UHRofHh0aHBwgJC4nICIsIxwcKDcpLDAxNDQ0Hyc5PTgyPC4zNDL/2wBDAQkJCQwLDBgNDRgyIRwhMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjL/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAb/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k="
        />

        {/* Dark overlay to ensure text readability */}
        <div className="absolute inset-0 bg-black/50" />

        {/* Vignette */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.8)_100%)]" />

        <NoiseOverlay className="z-0" />
      </div>

      <div className="absolute top-10 right-[5%] z-20 hidden rotate-3 transform transition-transform duration-500 hover:scale-105 md:block">
        <div className="relative h-[150px] w-[300px] rotate-1 border-2 border-[#E3C676]/20 bg-[#f0f0e0] p-6 shadow-xl">
          <NoiseOverlay />
          {/* Paper Texture */}
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/paper.png')] opacity-50"></div>
          {/* Tape */}
          <div className="absolute -top-3 left-1/2 h-8 w-24 -translate-x-1/2 -rotate-2 skew-x-12 transform bg-[#E3C676]/90 shadow-md backdrop-blur-sm"></div>

          <h3 className="relative z-10 mb-2 font-mono text-2xl leading-tight font-black text-black">
            Interested in
            <br />
            <span className="text-[#d4b255] drop-shadow-sm">Partnering?</span>
          </h3>
          <p className="relative z-10 mb-2 font-mono text-xs text-neutral-700">
            Download our{" "}
            <span className="bg-[#E3C676]/20 px-1 font-bold">
              <Link href="https://cdn.qhacks.io/assets/7947bfeb-53f9-4af2-89ce-3266e861d1c0.pdf" target="_blank">
                sponsorship package
              </Link>
            </span>
            !
          </p>
        </div>
      </div>

      <div className="relative z-20 mb-12 -rotate-1 transform">
        <div className="relative mx-auto max-w-2xl border-4 border-[#E3C676] bg-[#f5f5f0] p-4 px-8 shadow-2xl md:p-6 md:px-12">
          <NoiseOverlay />
          {/* Paper Texture */}
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/paper.png')] opacity-30"></div>
          {/* Washi Tape */}
          <div className="mask-image-tape absolute -top-3 left-6 h-6 w-20 -rotate-1 bg-[#E3C676] opacity-90 shadow-lg md:-top-4 md:left-12 md:h-8 md:w-32"></div>
          <div className="mask-image-tape absolute right-6 -bottom-3 h-6 w-20 rotate-1 bg-[#E3C676] opacity-90 shadow-lg md:right-12 md:-bottom-4 md:h-8 md:w-32"></div>

          <h2 className="relative z-10 text-center font-mono text-3xl font-black tracking-tighter text-black uppercase md:text-6xl">
            Honouring our <br />
            <span className="mt-2 inline-block -skew-x-6 transform px-4 py-1 text-[#E3C676] shadow-[4px_4px_0px_rgba(227,198,118,0.5)]">
              Current Sponsors
            </span>
          </h2>
        </div>
      </div>

      {/* Film Strip Carousel 1 */}
      <div className="relative z-10 my-4 w-full scale-[1.02] rotate-[-4deg] transform-gpu py-4">
        <div className="relative z-10 flex overflow-hidden border-y-4 border-black bg-black/90 shadow-[0_10px_30px_rgba(0,0,0,0.5)] md:border-y-8">
          <FilmSprockets />

          <motion.div
            className="flex items-center"
            animate={{ x: ["0%", "-50%"] }}
            transition={{ repeat: Infinity, ease: "linear", duration: 40 }}
          >
            {[...SPONSORS, ...SPONSORS].map((sponsor, idx) => {
              const widthClass = sponsor.wide ? "w-[320px] md:w-[640px]" : "w-[160px] md:w-[320px]";

              const content = (
                <>
                  <NoiseOverlay className="z-30 transition-opacity duration-300 group-hover:opacity-0" />
                  {/* Golden Hover Overlay Card */}
                  <div className="pointer-events-none absolute inset-0 z-10 bg-[#E3C676]/10 opacity-0 transition-all duration-500 group-hover:opacity-100">
                    {/* Golden Border */}
                    <div className="absolute inset-2 scale-95 border border-[#E3C676] transition-transform duration-500 group-hover:scale-100 md:inset-4"></div>
                    {/* Glow */}
                    <div className="absolute inset-0 bg-linear-to-tr from-[#E3C676]/20 to-transparent"></div>
                  </div>

                  {/* Frame Number */}
                  <span className="absolute top-1 right-1 font-mono text-[8px] text-neutral-600 transition-colors duration-300 group-hover:text-[#E3C676] md:top-2 md:right-2 md:text-[10px]">
                    #{idx + 124}
                  </span>
                  <span className="absolute bottom-1 left-1 font-mono text-[8px] text-neutral-600 transition-colors duration-300 group-hover:text-[#E3C676] md:bottom-2 md:left-2 md:text-[10px]">
                    KODAK 400
                  </span>

                  {/* Content */}
                  <div className="z-20 flex h-full w-full items-center justify-center p-0">
                    {sponsor.logo ? (
                      <div className="relative h-full w-full transform transition-transform duration-500 group-hover:scale-110">
                        <Image
                          src={sponsor.logo}
                          alt={sponsor.name}
                          fill
                          sizes={sponsor.wide ? "(max-width: 768px) 320px, 640px" : "(max-width: 768px) 160px, 320px"}
                          loading="lazy"
                          className="object-contain opacity-70 grayscale transition-all duration-500 group-hover:opacity-100 group-hover:grayscale-0"
                        />
                      </div>
                    ) : (
                      <span className="font-mono text-sm font-bold tracking-widest text-white uppercase transition-all duration-500 group-hover:scale-110 group-hover:text-[#E3C676] md:text-2xl">
                        {sponsor.name}
                      </span>
                    )}
                  </div>
                </>
              );

              return sponsor.url ? (
                <Link
                  key={`row1-${idx}`}
                  href={getSponsorUrl(sponsor.url)}
                  target="_blank"
                  className={`group relative flex h-[100px] shrink-0 items-center justify-center overflow-hidden border-r-4 border-black bg-[#111] p-4 md:h-[200px] md:p-8 ${widthClass}`}
                >
                  {content}
                </Link>
              ) : (
                <div
                  key={`row1-${idx}`}
                  className={`group relative flex h-[100px] shrink-0 items-center justify-center overflow-hidden border-r-4 border-black bg-[#111] p-4 md:h-[200px] md:p-8 ${widthClass}`}
                >
                  {content}
                </div>
              );
            })}
          </motion.div>
        </div>
      </div>

      {/* "Honouring our Past Sponsors" - Bottom Left */}
      <div className="relative z-20 mb-8 block -rotate-2 transform transition-transform duration-500 hover:scale-105 md:absolute md:bottom-20 md:left-[5%] md:mb-0">
        <div className="relative mx-auto w-[90%] max-w-[350px] border-2 border-[#E3C676]/20 bg-[#f0f0e0] p-6 shadow-xl md:w-[350px]">
          <NoiseOverlay />
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/paper.png')] opacity-50"></div>
          <div className="absolute -top-3 right-10 h-8 w-24 rotate-2 skew-x-12 transform bg-[#E3C676]/90 shadow-md backdrop-blur-sm"></div>

          <h3 className="relative z-10 mb-4 font-mono text-2xl font-black text-black">
            Honouring our <span className="text-[#d4b255]">Past Sponsors</span>
          </h3>
          <p className="relative z-10 font-mono text-xs leading-relaxed text-neutral-700">
            By partnering with <span className="font-bold text-[#b39646]">QHacks</span>, you will not only empower the next
            generation of leaders but also contribute to creating an inclusive and equitable future for the industry.
          </p>
        </div>
      </div>

      {/* Film Strip Carousel 2 */}
      <div className="relative z-0 my-4 w-full scale-[1.02] rotate-3 transform-gpu py-4">
        <div className="relative z-10 flex overflow-hidden border-y-4 border-black bg-black/90 shadow-[0_10px_30px_rgba(0,0,0,0.5)] md:border-y-8">
          <FilmSprockets />

          <motion.div
            className="flex items-center"
            animate={{ x: ["-50%", "0%"] }}
            transition={{ repeat: Infinity, ease: "linear", duration: 45 }}
          >
            {[...PAST_SPONSORS, ...PAST_SPONSORS].map((sponsor, idx) => {
              const widthClass = "w-[160px] md:w-[320px]"; // Base width for now as PAST_SPONSORS are not wide

              const content = (
                <>
                  <NoiseOverlay className="z-30 transition-opacity duration-300 group-hover:opacity-0" />
                  {/* Golden Hover Overlay Card */}
                  <div className="pointer-events-none absolute inset-0 z-10 bg-[#E3C676]/10 opacity-0 transition-all duration-500 group-hover:opacity-100">
                    {/* Golden Border */}
                    <div className="absolute inset-2 scale-95 border border-[#E3C676] transition-transform duration-500 group-hover:scale-100 md:inset-4"></div>
                    {/* Glow */}
                    <div className="absolute inset-0 bg-linear-to-tr from-[#E3C676]/20 to-transparent"></div>
                  </div>

                  <span className="absolute top-1 right-1 font-mono text-[8px] text-neutral-600 transition-colors duration-300 group-hover:text-[#E3C676] md:top-2 md:right-2 md:text-[10px]">
                    #{idx + 842}
                  </span>
                  <span className="absolute bottom-1 left-1 font-mono text-[8px] text-neutral-600 transition-colors duration-300 group-hover:text-[#E3C676] md:bottom-2 md:left-2 md:text-[10px]">
                    PORTRA 800
                  </span>

                  <div className="z-20 flex h-full w-full items-center justify-center p-0">
                    {sponsor.logo ? (
                      <div className="relative h-full w-full transform transition-transform duration-500 group-hover:scale-110">
                        <Image
                          src={sponsor.logo}
                          alt={sponsor.name}
                          fill
                          sizes="(max-width: 768px) 160px, 320px"
                          loading="lazy"
                          className="object-contain opacity-70 grayscale transition-all duration-500 group-hover:opacity-100 group-hover:grayscale-0"
                        />
                      </div>
                    ) : (
                      <span className="font-mono text-sm font-bold tracking-widest text-white uppercase transition-all duration-500 group-hover:scale-110 group-hover:text-[#E3C676] md:text-2xl">
                        {sponsor.name}
                      </span>
                    )}
                  </div>
                </>
              );

              return (
                <div
                  key={`row2-${idx}`}
                  className={`group relative flex h-[100px] shrink-0 items-center justify-center overflow-hidden border-r-4 border-black bg-[#111] p-4 md:h-[200px] md:p-8 ${widthClass}`}
                >
                  {content}
                </div>
              );
            })}
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Sponsors;
