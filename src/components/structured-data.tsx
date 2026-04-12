import { siteConfig } from "@/lib/metadata";
import type { BlogPost } from "@/lib/blog";

export function OrganizationSchema() {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Organization",
          name: siteConfig.name,
          url: siteConfig.url,
          logo: `${siteConfig.url}/icon.svg`,
          description: siteConfig.description,
          sameAs: [siteConfig.links.github, siteConfig.links.twitter],
        }),
      }}
    />
  );
}

export function BlogPostSchema({ post }: { post: BlogPost }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "BlogPosting",
          headline: post.title,
          description: post.excerpt,
          datePublished: post.publishedAt,
          dateModified: post.timeUpdated,
          author: {
            "@type": "Organization",
            name: "Creor",
            url: siteConfig.url,
          },
          publisher: {
            "@type": "Organization",
            name: siteConfig.name,
            url: siteConfig.url,
          },
          mainEntityOfPage: `${siteConfig.url}/blog/${post.slug}`,
        }),
      }}
    />
  );
}

export function SoftwareApplicationSchema() {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "SoftwareApplication",
          name: siteConfig.name,
          applicationCategory: "DeveloperApplication",
          operatingSystem: "Windows, macOS, Linux",
          offers: {
            "@type": "Offer",
            price: "0",
            priceCurrency: "USD",
          },
          description: siteConfig.description,
        }),
      }}
    />
  );
}
