'use client'
import signUp from "@/firebase/auth/signup";
import { useRouter } from "next/navigation";
import { useState } from "react";
const SignUp = () => {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
//   const [error, setError] = useState("");
  const router = useRouter();

  const handleForm = async (e: React.FormEvent) => {
    e.preventDefault();
    const { user, error } = await signUp({ email, password });
    if (error) {
      return console.log("Error signing up:", error);
    }
    console.log("User signed up:", user);
    // return router.push
  }

  return (
    <div className="relative h-screen overflow-hidden">
        <div className=" absolute inset-0 bg-gradient-to-b from-[#020202] to-[#2B2929] flex justify-center items-center">
            <div>
                <h1 className="text-4xl sm:text-5xl font-semibold tracking-tight text-[#E3C676] text-center">Sign Up</h1>
                <form onSubmit={handleForm} className="mt-12 space-y-6">
                    <div className="w-120">
                        <label
                            htmlFor="email"
                            className="block text-lg font-semibold tracking-wide text-white"
                        >
                            Email
                        </label>

                        <input
                            onChange={(e) => setEmail(e.target.value)}
                            id="email"
                            type="email"
                            placeholder="your@example.com"
                            className="mt-3 w-full bg-transparent text-lg font-medium placeholder-white/80 focus:placeholder-transparent outline-none border-b border-[#C8B476] focus:border-[#E3C676] pb-3"
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
                            className="mt-3 w-full bg-transparent text-lg font-medium placeholder-white/80 focus:placeholder-transparent outline-none border-b border-[#C8B476] focus:border-[#E3C676] pb-3"
                            autoComplete="new-password"
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        className="mt-6 inline-flex items-center rounded-xl px-6 py-3 font-semibold shadow-lg hover:cursor-pointer hover:scale-105 transition
                                    bg-[#E3C676] text-white"
                        >
                        Sign Up
                    </button>
                </form>
            </div>
        </div>

    </div>
  )
}

export default SignUp