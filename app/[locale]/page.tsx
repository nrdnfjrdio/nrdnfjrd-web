import ChatInterface from "@/components/Chatbot/ChatInterface";
import CornerNav from "@/components/CornerNav";

export default async function Home({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  return (
    <main className="h-full relative overflow-hidden flex items-center justify-center p-4 md:p-8">
      {/* Pixel grid is on body::before — this is the terminal window */}
      <div className="terminal-window relative w-full h-full max-w-[1400px] overflow-hidden flex flex-col">
        <ChatInterface locale={locale} />
      </div>
      <CornerNav locale={locale} />
    </main>
  );
}
