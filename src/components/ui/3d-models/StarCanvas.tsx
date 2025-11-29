"use client";

import { Stars } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";

const StarCanvas = () => (
  <div
    className="pointer-events-none absolute inset-0"
    style={{
      maskImage:
        "linear-gradient(to bottom, rgba(0,0,0,0) 0%, rgba(0,0,0,0.3) 5%, rgba(0,0,0,1) 15%, rgba(0,0,0,1) 100%)",
      WebkitMaskImage:
        "linear-gradient(to bottom, rgba(0,0,0,0) 0%, rgba(0,0,0,0.3) 15%, rgba(0,0,0,1) 35%, rgba(0,0,0,1) 100%)",
    }}
  >
    <Canvas dpr={[1, 1.5]} frameloop="demand">
      <Stars
        radius={90}
        depth={45}
        count={2600}
        factor={4}
        saturation={0}
        fade
        speed={0.6}
      />
    </Canvas>
  </div>
);

export default StarCanvas;
