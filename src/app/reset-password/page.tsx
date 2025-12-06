"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { authApi, HTTPError } from "@/lib/api";
import { useAuthStore } from "@/stores/auth";
import { toast } from "sonner";
import Link from "next/link";
import { CgSpinner } from "react-icons/cg";
import { IoIosWarning } from "react-icons/io";
import AnimatedStars from "@/components/ui/3d-models/Star";
import { motion } from "framer-motion";
import { FaCircle } from "react-icons/fa";
import NoiseOverlay from "@/components/ui/noise-overlay";

export default function ResetPasswordPage() {
  const router = useRouter();
  const { login } = useAuthStore();
  const [token, setToken] = useState<string | null>(null);
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isCheckingToken, setIsCheckingToken] = useState(true);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [generalError, setGeneralError] = useState<string | null>(null);

  useEffect(() => {
    const hash = window.location.hash;
    const params = new URLSearchParams(hash.substring(1));
    const tokenParam = params.get("token");

    if (tokenParam) {
      setToken(tokenParam);
    }
    setIsCheckingToken(false);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;

    setErrors({});
    setGeneralError(null);

    if (password.length < 8) {
      setErrors({ newPassword: "Password must be at least 8 characters" });
      return;
    }

    setIsLoading(true);

    try {
      const response = await authApi.resetPassword({
        token,
        newPassword: password,
      });
      login(response.token);
      toast.success("Password reset successfully! Redirecting...");
      setTimeout(() => {
        router.push("/");
      }, 2000);
    } catch (error) {
      console.error(error);
      if (error instanceof HTTPError) {
        if (error.isFormError() && Array.isArray(error.errors)) {
          const newErrors: Record<string, string> = {};
          error.errors.forEach((err) => {
            newErrors[err.field] = err.message;
          });
          if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            setIsLoading(false);
            return;
          }
        }
        setGeneralError(error.message);
      } else {
        setGeneralError("An unexpected error occurred");
      }
      setIsLoading(false);
    }
  };

  if (isCheckingToken) {
    return null; // Or a loading spinner
  }

  if (!token) {
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

        <div className="relative z-10 container mx-auto flex min-h-screen max-w-lg flex-col justify-center px-4 py-12 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.1 }}>
            <div className="relative rounded-3xl bg-[#080808] p-4 shadow-[0_0_100px_rgba(0,0,0,0.8),0_0_30px_rgba(227,198,118,0.05)] ring-1 ring-white/5">
              <div className="relative overflow-hidden rounded-2xl border border-white/5 bg-black shadow-[inset_0_0_40px_rgba(0,0,0,1)]">
                <div className="pointer-events-none absolute inset-0 z-20 rounded-2xl bg-linear-to-tr from-transparent via-white/3 to-transparent opacity-50"></div>
                <div className="relative z-10 p-8 text-center sm:p-10">
                  <h1 className="mb-4 text-2xl font-semibold text-red-500">Invalid Link</h1>
                  <p className="mb-6 text-white/70">This password reset link is invalid or missing.</p>
                  <Link href="/" className="text-[#E3C676] hover:underline">
                    Return Home
                  </Link>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

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
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="mb-8 text-center font-mono text-3xl font-bold tracking-tight text-[#E3C676] sm:text-4xl lg:text-5xl"
          style={{ textShadow: "0 0 20px rgba(227, 198, 118, 0.3)" }}
        >
          Reset Password
        </motion.h1>

        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.1 }}>
          {/* Movie Theater Screen Container */}
          <div className="relative rounded-3xl bg-[#080808] p-4 shadow-[0_0_100px_rgba(0,0,0,0.8),0_0_30px_rgba(227,198,118,0.05)] ring-1 ring-white/5">
            {/* Inner Bezel */}
            <div className="relative overflow-hidden rounded-2xl border border-white/5 bg-black shadow-[inset_0_0_40px_rgba(0,0,0,1)]">
              {/* Screen Reflection/Gloss */}
              <div className="pointer-events-none absolute inset-0 z-20 rounded-2xl bg-linear-to-tr from-transparent via-white/3 to-transparent opacity-50"></div>

              <div className="relative z-10 p-6 sm:p-10">
                {/* Viewfinder Corners */}
                <div className="pointer-events-none absolute top-6 left-6 h-8 w-8 border-t-2 border-l-2 border-[#E3C676]/60"></div>
                <div className="pointer-events-none absolute top-6 right-6 h-8 w-8 border-t-2 border-r-2 border-[#E3C676]/60"></div>
                <div className="pointer-events-none absolute bottom-6 left-6 h-8 w-8 border-b-2 border-l-2 border-[#E3C676]/60"></div>
                <div className="pointer-events-none absolute right-6 bottom-6 h-8 w-8 border-r-2 border-b-2 border-[#E3C676]/60"></div>

                <form onSubmit={handleSubmit} className="space-y-6" noValidate>
                  <div className="w-full">
                    <label className="mb-2 block font-mono text-xs tracking-widest text-[#E3C676]/80 uppercase">
                      New Password
                    </label>
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className={`w-full rounded-lg border bg-black/40 p-3 text-white transition-all outline-none focus:bg-black/60 ${
                        errors.newPassword ? "border-red-500" : "border-white/10 focus:border-[#E3C676]"
                      }`}
                      maxLength={128}
                      placeholder="Enter new password"
                    />
                    {errors.newPassword && <p className="mt-1 font-mono text-xs text-red-500">{errors.newPassword}</p>}
                  </div>

                  {generalError && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex items-center gap-3 rounded-lg border border-red-500/50 bg-red-500/10 p-4 backdrop-blur-sm"
                    >
                      <IoIosWarning className="shrink-0 text-xl text-red-500" />
                      <p className="font-mono text-sm font-bold tracking-wide text-red-500 uppercase">{generalError}</p>
                    </motion.div>
                  )}

                  <div>
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="flex w-full items-center justify-center rounded-xl bg-[#E3C676] px-8 py-3 font-bold tracking-widest text-black uppercase shadow-[0_0_10px_rgba(227,198,118,0.3)] transition-all hover:scale-[1.02] hover:shadow-[0_0_20px_rgba(227,198,118,0.5)] disabled:opacity-50 disabled:shadow-none disabled:hover:scale-100"
                    >
                      {isLoading ? (
                        <>
                          <CgSpinner className="mr-2 animate-spin text-xl" />
                          Resetting...
                        </>
                      ) : (
                        "Reset Password"
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
