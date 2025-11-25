import Image from "next/image";

const Stats = () => {
  return (
    <section className="relative w-full h-screen">
      <Image
        src="/stats1.png"
        alt="Description"
        fill
        priority
        className="object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-black/35 via-transparent to-black/20 pointer-events-none" />
    </section>
  );
};

export default Stats;
