"use client";

/* Infinite scrolling provider logo marquee */

const providers = [
  {
    name: "Anthropic",
    logo: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4 sm:h-5 sm:w-5 lg:h-7 lg:w-7">
        <path d="M17.304 3.541h-3.483l6.15 16.918h3.483l-6.15-16.918zm-10.608 0L.546 20.459h3.556l1.279-3.591h6.545l1.279 3.591h3.556L10.611 3.541H6.696zm.86 10.553 2.148-6.02 2.147 6.02H7.556z" />
      </svg>
    ),
  },
  {
    name: "OpenAI",
    logo: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4 sm:h-5 sm:w-5 lg:h-7 lg:w-7">
        <path d="M22.282 9.821a5.985 5.985 0 0 0-.516-4.91 6.046 6.046 0 0 0-6.51-2.9A6.065 6.065 0 0 0 4.981 4.18a5.985 5.985 0 0 0-3.998 2.9 6.046 6.046 0 0 0 .743 7.097 5.98 5.98 0 0 0 .51 4.911 6.051 6.051 0 0 0 6.515 2.9A5.985 5.985 0 0 0 13.26 24a6.056 6.056 0 0 0 5.772-4.206 5.99 5.99 0 0 0 3.997-2.9 6.056 6.056 0 0 0-.747-7.073zM13.26 22.43a4.476 4.476 0 0 1-2.876-1.04l.141-.081 4.779-2.758a.795.795 0 0 0 .392-.681v-6.737l2.02 1.168a.071.071 0 0 1 .038.052v5.583a4.504 4.504 0 0 1-4.494 4.494zM3.6 18.304a4.47 4.47 0 0 1-.535-3.014l.142.085 4.783 2.759a.771.771 0 0 0 .78 0l5.843-3.369v2.332a.08.08 0 0 1-.033.062L9.74 19.95a4.5 4.5 0 0 1-6.14-1.646zM2.34 7.896a4.485 4.485 0 0 1 2.366-1.973V11.6a.766.766 0 0 0 .388.676l5.815 3.355-2.02 1.168a.076.076 0 0 1-.071 0l-4.83-2.786A4.504 4.504 0 0 1 2.34 7.872zm16.597 3.855l-5.833-3.387L15.119 7.2a.076.076 0 0 1 .071 0l4.83 2.791a4.494 4.494 0 0 1-.676 8.105v-5.678a.79.79 0 0 0-.407-.667zm2.01-3.023l-.141-.085-4.774-2.782a.776.776 0 0 0-.785 0L9.409 9.23V6.897a.066.066 0 0 1 .028-.061l4.83-2.787a4.5 4.5 0 0 1 6.68 4.66zm-12.64 4.135l-2.02-1.164a.08.08 0 0 1-.038-.057V6.075a4.5 4.5 0 0 1 7.375-3.453l-.142.08L8.704 5.46a.795.795 0 0 0-.393.681zm1.097-2.365l2.602-1.5 2.607 1.5v2.999l-2.597 1.5-2.607-1.5z" />
      </svg>
    ),
  },
  {
    name: "Google",
    logo: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4 sm:h-5 sm:w-5 lg:h-7 lg:w-7">
        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" />
        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
      </svg>
    ),
  },
  {
    name: "xAI",
    logo: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4 sm:h-5 sm:w-5 lg:h-7 lg:w-7">
        <path d="M3.005 6.89L11.74 18.204H8.078L3.005 11.166v7.038H0V6.89h3.005zm17.99 0v11.314H17.99V11.166L12.918 18.204H9.255L17.99 6.89h3.005zM24 6.89v3.124h-6.01V6.89H24zM6.01 15.08v3.124H0V15.08h6.01z" />
      </svg>
    ),
  },
  {
    name: "Mistral",
    logo: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4 sm:h-5 sm:w-5 lg:h-7 lg:w-7">
        <path d="M3 3h4.5v4.5H3zm13.5 0H21v4.5h-4.5zM3 7.5h4.5V12H3zm4.5 0h4.5V12H7.5zm4.5 0h4.5V12H12zm4.5 0H21V12h-4.5zM3 12h4.5v4.5H3zm9 0h4.5v4.5H12zm4.5 0H21v4.5h-4.5zM3 16.5h4.5V21H3zm4.5 0h4.5V21H7.5zm9 0H21V21h-4.5z" />
      </svg>
    ),
  },
  {
    name: "AWS Bedrock",
    logo: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4 sm:h-5 sm:w-5 lg:h-7 lg:w-7">
        <path d="M12 0L1.608 6v12L12 24l10.392-6V6zm-1.073 1.445h.001a1.8 1.8 0 0 1 2.138 0l7.286 4.207a1.8 1.8 0 0 1 .9 1.559v8.578a1.8 1.8 0 0 1-.9 1.559l-7.286 4.207a1.8 1.8 0 0 1-2.138 0l-7.286-4.207a1.8 1.8 0 0 1-.9-1.559V7.211a1.8 1.8 0 0 1 .9-1.559z" />
      </svg>
    ),
  },
  {
    name: "Azure",
    logo: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4 sm:h-5 sm:w-5 lg:h-7 lg:w-7">
        <path d="M13.053 0L6 7.583l-3.976 7.075L6.309 16H0l8.154 8h12.327L13.053 0zM8.6 16.182L14.04 3.428l4.682 12.578L8.6 16.182z" />
      </svg>
    ),
  },
  {
    name: "Groq",
    logo: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4 sm:h-5 sm:w-5 lg:h-7 lg:w-7">
        <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm0 2.4a9.6 9.6 0 1 1 0 19.2 9.6 9.6 0 0 1 0-19.2zm0 3.6a6 6 0 1 0 0 12 6 6 0 0 0 0-12zm0 2.4a3.6 3.6 0 1 1 0 7.2 3.6 3.6 0 0 1 0-7.2z" />
      </svg>
    ),
  },
  {
    name: "Cohere",
    logo: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4 sm:h-5 sm:w-5 lg:h-7 lg:w-7">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
      </svg>
    ),
  },
  {
    name: "Perplexity",
    logo: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4 sm:h-5 sm:w-5 lg:h-7 lg:w-7">
        <path d="M12 1L4 5v6c0 5.55 3.42 10.74 8 12 4.58-1.26 8-6.45 8-12V5l-8-4zm0 2.18l6 3v5.32c0 4.46-2.77 8.63-6 9.82-3.23-1.19-6-5.36-6-9.82V6.18l6-3z" />
      </svg>
    ),
  },
  {
    name: "Together AI",
    logo: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4 sm:h-5 sm:w-5 lg:h-7 lg:w-7">
        <path d="M7 7h4v4H7zm6 0h4v4h-4zM7 13h4v4H7zm6 0h4v4h-4z" />
      </svg>
    ),
  },
  {
    name: "DeepInfra",
    logo: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4 sm:h-5 sm:w-5 lg:h-7 lg:w-7">
        <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
      </svg>
    ),
  },
  {
    name: "Cerebras",
    logo: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4 sm:h-5 sm:w-5 lg:h-7 lg:w-7">
        <path d="M4 4h4v4H4zm6 0h4v4h-4zm6 0h4v4h-4zM4 10h4v4H4zm6 0h4v4h-4zm6 0h4v4h-4zM4 16h4v4H4zm6 0h4v4h-4zm6 0h4v4h-4z" />
      </svg>
    ),
  },
  {
    name: "OpenRouter",
    logo: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4 sm:h-5 sm:w-5 lg:h-7 lg:w-7">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z" />
      </svg>
    ),
  },
  {
    name: "Fireworks",
    logo: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4 sm:h-5 sm:w-5 lg:h-7 lg:w-7">
        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
      </svg>
    ),
  },
  {
    name: "Vertex AI",
    logo: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4 sm:h-5 sm:w-5 lg:h-7 lg:w-7">
        <path d="M12 2L1.5 21h21L12 2zm0 4l7.53 13H4.47L12 6z" />
      </svg>
    ),
  },
];

export function ProviderMarquee() {
  return (
    <section className="border-y border-border bg-background py-6 sm:py-10 lg:py-14 overflow-hidden">
      <p className="text-center text-[10px] sm:text-xs lg:text-sm font-medium uppercase tracking-[0.2em] lg:tracking-[0.25em] text-muted-foreground mb-4 sm:mb-6 lg:mb-10">
        Powering development with 19+ LLM providers
      </p>
      <div className="relative">
        {/* Fade edges */}
        <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-24 bg-gradient-to-r from-background to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-24 bg-gradient-to-l from-background to-transparent" />

        {/* Scrolling track */}
        <div className="flex animate-marquee gap-8 sm:gap-12 lg:gap-16">
          {/* Duplicate for seamless loop */}
          {[...providers, ...providers].map((p, i) => (
            <div
              key={`${p.name}-${i}`}
              className="flex shrink-0 items-center gap-1.5 sm:gap-2.5 lg:gap-3 text-muted-foreground/60 transition-colors hover:text-foreground"
            >
              {p.logo}
              <span className="whitespace-nowrap text-xs sm:text-sm lg:text-base font-medium">
                {p.name}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
