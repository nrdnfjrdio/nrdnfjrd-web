"use client";

import { useTranslations } from "next-intl";

interface ContactOverlayProps {
  onClose: () => void;
}

export default function ContactOverlay({ onClose }: ContactOverlayProps) {
  const t = useTranslations("contact");
  return (
    <div className="absolute bottom-20 right-4 w-80 border border-[#F0EDE6]/20 bg-[#161b22] p-5 animate-pixel-expand z-50">
      <button
        onClick={onClose}
        className="absolute top-2 right-3 text-[#F0EDE6]/40 hover:text-[#F5A623] font-mono text-xs"
      >
        [×]
      </button>
      <h2 className="text-[#F5A623] font-bold font-mono text-sm mb-3">{t("title")}</h2>
      <div className="space-y-1 text-sm font-mono text-[#F0EDE6]/80">
        <p>
          <span className="text-[#F0EDE6]/40">email:</span>{" "}
          <a href="mailto:lengsoe@gmail.com" className="hover:text-[#F5A623] transition-colors">
            lengsoe@gmail.com
          </a>
        </p>
        <p className="text-[#F0EDE6]/40 text-xs mt-3">CVR: —</p>
        <p className="text-[#F0EDE6]/40 text-xs">Nordjylland, Danmark</p>
      </div>
    </div>
  );
}
