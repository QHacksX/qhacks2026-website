"use client";
import AnimatedStars from "@/components/ui/3d-models/Star";
import { toast } from "sonner";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect, Suspense } from "react";
import { IoIosClose, IoIosWarning } from "react-icons/io";
import { FaGithub, FaGoogle, FaCircle } from "react-icons/fa";
import { authApi, HTTPError, CaptchaCancelledError } from "@/lib/api";
import { useAuthStore } from "@/stores/auth";
import { handleGithubLogin, handleGoogleLogin } from "@/lib/auth-helpers";
import { Route } from "next";
import { motion } from "framer-motion";
import NoiseOverlay from "@/components/ui/noise-overlay";

const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [generalError, setGeneralError] = useState<string | null>(null);
  const router = useRouter();
  const searchParams = useSearchParams();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const login = useAuthStore((state) => state.login);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const redirectTo = searchParams.get("redirect_to");
    if (redirectTo) {
      localStorage.setItem("redirect_to", redirectTo);
    }
  }, [searchParams]);

  useEffect(() => {
    if (isAuthenticated) {
      const cachedRedirect = localStorage.getItem("redirect_to");
      if (cachedRedirect) {
        localStorage.removeItem("redirect_to");
      }
      router.replace((cachedRedirect || "/") as Route);
    }
  }, [isAuthenticated, router]);

  const handleForm = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    setGeneralError(null);
    setIsLoading(true);

    // Client-side validation
    const newErrors: Record<string, string> = {};
    if (!email) {
      newErrors.email = "Email is required";
    } else if (email.length < 5 || email.length > 255 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = "Invalid email address";
    }

    if (!password) {
      newErrors.password = "Password is required";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setIsLoading(false);
      return;
    }

    try {
      const response = await authApi.login({ email, password });
      login(response.token);
      toast.success("Signed in successfully");
    } catch (error) {
      if (error instanceof CaptchaCancelledError) {
        return;
      }
      if (error instanceof HTTPError) {
        if (error.isRateLimitError()) {
          setGeneralError("Too many requests. Please try again later.");
          return;
        }
        if (error.isFormError() && Array.isArray(error.errors)) {
          const newErrors: Record<string, string> = {};
          error.errors.forEach((err) => {
            newErrors[err.field] = err.message;
          });
          if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
          }
        }
        setGeneralError(error.message);
      } else {
        setGeneralError("An unexpected error occurred");
        console.error(error);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasswordReset = async () => {
    setErrors({});
    setGeneralError(null);

    if (!email) {
      setErrors({ email: "Email is required" });
      return;
    } else if (email.length < 5 || email.length > 255 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setErrors({ email: "Invalid email address" });
      return;
    }

    try {
      await authApi.forgotPassword({ email });
      toast.success("Check your email for password reset instructions");
    } catch (error) {
      if (error instanceof CaptchaCancelledError) {
        return;
      }
      if (error instanceof HTTPError) {
        if (error.isRateLimitError()) {
          toast.error("Too many requests. Please try again later.");
          return;
        }
        if (error.isFormError() && Array.isArray(error.errors)) {
          const newErrors: Record<string, string> = {};
          error.errors.forEach((err) => {
            newErrors[err.field] = err.message;
          });
          if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
          }
        }
        toast.error(error.message);
      } else {
        toast.error("An unexpected error occurred");
      }
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#050505] text-white selection:bg-[#E3C676] selection:text-black">
      <button
        onClick={() => router.push("/?skipIntro=true")}
        className="absolute top-6 left-6 z-50 text-white/70 transition-all hover:scale-110 hover:text-[#E3C676]"
      >
        <IoIosClose size={40} className="drop-shadow-lg sm:h-12 sm:w-12" />
      </button>

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
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="mb-8 text-center font-mono text-3xl font-bold tracking-tight text-[#E3C676] sm:text-4xl lg:text-5xl"
          style={{ textShadow: "0 0 20px rgba(227, 198, 118, 0.3)" }}
        >
          Sign In
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

                <form onSubmit={handleForm} className="space-y-6" noValidate>
                  <div className="w-full">
                    <label
                      htmlFor="email"
                      className="mb-2 block font-mono text-xs tracking-widest text-[#E3C676]/80 uppercase"
                    >
                      Email
                    </label>

                    <input
                      onChange={(e) => setEmail(e.target.value)}
                      id="email"
                      type="email"
                      className={`w-full rounded-lg border bg-black/40 p-3 text-white transition-all outline-none focus:bg-black/60 ${
                        errors.email ? "border-red-500" : "border-white/10 focus:border-[#E3C676]"
                      }`}
                      autoComplete="email"
                      required
                      value={email}
                      placeholder="Enter your email"
                    />
                    {errors.email && <p className="mt-1 font-mono text-xs text-red-500">{errors.email}</p>}
                  </div>
                  <div>
                    <label
                      htmlFor="password"
                      className="mb-2 block font-mono text-xs tracking-widest text-[#E3C676]/80 uppercase"
                    >
                      Password
                    </label>
                    <input
                      onChange={(e) => setPassword(e.target.value)}
                      id="password"
                      type="password"
                      className={`w-full rounded-lg border bg-black/40 p-3 text-white transition-all outline-none focus:bg-black/60 ${
                        errors.password ? "border-red-500" : "border-white/10 focus:border-[#E3C676]"
                      }`}
                      autoComplete="current-password"
                      required
                      value={password}
                      maxLength={128}
                      placeholder="Enter your password"
                    />
                    {errors.password && <p className="mt-1 font-mono text-xs text-red-500">{errors.password}</p>}
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

                  <div className="flex flex-col items-center justify-between gap-4 pt-2 sm:flex-row">
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="flex-1 rounded-xl bg-[#E3C676] px-8 py-3 font-bold tracking-widest text-black uppercase shadow-[0_0_10px_rgba(227,198,118,0.3)] transition-all hover:scale-[1.02] hover:shadow-[0_0_20px_rgba(227,198,118,0.5)] disabled:opacity-50 disabled:shadow-none disabled:hover:scale-100"
                    >
                      {isLoading ? "Signing in..." : "Login"}
                    </button>
                  </div>

                  <div className="text-center">
                    <button
                      type="button"
                      className="text-sm font-medium text-white/60 transition-colors hover:text-[#E3C676]"
                      onClick={handlePasswordReset}
                    >
                      Forgot Password?
                    </button>
                  </div>

                  <div className="relative flex items-center py-2">
                    <div className="grow border-t border-white/10"></div>
                    <span className="mx-4 shrink text-xs tracking-widest text-white/40 uppercase">Or continue with</span>
                    <div className="grow border-t border-white/10"></div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <button
                      type="button"
                      onClick={handleGithubLogin}
                      className="flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-black/40 px-4 py-3 font-medium text-white transition-all hover:border-[#E3C676]/50 hover:bg-black/60"
                    >
                      <FaGithub size={20} />
                      GitHub
                    </button>
                    <button
                      type="button"
                      onClick={handleGoogleLogin}
                      className="flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-black/40 px-4 py-3 font-medium text-white transition-all hover:border-[#E3C676]/50 hover:bg-black/60"
                    >
                      <FaGoogle size={20} />
                      Google
                    </button>
                  </div>
                </form>

                <div className="mt-8 text-center">
                  <p className="text-sm text-white/60">
                    Don&apos;t have an account?{" "}
                    <Link href="/register" className="font-bold text-[#E3C676] transition-colors hover:text-[#d4b86a]">
                      Register
                    </Link>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

const Login = () => {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  );
};

export default Login;
