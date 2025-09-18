"use client";

import { useEffect } from "react";

type FireworkConfig = {
  color: string;
  x: number; // px
  y: number; // px
};

const fireworkConfigs: FireworkConfig[] = [
  { color: "#FF0000", x: 300, y: 300 }, // Red
  { color: "#FFFF00", x: 800, y: 250 }, // Yellow
  { color: "#0000FF", x: 500, y: 500 }, // Blue
];

const Fireworks = () => {
  useEffect(() => {
    const container = document.getElementById("fireworks-container");
    if (!container) return;

    const createFirework = (config: FireworkConfig) => {
      const firework = document.createElement("div");
      firework.className = "absolute w-full h-full pointer-events-none";

      const numParticles = 40;

      for (let i = 0; i < numParticles; i++) {
        const angle = (i / numParticles) * 2 * Math.PI;
        const distance = Math.random() * 80 + 40;
        const dx = Math.cos(angle) * distance;
        const dy = Math.sin(angle) * distance;

        const particle = document.createElement("div");
        particle.className = "firework-particle";
        particle.style.backgroundColor = config.color;
        particle.style.position = "absolute";
        particle.style.left = `${config.x}px`;
        particle.style.top = `${config.y}px`;
        particle.style.width = "4px";
        particle.style.height = "4px";
        particle.style.borderRadius = "9999px";
        particle.style.opacity = "1";
        particle.style.setProperty("--dx", `${dx}px`);
        particle.style.setProperty("--dy", `${dy}px`);

        firework.appendChild(particle);
      }

      container.appendChild(firework);
      setTimeout(() => firework.remove(), 4000);
    };

    fireworkConfigs.forEach((config, index) => {
      setTimeout(() => createFirework(config), index * 400);
    });
  }, []);

  return <div id="fireworks-container" className="absolute inset-0 z-50" />;
};

export default Fireworks;
