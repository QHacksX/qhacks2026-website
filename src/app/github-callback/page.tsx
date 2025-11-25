"use client";

import { useEffect, useRef, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import type { Route } from "next";
import { authApi } from "@/lib/api";
import { useAuthStore } from "@/stores/auth";
import { toast } from "sonner";
import AnimatedStars from "@/components/ui/3d-models/Star";
import { FaGithub } from "react-icons/fa";
import { CgSpinner } from "react-icons/cg";

const GithubCallbackContent = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const code = searchParams.get("code");
  const error = searchParams.get("error");
  const errorDescription = searchParams.get("error_description");
  const processedRef = useRef(false);

  useEffect(() => {
    if (processedRef.current) return;

    if (error) {
      processedRef.current = true;
      toast.error(errorDescription || "Failed to sign in with GitHub");
      router.push("/login");
      return;
    }

    if (!code) return;
    processedRef.current = true;

    const login = async () => {
      try {
        const response = await authApi.githubCallback({
          code,
          redirectUri: `${window.location.origin}/github-callback`,
        });
        useAuthStore.getState().login(response.token);
        const redirectTo = localStorage.getItem("redirect_to");
        if (redirectTo) {
          localStorage.removeItem("redirect_to");
        }
        router.push((redirectTo || "/") as Route);
      } catch (error) {
        console.error(error);
        toast.error("Failed to sign in with GitHub");
      }
    };

    login();
  }, [code, error, errorDescription, router]);

  return (
    <div className="relative flex h-screen items-center justify-center overflow-hidden bg-linear-to-b from-[#020202] to-[#2B2929]">
      <AnimatedStars />
      <div className="z-10 flex flex-col items-center gap-6 rounded-2xl border border-white/10 bg-white/5 p-8 backdrop-blur-sm">
        <FaGithub className="text-6xl text-white" />
        <div className="flex items-center gap-3 text-xl font-semibold text-white">
          <CgSpinner className="animate-spin text-[#E3C676]" />
          Authenticating with GitHub...
        </div>
      </div>
    </div>
  );
};

const GithubCallback = () => {
  return (
    <Suspense>
      <GithubCallbackContent />
    </Suspense>
  );
};

export default GithubCallback;
