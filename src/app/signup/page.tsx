"use client";
import AnimatedStars from "@/components/ui/3d-models/Star";
import { Toaster } from "@/components/ui/sonner";
// import signUp from "@/firebase/auth/signup";
// import { getAuthErrorMessage } from "@/firebase/utils";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { IoIosClose } from "react-icons/io";
const SignUp = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const router = useRouter();

  // const handleForm = async (e: React.FormEvent) => {
  //   e.preventDefault();
  //   setErrorMessage("");
  //   setSuccessMessage("");
  //   const { result, error } = await signUp({ email, password });
  //   if (error) {
  //     setErrorMessage(getAuthErrorMessage(error));
  //     toast.error(getAuthErrorMessage(error));
  //     return console.log("Error signing up:", error);
  //   } else if (result) {
  //     setSuccessMessage(result);
  //     // console.log("User signed up:", user);
  //     toast.success(result);
  //     return router.push("/signin");
  //   }
  // };

  return (
    <div className="relative min-h-screen overflow-hidden">
      <Toaster />
      {/* Close button - responsive positioning */}
      <Link
        href="/"
        className="absolute top-4 left-4 sm:top-6 sm:left-6 z-10 text-white hover:text-[#E3C676] transition-colors"
      >
        <IoIosClose size={40} className="sm:w-12 sm:h-12" />
      </Link>

      <div className="absolute inset-0 bg-gradient-to-b from-[#020202] to-[#2B2929] flex justify-center items-center px-4 sm:px-6 lg:px-8">
        <AnimatedStars />

        {/* Main content container - responsive width and spacing */}
        <div className="relative w-full max-w-md sm:max-w-lg lg:max-w-xl">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-semibold tracking-tight text-[#E3C676] text-center mb-8 sm:mb-12">
            Sign Up
          </h1>

          <form  className="space-y-6 sm:space-y-8">
            {/* Email field */}
            <div className="w-full">
              <label
                htmlFor="email"
                className="block text-base sm:text-lg font-semibold tracking-wide text-white mb-2 sm:mb-3"
              >
                Email
              </label>
              <input
                onChange={(e) => setEmail(e.target.value)}
                id="email"
                type="email"
                placeholder="your@example.com"
                className="w-full bg-transparent text-white text-base sm:text-lg font-medium placeholder-white/80 focus:placeholder-transparent outline-none border-b border-[#C8B476] focus:border-[#E3C676] pb-2 sm:pb-3 transition-colors"
                autoComplete="email"
                required
              />
            </div>

            {/* Password field */}
            <div className="w-full">
              <label
                htmlFor="password"
                className="block text-base sm:text-lg font-semibold tracking-wide text-white mb-2 sm:mb-3"
              >
                Password
              </label>
              <input
                onChange={(e) => setPassword(e.target.value)}
                id="password"
                type="password"
                placeholder="••••••••"
                className="w-full bg-transparent text-white text-base sm:text-lg font-medium placeholder-white/80 focus:placeholder-transparent outline-none border-b border-[#C8B476] focus:border-[#E3C676] pb-2 sm:pb-3 transition-colors"
                autoComplete="new-password"
                required
              />
            </div>

            {/* Submit button - responsive sizing */}
            <div className="pt-4 sm:pt-6">
              <button
                type="submit"
                className="w-full sm:w-auto inline-flex items-center justify-center rounded-xl px-6 py-3 font-semibold shadow-lg hover:cursor-pointer hover:scale-105 transition-transform bg-[#E3C676] text-white min-w-[120px] mx-auto sm:mx-0"
              >
                Sign Up
              </button>
            </div>

            {/* Error message - responsive styling */}
            {/* {errorMessage && (
              <div className="w-full">
                <p className="text-white bg-red-600/90 font-medium rounded-lg text-sm sm:text-base px-4 sm:px-5 py-3 text-center break-words">
                  {errorMessage}
                </p>
              </div>
            )} */}

            {/* Success message - responsive styling */}
            {/* {successMessage && (
              <div className="w-full">
                <p className="text-white bg-green-600/90 font-medium rounded-lg text-sm sm:text-base px-4 sm:px-5 py-3 text-center break-words">
                  {successMessage}
                </p>
              </div>
            )} */}
          </form>

          {/* Sign in link - responsive text size */}
          <div className="mt-6 sm:mt-8 text-center">
            <p className="text-white text-base sm:text-lg underline underline-offset-4 hover:text-[#E3C676] transition-colors">
              Already have an account?{" "}
              <Link
                href="/signin"
                className="font-semibold hover:text-[#C8B476] transition-colors"
              >
                Click here to sign in!
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
