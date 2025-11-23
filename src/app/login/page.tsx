"use client";
import AnimatedStars from "@/components/ui/3d-models/Star";
import { toast } from "sonner";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import { IoIosClose, IoIosWarning } from "react-icons/io";
import { FaGithub, FaGoogle } from "react-icons/fa";
import { authApi, HTTPError, CaptchaCancelledError } from "@/lib/api";
import { useAuthStore } from "@/stores/auth";
import { handleGithubLogin, handleGoogleLogin } from "@/lib/auth-helpers";

const Login = () => {
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
      router.replace(cachedRedirect || "/");
    }
  }, [isAuthenticated, router]);

  const handleForm = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    setGeneralError(null);

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
      <Link href="/" className="p-5 absolute left-0 z-10 text-white">
        <IoIosClose size={50} />
      </Link>

      <div className=" absolute inset-0 bg-gradient-to-b from-[#020202] to-[#2B2929] flex justify-center items-center px-4 sm:px-6 lg:px-8">
        <AnimatedStars />
        <div className="relative w-full max-w-md sm:max-w-lg lg:max-w-xl">
          <h1 className="text-4xl sm:text-5xl font-semibold tracking-tight text-[#E3C676] text-center mb-6 sm:mb-8">
            Sign In
          </h1>
          <form
            onSubmit={handleForm}
            className="space-y-4 sm:space-y-6"
            noValidate
          >
            <div className="w-full">
              <label
                htmlFor="email"
                className="block text-base sm:text-lg font-semibold tracking-wide text-white mb-1 sm:mb-2"
              >
                Email
              </label>

              <input
                onChange={(e) => setEmail(e.target.value)}
                id="email"
                type="email"
                className={`w-full bg-transparent text-white text-base sm:text-lg font-medium placeholder-white/80 focus:placeholder-transparent outline-none border ${
                  errors.email
                    ? "border-red-500 focus:border-red-500"
                    : "border-[#C8B476] focus:border-[#E3C676]"
                } p-3 rounded-lg transition-colors`}
                autoComplete="email"
                required
                value={email}
              />
              {errors.email && (
                <p className="text-red-500 text-sm mt-1">{errors.email}</p>
              )}
            </div>
            <div>
              <label
                htmlFor="password"
                className="block text-base sm:text-lg font-semibold tracking-wide text-white mb-1 sm:mb-2"
              >
                Password
              </label>
              <input
                onChange={(e) => setPassword(e.target.value)}
                id="password"
                type="password"
                className={`w-full bg-transparent text-white text-lg font-medium placeholder-white/80 focus:placeholder-transparent outline-none border ${
                  errors.password
                    ? "border-red-500 focus:border-red-500"
                    : "border-[#C8B476] focus:border-[#E3C676]"
                } p-3 rounded-lg transition-colors`}
                autoComplete="current-password"
                required
                value={password}
              />
              {errors.password && (
                <p className="text-red-500 text-sm mt-1">{errors.password}</p>
              )}
            </div>

            {generalError && (
              <div className="bg-red-500/10 border border-red-500/50 rounded-lg p-3 flex items-center gap-2">
                <IoIosWarning className="text-red-500 text-xl shrink-0" />
                <p className="text-red-500 text-sm font-medium text-left">
                  {generalError}
                </p>
              </div>
            )}

            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <button
                type="submit"
                className="inline-flex items-center rounded-xl px-6 py-3 font-semibold shadow-lg hover:cursor-pointer hover:scale-105 transition bg-[#E3C676] text-white"
              >
                Login
              </button>
              <button
                type="button"
                className="text-white font-medium rounded-lg text-sm sm:w-auto px-5 py-2.5 text-center hover:text-[#E3C676] hover:cursor-pointer"
                onClick={handlePasswordReset}
              >
                Forgot Password
              </button>
            </div>

            <div className="flex items-center gap-4 my-6">
              <div className="h-px bg-white/20 flex-1" />
              <span className="text-white/60 text-sm">Or continue with</span>
              <div className="h-px bg-white/20 flex-1" />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <button
                type="button"
                onClick={handleGithubLogin}
                className="flex items-center justify-center gap-2 px-4 py-3 border border-white/20 rounded-xl text-white hover:bg-white/10 transition-colors font-medium"
              >
                <FaGithub size={20} />
                GitHub
              </button>
              <button
                type="button"
                onClick={handleGoogleLogin}
                className="flex items-center justify-center gap-2 px-4 py-3 border border-white/20 rounded-xl text-white hover:bg-white/10 transition-colors font-medium"
              >
                <FaGoogle size={20} />
                Google
              </button>
            </div>
          </form>
          <div className="mt-6 text-center">
            <p className="text-white text-lg">
              Don&apos;t have an account?{" "}
              <Link
                href="/register"
                className="underline underline-offset-4 hover:text-[#E3C676] transition-colors"
              >
                Register!
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
