"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

import { Gallery4, type Gallery4Item } from "@/components/ui/gallery4";

const joinItems: Gallery4Item[] = [
  {
    id: "placeholder",
    title: "See the full flow",
    description: "Check-in, kickoff, hacking, demos, prizes, and the late-night stories.",
    href: "#joinus",
    image: "/static/join/placeholder.webp",
  },
  {
    id: "projects",
    title: "Projects you're proud of",
    description: "Build bold ideas with teammates who love shipping fast and clean.",
    href: "#joinus",
    image: "/static/join/hackers.webp",
  },
  {
    id: "schools",
    title: "Schools everywhere",
    description: "A cross-campus crew—teams form with hackers from all over.",
    href: "#joinus",
    image: "/static/join/school.webp",
  },
  {
    id: "mentors",
    title: "Mentors on speed dial",
    description: "PMs, designers, and engineers ready to unblock you in minutes, not hours.",
    href: "#joinus",
    image: "/static/join/mentors.webp",
  },
  {
    id: "applicant",
    title: "Newcomer-friendly",
    description: "First hackathon? You're in good company with structured support.",
    href: "#joinus",
    image: "/static/join/applicants.webp",
  },
];

const JoinUs = () => {
  const [isGalleryReady, setIsGalleryReady] = useState(false);

  useEffect(() => {
    // Defer gallery rendering until component is mounted
    const timer = setTimeout(() => setIsGalleryReady(true), 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <section
      id="joinus"
      className="relative z-10 flex min-h-screen w-full flex-col items-center justify-start overflow-hidden bg-black pt-12 pb-32 sm:pt-16 sm:pb-40"
    >
      {/* Noise texture */}
      <div
        className="pointer-events-none absolute inset-0 bg-cover bg-center opacity-50"
        style={{ backgroundImage: `url('/static/noise.png')` }}
        aria-hidden="true"
      />

      <div className="relative z-20 flex w-full max-w-6xl flex-col items-center gap-6 px-4 sm:gap-10 sm:px-6">
        <div className="flex w-full justify-center">
          <Image
            src="/static/join-us.webp"
            alt="Join QHacks"
            width={1200}
            height={600}
            sizes="(min-width: 1280px) 40vw, (min-width: 1024px) 50vw, (min-width: 768px) 60vw, 80vw"
            className="h-auto w-[82vw] max-w-lg object-contain sm:w-[70vw] md:w-[60vw] md:max-w-xl"
            loading="lazy"
            quality={80}
          />
        </div>

        <div className="w-full max-w-6xl">
          {isGalleryReady ? (
            <Gallery4 items={joinItems} />
          ) : (
            <div className="py-8 sm:py-12 md:py-16">
              <div className="flex w-full justify-center">
                <div className="relative w-[98vw] sm:w-[92vw] lg:w-[84vw] xl:w-[78vw]">
                  <div className="flex gap-4 overflow-hidden px-4">
                    {[...Array(3)].map((_, i) => (
                      <div
                        key={i}
                        className="h-[420px] w-[68vw] max-w-[360px] animate-pulse rounded-2xl bg-white/10 sm:w-[56vw] md:w-[48vw] lg:w-[360px]"
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default JoinUs;
