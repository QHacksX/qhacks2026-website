export default function Wave() {
  return (
    <div className=" bg-[linear-gradient(180deg,#020202_47.32%,#2B2929_100%)] overflow-hidden">
      <img
        className="absolute top-0 left-0 w-full object-cover pointer-events-none h-112 opacity-100 brightness-125 contrast-110"
        src="/waves/w.png" // make sure this is JUST the background
        alt="Waves background"
      />
    </div>
  );
}
