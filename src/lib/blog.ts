const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001";

export interface BlogListItem {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  tags: string[];
  authorName: string;
  authorRole: string | null;
  readingTime: string;
  publishedAt: string;
}

export interface BlogPost extends BlogListItem {
  id: string;
  content: string;
  published: boolean;
  timeCreated: string;
  timeUpdated: string;
}

export async function fetchBlogPosts(): Promise<BlogListItem[]> {
  const res = await fetch(`${API_BASE}/api/blog`, { cache: "no-store" });
  if (!res.ok) throw new Error("Failed to fetch blog posts");
  const data = await res.json();
  return data.posts;
}

export async function fetchBlogPost(slug: string): Promise<BlogPost | null> {
  const res = await fetch(`${API_BASE}/api/blog/${slug}`, { cache: "no-store" });
  if (res.status === 404) return null;
  if (!res.ok) throw new Error("Failed to fetch blog post");
  const data = await res.json();
  return data.post;
}

export async function fetchBlogSlugs(): Promise<string[]> {
  const res = await fetch(`${API_BASE}/api/blog/slugs`, { cache: "no-store" });
  if (!res.ok) return [];
  const data = await res.json();
  return data.slugs;
}

export function formatBlogDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}
