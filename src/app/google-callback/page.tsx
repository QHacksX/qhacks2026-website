"use client";

import { useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { authApi } from "@/lib/api";
import { useAuthStore } from "@/stores/auth";
import { toast } from "sonner";
import AnimatedStars from "@/components/ui/3d-models/Star";
import { FaGoogle } from "react-icons/fa";
import { CgSpinner } from "react-icons/cg";

const GoogleCallback = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const code = searchParams.get("code");
  const processedRef = useRef(false);

  useEffect(() => {
    if (!code || processedRef.current) return;
    processedRef.current = true;

    const login = async () => {
      try {
        const response = await authApi.googleCallback({
            code,
            redirectUri: `${window.location.origin}/google-callback`
        });
        useAuthStore.getState().login(response.token);
        const redirectTo = localStorage.getItem("redirect_to");
        if (redirectTo) {
          localStorage.removeItem("redirect_to");
        }
        router.push(redirectTo || "/");
      } catch (error: any) {
        console.error(error);
        toast.error("Failed to sign in with Google");
      }
    };

    login();
  }, [code, router]);

  return (
    <div className="relative h-screen overflow-hidden bg-gradient-to-b from-[#020202] to-[#2B2929] flex justify-center items-center">
      <AnimatedStars />
      <div className="z-10 flex flex-col items-center gap-6 p-8 bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl">
        <FaGoogle className="text-white text-6xl" />
        <div className="flex items-center gap-3 text-white text-xl font-semibold">
          <CgSpinner className="animate-spin text-[#E3C676]" />
          Authenticating with Google...
        </div>
      </div>
    </div>
  );
};

export default GoogleCallback;
