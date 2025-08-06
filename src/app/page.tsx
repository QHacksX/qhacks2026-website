import AnimatedStars from "@/components/ui/3d-models/Star";
// import Star from "@/components/ui/3d-models/StarMesh";
import Wave from "@/components/ui/wave";

export default function Home() {
  return (
     <main className='bg-gradient-to-b from-[#020202] to-[#2B2929] h-screen relative'>
      <div className='radial-gradient-background relative w-full min-h-screen'>
        <Wave />
        {/* <GoldStarCanvas /> */}
        {/* <GoldStarScene /> */}

        <div className="relative z-10 flex flex-col items-center justify-center min-h-screen text-white">
          <AnimatedStars />
          <h1 className="text-3xl font-bold mb-4">Get ready to innovate!</h1>
          <img src="/logo/logo.png" alt="QHacks Logo" className="w-80 h-84" />
          <p className="text-white font-bold text-xl mb-4">
            75 days, 15 hours, 20 minutes
          </p>
          <button className="bg-[rgb(191_159_95/0.32)] text-white font-semibold px-6 py-3 rounded-md hover:opacity-90 transition">
            Register Here
          </button>
        </div>
      </div>
     </main>
  );
}
