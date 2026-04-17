"use client";

import { calculateMonthlyCost, formatDKK } from "@/lib/roi";

interface ROICalculatorProps {
  hours: number;
  onHoursChange: (hours: number) => void;
  label: string;
  unit: string;
  resultTemplate: string;
}

export default function ROICalculator({
  hours,
  onHoursChange,
  label,
  unit,
  resultTemplate,
}: ROICalculatorProps) {
  const monthly = calculateMonthlyCost(hours);
  const result = resultTemplate.replace("{amount}", formatDKK(monthly));

  return (
    <div className="mt-4 space-y-3">
      <p className="text-[#F0EDE6]">{label}</p>
      <div className="flex items-center gap-3">
        <button
          onClick={() => onHoursChange(Math.max(1, hours - 1))}
          className="w-8 h-8 border border-[#F0EDE6]/30 hover:border-[#F5A623] hover:text-[#F5A623] transition-colors flex items-center justify-center font-mono text-lg"
        >
          −
        </button>
        <input
          type="number"
          min={1}
          max={80}
          value={hours}
          onChange={(e) => {
            const v = parseInt(e.target.value, 10);
            if (!isNaN(v) && v >= 1 && v <= 80) onHoursChange(v);
          }}
          className="w-16 bg-transparent border border-[#F0EDE6]/30 text-center font-mono text-[#F5A623] text-lg py-1 focus:outline-none focus:border-[#F5A623]"
        />
        <span className="text-[#F0EDE6]/60 text-sm font-mono">{unit}</span>
        <button
          onClick={() => onHoursChange(Math.min(80, hours + 1))}
          className="w-8 h-8 border border-[#F0EDE6]/30 hover:border-[#F5A623] hover:text-[#F5A623] transition-colors flex items-center justify-center font-mono text-lg"
        >
          +
        </button>
      </div>
      {hours > 0 && (
        <p className="text-[#F5A623] font-mono text-sm animate-fade-in">
          {result}
        </p>
      )}
    </div>
  );
}
