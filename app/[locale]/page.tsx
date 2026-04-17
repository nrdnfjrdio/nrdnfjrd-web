import { useTranslations } from "next-intl";

export default function Home() {
  const t = useTranslations("chat");
  return (
    <main className="h-full flex items-center justify-center">
      <p className="font-[var(--font-space-grotesk)] text-2xl font-bold text-[#F5A623]">
        {t("opening")}
      </p>
    </main>
  );
}
