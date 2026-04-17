"use client";

import { useTranslations } from "next-intl";

interface AboutOverlayProps {
  onClose: () => void;
}

export default function AboutOverlay({ onClose }: AboutOverlayProps) {
  const t = useTranslations("about");
  return (
    <div className="absolute bottom-20 right-4 w-80 border border-[#F0EDE6]/20 bg-[#161b22] p-5 animate-pixel-expand z-50">
      <button
        onClick={onClose}
        className="absolute top-2 right-3 text-[#F0EDE6]/40 hover:text-[#F5A623] font-mono text-xs"
      >
        [×]
      </button>
      <h2 className="text-[#F5A623] font-bold font-mono text-sm mb-2">{t("title")}</h2>
      <p className="text-[#F0EDE6]/80 text-sm leading-relaxed">{t("body")}</p>
      <p className="mt-3 text-[#F5A623]/70 text-xs font-mono italic">{t("tagline")}</p>
    </div>
  );
}
