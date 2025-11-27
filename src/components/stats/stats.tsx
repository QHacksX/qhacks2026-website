import Image from "next/image";

const Stats = () => {
  return (
    <section className="relative h-screen w-full">
      <Image src="/stats1.png" alt="Description" fill priority className="object-cover" />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/35 via-transparent to-black/20" />
    </section>
  );
};

export default Stats;
