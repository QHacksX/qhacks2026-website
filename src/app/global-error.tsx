"use client";

import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { IoIosCloseCircle } from "react-icons/io";
import NoiseOverlay from "@/components/ui/noise-overlay";

export default function GlobalError({ error, reset }: { error: Error; reset?: () => void }) {
  const router = useRouter();
  console.error(error);

  return (
    <html>
      <body>
        <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#050505] p-4 text-white selection:bg-[#E3C676] selection:text-black">
          <NoiseOverlay />
          <div className="pointer-events-none absolute inset-0 z-0 bg-[radial-gradient(circle_at_center,rgba(227,198,118,0.15)_0%,transparent_70%)] opacity-20"></div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative z-10 w-full max-w-lg space-y-8 rounded-3xl border border-white/5 bg-[#080808] p-8 text-center shadow-[0_0_100px_rgba(0,0,0,0.8),0_0_30px_rgba(227,198,118,0.05)]"
          >
            {/* Viewfinder Corners */}
            <div className="pointer-events-none absolute top-6 left-6 h-8 w-8 border-t-2 border-l-2 border-[#E3C676]/40"></div>
            <div className="pointer-events-none absolute top-6 right-6 h-8 w-8 border-t-2 border-r-2 border-[#E3C676]/40"></div>
            <div className="pointer-events-none absolute bottom-6 left-6 h-8 w-8 border-b-2 border-l-2 border-[#E3C676]/40"></div>
            <div className="pointer-events-none absolute right-6 bottom-6 h-8 w-8 border-r-2 border-b-2 border-[#E3C676]/40"></div>

            <div className="flex justify-center">
              <motion.div
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              >
                <IoIosCloseCircle className="text-8xl text-red-500 drop-shadow-[0_0_20px_rgba(239,68,68,0.4)]" />
              </motion.div>
            </div>

            <div className="space-y-4">
              <h1 className="text-4xl font-bold tracking-tighter text-[#E3C676] uppercase italic">Critical Error</h1>
              <div className="space-y-2">
                <p className="mx-auto max-w-sm font-mono text-sm leading-relaxed tracking-widest text-white/70 uppercase">
                  An unexpected error occurred. Wanna help us fix it? Join QHacks!
                </p>
                <p className="mx-auto max-w-sm font-mono text-xs leading-relaxed text-white/50">
                  {error?.message ?? "Unknown error"}
                </p>
              </div>
            </div>

            <div className="flex flex-col gap-4 pt-4 sm:flex-row sm:justify-center">
              <button
                onClick={() => router.push("/")}
                className="group flex items-center justify-center gap-2 font-mono text-xs font-bold tracking-[0.3em] text-white/40 uppercase transition-all hover:text-[#E3C676]"
              >
                <span className="transition-transform group-hover:-translate-x-1">&larr;</span>
                <span className="border-b border-transparent group-hover:border-[#E3C676]">Return Home</span>
              </button>
              {reset && (
                <button
                  onClick={() => reset()}
                  className="group flex items-center justify-center gap-2 font-mono text-xs font-bold tracking-[0.3em] text-white/40 uppercase transition-all hover:text-[#E3C676]"
                >
                  <span className="border-b border-transparent group-hover:border-[#E3C676]">Try Again</span>
                  <span className="transition-transform group-hover:translate-x-1">&rarr;</span>
                </button>
              )}
            </div>
          </motion.div>

          {/* Decorative scanning line */}
          <motion.div
            animate={{ top: ["0%", "100%", "0%"] }}
            transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
            className="pointer-events-none absolute left-0 z-20 h-px w-full bg-linear-to-r from-transparent via-[#E3C676]/10 to-transparent"
          />
        </div>
      </body>
    </html>
  );
}
