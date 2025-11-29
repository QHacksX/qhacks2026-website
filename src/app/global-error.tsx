"use client";

import { useRouter } from "next/navigation";
import { IoIosCloseCircle } from "react-icons/io";
import AnimatedStars from "@/components/ui/3d-models/Star";

export default function GlobalError({ error }: { error: Error; reset?: () => void }) {
  const router = useRouter();
  console.error(error);

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-[#020202] text-white">
      <div className="pointer-events-none absolute inset-0 bg-linear-to-b from-[#020202] to-[#2B2929]">
        <AnimatedStars />
      </div>

      <div className="relative z-10 w-full max-w-md space-y-6 rounded-2xl border border-white/10 bg-white/5 p-8 text-center backdrop-blur-sm">
        <IoIosCloseCircle className="mx-auto text-6xl text-red-500" />
        <h1 className="text-2xl font-semibold text-white">Unexpected Error</h1>
        <p className="text-white/70">An unexpected error occurred. Wanna help us fix it? Join QHacks!</p>
        <p className="text-white/70">Details: {error?.message ?? "Unknown error"}</p>

        <button
          onClick={() => router.push("/")}
          className="inline-block rounded-xl bg-white/10 px-6 py-3 font-bold text-white transition-colors hover:bg-white/20"
        >
          Return Home
        </button>
      </div>
    </div>
  );
}
