import { getPost, getAllPosts } from "@/lib/blog";
import { getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";
import Link from "next/link";
import { MDXRemote } from "next-mdx-remote/rsc";
import type { Metadata } from "next";

export async function generateStaticParams() {
  const daPosts = getAllPosts("da").map((p) => ({ locale: "da", slug: p.slug }));
  const enPosts = getAllPosts("en").map((p) => ({ locale: "en", slug: p.slug }));
  return [...daPosts, ...enPosts];
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) return {};
  return {
    title: post.meta.title,
    description: post.meta.excerpt,
    openGraph: { title: post.meta.title, description: post.meta.excerpt },
  };
}

export default async function BlogPost({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  const t = await getTranslations({ locale, namespace: "blog" });
  const post = getPost(slug);
  if (!post) notFound();

  return (
    <main className="max-w-2xl mx-auto px-6 py-16">
      <Link
        href={`/${locale}/blog`}
        className="text-[#F0EDE6]/40 font-mono text-xs hover:text-[#F5A623] transition-colors mb-8 block"
      >
        {t("backToBlog")}
      </Link>
      <p className="text-[#F0EDE6]/40 font-mono text-xs mb-2">{post.meta.date}</p>
      <h1 className="text-3xl font-bold text-[#F0EDE6] mb-8">{post.meta.title}</h1>
      <article className="prose prose-invert prose-sm max-w-none prose-headings:font-bold prose-headings:text-[#F0EDE6] prose-p:text-[#F0EDE6]/80 prose-a:text-[#F5A623]">
        <MDXRemote source={post.content} />
      </article>
    </main>
  );
}
