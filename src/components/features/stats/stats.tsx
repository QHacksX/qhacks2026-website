import Image from "next/image";

const Stats = () => {
  return (
    <section className="h-full w-full object-cover">
      <Image src="/static/stat1.png" alt="Description" priority className="object-cover" height={1832} width={1750} />
    </section>
  );
};

export default Stats;
