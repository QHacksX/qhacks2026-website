"use client";

import { useEffect, useRef, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import type { Route } from "next";
import { authApi } from "@/lib/api";
import { useAuthStore } from "@/stores/auth";
import { toast } from "sonner";
import AnimatedStars from "@/components/ui/3d-models/Star";
import { FaGoogle, FaCircle } from "react-icons/fa";
import { CgSpinner } from "react-icons/cg";
import { motion } from "framer-motion";
import NoiseOverlay from "@/components/ui/noise-overlay";

const GoogleCallbackContent = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const code = searchParams.get("code");
  const error = searchParams.get("error");
  const errorDescription = searchParams.get("error_description");
  const processedRef = useRef(false);

  useEffect(() => {
    if (processedRef.current) return;

    if (error) {
      processedRef.current = true;
      toast.error(errorDescription || "Failed to sign in with Google");
      router.push("/login");
      return;
    }

    if (!code) return;
    processedRef.current = true;

    const login = async () => {
      try {
        const response = await authApi.googleCallback({
          code,
          redirectUri: `${window.location.origin}/google-callback`,
        });
        useAuthStore.getState().login(response.token);
        const redirectTo = localStorage.getItem("redirect_to");
        if (redirectTo) {
          localStorage.removeItem("redirect_to");
        }
        router.push((redirectTo || "/?skipIntro=true") as Route);
      } catch (error) {
        console.error(error);
        toast.error("Failed to sign in with Google");
      }
    };

    login();
  }, [code, error, errorDescription, router]);

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#050505] text-white selection:bg-[#E3C676] selection:text-black">
      {/* Background Elements */}
      <div className="pointer-events-none absolute inset-0 z-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,var(--tw-gradient-stops))] from-[#1a1a1a] via-[#020202] to-[#000000]"></div>
        <AnimatedStars />
        <NoiseOverlay />
        {/* Vintage Vignette */}
        <div className="absolute inset-0 z-2 bg-[radial-gradient(circle_at_center,transparent_50%,rgba(0,0,0,0.8)_100%)]"></div>
        {/* Film Scratch Overlay (Subtle) */}
        <div className="absolute inset-0 z-2 animate-pulse bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-[0.03]"></div>
      </div>

      {/* REC Indicator - Top Right */}
      <motion.div
        className="fixed top-8 right-8 z-50 flex items-center gap-3"
        animate={{ opacity: [1, 0.3, 1] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
      >
        <FaCircle className="text-red-600 drop-shadow-[0_0_8px_rgba(220,38,38,0.8)]" size={14} />
        <span className="font-mono text-xl font-bold tracking-[0.2em] text-white/90 drop-shadow-md">REC</span>
      </motion.div>

      <div className="relative z-10 container mx-auto flex min-h-screen max-w-lg flex-col justify-center px-4 py-12 sm:px-6 lg:px-8">
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.1 }}>
          {/* Movie Theater Screen Container */}
          <div className="relative rounded-3xl bg-[#080808] p-4 shadow-[0_0_100px_rgba(0,0,0,0.8),0_0_30px_rgba(227,198,118,0.05)] ring-1 ring-white/5">
            {/* Inner Bezel */}
            <div className="relative overflow-hidden rounded-2xl border border-white/5 bg-black shadow-[inset_0_0_40px_rgba(0,0,0,1)]">
              {/* Screen Reflection/Gloss */}
              <div className="pointer-events-none absolute inset-0 z-20 rounded-2xl bg-linear-to-tr from-transparent via-white/3 to-transparent opacity-50"></div>

              <div className="relative z-10 flex flex-col items-center gap-6 p-8 sm:p-10">
                {/* Viewfinder Corners */}
                <div className="pointer-events-none absolute top-6 left-6 h-8 w-8 border-t-2 border-l-2 border-[#E3C676]/60"></div>
                <div className="pointer-events-none absolute top-6 right-6 h-8 w-8 border-t-2 border-r-2 border-[#E3C676]/60"></div>
                <div className="pointer-events-none absolute bottom-6 left-6 h-8 w-8 border-b-2 border-l-2 border-[#E3C676]/60"></div>
                <div className="pointer-events-none absolute right-6 bottom-6 h-8 w-8 border-r-2 border-b-2 border-[#E3C676]/60"></div>

                <FaGoogle className="text-6xl text-white" />
                <div className="flex items-center gap-3 text-xl font-semibold text-white">
                  <CgSpinner className="animate-spin text-[#E3C676]" />
                  Authenticating with Google...
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

const GoogleCallback = () => {
  return (
    <Suspense>
      <GoogleCallbackContent />
    </Suspense>
  );
};

export default GoogleCallback;
