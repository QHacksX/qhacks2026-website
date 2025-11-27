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
            <span className="font-mono text-base font-bold sm:text-3xl md:text-3xl lg:text-4xl xl:text-3xl">
              {item.value}
            </span>
            <span className="text-base text-gray-500 sm:text-lg md:text-2xl lg:text-2xl xl:text-xl">{item.label}</span>
          </div>
          {index < items.length - 1 && (
            <div className="px-2 text-[28px] leading-none font-semibold text-white/60 sm:px-3 sm:text-[36px]">:</div>
          )}
        </div>
      ))}
    </div>
  );
};

export default Timer;
