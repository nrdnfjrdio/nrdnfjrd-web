import ChatInterface from "@/components/Chatbot/ChatInterface";
import CornerNav from "@/components/CornerNav";

export default async function Home({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  return (
    <main className="h-full relative overflow-hidden">
      <ChatInterface locale={locale} />
      <CornerNav locale={locale} />
    </main>
  );
}
