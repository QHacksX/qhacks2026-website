import AnimatedStars from "@/components/ui/3d-models/Star";
import Link from "next/link";
import { IoIosCloseCircle } from "react-icons/io";

export default function NotFound() {
  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-[#020202] text-white">
      <div className="pointer-events-none absolute inset-0 bg-linear-to-b from-[#020202] to-[#2B2929]">
        <AnimatedStars />
      </div>

      <div className="relative z-10 w-full max-w-md space-y-6 rounded-2xl border border-white/10 bg-white/5 p-8 text-center backdrop-blur-sm">
        <IoIosCloseCircle className="mx-auto text-6xl text-white" />
        <h1 className="text-2xl font-semibold text-white">Page Not Found</h1>
        <p className="text-white/70">We couldn't find the page you're looking for. Come build it with us!</p>
        <Link
          href="/"
          className="inline-block rounded-xl bg-white/10 px-6 py-3 font-bold text-white transition-colors hover:bg-white/20"
        >
          Return Home
        </Link>
      </div>
    </div>
  );
}
