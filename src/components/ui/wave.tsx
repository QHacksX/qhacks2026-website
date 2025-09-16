export default function Wave() {
  return (
    <div className="bg-[linear-gradient(180deg,#020202_47.32%,#2B2929_100%)] overflow-hidden">
      <img
        className="absolute top-0 left-0 w-full  pointer-events-none h-112 opacity-100 brightness-125 contrast-110 hidden md:block h-64 md:h-56 lg:h-84 xl:h-100"
        src="/waves/w.png"
        alt="Waves background"
      />
    </div>
  );
}
