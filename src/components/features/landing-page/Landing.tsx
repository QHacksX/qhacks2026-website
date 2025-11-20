import Image from "next/image";

const Landing = () => {
  return (
    <main className="relative z-10 w-full h-screen overflow-hidden bg-black">
      
      {/* Noise texture */}
      <div
        className="absolute inset-0 bg-[url('/noise.png')] bg-cover bg-center opacity-50 pointer-events-none"
        aria-hidden="true"
      />

      {/* LEFT SIDE – Ellipse + Crown + Logo */}
      <div className="w-[70%] h-full relative flex items-center justify-center">
        
        {/* Glow background */}
        <Image
          src="/Ellipse.svg"
          alt="glowing ellipse"
          width={900}
          height={900}
          className="absolute w-[70vw] max-w-[580px] object-contain"
          priority
        />

        {/* Grouped Crown + Logo */}
        <div className="absolute flex flex-col items-center justify-center">
          
          {/* Crown */}
          <Image
            src="/crown.png"
            alt="QHacks crown"
            width={600}
            height={500}
            className="w-[400px]  pointer-events-none mix-blend-screen"
            priority
          />

          {/* QHacks 2026 logo on top of crown */}
          <Image
            src="/logo.png"
            alt="QHacks logo"
            width={500}
            height={300}
            className="absolute top-[30%] w-[250px] object-contain pointer-events-none"
            priority
          />
        </div>
        <div className="absolute flex flex-col items-center top-[65%]">
          <button
            className="
              rounded-full border border-[#f4d389]
              px-8 py-2 text-sm
              text-[#f4d389]
              bg-black/20
              hover:bg-[#f4d389] hover:text-black
              transition
              shadow-[0_0_20px_rgba(244,211,137,0.45)]
            "
          >
            Register Here
          </button>
        </div>
        

      </div>

      {/* RIGHT SIDE – Projector */}
      <div className="w-[30%] h-full flex items-end justify-end">
        <div className="absolute top-0 right-0 h-full w-auto">
          <Image
            src="/projector.svg"
            alt="projector"
            width={2000}
            height={13}
            className="h-full w-auto object-contain mix-blend-lighten drop-shadow-2xl"
            priority
          />
        </div>
      </div>

    </main>
  );
};

export default Landing;
