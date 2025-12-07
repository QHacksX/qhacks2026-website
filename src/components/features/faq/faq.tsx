import Image from "next/image";
import { useState } from "react";

export default function FAQ() {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  const faqItems = [
    {
      id: 1,
      image: "/faq1.png",
      answer:
        "A hackathon is a 36-hour event where students come together to build a project from scratch. It's a great opportunity to learn new skills, meet new people, and win prizes!",
    },
    {
      id: 2,
      image: "/faq2.png",
      answer: "QHacks is fully in person located at Queens University in Kingston, Ontario.",
    },
    {
      id: 3,
      image: "/faq3.png",
      answer: "Teams can be formed with groups of 1-4.",
    },
    {
      id: 4,
      image: "/faq4.png",
      answer:
        "No problem! We will have team formation events before the hackathon. You can also find teammates on our Discord server, which will be released after applications have closed.",
    },
    {
      id: 5,
      image: "/faq5.png",
      answer: "QHacks is open to all undergraduate students from any university or college.",
    },
    {
      id: 6,
      image: "/faq6.png",
      answer:
        "This year hackathon theme will be announced closer towards the event. Follow us on social media to stay updated.",
    },
  ];

  const toggleAccordion = (index: number) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  return (
    <section
      id="faq"
      className="relative flex min-h-screen items-center justify-center bg-black bg-[url('/static/noise.png')] px-4 py-16"
    >
      {/* Noise Background */}
      <div
        className="pointer-events-none absolute inset-0 bg-cover bg-center opacity-50"
        style={{ backgroundImage: `url('/static/noise.png')` }}
        aria-hidden="true"
      />
      <div className="absolute inset-0 bg-gradient-to-br from-[#0A0A0A] via-[#101010] to-[#1A1A1A] opacity-90"></div>
      <div className="pointer-events-none absolute inset-0 bg-[url('/static/noise.png')] opacity-40 mix-blend-overlay" />

      <div className="relative z-10 flex w-full max-w-7xl flex-col gap-8 lg:flex-row lg:gap-12">
        {/* FAQ Title - Shows on top for mobile, right side for desktop */}
        <div className="flex flex-1 items-center justify-center lg:order-2">
          <div className="animate-float relative -rotate-1 transform">
            <Image
              src="/faq.svg" // <-- your TV FAQ image in /public
              alt="FAQ TV Screen"
              width={400}
              height={400}
              className="relative z-10 mx-auto h-auto w-[260px] object-contain md:w-[320px] lg:w-[380px]"
            />
          </div>
        </div>

        {/* FAQ Accordion - Shows below title on mobile, left side on desktop */}
        <div className="flex-1 lg:order-1">
          {faqItems.map((item, index) => (
            <div key={item.id} className="-mb-2 overflow-hidden transition-all duration-500 ease-in-out">
              <button
                onClick={() => toggleAccordion(index)}
                className="group w-full cursor-pointer transition-all duration-300"
                aria-expanded={expandedIndex === index}
              >
                <div className="relative w-full transition-all duration-300 group-hover:scale-[1.02]">
                  <Image
                    src={item.image}
                    alt={`FAQ ${item.id}`}
                    width={1200}
                    height={200}
                    className="w-full scale-90 object-contain"
                    priority={index < 2}
                  />
                </div>
              </button>

              {/* Answer Section */}
              <div
                className={`-mt-2 overflow-hidden transition-all duration-500 ease-in-out ${
                  expandedIndex === index ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
                }`}
              >
                <div className="animate-fadeIn relative mx-auto w-[90%] border-4 border-[#E3C676] bg-[#f5f5f0] p-6 shadow-xl md:p-8">
                  {/* Noise/Paper texture overlay */}
                  <div
                    className="pointer-events-none absolute inset-0 z-10 opacity-[0.6] mix-blend-overlay"
                    style={{
                      backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulance type='fractalNoise' baseFrequency='1.7' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
                      filter: "contrast(140%) brightness(100%)",
                    }}
                  />
                  <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/paper.png')] opacity-20"></div>

                  {/* Decorative corner accents */}
                  <div className="absolute -top-1 -left-1 h-3 w-3 border-t-2 border-l-2 border-black opacity-30"></div>
                  <div className="absolute -top-1 -right-1 h-3 w-3 border-t-2 border-r-2 border-black opacity-30"></div>
                  <div className="absolute -bottom-1 -left-1 h-3 w-3 border-b-2 border-l-2 border-black opacity-30"></div>
                  <div className="absolute -right-1 -bottom-1 h-3 w-3 border-r-2 border-b-2 border-black opacity-30"></div>

                  <p className="relative z-20 font-mono text-base leading-relaxed text-black md:text-lg">{item.answer}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
