"use client";
import AnimatedStars from "@/components/ui/3d-models/Star";
import { toast } from "sonner";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect, Suspense } from "react";
import { IoIosClose, IoIosWarning } from "react-icons/io";
import { FaGithub, FaGoogle } from "react-icons/fa";
import { authApi, HTTPError, CaptchaCancelledError } from "@/lib/api";
import { useAuthStore } from "@/stores/auth";
import { handleGithubLogin, handleGoogleLogin } from "@/lib/auth-helpers";
import { Route } from "next";

const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [generalError, setGeneralError] = useState<string | null>(null);
  const router = useRouter();
  const searchParams = useSearchParams();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const login = useAuthStore((state) => state.login);

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
    <div className="relative h-screen overflow-hidden">
      <Link href="/" className="absolute left-0 z-10 p-5 text-white">
        <IoIosClose size={50} />
      </Link>

      <div className="absolute inset-0 flex items-center justify-center bg-linear-to-b from-[#020202] to-[#2B2929] px-4 sm:px-6 lg:px-8">
        <AnimatedStars />
        <div className="relative w-full max-w-md sm:max-w-lg lg:max-w-xl">
          <h1 className="mb-6 text-center text-4xl font-semibold tracking-tight text-[#E3C676] sm:mb-8 sm:text-5xl">
            Sign In
          </h1>
          <form onSubmit={handleForm} className="space-y-4 sm:space-y-6" noValidate>
            <div className="w-full">
              <label
                htmlFor="email"
                className="mb-1 block text-base font-semibold tracking-wide text-white sm:mb-2 sm:text-lg"
              >
                Email
              </label>

              <input
                onChange={(e) => setEmail(e.target.value)}
                id="email"
                type="email"
                className={`w-full border bg-transparent text-base font-medium text-white placeholder-white/80 outline-none focus:placeholder-transparent sm:text-lg ${
                  errors.email ? "border-red-500 focus:border-red-500" : "border-[#C8B476] focus:border-[#E3C676]"
                } rounded-lg p-3 transition-colors`}
                autoComplete="email"
                required
                value={email}
              />
              {errors.email && <p className="mt-1 text-sm text-red-500">{errors.email}</p>}
            </div>
            <div>
              <label
                htmlFor="password"
                className="mb-1 block text-base font-semibold tracking-wide text-white sm:mb-2 sm:text-lg"
              >
                Password
              </label>
              <input
                onChange={(e) => setPassword(e.target.value)}
                id="password"
                type="password"
                className={`w-full border bg-transparent text-lg font-medium text-white placeholder-white/80 outline-none focus:placeholder-transparent ${
                  errors.password ? "border-red-500 focus:border-red-500" : "border-[#C8B476] focus:border-[#E3C676]"
                } rounded-lg p-3 transition-colors`}
                autoComplete="current-password"
                required
                value={password}
                maxLength={128}
              />
              {errors.password && <p className="mt-1 text-sm text-red-500">{errors.password}</p>}
            </div>

            {generalError && (
              <div className="flex items-center gap-2 rounded-lg border border-red-500/50 bg-red-500/10 p-3">
                <IoIosWarning className="shrink-0 text-xl text-red-500" />
                <p className="text-left text-sm font-medium text-red-500">{generalError}</p>
              </div>
            )}

            <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
              <button
                type="submit"
                className="inline-flex items-center rounded-xl bg-[#E3C676] px-6 py-3 font-semibold text-white shadow-lg transition hover:scale-105 hover:cursor-pointer"
              >
                Login
              </button>
              <button
                type="button"
                className="rounded-lg px-5 py-2.5 text-center text-sm font-medium text-white hover:cursor-pointer hover:text-[#E3C676] sm:w-auto"
                onClick={handlePasswordReset}
              >
                Forgot Password
              </button>
            </div>

            <div className="my-6 flex items-center gap-4">
              <div className="h-px flex-1 bg-white/20" />
              <span className="text-sm text-white/60">Or continue with</span>
              <div className="h-px flex-1 bg-white/20" />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <button
                type="button"
                onClick={handleGithubLogin}
                className="flex items-center justify-center gap-2 rounded-xl border border-white/20 px-4 py-3 font-medium text-white transition-colors hover:bg-white/10"
              >
                <FaGithub size={20} />
                GitHub
              </button>
              <button
                type="button"
                onClick={handleGoogleLogin}
                className="flex items-center justify-center gap-2 rounded-xl border border-white/20 px-4 py-3 font-medium text-white transition-colors hover:bg-white/10"
              >
                <FaGoogle size={20} />
                Google
              </button>
            </div>
          </form>
          <div className="mt-6 text-center">
            <p className="text-lg text-white">
              Don&apos;t have an account?{" "}
              <Link href="/register" className="underline underline-offset-4 transition-colors hover:text-[#E3C676]">
                Register!
              </Link>
            </p>
          </div>
        </div>
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
