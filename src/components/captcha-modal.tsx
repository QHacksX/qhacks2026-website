"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useCaptchaStore } from "@/stores/captcha";
import HCaptcha from "@hcaptcha/react-hcaptcha";
import { useRef } from "react";
import { FaRobot } from "react-icons/fa";

export function CaptchaModal() {
  const { isOpen, siteKey, resolve, close, reset } = useCaptchaStore();
  const captchaRef = useRef<HCaptcha>(null);

  const handleVerify = (token: string) => {
    if (resolve) {
      resolve(token);
    }
    reset();
  };

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      close();
      // If closed without verifying, we reject the promise
      const { reject } = useCaptchaStore.getState();
      if (reject) {
        reject(new Error("Captcha cancelled"));
      }
      reset();
    }
  };

  if (!siteKey) return null;

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="border-[#333] bg-[#1a1a1a] text-white duration-0 sm:max-w-[425px]">
        <DialogHeader className="flex flex-col items-center gap-4">
          <FaRobot className="text-6xl text-[#E3C676]" />
          <DialogTitle className="text-xl text-[#E3C676]">
            Are you human?
          </DialogTitle>
        </DialogHeader>
        <div className="flex justify-center py-4">
          <HCaptcha
            sitekey={siteKey}
            onVerify={handleVerify}
            ref={captchaRef}
            theme="dark"
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}
