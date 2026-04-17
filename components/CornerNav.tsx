"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { useRouter, usePathname } from "@/i18n/navigation";
import AboutOverlay from "./Overlays/AboutOverlay";
import ContactOverlay from "./Overlays/ContactOverlay";

type Panel = "about" | "contact" | null;

export default function CornerNav({ locale }: { locale: string }) {
  const t = useTranslations("nav");
  const router = useRouter();
  const pathname = usePathname();
  const [open, setOpen] = useState<Panel>(null);

  const toggle = (panel: Panel) => setOpen((p) => (p === panel ? null : panel));

  const switchLocale = () => {
    const next = locale === "da" ? "en" : "da";
    router.push(pathname, { locale: next });
  };

  return (
    <>
      {open === "about" && <AboutOverlay onClose={() => setOpen(null)} />}
      {open === "contact" && <ContactOverlay onClose={() => setOpen(null)} />}

      <nav className="fixed bottom-4 right-4 flex items-center gap-1 z-40">
        <NavBtn onClick={switchLocale} label={t("langToggle")} />
        <NavBtn onClick={() => toggle("about")} label={t("about")} active={open === "about"} />
        <NavBtn onClick={() => toggle("contact")} label={t("contact")} active={open === "contact"} />
        <NavBtn
          href={`/${locale}/blog`}
          label={t("blog")}
        />
      </nav>
    </>
  );
}

function NavBtn({
  onClick,
  href,
  label,
  active,
}: {
  onClick?: () => void;
  href?: string;
  label: string;
  active?: boolean;
}) {
  const base =
    "px-2.5 py-1.5 text-xs font-mono border transition-colors duration-100 select-none";
  const cls = active
    ? `${base} bg-[#F5A623] text-[#0D1117] border-[#F5A623]`
    : `${base} bg-[#0D1117]/80 text-[#F0EDE6]/60 border-[#F0EDE6]/20 hover:border-[#F5A623] hover:text-[#F5A623]`;

  if (href) {
    return (
      <a href={href} className={cls}>
        {label}
      </a>
    );
  }
  return (
    <button onClick={onClick} className={cls}>
      {label}
    </button>
  );
}
