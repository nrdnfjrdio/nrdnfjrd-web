import { getAllPosts } from "@/lib/blog";
import { getTranslations } from "next-intl/server";
import Link from "next/link";

export default async function BlogIndex({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "blog" });
  const posts = getAllPosts(locale);

  return (
    <main className="max-w-2xl mx-auto px-6 py-16">
      <h1 className="text-3xl font-bold text-[#F0EDE6] mb-2">{t("title")}</h1>
      <p className="text-[#F0EDE6]/50 text-sm mb-10 font-mono">{t("subtitle")}</p>
      {posts.length === 0 ? (
        <p className="text-[#F0EDE6]/40 font-mono text-sm">— ingen indlæg endnu —</p>
      ) : (
        <ul className="space-y-8">
          {posts.map((post) => (
            <li key={post.slug} className="border-b border-[#F0EDE6]/10 pb-8">
              <p className="text-[#F0EDE6]/40 font-mono text-xs mb-1">{post.date}</p>
              <h2 className="text-xl font-bold text-[#F0EDE6] mb-2">{post.title}</h2>
              <p className="text-[#F0EDE6]/60 text-sm mb-3">{post.excerpt}</p>
              <Link
                href={`/${locale}/blog/${post.slug}`}
                className="text-[#F5A623] font-mono text-sm hover:underline"
              >
                {t("readMore")} →
              </Link>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
