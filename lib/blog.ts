import fs from "fs";
import path from "path";
import matter from "gray-matter";

const BLOG_DIR = path.join(process.cwd(), "content/blog");

export interface PostMeta {
  slug: string;
  title: string;
  date: string;
  excerpt: string;
  lang: string;
}

export function getAllPosts(locale: string): PostMeta[] {
  if (!fs.existsSync(BLOG_DIR)) return [];
  const files = fs.readdirSync(BLOG_DIR).filter((f) => f.endsWith(".mdx") || f.endsWith(".md"));
  return files
    .map((file) => {
      const raw = fs.readFileSync(path.join(BLOG_DIR, file), "utf-8");
      const { data } = matter(raw);
      return {
        slug: data.slug ?? file.replace(/\.mdx?$/, ""),
        title: data.title ?? "",
        date: data.date ?? "",
        excerpt: data.excerpt ?? "",
        lang: data.lang ?? "da",
      } as PostMeta;
    })
    .filter((p) => p.lang === locale)
    .sort((a, b) => b.date.localeCompare(a.date));
}

export function getPost(slug: string): { meta: PostMeta; content: string } | null {
  if (!fs.existsSync(BLOG_DIR)) return null;
  const files = fs.readdirSync(BLOG_DIR).filter((f) => f.endsWith(".mdx") || f.endsWith(".md"));
  for (const file of files) {
    const raw = fs.readFileSync(path.join(BLOG_DIR, file), "utf-8");
    const { data, content } = matter(raw);
    const fileSlug = data.slug ?? file.replace(/\.mdx?$/, "");
    if (fileSlug === slug) {
      return {
        meta: { slug: fileSlug, title: data.title, date: data.date, excerpt: data.excerpt, lang: data.lang },
        content,
      };
    }
  }
  return null;
}
