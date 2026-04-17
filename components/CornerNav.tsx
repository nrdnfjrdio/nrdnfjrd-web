"use client";

import { useState } from "react";
import { useRouter, usePathname } from "@/i18n/navigation";
import AboutOverlay from "./Overlays/AboutOverlay";
import ContactOverlay from "./Overlays/ContactOverlay";

type Panel = "about" | "contact" | null;

export default function CornerNav({ locale }: { locale: string }) {
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
      {open === "about"   && <AboutOverlay   onClose={() => setOpen(null)} />}
      {open === "contact" && <ContactOverlay onClose={() => setOpen(null)} />}

      <nav className="fixed bottom-5 right-5 flex items-center gap-2 z-40">
        {/* Language toggle */}
        <NavBtn onClick={switchLocale} label={locale === "da" ? "EN" : "DA"} title="Switch language">
          <GlobeIcon />
        </NavBtn>

        {/* About */}
        <NavBtn onClick={() => toggle("about")} active={open === "about"} title="About">
          <InfoIcon />
        </NavBtn>

        {/* Contact */}
        <NavBtn onClick={() => toggle("contact")} active={open === "contact"} title="Contact">
          <MailIcon />
        </NavBtn>

        {/* Blog */}
        <NavBtn href={`/${locale}/blog`} title="Blog">
          <DocIcon />
        </NavBtn>

        {/* LinkedIn */}
        <NavBtn href="https://linkedin.com" title="LinkedIn" external>
          <LinkedInIcon />
        </NavBtn>
      </nav>
    </>
  );
}

function NavBtn({
  onClick,
  href,
  label,
  active,
  title,
  external,
  children,
}: {
  onClick?: () => void;
  href?: string;
  label?: string;
  active?: boolean;
  title?: string;
  external?: boolean;
  children?: React.ReactNode;
}) {
  const cls = `nav-icon-btn ${active ? "active" : ""}`;

  if (href) {
    return (
      <a
        href={href}
        className={cls}
        title={title}
        {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      >
        {children}
        {label && <span className="font-mono text-[10px] leading-none">{label}</span>}
      </a>
    );
  }
  return (
    <button onClick={onClick} className={cls} title={title}>
      {children}
      {label && <span className="font-mono text-[10px] leading-none ml-0.5">{label}</span>}
    </button>
  );
}

/* ── Pixel art SVG icons (16×16 grid, rendered at 18×18) ── */

function GlobeIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 16 16" className="pixel-art" fill="currentColor">
      <rect x="6"  y="1"  width="4" height="1" />
      <rect x="4"  y="2"  width="8" height="1" />
      <rect x="3"  y="3"  width="10" height="1" />
      <rect x="2"  y="4"  width="12" height="1" />
      <rect x="2"  y="5"  width="12" height="1" />
      <rect x="2"  y="6"  width="12" height="1" />
      <rect x="7"  y="1"  width="2"  height="14" />
      <rect x="2"  y="7"  width="12" height="2" />
      <rect x="2"  y="9"  width="12" height="1" />
      <rect x="2"  y="10" width="12" height="1" />
      <rect x="2"  y="11" width="12" height="1" />
      <rect x="3"  y="12" width="10" height="1" />
      <rect x="4"  y="13" width="8"  height="1" />
      <rect x="6"  y="14" width="4"  height="1" />
      {/* Horizontal line */}
      <rect x="2"  y="7"  width="12" height="1" />
    </svg>
  );
}

function InfoIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 16 16" className="pixel-art" fill="currentColor">
      {/* Outer ring */}
      <rect x="5" y="1"  width="6" height="1" />
      <rect x="3" y="2"  width="2" height="1" />
      <rect x="11" y="2" width="2" height="1" />
      <rect x="2" y="3"  width="2" height="2" />
      <rect x="12" y="3" width="2" height="2" />
      <rect x="1" y="5"  width="2" height="6" />
      <rect x="13" y="5" width="2" height="6" />
      <rect x="2" y="11" width="2" height="2" />
      <rect x="12" y="11" width="2" height="2" />
      <rect x="3" y="13" width="2" height="1" />
      <rect x="11" y="13" width="2" height="1" />
      <rect x="5" y="14" width="6" height="1" />
      {/* i dot */}
      <rect x="7" y="4"  width="2" height="2" />
      {/* i stem */}
      <rect x="6" y="7"  width="4" height="5" />
      <rect x="5" y="11" width="6" height="1" />
    </svg>
  );
}

function MailIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 16 16" className="pixel-art" fill="currentColor">
      {/* Envelope body */}
      <rect x="1"  y="3"  width="14" height="10" />
      {/* Inner cutout */}
      <rect x="2"  y="4"  width="12" height="8"  fill="#0D1117" />
      {/* Flap V shape */}
      <rect x="2"  y="4"  width="1"  height="1"  fill="currentColor" />
      <rect x="3"  y="5"  width="1"  height="1"  fill="currentColor" />
      <rect x="4"  y="6"  width="1"  height="1"  fill="currentColor" />
      <rect x="5"  y="7"  width="1"  height="1"  fill="currentColor" />
      <rect x="6"  y="8"  width="1"  height="1"  fill="currentColor" />
      <rect x="7"  y="9"  width="2"  height="1"  fill="currentColor" />
      <rect x="9"  y="8"  width="1"  height="1"  fill="currentColor" />
      <rect x="10" y="7"  width="1"  height="1"  fill="currentColor" />
      <rect x="11" y="6"  width="1"  height="1"  fill="currentColor" />
      <rect x="12" y="5"  width="1"  height="1"  fill="currentColor" />
      <rect x="13" y="4"  width="1"  height="1"  fill="currentColor" />
    </svg>
  );
}

function DocIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 16 16" className="pixel-art" fill="currentColor">
      {/* Page */}
      <rect x="3"  y="1"  width="8" height="14" />
      <rect x="11" y="3"  width="2" height="12" />
      {/* Dog ear */}
      <rect x="9"  y="1"  width="2" height="2" fill="#0D1117" />
      <rect x="11" y="1"  width="2" height="2" fill="#0D1117" />
      <rect x="9"  y="3"  width="4" height="1"  />
      {/* Lines */}
      <rect x="5"  y="5"  width="6" height="1" fill="#0D1117" />
      <rect x="5"  y="7"  width="6" height="1" fill="#0D1117" />
      <rect x="5"  y="9"  width="6" height="1" fill="#0D1117" />
      <rect x="5"  y="11" width="4" height="1" fill="#0D1117" />
    </svg>
  );
}

function LinkedInIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 16 16" className="pixel-art" fill="currentColor">
      {/* Box */}
      <rect x="1" y="1" width="14" height="14" />
      <rect x="2" y="2" width="12" height="12" fill="#0D1117" />
      {/* in letters */}
      {/* Left I */}
      <rect x="3"  y="4"  width="2" height="2" fill="currentColor" />
      <rect x="3"  y="7"  width="2" height="5" fill="currentColor" />
      {/* n */}
      <rect x="6"  y="6"  width="2" height="6" fill="currentColor" />
      <rect x="8"  y="6"  width="2" height="1" fill="currentColor" />
      <rect x="10" y="7"  width="2" height="5" fill="currentColor" />
      <rect x="8"  y="7"  width="2" height="1" fill="currentColor" />
    </svg>
  );
}
