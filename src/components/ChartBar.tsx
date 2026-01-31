import { useMemo } from 'react';

interface ChartBarProps {
  data: number[];
  max: number;
  label: string;
  showMax: string;
  showMin: string;
}

export function ChartBar({ data, max, label, showMax, showMin }: ChartBarProps) {
  const displayData = useMemo(() => data.slice(-16), [data]); // Show last 16 data points

  return (
    <div className="relative w-full h-28 md:h-32">
      {/* Y-axis labels */}
      <div className="absolute -left-2 md:left-0 top-0 bottom-0 flex flex-col justify-between text-white text-xs md:text-lg font-['Electrolize',sans-serif] pr-2">
        <span className="transform -translate-y-1/2">{showMax}</span>
        <span className="transform translate-y-1/2">{showMin}</span>
      </div>

      {/* Chart area */}
      <div className="ml-12 md:ml-16 h-full border-l-2 border-b-2 border-white/50 relative">
        {/* Horizontal grid lines */}
        <div className="absolute inset-0">
          <div className="absolute top-0 left-0 right-0 h-px bg-white/30" />
          <div className="absolute top-1/2 left-0 right-0 h-px bg-white/30 transform -translate-y-1/2" />
        </div>

        {/* Bars */}
        <div className="absolute inset-0 flex items-end justify-start gap-[3px] md:gap-[4px] pl-1 pb-0 pr-1">
          {displayData.map((value, index) => {
            const height = Math.min((value / max) * 100, 100);
            return (
              <div
                key={index}
                className="bg-[#bfecff] rounded-t w-[4px] md:w-[6px] transition-all duration-500"
                style={{ height: `${height}%` }}
              />
            );
          })}
        </div>

        {/* Vertical grid lines */}
        <div className="absolute inset-0 flex justify-between pl-0 pr-0 pointer-events-none">
          <div className="h-full w-px bg-white/30" />
          <div className="h-full w-px bg-white/30" />
        </div>
      </div>
    </div>
  );
}