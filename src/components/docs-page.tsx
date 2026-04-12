import Link from "next/link";
import { Copy, MessageSquare, HelpCircle } from "lucide-react";

interface TocItem {
  label: string;
  href: string;
}

interface DocsPageProps {
  breadcrumb: string;
  title: string;
  description: string;
  toc?: TocItem[];
  children: React.ReactNode;
}

export function DocsPage({ breadcrumb, title, description, toc, children }: DocsPageProps) {
  return (
    <div className="flex w-full justify-center px-4 md:px-8 py-10 lg:py-16">
      <div className="flex w-full max-w-[1100px] justify-between gap-12 xl:gap-24">
        <article className="min-w-0 max-w-[760px] flex-1">
          <p className="mb-3 text-[13px] text-[#A1A1A1]">{breadcrumb}</p>
          <h1 className="mb-6 text-[32px] font-semibold tracking-tight text-[#EDEDED] sm:text-[40px]">
            {title}
          </h1>
          <p className="mb-10 text-[15px] leading-relaxed text-[#D1D1D1] sm:text-[16px]">
            {description}
          </p>
          {children}
        </article>

        <aside className="hidden w-[220px] shrink-0 xl:block">
          <div className="sticky top-[92px] space-y-8">
            {toc && toc.length > 0 && (
              <>
                <div>
                  <h4 className="mb-3 text-[13px] font-medium text-[#EDEDED]">On this page</h4>
                  <div className="flex flex-col space-y-2 text-[13px]">
                    {toc.map((item) => (
                      <Link
                        key={item.href}
                        href={item.href}
                        className="text-[#A1A1A1] transition-colors hover:text-[#EDEDED]"
                      >
                        {item.label}
                      </Link>
                    ))}
                  </div>
                </div>
                <div className="h-px w-full bg-[#222222]" />
              </>
            )}
            <div className="flex flex-col space-y-3.5 text-[13px]">
              <button className="flex items-center gap-2.5 text-[#A1A1A1] transition-colors hover:text-[#EDEDED]">
                <Copy className="h-4 w-4" />
                Copy page
              </button>
              <button className="flex items-center gap-2.5 text-[#A1A1A1] transition-colors hover:text-[#EDEDED]">
                <MessageSquare className="h-4 w-4" />
                Share feedback
              </button>
              <button className="flex items-center gap-2.5 text-[#A1A1A1] transition-colors hover:text-[#EDEDED]">
                <HelpCircle className="h-4 w-4" />
                Explain more
              </button>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}

export function DocsSection({ id, title, children }: { id: string; title: string; children: React.ReactNode }) {
  return (
    <section id={id} className="mb-12">
      <h2 className="mb-5 mt-12 text-[20px] font-semibold tracking-tight text-[#EDEDED]">
        {title}
      </h2>
      {children}
    </section>
  );
}

export function DocsH3({ children }: { children: React.ReactNode }) {
  return (
    <h3 className="mb-4 mt-8 text-[16px] font-medium tracking-tight text-[#EDEDED]">
      {children}
    </h3>
  );
}

export function DocsParagraph({ children }: { children: React.ReactNode }) {
  return (
    <p className="mb-4 text-[15px] leading-relaxed text-[#D1D1D1]">
      {children}
    </p>
  );
}

export function DocsCode({ children, lines }: { children: string; lines?: boolean }) {
  const codeLines = children.split("\n");
  return (
    <div className="mb-6 overflow-hidden rounded-md border border-[#222222] bg-[#0A0A0A]">
      <div className="overflow-x-auto px-4 py-3 font-mono text-[13px]">
        {lines ? (
          <div className="flex">
            <div className="mr-4 select-none flex-col text-right text-[#444444]">
              {codeLines.map((_, i) => (
                <div key={i}>{i + 1}</div>
              ))}
            </div>
            <div className="flex-1">
              {codeLines.map((line, i) => (
                <div key={i} className="text-[#EDEDED]">{line || "\u00A0"}</div>
              ))}
            </div>
          </div>
        ) : (
          <pre className="text-[#EDEDED] whitespace-pre-wrap">{children}</pre>
        )}
      </div>
    </div>
  );
}

export function DocsTable({ headers, rows }: { headers: string[]; rows: string[][] }) {
  return (
    <div className="mb-8 overflow-hidden rounded-lg border border-[#222222] bg-[#141414]">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-[14px]">
          <thead className="border-b border-[#222222] bg-[#1A1A1A] text-[12px] font-medium text-[#A1A1A1]">
            <tr>
              {headers.map((h) => (
                <th key={h} className="px-4 py-3 font-medium">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-[#222222]">
            {rows.map((row, i) => (
              <tr key={i}>
                {row.map((cell, j) => (
                  <td key={j} className={`px-4 py-4 ${j === 0 ? "text-[#EDEDED]" : "text-[#A1A1A1]"}`}>
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export function DocsCard({ title, description, href }: { title: string; description: string; href: string }) {
  return (
    <Link
      href={href}
      className="flex flex-col rounded-lg border border-[#222222] bg-[#141414] p-5 transition-colors hover:bg-[#1A1A1A]"
    >
      <h3 className="mb-2 text-[14px] font-medium text-[#EDEDED]">{title}</h3>
      <p className="text-[13px] leading-relaxed text-[#A1A1A1]">{description}</p>
    </Link>
  );
}

export function DocsList({ items }: { items: string[] }) {
  return (
    <ul className="mb-6 ml-4 list-disc space-y-2 text-[15px] leading-relaxed text-[#D1D1D1]">
      {items.map((item) => (
        <li key={item}>{item}</li>
      ))}
    </ul>
  );
}

export function DocsDivider() {
  return <div className="h-px w-full bg-[#222222] my-10" />;
}

export function DocsCallout({ type = "info", children }: { type?: "info" | "warning" | "tip"; children: React.ReactNode }) {
  const colors = {
    info: "border-[#3399FF] bg-[#3399FF]/5",
    warning: "border-[#FF6A13] bg-[#FF6A13]/5",
    tip: "border-[#22C55E] bg-[#22C55E]/5",
  };
  const labels = { info: "Note", warning: "Warning", tip: "Tip" };

  return (
    <div className={`mb-6 rounded-md border-l-4 ${colors[type]} px-4 py-3`}>
      <p className="mb-1 text-[13px] font-semibold text-[#EDEDED]">{labels[type]}</p>
      <div className="text-[14px] leading-relaxed text-[#D1D1D1]">{children}</div>
    </div>
  );
}
