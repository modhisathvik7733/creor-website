"use client";

import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Search, ArrowRight, FileText, Code2 } from "lucide-react";
import { searchDocs, type SearchEntry } from "@/lib/docs-search-index";

export function DocsSearchTrigger({ onOpen }: { onOpen: () => void }) {
  return (
    <button
      onClick={onOpen}
      className="flex h-10 w-full max-w-[460px] items-center gap-3 rounded-xl border border-[#222] bg-[#111] px-4 text-[14px] text-[#555] transition-colors hover:border-[#333] hover:bg-[#151515]"
    >
      <Search className="h-4 w-4 shrink-0 text-[#444]" />
      <span className="flex-1 text-left">Search documentation...</span>
      <kbd className="hidden items-center gap-0.5 rounded-md bg-[#1A1A1A] px-2 py-0.5 font-mono text-[11px] text-[#555] sm:flex">
        <span className="text-[12px]">&#x2318;</span>K
      </kbd>
    </button>
  );
}

export function DocsSearchModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const prevOpenRef = useRef(false);
  if (isOpen && !prevOpenRef.current) {
    // Reset state when modal opens (during render, not in effect)
    if (query !== "") setQuery("");
    if (selected !== 0) setSelected(0);
  }
  prevOpenRef.current = isOpen;

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  const prevQueryRef = useRef(query);
  const searchResults = useMemo(() => searchDocs(query), [query]);
  if (prevQueryRef.current !== query) {
    prevQueryRef.current = query;
    if (selected !== 0) setSelected(0);
  }

  const navigate = useCallback(
    (href: string) => {
      router.push(href);
      onClose();
    },
    [router, onClose],
  );

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelected((s) => Math.min(s + 1, searchResults.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelected((s) => Math.max(s - 1, 0));
    } else if (e.key === "Enter" && searchResults[selected]) {
      e.preventDefault();
      navigate(searchResults[selected].href);
    } else if (e.key === "Escape") {
      onClose();
    }
  };

  // Global cmd+K listener
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        if (isOpen) onClose();
      }
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-start justify-center pt-[15vh]">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
        style={{ animation: "search-backdrop-in 0.15s ease-out" }}
      />

      {/* Modal */}
      <div
        className="relative z-10 w-full max-w-[580px] mx-4 overflow-hidden rounded-2xl border border-[#222] bg-[#0E0E0E] shadow-2xl"
        style={{ animation: "search-modal-in 0.15s ease-out" }}
      >
        {/* Search input */}
        <div className="flex items-center gap-3 border-b border-[#1A1A1A] px-5 py-4">
          <Search className="h-5 w-5 shrink-0 text-[#555]" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Search docs, API, guides..."
            className="flex-1 bg-transparent text-[16px] text-[#EDEDED] outline-none placeholder:text-[#444]"
          />
          <kbd
            onClick={onClose}
            className="cursor-pointer rounded-md bg-[#1A1A1A] px-2 py-0.5 text-[11px] text-[#555] transition-colors hover:bg-[#222]"
          >
            ESC
          </kbd>
        </div>

        {/* Results */}
        <div className="max-h-[400px] overflow-y-auto">
          {query && searchResults.length === 0 && (
            <div className="px-5 py-10 text-center text-[14px] text-[#555]">
              No searchResults for &ldquo;{query}&rdquo;
            </div>
          )}

          {searchResults.length > 0 && (
            <div className="py-2">
              {searchResults.map((entry, i) => (
                <button
                  key={entry.href}
                  onClick={() => navigate(entry.href)}
                  onMouseEnter={() => setSelected(i)}
                  className={`flex w-full items-center gap-3 px-5 py-3 text-left transition-colors ${
                    i === selected ? "bg-[#1A1A1A]" : "hover:bg-[#141414]"
                  }`}
                >
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#1A1A1A]">
                    {entry.category === "api" ? (
                      <Code2 className="h-3.5 w-3.5 text-[#FF6A13]" />
                    ) : (
                      <FileText className="h-3.5 w-3.5 text-[#666]" />
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-[14px] font-medium text-[#EDEDED]">{entry.title}</p>
                    <p className="text-[12px] text-[#555]">{entry.section}</p>
                  </div>
                  <span
                    className={`shrink-0 rounded-md px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${
                      entry.category === "api"
                        ? "bg-[#FF6A13]/10 text-[#FF6A13]"
                        : "bg-[#333]/50 text-[#666]"
                    }`}
                  >
                    {entry.category}
                  </span>
                  {i === selected && (
                    <ArrowRight className="h-3.5 w-3.5 shrink-0 text-[#555]" />
                  )}
                </button>
              ))}
            </div>
          )}

          {!query && (
            <div className="px-5 py-6">
              <p className="mb-3 text-[11px] font-semibold uppercase tracking-wider text-[#444]">
                Quick links
              </p>
              <div className="space-y-1">
                {[
                  { label: "Installation", href: "/docs/installation" },
                  { label: "Quickstart", href: "/docs/quickstart" },
                  { label: "API Overview", href: "/docs/api" },
                  { label: "Models & Pricing", href: "/docs/models" },
                  { label: "MCP Integrations", href: "/docs/customizing/mcp" },
                ].map((link) => (
                  <button
                    key={link.href}
                    onClick={() => navigate(link.href)}
                    className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-[13px] text-[#888] transition-colors hover:bg-[#1A1A1A] hover:text-[#EDEDED]"
                  >
                    <ArrowRight className="h-3 w-3" />
                    {link.label}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center gap-4 border-t border-[#1A1A1A] px-5 py-2.5 text-[11px] text-[#444]">
          <span className="flex items-center gap-1">
            <kbd className="rounded bg-[#1A1A1A] px-1.5 py-0.5">↑↓</kbd> navigate
          </span>
          <span className="flex items-center gap-1">
            <kbd className="rounded bg-[#1A1A1A] px-1.5 py-0.5">↵</kbd> open
          </span>
          <span className="flex items-center gap-1">
            <kbd className="rounded bg-[#1A1A1A] px-1.5 py-0.5">esc</kbd> close
          </span>
        </div>
      </div>
    </div>
  );
}
