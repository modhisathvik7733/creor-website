import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { BlogListItem } from "@/lib/blog";
import { formatBlogDate } from "@/lib/blog";

const categoryGradients: Record<string, string> = {
  Engineering: "from-indigo-500/10 to-purple-500/5",
  "AI & LLMs": "from-emerald-500/10 to-cyan-500/5",
  Product: "from-amber-500/10 to-orange-500/5",
  Guides: "from-blue-500/10 to-indigo-500/5",
};

export function BlogCard({ post }: { post: BlogListItem }) {
  const gradient = categoryGradients[post.category] ?? "from-white/[0.04] to-white/[0.01]";

  return (
    <Link href={`/blog/${post.slug}`} className="group block h-full">
      <div className="flex h-full flex-col rounded-xl border border-white/[0.06] bg-white/[0.02] transition-colors hover:border-white/[0.12] hover:bg-white/[0.04]">
        <div className={`aspect-[16/9] rounded-t-xl bg-gradient-to-br ${gradient} flex items-center justify-center`}>
          <div className="text-[40px] opacity-20">
            {post.category === "Engineering" && "{ }"}
            {post.category === "AI & LLMs" && "AI"}
            {post.category === "Product" && "</>"}
            {post.category === "Guides" && "//"}
          </div>
        </div>

        <div className="flex flex-1 flex-col p-5">
          <span className="mb-3 w-fit rounded-full border border-white/[0.08] px-2.5 py-0.5 text-[11px] font-medium text-white/40">
            {post.category}
          </span>

          <h2 className="mb-2 text-[16px] font-semibold leading-snug text-white group-hover:text-white/90">
            {post.title}
          </h2>

          <p className="mb-4 flex-1 text-[13px] leading-relaxed text-white/35 line-clamp-2">
            {post.excerpt}
          </p>

          <div className="flex items-center justify-between text-[12px] text-white/20">
            <div className="flex items-center gap-2">
              <time>{formatBlogDate(post.publishedAt)}</time>
              <span>&middot;</span>
              <span>{post.readingTime}</span>
            </div>
            <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
          </div>
        </div>
      </div>
    </Link>
  );
}

export function FeaturedBlogCard({ post }: { post: BlogListItem }) {
  const gradient = categoryGradients[post.category] ?? "from-white/[0.04] to-white/[0.01]";

  return (
    <Link href={`/blog/${post.slug}`} className="group block">
      <div className="grid overflow-hidden rounded-xl border border-white/[0.06] bg-white/[0.02] transition-colors hover:border-white/[0.12] hover:bg-white/[0.04] sm:grid-cols-2">
        <div className={`aspect-[16/9] bg-gradient-to-br ${gradient} flex items-center justify-center sm:aspect-auto sm:min-h-[280px]`}>
          <div className="text-[56px] opacity-20 font-mono">
            {post.category === "Engineering" && "{ }"}
            {post.category === "AI & LLMs" && "AI"}
            {post.category === "Product" && "</>"}
            {post.category === "Guides" && "//"}
          </div>
        </div>

        <div className="flex flex-col justify-center p-6 sm:p-8">
          <span className="mb-4 w-fit rounded-full border border-white/[0.08] px-2.5 py-0.5 text-[11px] font-medium text-white/40">
            {post.category}
          </span>

          <h2 className="mb-3 text-[22px] font-bold leading-tight tracking-tight text-white sm:text-[26px]">
            {post.title}
          </h2>

          <p className="mb-5 text-[14px] leading-relaxed text-white/40">
            {post.excerpt}
          </p>

          <div className="flex items-center gap-2 text-[13px] text-white/25">
            <time>{formatBlogDate(post.publishedAt)}</time>
            <span>&middot;</span>
            <span>{post.readingTime}</span>
          </div>
        </div>
      </div>
    </Link>
  );
}
