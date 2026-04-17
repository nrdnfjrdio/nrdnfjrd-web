"use client";

import { formatDKK, calculateMonthlyCost } from "@/lib/roi";

interface Solution {
  id: string;
  title_da: string;
  title_en: string;
  description_da: string;
  description_en: string;
  price_dkk_month: number;
  track: "saas" | "consulting";
}

interface SolutionRevealProps {
  solution: Solution | null;
  track: "saas" | "consulting";
  locale: string;
  hoursPerWeek: number;
  onCTA: () => void;
  t: {
    saasReveal: { badge: string; ready: string; cta: string };
    consultingReveal: { badge: string; message: string; saving: string; cta: string };
  };
}

export default function SolutionReveal({
  solution,
  track,
  locale,
  hoursPerWeek,
  onCTA,
  t,
}: SolutionRevealProps) {
  const isSaaS = track === "saas" && solution;
  const monthlySaving = calculateMonthlyCost(hoursPerWeek);
  const title = solution
    ? locale === "da"
      ? solution.title_da
      : solution.title_en
    : "";
  const description = solution
    ? locale === "da"
      ? solution.description_da
      : solution.description_en
    : "";

  return (
    <div className="mt-6 border border-[#F5A623]/40 p-4 space-y-3 animate-fade-in">
      <div className="flex items-center gap-2">
        <span className="text-xs font-mono px-2 py-0.5 border border-[#F5A623] text-[#F5A623]">
          {isSaaS ? t.saasReveal.badge : t.consultingReveal.badge}
        </span>
      </div>

      {isSaaS ? (
        <>
          <h2 className="text-xl font-bold text-[#F0EDE6]">{title}</h2>
          <p className="text-[#F0EDE6]/70 text-sm">{description}</p>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-3xl font-bold text-[#F5A623] font-mono">
              {formatDKK(solution.price_dkk_month)}
            </span>
            <span className="text-[#F0EDE6]/60 text-sm font-mono">kr/måned</span>
          </div>
          <p className="text-[#F0EDE6]/50 text-xs font-mono">{t.saasReveal.ready}</p>
        </>
      ) : (
        <>
          <h2 className="text-xl font-bold text-[#F0EDE6]">{t.consultingReveal.message}</h2>
          {hoursPerWeek > 0 && (
            <p className="text-[#F5A623] font-mono text-sm">
              {t.consultingReveal.saving.replace("{amount}", formatDKK(monthlySaving))}
            </p>
          )}
        </>
      )}

      <button
        onClick={onCTA}
        className="mt-2 w-full sm:w-auto px-6 py-2.5 bg-[#F5A623] text-[#0D1117] font-bold hover:bg-[#F5A623]/90 transition-colors font-mono text-sm"
      >
        {isSaaS ? t.saasReveal.cta : t.consultingReveal.cta}
      </button>
    </div>
  );
}
