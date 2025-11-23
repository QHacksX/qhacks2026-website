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

const RegisterForm = () => {
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
      router.replace((cachedRedirect || "/") as Route);
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

  return (
    <div className="relative min-h-screen overflow-hidden">
      <Link
        href="/"
        className="absolute top-4 left-4 z-10 text-white transition-colors hover:text-[#E3C676] sm:top-6 sm:left-6"
      >
        <IoIosClose size={40} className="sm:h-12 sm:w-12" />
      </Link>

      <div className="absolute inset-0 flex items-center justify-center bg-linear-to-b from-[#020202] to-[#2B2929] px-4 sm:px-6 lg:px-8">
        <AnimatedStars />

        <div className="relative w-full max-w-md sm:max-w-lg lg:max-w-xl">
          <h1 className="mb-6 text-center text-3xl font-semibold tracking-tight text-[#E3C676] sm:mb-8 sm:text-4xl lg:text-5xl">
            Sign Up
          </h1>

          <form
            onSubmit={handleForm}
            className="space-y-4 sm:space-y-6"
            noValidate
          >
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="w-full">
                <label
                  htmlFor="givenName"
                  className="mb-1 block text-base font-semibold tracking-wide text-white sm:mb-2 sm:text-lg"
                >
                  First Name
                </label>
                <input
                  onChange={(e) => setGivenName(e.target.value)}
                  id="givenName"
                  type="text"
                  className={`w-full border bg-transparent text-base font-medium text-white placeholder-white/80 outline-none focus:placeholder-transparent sm:text-lg ${
                    errors.givenName
                      ? "border-red-500 focus:border-red-500"
                      : "border-[#C8B476] focus:border-[#E3C676]"
                  } rounded-lg p-3 transition-colors`}
                  autoComplete="given-name"
                  required
                  value={givenName}
                />
                {errors.givenName && (
                  <p className="mt-1 text-sm text-red-500">
                    {errors.givenName}
                  </p>
                )}
              </div>
              <div className="w-full">
                <label
                  htmlFor="surname"
                  className="mb-1 block text-base font-semibold tracking-wide text-white sm:mb-2 sm:text-lg"
                >
                  Last Name
                </label>
                <input
                  onChange={(e) => setSurname(e.target.value)}
                  id="surname"
                  type="text"
                  className={`w-full border bg-transparent text-base font-medium text-white placeholder-white/80 outline-none focus:placeholder-transparent sm:text-lg ${
                    errors.surname
                      ? "border-red-500 focus:border-red-500"
                      : "border-[#C8B476] focus:border-[#E3C676]"
                  } rounded-lg p-3 transition-colors`}
                  autoComplete="family-name"
                  required
                  value={surname}
                />
                {errors.surname && (
                  <p className="mt-1 text-sm text-red-500">{errors.surname}</p>
                )}
              </div>
            </div>

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
                  errors.email
                    ? "border-red-500 focus:border-red-500"
                    : "border-[#C8B476] focus:border-[#E3C676]"
                } rounded-lg p-3 transition-colors`}
                autoComplete="email"
                required
                value={email}
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-500">{errors.email}</p>
              )}
            </div>

            <div className="w-full">
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
                className={`w-full border bg-transparent text-base font-medium text-white placeholder-white/80 outline-none focus:placeholder-transparent sm:text-lg ${
                  errors.password
                    ? "border-red-500 focus:border-red-500"
                    : "border-[#C8B476] focus:border-[#E3C676]"
                } rounded-lg p-3 transition-colors`}
                autoComplete="new-password"
                required
                value={password}
              />
              {errors.password && (
                <p className="mt-1 text-sm text-red-500">{errors.password}</p>
              )}
            </div>

            {generalError && (
              <div className="flex items-center gap-2 rounded-lg border border-red-500/50 bg-red-500/10 p-3">
                <IoIosWarning className="shrink-0 text-xl text-red-500" />
                <p className="text-left text-sm font-medium text-red-500">
                  {generalError}
                </p>
              </div>
            )}

            <div>
              <button
                type="submit"
                className="mx-auto inline-flex w-full min-w-[120px] items-center justify-center rounded-xl bg-[#E3C676] px-6 py-3 font-semibold text-white shadow-lg transition-transform hover:scale-105 hover:cursor-pointer sm:mx-0 sm:w-auto"
              >
                Register
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

          <div className="mt-6 text-center sm:mt-8">
            <p className="text-base text-white sm:text-lg">
              Already have an account?{" "}
              <Link
                href="/login"
                className="underline underline-offset-4 transition-colors hover:text-[#E3C676]"
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

const Register = () => {
  return (
    <Suspense>
      <RegisterForm />
    </Suspense>
  );
};

export default Register;
