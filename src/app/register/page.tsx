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

const Register = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [givenName, setGivenName] = useState("");
  const [surname, setSurname] = useState("");
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
      const response = await authApi.register({
        email,
        password,
        givenName,
        surname,
      });
      toast.success("Signed in successfully");
      login(response.token);
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
            // Convert snake_case to camelCase for field matching
            const field = err.field.replace(/_([a-z])/g, (_, letter) =>
              letter.toUpperCase(),
            );
            newErrors[field] = err.message;
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

  return (
    <div className="relative min-h-screen overflow-hidden">
      <Link
        href="/"
        className="absolute top-4 left-4 sm:top-6 sm:left-6 z-10 text-white hover:text-[#E3C676] transition-colors"
      >
        <IoIosClose size={40} className="sm:w-12 sm:h-12" />
      </Link>

      <div className="absolute inset-0 bg-gradient-to-b from-[#020202] to-[#2B2929] flex justify-center items-center px-4 sm:px-6 lg:px-8">
        <AnimatedStars />

        <div className="relative w-full max-w-md sm:max-w-lg lg:max-w-xl">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-semibold tracking-tight text-[#E3C676] text-center mb-6 sm:mb-8">
            Sign Up
          </h1>

          <form
            onSubmit={handleForm}
            className="space-y-4 sm:space-y-6"
            noValidate
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="w-full">
                <label
                  htmlFor="givenName"
                  className="block text-base sm:text-lg font-semibold tracking-wide text-white mb-1 sm:mb-2"
                >
                  First Name
                </label>
                <input
                  onChange={(e) => setGivenName(e.target.value)}
                  id="givenName"
                  type="text"
                  className={`w-full bg-transparent text-white text-base sm:text-lg font-medium placeholder-white/80 focus:placeholder-transparent outline-none border ${
                    errors.given_name
                      ? "border-red-500 focus:border-red-500"
                      : "border-[#C8B476] focus:border-[#E3C676]"
                  } p-3 rounded-lg transition-colors`}
                  autoComplete="given-name"
                  required
                  value={givenName}
                />
                {errors.given_name && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.given_name}
                  </p>
                )}
              </div>
              <div className="w-full">
                <label
                  htmlFor="surname"
                  className="block text-base sm:text-lg font-semibold tracking-wide text-white mb-1 sm:mb-2"
                >
                  Last Name
                </label>
                <input
                  onChange={(e) => setSurname(e.target.value)}
                  id="surname"
                  type="text"
                  className={`w-full bg-transparent text-white text-base sm:text-lg font-medium placeholder-white/80 focus:placeholder-transparent outline-none border ${
                    errors.surname
                      ? "border-red-500 focus:border-red-500"
                      : "border-[#C8B476] focus:border-[#E3C676]"
                  } p-3 rounded-lg transition-colors`}
                  autoComplete="family-name"
                  required
                  value={surname}
                />
                {errors.surname && (
                  <p className="text-red-500 text-sm mt-1">{errors.surname}</p>
                )}
              </div>
            </div>

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

            <div className="w-full">
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
                className={`w-full bg-transparent text-white text-base sm:text-lg font-medium placeholder-white/80 focus:placeholder-transparent outline-none border ${
                  errors.password
                    ? "border-red-500 focus:border-red-500"
                    : "border-[#C8B476] focus:border-[#E3C676]"
                } p-3 rounded-lg transition-colors`}
                autoComplete="new-password"
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

            <div>
              <button
                type="submit"
                className="w-full sm:w-auto inline-flex items-center justify-center rounded-xl px-6 py-3 font-semibold shadow-lg hover:cursor-pointer hover:scale-105 transition-transform bg-[#E3C676] text-white min-w-[120px] mx-auto sm:mx-0"
              >
                Register
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

          <div className="mt-6 sm:mt-8 text-center">
            <p className="text-white text-base sm:text-lg">
              Already have an account?{" "}
              <Link
                href="/login"
                className="underline underline-offset-4 hover:text-[#E3C676] transition-colors"
              >
                Login!
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
