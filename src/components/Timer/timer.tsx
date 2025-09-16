"use client";
type TimerProps = {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
};

const Timer = ({ days, hours, minutes, seconds }: TimerProps) => {
  const items = [
    { label: "Days", value: days },
    { label: "Hours", value: hours },
    { label: "Minutes", value: minutes },
    { label: "Seconds", value: seconds },
  ];

  return (
    <div className="flex items-center justify-center gap-1 sm:gap-2">
      {items.map((item, index) => (
        <div key={index} className="flex items-center">
          <div className="flex flex-col items-center">
            <span className="font-bold sm:text-3xl md:text-3xl lg:text-4xl text-base xl:text-3xl">
              {item.value}
            </span>
            <span className="text-gray-500 mt-1  sm:text-lg md:text-2xl lg:text-2xl text-base xl:text-xl">
              {item.label}
            </span>
          </div>
          {index < items.length - 1 && (
            <div className="px-2 sm:px-3 text-[28px] sm:text-[36px] leading-none font-semibold text-white/60">
              :
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default Timer;
