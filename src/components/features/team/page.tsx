"use client";
import { useEffect, useRef, useState } from "react";
import { Volume2, VolumeX } from "lucide-react";

type RoleRowProps = {
  role: string;
  name: string;
};
// Single row for a role and name
const RoleRow = ({ role, name }: RoleRowProps) => (
  <div className="flex w-[330px] justify-between">
    <p className="font-credits text-[0.9rem] font-semibold tracking-[0.16em] text-white uppercase">{role}</p>

    <p className="font-credits text-[1rem] font-normal tracking-[0.12em] text-white uppercase">{name}</p>
  </div>
);

const CreditsContent = () => (
  <>
    {/* TITLE */}
    <h1 className="font-title mb-12 text-[3rem] font-bold tracking-[0.1em] text-[#E3C88B] uppercase">MEET THE EXECS</h1>

    {/* CO-CHAIRS */}
    <section className="flex flex-col items-center">
      <h2 className="font-title mb-[0.7rem] text-[1.8rem] font-semibold tracking-[0.18em] text-[#E3C88B] uppercase">
        CO-CHAIRS
      </h2>

      <p className="font-credits text-[1rem] font-normal tracking-[0.12em] text-white uppercase">AMANDA CAO</p>
      <p className="font-credits text-[1rem] font-normal tracking-[0.12em] text-white uppercase">MICHAEL KWON</p>
      <p className="font-credits text-[1rem] font-normal tracking-[0.12em] text-white uppercase">WILL WU</p>
    </section>

    {/* FINANCE */}
    <section className="flex flex-col items-center">
      <h2 className="font-title mb-[0.7rem] text-[1.8rem] font-semibold tracking-[0.18em] text-[#E3C88B] uppercase">
        FINANCE
      </h2>

      <RoleRow role="DIRECTOR" name="ASHMAAN SOHAIL" />
      <RoleRow role="OFFICER" name="ELA AYDINER" />
    </section>

    {/* FIRST YEAR REPS */}
    <section className="flex flex-col items-center">
      <h2 className="font-title mb-[0.7rem] text-[1.8rem] font-semibold tracking-[0.18em] text-[#E3C88B] uppercase">
        FIRST YEAR REPS
      </h2>

      {["MOUCTAR DLALLO", "SOMIAYA HASSAN", "LISA LI", "NISHI SHAH"].map((n) => (
        <p key={n} className="font-credits text-[1rem] font-normal tracking-[0.12em] text-white uppercase">
          {n}
        </p>
      ))}
    </section>

    {/* LOGISTICS */}
    <section className="flex flex-col items-center">
      <h2 className="font-title mb-[0.7rem] text-[1.8rem] font-semibold tracking-[0.18em] text-[#E3C88B] uppercase">
        LOGISTICS
      </h2>

      <RoleRow role="DIRECTOR" name="ARYAMAN BHATIA" />
      <RoleRow role="DIRECTOR" name="VICTOR VONG" />
      <RoleRow role="OFFICER" name="ABDEL-RAHMAN MOBARAK" />
      <RoleRow role="OFFICER" name="FRANCOIS OLIVER" />
      <RoleRow role="OFFICER" name="AHMED EL SAWWAH" />
      <RoleRow role="OFFICER" name="JULIA TUN" />
    </section>

    {/* MARKETING */}
    <section className="flex flex-col items-center">
      <h2 className="font-title mb-[0.7rem] text-[1.8rem] font-semibold tracking-[0.18em] text-[#E3C88B] uppercase">
        MARKETING
      </h2>

      <RoleRow role="DIRECTOR" name="SUE OLIVEROS" />
      <RoleRow role="DIRECTOR" name="ROUNIKA SAXENA" />
      <RoleRow role="OFFICER" name="IVAN FANG" />
      <RoleRow role="OFFICER" name="BRANDON YIP" />
    </section>

    {/* OPERATIONS */}
    <section className="flex flex-col items-center">
      <h2 className="font-title mb-[0.7rem] text-[1.8rem] font-semibold tracking-[0.18em] text-[#E3C88B] uppercase">
        OPERATIONS
      </h2>

      <RoleRow role="DIRECTOR" name="JEFFRY WU" />
      <RoleRow role="OFFICER" name="RASTIN AGHIGHI" />
      <RoleRow role="OFFICER" name="HARISH KANDAVELL" />
    </section>

    {/* PARTNERSHIPS */}
    <section className="flex flex-col items-center">
      <h2 className="font-title mb-[0.7rem] text-[1.8rem] font-semibold tracking-[0.18em] text-[#E3C88B] uppercase">
        PARTNERSHIPS
      </h2>

      <RoleRow role="DIRECTOR" name="EASTAL LAW" />
      <RoleRow role="DIRECTOR" name="KELVIN NGUYEN" />
      <RoleRow role="OFFICER" name="JASON CHEN" />
      <RoleRow role="OFFICER" name="JESHNA KANDURI" />
      <RoleRow role="OFFICER" name="HARSH KALYANI" />
      <RoleRow role="OFFICER" name="JOSE KERKETTA" />
      <RoleRow role="OFFICER" name="MAIRA OPEL" />
    </section>

    {/* TECH */}
    <section className="flex flex-col items-center">
      <h2 className="font-title mb-[0.7rem] text-[1.8rem] font-semibold tracking-[0.18em] text-[#E3C88B] uppercase">TECH</h2>

      <RoleRow role="DIRECTOR" name="KOSI AMOBI-OLEKA" />
      <RoleRow role="DIRECTOR" name="KUZAY BILGIN" />
      <RoleRow role="OFFICER" name="TECHMENG AING" />
      <RoleRow role="OFFICER" name="AAYUSH ARYAL" />
      <RoleRow role="OFFICER" name="ISAAC FUNG" />
      <RoleRow role="OFFICER" name="ALFONSO SINA" />
    </section>
  </>
);

export default function TeamsCredits() {
  const trackRef = useRef<HTMLDivElement>(null);
  const pageRef = useRef<HTMLElement | null>(null);
  const [isMuted, setIsMuted] = useState(true);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const page = pageRef.current;
    const track = trackRef.current;
    if (!page || !track) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry.isIntersecting) {
          // Start the credits when in view, with a delay
          timeoutRef.current = setTimeout(() => {
            track.style.animationPlayState = "running";
          }, 1000);
        } else {
          // Pause the credits when out of view
          if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
          }
          track.style.animationPlayState = "paused";
        }
      },
      {
        threshold: 0.3, // 30% of the page visible
      },
    );

    observer.observe(page);

    return () => {
      observer.disconnect();
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return (
    <main id="team" ref={pageRef} className="relative flex h-screen w-full flex-col overflow-hidden bg-black lg:flex-row">
      {/* LEFT HALF – VIDEO */}
      <section className="relative flex h-1/3 w-full items-center justify-center lg:h-full lg:w-1/2">
        <video
          src="https://cdn.qhacks.io/assets/0f1ec19b-8d41-4eea-b053-27d046857fff.mp4"
          className="h-full w-full object-cover"
          autoPlay
          loop
          muted={isMuted}
          playsInline
        />

        {/* optional subtle overlay for readability */}
        <div className="pointer-events-none absolute inset-0 bg-black/30" />

        {/* Mute/Unmute Button */}
        <button
          onClick={() => setIsMuted(!isMuted)}
          className="absolute right-4 bottom-4 z-10 rounded-full bg-black/50 p-2 text-white backdrop-blur-sm transition-colors hover:bg-black/70"
          aria-label={isMuted ? "Unmute video" : "Mute video"}
        >
          {isMuted ? <VolumeX size={24} /> : <Volume2 size={24} />}
        </button>
      </section>

      {/* RIGHT HALF – CREDITS */}
      <section className="relative flex h-2/3 w-full items-center justify-center lg:h-full lg:w-1/2">
        <div className="credits-wrapper">
          <div className="credits-track" ref={trackRef}>
            <div className="credits">
              <CreditsContent />
            </div>
            <div className="credits">
              <CreditsContent />
            </div>
          </div>
        </div>

        {/* fade top & bottom so credits feel cinematic */}
        <div className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-black to-transparent" />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black to-transparent" />
      </section>

      <style jsx>{`
        .credits-wrapper {
          position: relative;
          width: 100%;
          height: 100%;
          overflow: hidden;
        }

        .credits-track {
          position: absolute;
          width: 100%;
          animation: scrollCredits 45s linear infinite;
          animation-play-state: paused;
          will-change: transform;
        }

        .credits {
          display: flex;
          flex-direction: column;
          gap: 3rem;
          text-align: center;
          padding-top: 5rem;
          padding-bottom: 5rem;
        }

        @keyframes scrollCredits {
          0% {
            transform: translateY(0);
          }
          100% {
            transform: translateY(-50%);
          }
        }
      `}</style>
    </main>
  );
}
