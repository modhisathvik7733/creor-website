import type { Metadata } from "next";
import { generatePageMetadata } from "@/lib/metadata";
import { allSections } from "@/lib/docs-search-index";
import { DocsCategoryCard } from "@/components/docs/docs-category-card";

export const metadata: Metadata = generatePageMetadata({
  title: "Documentation | Creor",
  description: "Guides, API reference, and tutorials for Creor — the AI-powered IDE.",
  path: "/docs",
});

const docsSections = allSections.filter((s) => s.category === "docs");
const apiSections = allSections.filter((s) => s.category === "api");

export default function DocsPage() {
  return (
    <div className="mx-auto max-w-[1100px] px-5 py-16 sm:px-6 sm:py-20">
      {/* Hero */}
      <div className="mx-auto max-w-[600px] text-center">
        <h1 className="text-[32px] font-bold tracking-tight text-[#EDEDED] sm:text-[44px]">
          Documentation
        </h1>
        <p className="mt-3 text-[16px] leading-relaxed text-[#888]">
          Everything you need to build with Creor — from quickstart to API reference.
        </p>

        <p className="mt-4 text-[13px] text-[#555]">
          Press <kbd className="rounded bg-[#1A1A1A] px-1.5 py-0.5 font-mono text-[11px] text-[#888]">&#x2318;K</kbd> to search
        </p>
      </div>

      {/* Docs categories */}
      <div className="mt-16">
        <p className="mb-5 text-[11px] font-semibold uppercase tracking-wider text-[#444]">
          Guides
        </p>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {docsSections.map((section) => (
            <DocsCategoryCard key={section.title} section={section} />
          ))}
        </div>
      </div>

      {/* API Reference */}
      <div className="mt-16 border-t border-[#1A1A1A] pt-12">
        <p className="mb-5 text-[11px] font-semibold uppercase tracking-wider text-[#444]">
          API Reference
        </p>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {apiSections.map((section) => (
            <DocsCategoryCard key={section.title} section={section} />
          ))}
        </div>
      </div>

      {/* Quick links footer */}
      <div className="mt-16 border-t border-[#1A1A1A] pt-8 text-center">
        <p className="text-[13px] text-[#555]">
          Can&apos;t find what you need?{" "}
          <span className="text-[#888]">Press</span>{" "}
          <kbd className="rounded bg-[#1A1A1A] px-1.5 py-0.5 font-mono text-[11px] text-[#888]">&#x2318;K</kbd>{" "}
          <span className="text-[#888]">to search across all docs.</span>
        </p>
      </div>
    </div>
  );
}
