"use client";

import Image from "next/image";
import Link from "next/link";
import { useAuthStore } from "@/stores/auth";
import { useEffect, useState } from "react";

const Landing = () => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const logout = useAuthStore((state) => state.logout);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <main className="relative z-10 w-full h-screen bg-black">
      
      {/* Noise texture */}
      <div
        className="absolute inset-0 bg-cover bg-center opacity-50 pointer-events-none"
        style={{ backgroundImage: `url('/static/noise.png')` }}
        aria-hidden="true"
      />

      <div className="w-[70%] h-full relative flex items-center justify-center">
        
        {/* Glow background */}
        <Image
          src="/static/Ellipse.svg"
          alt="glowing ellipse"
          width={900}
          height={900}
          className="absolute w-[70vw] max-w-[580px] object-contain"
          priority
        />

        {/* Grouped Crown + Logo */}
        <div className="absolute flex flex-col items-center justify-center">
          
          {/* Crown */}
          <Image
            src="/static/crown.png"
            alt="QHacks crown"
            width={600}
            height={500}
            className="w-[400px]  pointer-events-none mix-blend-screen"
            priority
          />

          {/* QHacks 2026 logo on top of crown */}
          <Image
            src="/static/logo-text.png"
            alt="QHacks logo"
            width={500}
            height={300}
            className="absolute top-[30%] w-[250px] object-contain pointer-events-none"
            priority
          />
        </div>
        <div className="absolute flex flex-col items-center top-[65%]">
          <Link
            href={mounted && isAuthenticated ? "/application" : "/register"}
            className="
              rounded-full border border-[#BF9F5F]
              px-8 py-3 text-sm
              text-[#f4d389]
              bg-[rgba(217,217,217,0)]
              hover:bg-[#f4d389] hover:text-black
              transition
              shadow-[0_0_20px_rgba(244,211,137,0.45)]
            "
          >
            {mounted && isAuthenticated ? "Apply Now" : "Register Here"}
          </Link>
          {mounted && isAuthenticated ? (
            <div className="mt-4 text-center space-y-1">
              <button
                onClick={() => logout()}
                className="text-[#BF9F5F] hover:underline hover:cursor-pointer"
              >
                Logout
              </button>
            </div>
          ) : (
            <div className="mt-4 text-center space-y-1">
              <p className="text-white">Already have an Account?</p>
              <Link href="/login" className="text-[#BF9F5F]">
                Log in
              </Link>
            </div>
          )}
        </div>
        

      </div>

      {/* RIGHT SIDE – Projector */}
      <div className="w-[30%] h-full flex items-end justify-end">
        <div className="absolute top-0 right-0 h-full w-auto">
          <Image
            src="/static/projector.svg"
            alt="projector"
            width={2000}
            height={13}
            className="h-full w-auto object-contain mix-blend-lighten drop-shadow-2xl"
            priority
          />
        </div>
      </div>

    </main>
  );
};

export default Landing;
