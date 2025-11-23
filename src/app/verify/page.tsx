"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { authApi } from "@/lib/api";
import { useAuthStore } from "@/stores/auth";
import { toast } from "sonner";
import Link from "next/link";
import Image from "next/image";
import { CgSpinner } from "react-icons/cg";
import { IoIosCheckmarkCircle, IoIosCloseCircle } from "react-icons/io";
import AnimatedStars from "@/components/ui/3d-models/Star";

export default function VerifyPage() {
  const router = useRouter();
  const { isAuthenticated } = useAuthStore();
  const [status, setStatus] = useState<"loading" | "success" | "error">(
    "loading",
  );

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
    <div className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden bg-[#020202] text-white">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#020202] to-[#2B2929] pointer-events-none">
        <AnimatedStars />
      </div>

      <div className="relative z-10 w-full max-w-md p-8 bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl text-center space-y-6">
        {status === "loading" && (
          <>
            <CgSpinner className="animate-spin text-[#E3C676] text-6xl mx-auto" />
            <h1 className="text-2xl font-semibold">Verifying Email...</h1>
            <p className="text-white/70">
              Please wait while we verify your email address.
            </p>
          </>
        )}

        {status === "success" && (
          <>
            <IoIosCheckmarkCircle className="text-green-500 text-6xl mx-auto" />
            <h1 className="text-2xl font-semibold text-green-500">
              Email Verified!
            </h1>
            <p className="text-white/70">
              Your email has been successfully verified.
            </p>
            <button
              onClick={() => router.push(isAuthenticated ? "/" : "/login")}
              className="inline-block w-full bg-[#E3C676] text-black font-bold py-3 px-6 rounded-xl hover:scale-[1.02] transition-transform"
            >
              {isAuthenticated ? "Return Home" : "Login"}
            </button>
          </>
        )}

        {status === "error" && (
          <>
            <IoIosCloseCircle className="text-red-500 text-6xl mx-auto" />
            <h1 className="text-2xl font-semibold text-red-500">
              Verification Failed
            </h1>
            <p className="text-white/70">
              The verification link is invalid or has expired.
            </p>
            <button
              onClick={() => router.push("/")}
              className="inline-block w-full bg-white/10 text-white font-bold py-3 px-6 rounded-xl hover:bg-white/20 transition-colors"
            >
              Return Home
            </button>
          </>
        )}
      </div>
    </div>
  );
}
