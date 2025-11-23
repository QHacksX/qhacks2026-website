"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { authApi } from "@/lib/api";
import { useAuthStore } from "@/stores/auth";
import { toast } from "sonner";
import Link from "next/link";
import { CgSpinner } from "react-icons/cg";
import AnimatedStars from "@/components/ui/3d-models/Star";

export default function ResetPasswordPage() {
  const router = useRouter();
  const { login } = useAuthStore();
  const [token, setToken] = useState<string | null>(null);
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isCheckingToken, setIsCheckingToken] = useState(true);

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

    if (password.length < 8) {
      toast.error("Password must be at least 8 characters.");
      return;
    }

    setIsLoading(true);
    try {
      const response = await authApi.resetPassword({
        token,
        newPassword: password,
      });
      login(response.token);
      toast.success("Password reset successfully! Logging you in...");
      router.push("/dashboard");
    } catch (error: any) {
      console.error(error);
      toast.error(error.message || "Failed to reset password.");
    } finally {
      setIsLoading(false);
    }
  };

  if (isCheckingToken) {
    return null; // Or a loading spinner
  }

  if (!token) {
    return (
      <div className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden bg-[#020202] text-white">
        <div className="absolute inset-0 bg-gradient-to-b from-[#020202] to-[#2B2929] pointer-events-none">
          <AnimatedStars />
        </div>
        <div className="relative z-10 p-8 bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl text-center max-w-md w-full">
          <h1 className="text-2xl font-semibold text-red-500 mb-4">
            Invalid Link
          </h1>
          <p className="text-white/70 mb-6">
            This password reset link is invalid or missing.
          </p>
          <Link href="/" className="text-[#E3C676] hover:underline">
            Return Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="relative h-screen overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-[#020202] to-[#2B2929] flex justify-center items-center px-4 sm:px-6 lg:px-8">
        <AnimatedStars />

        <div className="relative w-full max-w-md sm:max-w-lg lg:max-w-xl">
          <h1 className="text-4xl sm:text-5xl font-semibold tracking-tight text-[#E3C676] text-center mb-6 sm:mb-8">
            Reset Password
          </h1>

          <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
            <div className="w-full">
              <label className="block text-base sm:text-lg font-semibold tracking-wide text-white mb-1 sm:mb-2">
                New Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-transparent text-white text-base sm:text-lg font-medium placeholder-white/80 focus:placeholder-transparent outline-none border border-[#C8B476] focus:border-[#E3C676] p-3 rounded-lg transition-colors"
                required
                minLength={8}
              />
            </div>

            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full sm:w-auto inline-flex items-center justify-center rounded-xl px-6 py-3 font-semibold shadow-lg hover:cursor-pointer hover:scale-105 transition-transform bg-[#E3C676] text-white min-w-[120px] mx-auto sm:mx-0"
              >
                {isLoading ? (
                  <>
                    <CgSpinner className="animate-spin text-xl mr-2" />
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
  );
}
