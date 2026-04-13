"use client";

import { useEffect, useState } from "react";
import { useIntersectionObserver } from "@/hooks/use-intersection-observer";

const files = [
  { name: "src/", indent: 0, type: "folder" },
  { name: "app/", indent: 1, type: "folder" },
  { name: "layout.tsx", indent: 2, type: "file" },
  { name: "page.tsx", indent: 2, type: "file" },
  { name: "components/", indent: 1, type: "folder" },
  { name: "Navbar.tsx", indent: 2, type: "file" },
  { name: "CartSummary.tsx", indent: 2, type: "file" },
  { name: "lib/", indent: 1, type: "folder" },
  { name: "utils.ts", indent: 2, type: "file" },
  { name: "api.ts", indent: 2, type: "file" },
];

export function AnimatedRepoMap() {
  const { ref, isIntersecting } = useIntersectionObserver({ threshold: 0.4 });
  const [visibleCount, setVisibleCount] = useState(0);

  useEffect(() => {
    if (!isIntersecting) return;

    files.forEach((_, i) => {
      setTimeout(() => setVisibleCount(i + 1), 150 + i * 90);
    });
  }, [isIntersecting]);

  return (
    <div ref={ref}>
      <span className="mb-3 block font-mono text-[10px] uppercase tracking-widest text-white/35">
        Repo Map
      </span>
      <div className="space-y-0.5 font-mono text-[11px]">
        {files.map((f, i) => (
          <div
            key={i}
            className={`text-white/45 transition-all duration-300 ease-out ${
              i < visibleCount
                ? "opacity-100 translate-y-0"
                : "opacity-0 -translate-y-2"
            }`}
            style={{ paddingLeft: `${f.indent * 16}px` }}
          >
            <span className={f.type === "folder" ? "text-amber-400/60" : "text-white/35"}>
              {f.type === "folder" ? "▸ " : "  "}
            </span>
            {f.name}
          </div>
        ))}
      </div>
    </div>
  );
}
