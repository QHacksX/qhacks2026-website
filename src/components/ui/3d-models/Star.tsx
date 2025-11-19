"use client";
import { Stars } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";

export default function AnimatedStars() {
  return (
    <div 
      className="absolute inset-0"
      style={{
        maskImage: "linear-gradient(to bottom, rgba(0,0,0,0) 0%, rgba(0,0,0,0.3) 5%, rgba(0,0,0,1) 15%, rgba(0,0,0,1) 100%)",
        WebkitMaskImage: "linear-gradient(to bottom, rgba(0,0,0,0) 0%, rgba(0,0,0,0.3) 15%, rgba(0,0,0,1) 35%, rgba(0,0,0,1) 100%)"
      }}
    >
      <Canvas>
        {/* Stars */}
        <Stars
          radius={100} // Inner sphere radius
          depth={50} // Star field depth
          count={3500} // Number of stars
          factor={4} // Size factor
          saturation={0} // 0 = white, 1 = colorful
          fade // Fades stars when moving
          speed={1} // Rotation speed
        />
      </Canvas>
    </div>
  );
}