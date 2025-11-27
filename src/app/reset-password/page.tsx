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
      <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-[#020202] text-white">
        <div className="pointer-events-none absolute inset-0 bg-linear-to-b from-[#020202] to-[#2B2929]">
          <AnimatedStars />
        </div>
        <div className="relative z-10 w-full max-w-md rounded-2xl border border-white/10 bg-white/5 p-8 text-center backdrop-blur-sm">
          <h1 className="mb-4 text-2xl font-semibold text-red-500">Invalid Link</h1>
          <p className="mb-6 text-white/70">This password reset link is invalid or missing.</p>
          <Link href="/" className="text-[#E3C676] hover:underline">
            Return Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="relative h-screen overflow-hidden">
      <div className="absolute inset-0 flex items-center justify-center bg-linear-to-b from-[#020202] to-[#2B2929] px-4 sm:px-6 lg:px-8">
        <AnimatedStars />

        <div className="relative w-full max-w-md sm:max-w-lg lg:max-w-xl">
          <h1 className="mb-6 text-center text-4xl font-semibold tracking-tight text-[#E3C676] sm:mb-8 sm:text-5xl">
            Reset Password
          </h1>

          <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6" noValidate>
            <div className="w-full">
              <label className="mb-1 block text-base font-semibold tracking-wide text-white sm:mb-2 sm:text-lg">
                New Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={`w-full rounded-lg border bg-transparent p-3 text-base font-medium text-white placeholder-white/80 transition-colors outline-none focus:placeholder-transparent sm:text-lg ${
                  errors.newPassword ? "border-red-500 focus:border-red-500" : "border-[#C8B476] focus:border-[#E3C676]"
                }`}
                maxLength={128}
              />
              {errors.newPassword && <p className="mt-1 text-sm font-medium text-red-500">{errors.newPassword}</p>}
            </div>

            {generalError && (
              <div className="flex items-start gap-3 rounded-lg border border-red-500/20 bg-red-500/10 p-3">
                <IoIosWarning className="mt-0.5 shrink-0 text-xl text-red-500" />
                <p className="text-sm text-red-200">{generalError}</p>
              </div>
            )}

            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="mx-auto inline-flex w-full min-w-[120px] items-center justify-center rounded-xl bg-[#E3C676] px-6 py-3 font-semibold text-white shadow-lg transition-transform hover:scale-105 hover:cursor-pointer sm:mx-0 sm:w-auto"
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
  );
}
