import { ChevronRight, ChevronDown, MoreHorizontal } from "lucide-react";

interface FileEntry {
  name: string;
  depth: number;
  type: "folder" | "file";
  path?: string;
  git?: "M" | "U";
  dotColor?: string;
  open?: boolean;
}

const TREE: FileEntry[] = [
  { name: ".creor", depth: 0, type: "folder", dotColor: "#4ec96e" },
  { name: ".next", depth: 0, type: "folder" },
  { name: "api", depth: 0, type: "folder", dotColor: "#4ec96e" },
  { name: "ecommerce-web", depth: 0, type: "folder", dotColor: "#c8c832", open: true },
  { name: "src/", depth: 1, type: "folder", open: true },
  { name: "app/", depth: 2, type: "folder" },
  { name: "components/", depth: 2, type: "folder", open: true },
  { name: "CartSummary.tsx", depth: 3, type: "file", path: "src/components/CartSummary.tsx", git: "M" },
  { name: "Navbar.tsx", depth: 3, type: "file", path: "src/components/Navbar.tsx" },
  { name: "ProductCard.tsx", depth: 3, type: "file", path: "src/components/ProductCard.tsx" },
  { name: "hooks/", depth: 2, type: "folder" },
  { name: "lib/", depth: 2, type: "folder", open: true },
  { name: "api.ts", depth: 3, type: "file", path: "src/lib/api.ts" },
  { name: "utils.ts", depth: 3, type: "file", path: "src/lib/utils.ts", git: "M" },
  { name: "package.json", depth: 1, type: "file" },
  { name: ".env", depth: 0, type: "file", git: "U" },
  { name: "README.md", depth: 0, type: "file" },
];

function FileIcon({ name }: { name: string }) {
  const ext = name.split(".").pop()?.toLowerCase();
  let color = "text-white/20";
  let label = "";

  switch (ext) {
    case "ts":
      color = "text-blue-500/60";
      label = "T";
      break;
    case "jsx":
    case "tsx":
      color = "text-blue-400/60";
      label = "⚛";
      break;
    case "css":
      color = "text-purple-400/60";
      label = "#";
      break;
    case "json":
      color = "text-yellow-400/60";
      label = "{}";
      break;
    case "md":
      color = "text-blue-300/60";
      label = "ⓘ";
      break;
    case "sh":
      color = "text-green-400/60";
      label = "$";
      break;
    default:
      color = "text-white/20";
      label = "◇";
  }

  return (
    <span className={`w-4 shrink-0 text-center text-[10px] ${color}`}>
      {label}
    </span>
  );
}

export function FileExplorer({ activeFile }: { activeFile: string | null }) {
  return (
    <div className="hidden w-40 shrink-0 flex-col border-r border-white/[0.06] bg-[#0d0d0f] sm:flex lg:w-52">
      {/* Explorer header */}
      <div className="flex items-center justify-between px-4 py-2">
        <span className="text-[11px] font-semibold uppercase tracking-wider text-white/40">
          Explorer
        </span>
        <MoreHorizontal className="h-4 w-4 text-white/15" />
      </div>

      {/* Open Editors */}
      <div className="flex items-center gap-1 px-2 py-1 text-[11px] text-white/30">
        <ChevronRight className="h-3 w-3 text-white/20" />
        <span className="uppercase">Open Editors</span>
      </div>

      {/* Project name */}
      <div className="flex items-center gap-1 px-2 py-1 text-[11px] font-semibold text-white/50">
        <ChevronDown className="h-3 w-3 text-white/30" />
        <span className="uppercase">Ecommerce</span>
      </div>

      {/* File tree */}
      <div className="flex-1 overflow-hidden px-1 text-[12px]">
        {TREE.map((entry, i) => {
          const isActive =
            entry.path !== undefined && entry.path === activeFile;

          return (
            <div
              key={i}
              className={`flex items-center gap-1 rounded-sm px-1 py-[2px] transition-colors duration-300 ${
                isActive ? "bg-white/[0.06]" : ""
              }`}
              style={{ paddingLeft: `${(entry.depth + 1) * 10 + 4}px` }}
            >
              {/* Chevron or spacer */}
              {entry.type === "folder" ? (
                entry.open ? (
                  <ChevronDown className="h-3 w-3 shrink-0 text-white/25" />
                ) : (
                  <ChevronRight className="h-3 w-3 shrink-0 text-white/25" />
                )
              ) : (
                <span className="w-3 shrink-0" />
              )}

              {/* File/folder icon */}
              {entry.type === "file" ? (
                <FileIcon name={entry.name} />
              ) : (
                <span className="w-4 shrink-0 text-center text-[11px] text-amber-400/50">
                  ▸
                </span>
              )}

              {/* Name */}
              <span
                className={`flex-1 truncate ${
                  isActive
                    ? "text-white/80"
                    : entry.git === "M"
                      ? "text-amber-300/70"
                      : entry.git === "U"
                        ? "text-green-400/70"
                        : entry.type === "folder"
                          ? "text-white/50"
                          : "text-white/35"
                }`}
              >
                {entry.name}
              </span>

              {/* Git status or dot */}
              {entry.git && (
                <span
                  className={`shrink-0 text-[10px] font-medium ${
                    entry.git === "M"
                      ? "text-amber-400/70"
                      : "text-green-400/70"
                  }`}
                >
                  {entry.git}
                </span>
              )}
              {entry.dotColor && !entry.git && (
                <span
                  className="h-2 w-2 shrink-0 rounded-full"
                  style={{ backgroundColor: entry.dotColor }}
                />
              )}
            </div>
          );
        })}
      </div>

      {/* Bottom sections */}
      <div className="border-t border-white/[0.04]">
        <div className="flex items-center gap-1 px-3 py-1.5 text-[11px] text-white/25">
          <ChevronRight className="h-3 w-3 text-white/15" />
          <span className="uppercase">Outline</span>
        </div>
        <div className="flex items-center gap-1 border-t border-white/[0.04] px-3 py-1.5 text-[11px] text-white/25">
          <ChevronRight className="h-3 w-3 text-white/15" />
          <span className="uppercase">Timeline</span>
        </div>
      </div>
    </div>
  );
}
