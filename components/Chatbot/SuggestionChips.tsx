"use client";

interface Chip {
  id: string;
  label: string;
}

interface SuggestionChipsProps {
  chips: Chip[];
  selected: string[];
  onSelect: (id: string) => void;
  multiSelect?: boolean;
}

export default function SuggestionChips({
  chips,
  selected,
  onSelect,
  multiSelect = false,
}: SuggestionChipsProps) {
  return (
    <div className="flex flex-wrap gap-2 mt-3">
      {chips.map((chip) => {
        const isSelected = selected.includes(chip.id);
        return (
          <button
            key={chip.id}
            onClick={() => onSelect(chip.id)}
            className={`
              px-3 py-1.5 text-sm font-mono border transition-colors duration-100
              ${isSelected
                ? "bg-[#F5A623] text-[#0D1117] border-[#F5A623]"
                : "bg-transparent text-[#F0EDE6] border-[#F0EDE6]/30 hover:border-[#F5A623] hover:text-[#F5A623]"
              }
            `}
            style={{ imageRendering: "pixelated" }}
          >
            {chip.label}
          </button>
        );
      })}
    </div>
  );
}
