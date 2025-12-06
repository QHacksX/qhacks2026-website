"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import type { Route } from "next";
import { authApi } from "@/lib/api";
import { useAuthStore } from "@/stores/auth";
import { toast } from "sonner";
import { CgSpinner } from "react-icons/cg";
import { IoIosCheckmarkCircle, IoIosCloseCircle } from "react-icons/io";
import AnimatedStars from "@/components/ui/3d-models/Star";
import { motion } from "framer-motion";
import { FaCircle } from "react-icons/fa";
import NoiseOverlay from "@/components/ui/noise-overlay";

export default function VerifyPage() {
  const router = useRouter();
  const { isAuthenticated } = useAuthStore();
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");

  useEffect(() => {
    const verifyToken = async () => {
      // Parse token from hash: #token=...
      // We use window.location.hash directly because Next.js router doesn't expose hash params easily in server components or initial render
      const hash = window.location.hash;
      const params = new URLSearchParams(hash.substring(1)); // remove #
      const token = params.get("token");

      if (!token) {
        setStatus("error");
        // Only show toast if we're done loading to avoid flash
        return;
      }

      try {
        await authApi.verify({ token });
        setStatus("success");
        toast.success("Email verified successfully!");
      } catch (error) {
        console.error(error);
        setStatus("error");
        toast.error("Failed to verify email. The link may be expired.");
      }
    };

    verifyToken();
  }, []);

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#050505] text-white selection:bg-[#E3C676] selection:text-black">
      {/* Background Elements */}
      <div className="pointer-events-none absolute inset-0 z-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,var(--tw-gradient-stops))] from-[#1a1a1a] via-[#020202] to-[#000000]"></div>
        <AnimatedStars />
        <NoiseOverlay />
        <div className="absolute inset-0 z-2 bg-[radial-gradient(circle_at_center,transparent_50%,rgba(0,0,0,0.8)_100%)]"></div>
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

              <div className="relative z-10 flex flex-col items-center gap-6 p-8 text-center sm:p-10">
                {/* Viewfinder Corners */}
                <div className="pointer-events-none absolute top-6 left-6 h-8 w-8 border-t-2 border-l-2 border-[#E3C676]/60"></div>
                <div className="pointer-events-none absolute top-6 right-6 h-8 w-8 border-t-2 border-r-2 border-[#E3C676]/60"></div>
                <div className="pointer-events-none absolute bottom-6 left-6 h-8 w-8 border-b-2 border-l-2 border-[#E3C676]/60"></div>
                <div className="pointer-events-none absolute right-6 bottom-6 h-8 w-8 border-r-2 border-b-2 border-[#E3C676]/60"></div>

                {status === "loading" && (
                  <>
                    <CgSpinner className="mx-auto animate-spin text-6xl text-[#E3C676]" />
                    <h1 className="text-2xl font-semibold">Verifying Email...</h1>
                    <p className="text-white/70">Please wait while we verify your email address.</p>
                  </>
                )}

                {status === "success" && (
                  <>
                    <IoIosCheckmarkCircle className="mx-auto text-6xl text-green-500" />
                    <h1 className="text-2xl font-semibold text-green-500">Email Verified!</h1>
                    <p className="text-white/70">Your email has been successfully verified.</p>
                    <button
                      onClick={() => router.push((isAuthenticated ? "/" : "/login") as Route)}
                      className="inline-block w-full rounded-xl bg-[#E3C676] px-6 py-3 font-bold text-black transition-transform hover:scale-[1.02]"
                    >
                      {isAuthenticated ? "Return Home" : "Login"}
                    </button>
                  </>
                )}

                {status === "error" && (
                  <>
                    <IoIosCloseCircle className="mx-auto text-6xl text-red-500" />
                    <h1 className="text-2xl font-semibold text-red-500">Verification Failed</h1>
                    <p className="text-white/70">The verification link is invalid or has expired.</p>
                    <button
                      onClick={() => router.push("/")}
                      className="inline-block w-full rounded-xl bg-white/10 px-6 py-3 font-bold text-white transition-colors hover:bg-white/20"
                    >
                      Return Home
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
