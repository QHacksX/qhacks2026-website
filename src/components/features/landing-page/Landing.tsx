"use client";

import { useAuthStore } from "@/stores/auth";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

const Landing = () => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const logout = useAuthStore((state) => state.logout);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <main id="home" className="relative z-10 w-full h-screen bg-black">
      
      {/* Noise texture */}
      <div
        className="absolute inset-0 bg-cover bg-center opacity-50 pointer-events-none"
        style={{ backgroundImage: `url('/static/noise.png')` }}
        aria-hidden="true"
      />

      <div className="w-full lg:w-[70%] h-full relative flex items-center justify-center px-4 lg:px-0">
        {/* Glow background - at the back (z-10) */}
        <div className="absolute inset-0 z-10 flex items-center justify-center">
          <Image
            src="/static/Ellipse.svg"
            alt="glowing ellipse"
            width={1200}
            height={1200}
            className="w-[85vw] lg:w-[65vw] max-w-[640px] object-contain opacity-90"
            priority
          />
        </div>

        {/* Crown - middle layer (z-20) */}
        <div className="absolute inset-0 z-20 flex items-center justify-center">
          <Image
            src="/static/crown.png"
            alt="QHacks crown"
            width={600}
            height={500}
            className="w-[320px] sm:w-[420px] md:w-[480px] lg:w-[520px] pointer-events-none mix-blend-screen -translate-y-3 sm:-translate-y-4 opacity-70"
            priority
          />
        </div>

        {/* QHacks 2026 text and actions - on top (z-30) */}
        <div className="absolute inset-0 z-30 flex flex-col items-center justify-center gap-5 pointer-events-none text-center translate-y-8 sm:translate-y-10">
          <div className="flex flex-col items-center gap-1">
            <h1
              className="text-[#e7dfcf] font-bold text-[44px] sm:text-[56px] md:text-[68px] lg:text-[76px] leading-tight tracking-tight"
              style={{ fontFamily: "'Space Grotesk', 'Inter', system-ui, sans-serif" }}
            >
              QHacks
            </h1>
            <p
              className="text-[#c3a046] font-semibold text-[30px] sm:text-[40px] md:text-[50px] lg:text-[58px] leading-tight tracking-tight"
              style={{ fontFamily: "'Space Grotesk', 'Inter', system-ui, sans-serif" }}
            >
              2026
            </p>
          </div>

          <div className="flex flex-col items-center pointer-events-auto gap-3">
            <Link
              href={mounted && isAuthenticated ? "/application" : "/register"}
              className="
                rounded-full border border-[#F4D389]
                px-9 py-2.5 text-base font-semibold tracking-wide
                text-[#f4d389]
                bg-transparent
                hover:bg-[rgba(244,211,137,0.08)] hover:text-[#f9e7b6]
                transition
                shadow-[0_10px_40px_rgba(244,211,137,0.2)]
              "
            >
              {mounted && isAuthenticated ? "Apply Now" : "Register Here"}
            </Link>
            {mounted && isAuthenticated ? (
              <div className="text-center space-y-2">
                <button
                  onClick={() => logout()}
                  className="text-[#F4D389] text-base font-semibold hover:underline hover:cursor-pointer"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="text-center space-y-1">
                <p className="text-white text-sm sm:text-base font-medium">Already have an account?</p>
                <Link href="/login" className="text-[#c3a046] text-base font-semibold hover:underline">
                  Login
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* RIGHT SIDE – Projector */}
      <div className="hidden lg:flex w-[30%] h-full items-end justify-end">
        <div className="absolute top-0 right-0 h-full w-auto">
          <Image
            src="/static/projector.svg"
            alt="projector"
            width={2000}
            height={13}
            className="h-full w-auto object-contain mix-blend-lighten drop-shadow-2xl pointer-events-none select-none"
            priority
          />
        </div>
      </div>

    </main>
  );
};

export default Landing;
