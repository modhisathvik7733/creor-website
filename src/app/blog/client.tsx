"use client";

import { useEffect, useState } from "react";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { FadeIn } from "@/components/fade-in";
import { BlogCard, FeaturedBlogCard } from "@/components/blog/blog-card";
import { fetchBlogPosts, type BlogListItem } from "@/lib/blog";

export function BlogListClient() {
  const [posts, setPosts] = useState<BlogListItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBlogPosts()
      .then(setPosts)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="mx-auto max-w-[1100px] px-6 pt-32 pb-20">
        <FadeIn>
          <h1 className="text-4xl font-bold tracking-tight">Blog</h1>
          <p className="mt-3 text-foreground-secondary">
            Engineering deep-dives, practical guides, and insights on AI-native
            development from the Creor team.
          </p>
        </FadeIn>

        {loading ? (
          <div className="mt-12 space-y-6">
            <div className="h-[280px] animate-pulse rounded-xl border border-white/[0.06] bg-white/[0.02]" />
            <div className="grid gap-5 sm:grid-cols-2">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="h-[340px] animate-pulse rounded-xl border border-white/[0.06] bg-white/[0.02]"
                />
              ))}
            </div>
          </div>
        ) : posts.length === 0 ? (
          <div className="mt-20 text-center">
            <p className="text-foreground-secondary">No blog posts yet.</p>
          </div>
        ) : (
          <>
            <div className="mt-12">
              <FadeIn delay={100}>
                <FeaturedBlogCard post={posts[0]} />
              </FadeIn>
            </div>

            {posts.length > 1 && (
              <div className="mt-6 grid gap-5 sm:grid-cols-2">
                {posts.slice(1).map((post, i) => (
                  <FadeIn key={post.slug} delay={150 + i * 80}>
                    <BlogCard post={post} />
                  </FadeIn>
                ))}
              </div>
            )}
          </>
        )}
      </main>
      <Footer />
    </div>
  );
}
