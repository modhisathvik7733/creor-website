import type { Components } from "react-markdown";

export const blogMarkdownComponents: Components = {
  h2: ({ children, ...props }) => (
    <h2
      className="mb-5 mt-12 text-[22px] font-semibold tracking-tight text-[#EDEDED]"
      id={typeof children === "string" ? children.toLowerCase().replace(/\s+/g, "-") : undefined}
      {...props}
    >
      {children}
    </h2>
  ),
  h3: ({ children, ...props }) => (
    <h3 className="mb-4 mt-8 text-[16px] font-medium tracking-tight text-[#EDEDED]" {...props}>
      {children}
    </h3>
  ),
  p: ({ children, ...props }) => (
    <p className="mb-5 text-[15px] leading-[1.8] text-[#D1D1D1]" {...props}>
      {children}
    </p>
  ),
  strong: ({ children, ...props }) => (
    <strong className="font-semibold text-[#EDEDED]" {...props}>
      {children}
    </strong>
  ),
  a: ({ children, href, ...props }) => (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="text-white/70 underline decoration-white/20 underline-offset-2 transition-colors hover:text-white hover:decoration-white/40"
      {...props}
    >
      {children}
    </a>
  ),
  ul: ({ children, ...props }) => (
    <ul className="mb-6 ml-4 list-disc space-y-2 text-[15px] leading-[1.8] text-[#D1D1D1]" {...props}>
      {children}
    </ul>
  ),
  ol: ({ children, ...props }) => (
    <ol className="mb-6 ml-4 list-decimal space-y-2 text-[15px] leading-[1.8] text-[#D1D1D1]" {...props}>
      {children}
    </ol>
  ),
  li: ({ children, ...props }) => (
    <li className="text-[#D1D1D1]" {...props}>
      {children}
    </li>
  ),
  blockquote: ({ children, ...props }) => (
    <blockquote
      className="mb-6 border-l-2 border-white/[0.15] pl-5 text-[15px] leading-[1.8] text-white/50 italic"
      {...props}
    >
      {children}
    </blockquote>
  ),
  code: ({ children, className, ...props }) => {
    const isInline = !className;
    if (isInline) {
      return (
        <code
          className="rounded bg-white/[0.06] px-1.5 py-0.5 font-mono text-[13px] text-[#EDEDED]"
          {...props}
        >
          {children}
        </code>
      );
    }
    return (
      <code className="font-mono text-[13px] text-[#EDEDED]" {...props}>
        {children}
      </code>
    );
  },
  pre: ({ children, ...props }) => (
    <div className="mb-6 overflow-hidden rounded-md border border-[#222222] bg-[#0A0A0A]">
      <pre className="overflow-x-auto px-4 py-3" {...props}>
        {children}
      </pre>
    </div>
  ),
  img: ({ src, alt, ...props }) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={alt || ""}
      className="my-6 w-full rounded-lg"
      loading="lazy"
      {...props}
    />
  ),
  hr: () => <div className="my-10 h-px w-full bg-[#222222]" />,
};
