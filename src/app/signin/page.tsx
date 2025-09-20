"use client";
import AnimatedStars from "@/components/ui/3d-models/Star";
import { passwordReset } from "@/firebase/auth/passwrodReset";
import signIn from "@/firebase/auth/signin";
import { getAuthErrorMessage } from "@/firebase/utils";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { IoIosClose } from "react-icons/io";
import { toast } from "sonner";
import { Toaster } from "@/components/ui/sonner";

const SignUp = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleForm = async (e: React.FormEvent) => {
    e.preventDefault();
    const { user, error } = await signIn({ email, password });
    if (error) {
      toast.error(getAuthErrorMessage(error));
      return console.log("Error signing in:", error);
    } else if (user) {
      toast.success(
        `Account created for ${user.user.email ?? "your account"}. Please verify your email.`,
      );
      console.log("User signed in:", user);
      return router.push("/");
    }
  };

  const handlePasswordReset = async () => {
    console.log("email:", email);
    const { result, error } = await passwordReset({ email });
    if (error) {
      console.log(error);
      toast.error(getAuthErrorMessage(error));
    } else if (result) {
      console.log("password reset result:", result);
      toast.success(result);
    }
  };

  return (
    <div className="relative h-screen overflow-hidden">
      <Toaster />

      <Link href="/" className="p-5 absolute left-0 z-10 text-white">
        <IoIosClose size={50} />
      </Link>

      <div className=" absolute inset-0 bg-gradient-to-b from-[#020202] to-[#2B2929] flex justify-center items-center px-4 sm:px-6 lg:px-8">
        <AnimatedStars />
        <div className="relative w-full max-w-md sm:max-w-lg lg:max-w-xl">
          <h1 className="text-4xl sm:text-5xl font-semibold tracking-tight text-[#E3C676] text-center">
            Sign In
          </h1>
          <form
            onSubmit={handleForm}
            className="lg:mt-12 space-y-6 sm:space-y-8"
          >
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
            <div>
              <label
                htmlFor="password"
                className="block text-lg font-semibold tracking-wide text-white"
              >
                Password
              </label>
              <input
                onChange={(e) => setPassword(e.target.value)}
                id="password"
                type="password"
                placeholder="••••••••"
                className="mt-3 w-full bg-transparent text-white text-lg font-medium placeholder-white/80 focus:placeholder-transparent outline-none border-b border-[#C8B476] focus:border-[#E3C676] pb-3"
                autoComplete="new-password"
                required
              />
            </div>
            <button
              type="submit"
              className="mt-6 inline-flex items-center rounded-xl px-6 py-3 font-semibold shadow-lg hover:cursor-pointer hover:scale-105 transition
                                    bg-[#E3C676] text-white"
            >
              Sign In
            </button>
            <button
              type="button"
              className="text-white font-medium rounded-lg text-sm sm:w-auto px-5 py-2.5 text-center hover:text-[#E3C676] hover:cursor-pointer"
              onClick={handlePasswordReset}
            >
              Forgot Password
            </button>
          </form>
          <div className="mt-6 text-center">
            <p className="text-white text-lg underline underline-offset-4 hover:text-[#E3C676] transition-colors">
              Don&apos;t have an account?{" "}
              <Link href="/signup">Click here to sign up!</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
