"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { BlogCta } from "@/components/blog/blog-cta";
import type { BlogPost } from "@/lib/blog";
import { formatBlogDate } from "@/lib/blog";

export function BlogPostLayout({
  post,
  children,
}: {
  post: BlogPost;
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <article className="mx-auto max-w-[720px] px-6 pt-32 pb-20">
        <Link
          href="/blog"
          className="mb-8 inline-flex items-center gap-1.5 text-[13px] text-white/40 transition-colors hover:text-white/70"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Back to Blog
        </Link>

        <header className="mb-12">
          <span className="mb-4 inline-block rounded-full border border-white/[0.08] px-3 py-1 text-[12px] text-white/40">
            {post.category}
          </span>
          <h1 className="text-[32px] font-bold leading-[1.15] tracking-tight text-[#EDEDED] sm:text-[40px]">
            {post.title}
          </h1>
          <div className="mt-4 flex items-center gap-3 text-[13px] text-white/30">
            <span>{post.authorName}</span>
            <span>&middot;</span>
            <time>{formatBlogDate(post.publishedAt)}</time>
            <span>&middot;</span>
            <span>{post.readingTime}</span>
          </div>
        </header>

        <div className="h-px w-full bg-[#222222] mb-10" />

        <div>{children}</div>

        <div className="h-px w-full bg-[#222222] my-10" />

        <BlogCta />
      </article>
      <Footer />
    </div>
  );
}
