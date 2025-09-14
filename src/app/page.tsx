'use client';

import Timer from "@/components/Timer/timer";
import GoldWireSphereCanvas from "@/components/ui/3d-models/Sphere";
import AnimatedStars from "@/components/ui/3d-models/Star";
import NavBar from "@/components/ui/navbar/navbar";
import TwinkleEffect from "@/components/ui/Twinkle";
import Wave from "@/components/ui/wave";
import { signUserOut } from "@/firebase/auth/signout";
import { auth } from "@/firebase/config";
import { useCountdown } from "@/hooks/useCountdown";
import { useWindowSize } from "@/hooks/useWindowSize";
import { onAuthStateChanged } from "firebase/auth";
import { useEffect, useMemo, useState } from 'react';

export default function Home() {
  const [showFireworks, setShowFireworks] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [isSignedIn, setIsSignedIn] = useState(false);
  const size = useWindowSize()
  const t = useMemo(() => new Date("2026-02-06T17:00:00-05:00"), []);
  const countdown = useCountdown(t);
  

  useEffect(() => {
    const showTimer = setTimeout(() => {
      setShowFireworks(true);
      setTimeout(() => setIsVisible(true), 50);
    }, 100);

    const hideTimer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(() => setShowFireworks(false), 500);
    }, 4000);

    return () => {
      clearTimeout(showTimer);
      clearTimeout(hideTimer);
    };
  }, []);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setIsSignedIn(true);
      } else {
        setIsSignedIn(false);
      }
    });

    // Cleanup function to unsubscribe when component unmounts
    return () => unsubscribe();
  }, []);

  return (
    <main className="relative min-h-screen">
      {/* 0) Base gradient (behind everything) */}
      <div className="absolute inset-0  bg-gradient-to-b from-[#020202] to-[#2B2929]" />
      <Wave />

      {/* 1) Video layer (do NOT give it a solid background) */}
      {showFireworks && (
        <video
          className={`absolute inset-0 w-full h-full object-cover pointer-events-none transition-opacity duration-500 ${
            isVisible ? "opacity-100" : "opacity-0"
          }`}
          autoPlay
          muted
          loop
          playsInline
          style={{ mixBlendMode: 'screen' }}
        >
          <source src="/videos/firework.webm" type="video/webm" />
          Your browser does not support the video tag.
        </video>
      )}


      {/* 3) Your content on top */}
      <div className="relative z-30 flex flex-col items-center justify-center min-h-screen text-white px-4">
        {size.width && size.width < 650 ? (
          <>
            <GoldWireSphereCanvas position={[6, -6, 0]} radius={3} />
            <GoldWireSphereCanvas position={[-6, 7.5, 0]} radius={3} />
          </>
        ) : size.width && size.width < 1024 ? (
          <>
            <GoldWireSphereCanvas position={[10, -4, 0]} radius={4} />
            <GoldWireSphereCanvas position={[-10, 4, 0]} radius={4} />
          </>
        ) : (
          <>
            <GoldWireSphereCanvas position={[23, -3, 0]} radius={7} />
            <GoldWireSphereCanvas position={[-23, 0, 0]} radius={7} />
          </>
        )}
        

        <AnimatedStars />

        {/* <h1 className="text-3xl font-bold mb-4">Get ready to innovate!</h1> */}

        <div className="group relative z-40">
          <img
          src="/logo/logo.png"
          alt="QHacks Logo"
          className="w-60 h-auto sm:w-64 h-64 md:w-80 lg:w-112 xl:w-80 cursor-pointer transition-transform hover:scale-105"
        />
          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <TwinkleEffect />
          </div>
        </div>

        <p className="text-white font-bold  mb-4 sm:text-lg md:text-2xl lg:text-3xl xl:text-2xl">
          {/* 75 days, 15 hours, 20 minutes */}
          <Timer days={countdown.days} hours={countdown.hours} minutes={countdown.minutes} seconds={countdown.seconds} />
        </p>
        <button className=" text-white rounded-[100px] border-2 border-[#47483B] px-6 py-3 xl:text-lg lg:text-2xl lg:px-8 lg:py-4">
          Register Here
        </button>
        <div className="relative z-40">
         {!isSignedIn ? (
          <p className="mt-4 text-white font-montserrat text-xl font-bold">
            Already have an account?{" "}
            <a
              href="/signin"
              className="text-[#BF9F5F] font-montserrat text-xl font-bold hover:cursor-pointer"
            >
              Log in
            </a>
          </p>
        ) : (
          <div className="flex flex-col items-center space-y-3">
            <p 
          className="mt-4  text-white font-montserrat xl:text-2xl md:text-2xl lg:text-2xl sm:text-3xl font-bold hover:cursor-pointer"
          onClick={signUserOut}
          >
            Logout
          </p>
          </div>
        )}
         <div className="flex flex-col sm:flex-row sm:space-x-6 mt-3 justify-center items-center space-y-3 sm:space-y-0">
          <a href="#" className="hover:cursor-pointer">
            <img 
              src="/logo/instagram.svg" 
              alt="Instagram Logo" 
              className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 lg:w-14 lg:h-14 xl:w-10 xl:h-10 inline-block" 
            />
          </a>
          <a href="#" className="hover:cursor-pointer">
            <img 
              src="/logo/linkedin.svg" 
              alt="LinkedIn Logo" 
              className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 lg:w-14 lg:h-14 xl:w-10 xl:h-10 inline-block" 
            />
          </a>
        </div>
        </div>
      </div>
        <NavBar />

    </main>
  );
}
