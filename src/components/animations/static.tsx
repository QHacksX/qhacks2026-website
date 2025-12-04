"use client";
import { useEffect, useRef } from "react";

interface StaticBackgroundProps {
  className?: string;
}

export default function StaticBackground({ className }: StaticBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return; // ✅ TS now knows canvas is not null

    const ctx = canvas.getContext("2d");
    if (!ctx) return; // ✅ TS now knows ctx is not null

    const resize = () => {
      // Reduce canvas size for better performance
      canvas.width = window.innerWidth / 4;
      canvas.height = window.innerHeight / 4;
    };

    resize();
    window.addEventListener("resize", resize);

    let animationFrameId: number;
    let lastFrameTime = 0;
    const fps = 30; // Limit to 30fps for static effect
    const frameInterval = 1000 / fps;

    const renderGrain = (currentTime: number) => {
      const deltaTime = currentTime - lastFrameTime;

      if (deltaTime >= frameInterval) {
        lastFrameTime = currentTime - (deltaTime % frameInterval);

        const { width, height } = canvas;
        const imageData = ctx.createImageData(width, height);
        const buffer = imageData.data;

        // subtle film grain
        for (let i = 0; i < buffer.length; i += 4) {
          const shade = Math.random() * 255; // keep it dark & soft
          buffer[i] = shade;
          buffer[i + 1] = shade;
          buffer[i + 2] = shade;
          buffer[i + 3] = 255;
        }

        ctx.putImageData(imageData, 0, 0);
      }

      animationFrameId = requestAnimationFrame(renderGrain);
    };

    renderGrain(0);

    return () => {
      window.removeEventListener("resize", resize);
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className={`pointer-events-none ${className || "fixed inset-0 z-[1] h-screen w-screen opacity-25 mix-blend-overlay"}`}
    />
  );
}
