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
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-[#020202] text-white">
      {/* Background */}
      <div className="pointer-events-none absolute inset-0 bg-linear-to-b from-[#020202] to-[#2B2929]">
        <AnimatedStars />
      </div>

      <div className="relative z-10 w-full max-w-md space-y-6 rounded-2xl border border-white/10 bg-white/5 p-8 text-center backdrop-blur-sm">
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
  );
}
