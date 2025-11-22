"use client";

import { useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { authApi } from "@/lib/api";
import { useAuthStore } from "@/stores/auth";
import { toast } from "sonner";
import AnimatedStars from "@/components/ui/3d-models/Star";

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
        router.push("/");
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
      <div className="text-white text-xl font-semibold z-10">
        Authenticating with Google...
      </div>
    </div>
  );
};

export default GoogleCallback;
