import Image from "next/image";
const Landing = () => {
  return (
    <main className="relative w-full h-screen overflow-hidden bg-black">
        <div
        className="absolute inset-0 bg-[url('/noise.png')] bg-cover bg-center opacity-50 pointer-events-none"
        aria-hidden="true"
      />
      <div
              className="
                absolute top-0 right-0 
                h-full w-auto         /* fixed height, flexible width */
              "
            >
              <Image
                src="/projector.svg"
                alt="QHacks 2025 marquee sign - February 6-8"
                width={2000}
                height={13}
                className="h-full w-auto object-contain mix-blend-lighten drop-shadow-2xl"
                priority
              />
            </div>
    </main>
  )
}

export default Landing