"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { BlogPostLayout } from "@/components/blog/blog-post-layout";
import { blogMarkdownComponents } from "@/components/blog/blog-article";
import { BlogPostSchema } from "@/components/structured-data";
import { fetchBlogPost, type BlogPost } from "@/lib/blog";

export function BlogPostClient() {
  const params = useParams<{ slug: string }>();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!params.slug) return;
    fetchBlogPost(params.slug)
      .then((p) => {
        if (!p) setError(true);
        else setPost(p);
      })
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, [params.slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="mx-auto max-w-[720px] px-6 pt-32 pb-20">
          <div className="space-y-4">
            <div className="h-4 w-24 animate-pulse rounded bg-white/[0.06]" />
            <div className="h-10 w-3/4 animate-pulse rounded bg-white/[0.06]" />
            <div className="h-4 w-48 animate-pulse rounded bg-white/[0.06]" />
            <div className="mt-10 h-px w-full bg-[#222222]" />
            <div className="mt-6 space-y-3">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="h-4 animate-pulse rounded bg-white/[0.06]" />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="flex flex-col items-center justify-center px-6 pt-32 pb-20 text-center">
          <h1 className="text-3xl font-bold tracking-tight">Post not found</h1>
          <p className="mt-3 text-foreground-secondary">
            The blog post you&apos;re looking for doesn&apos;t exist.
          </p>
          <a
            href="/blog"
            className="mt-8 inline-flex items-center rounded-full bg-foreground px-6 py-2.5 text-sm font-medium text-background transition-opacity hover:opacity-90"
          >
            Back to Blog
          </a>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <BlogPostLayout post={post}>
      <BlogPostSchema post={post} />
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={blogMarkdownComponents}
      >
        {post.content}
      </ReactMarkdown>
    </BlogPostLayout>
  );
}
