"use client";

import { useAuth } from "@/lib/auth";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState, Suspense } from "react";
import Link from "next/link";
import Image from "next/image";

const GITHUB_CLIENT_ID = process.env.NEXT_PUBLIC_GITHUB_CLIENT_ID ?? "";
const GOOGLE_CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID ?? "";

import { ALLOWED_EMAILS } from "@/lib/allowed-emails";

const FUN_PROMPTS = [
  { prompt: "it works on my machine but not in production", response: "Classic. Found it — you forgot to set the env variable. Works everywhere now." },
  { prompt: "why is my div not centering", response: "Added display: flex and two lines. CSS is easy said no developer ever." },
  { prompt: "fix this bug before the demo in 10 minutes", response: "Done. Also fixed 3 other bugs you didn't know about. You're welcome." },
  { prompt: "I pushed to main instead of my branch", response: "Reverted. Created your branch. Nobody saw anything. Our little secret." },
  { prompt: "this worked yesterday and I changed nothing", response: "Your package-lock.json disagrees. Pinned the dependency. Crisis averted." },
  { prompt: "make this code readable my teammate is confused", response: "Renamed 14 variables from x, y, temp to actual words. Revolutionary." },
  { prompt: "my node_modules is 2GB help", response: "Found 847 unused packages. npm uninstall go brrr. Down to 200MB." },
];

const GREETINGS = [
  { title: "Welcome back", sub: "Sign in to your account or create a new one" },
  { title: "Oh hey, you again", sub: "We missed you (the AI didn't, it has no feelings)" },
  { title: "Ready to ship?", sub: "Your codebase has been waiting patiently" },
  { title: "Let's build something", sub: "The terminal is warm, the agents are ready" },
  { title: "Back so soon?", sub: "That's the sign of a great product (we hope)" },
];

function FunHeading() {
  const [gi, setGi] = useState(0);
  const g = GREETINGS[gi];

  return (
    <div
      className="cursor-pointer select-none text-center lg:text-left"
      onClick={() => setGi((i) => (i + 1) % GREETINGS.length)}
      title="Click me"
    >
      <h1 className="text-3xl font-bold tracking-tight transition-all duration-300">
        {g.title}
      </h1>
      <p className="mt-2 text-[14px] text-white/40 transition-all duration-300">
        {g.sub}
      </p>
      <p className="mt-1 text-[10px] text-white/15">(click to change)</p>
    </div>
  );
}

function FunTerminal() {
  const [idx, setIdx] = useState(0);
  const [typedChars, setTypedChars] = useState(0);
  const [showResponse, setShowResponse] = useState(false);
  const [responseChars, setResponseChars] = useState(0);

  useEffect(() => {
    const current = FUN_PROMPTS[idx];
    let frame: ReturnType<typeof setTimeout>;

    if (typedChars < current.prompt.length) {
      frame = setTimeout(() => setTypedChars((c) => c + 1), 70);
    } else if (!showResponse) {
      frame = setTimeout(() => setShowResponse(true), 800);
    } else if (responseChars < current.response.length) {
      frame = setTimeout(() => setResponseChars((c) => c + 1), 25);
    } else {
      frame = setTimeout(() => {
        setIdx((i) => (i + 1) % FUN_PROMPTS.length);
        setTypedChars(0);
        setShowResponse(false);
        setResponseChars(0);
      }, 5000);
    }

    return () => clearTimeout(frame);
  }, [idx, typedChars, showResponse, responseChars]);

  const current = FUN_PROMPTS[idx];

  return (
    <div className="w-full max-w-[480px] overflow-hidden rounded-lg border border-white/[0.08] bg-[#111113]">
      <div className="flex items-center gap-1.5 border-b border-white/[0.06] px-3 py-2">
        <span className="h-2 w-2 rounded-full bg-[#ff5f57]" />
        <span className="h-2 w-2 rounded-full bg-[#febc2e]" />
        <span className="h-2 w-2 rounded-full bg-[#28c840]" />
        <span className="ml-3 text-[10px] text-white/25">creor</span>
      </div>
      <div className="h-[140px] px-4 py-3 font-mono text-[12px] leading-[20px]">
        <div className="text-white/25">
          <span className="text-indigo-400/60">creor</span>{" "}
          <span className="text-white/15">v4.2.0</span>
        </div>
        <div className="mt-2 flex items-start">
          <span className="mr-1.5 shrink-0 text-indigo-400/50">&gt;</span>
          <span className="text-white/60">
            {current.prompt.slice(0, typedChars)}
            {typedChars < current.prompt.length && (
              <span className="ml-0.5 inline-block h-3.5 w-[2px] animate-pulse bg-white/50" />
            )}
          </span>
        </div>
        {showResponse && (
          <div className="mt-2 flex items-start">
            <span className="mr-1.5 shrink-0 text-emerald-400/60">
              &larr;
            </span>
            <span className="text-white/40">
              {current.response.slice(0, responseChars)}
              {responseChars < current.response.length && (
                <span className="ml-0.5 inline-block h-3.5 w-[2px] animate-pulse bg-emerald-400/50" />
              )}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}

function isValidRedirect(url: string): boolean {
  if (!url || !url.startsWith('/')) return false;
  if (url.startsWith('//')) return false;  // protocol-relative URLs
  if (url.includes('://')) return false;
  return true;
}

function LoginContent() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const rawRedirect = searchParams.get("redirect") ?? "/dashboard";
  const redirectTo = isValidRedirect(rawRedirect) ? rawRedirect : "/dashboard";

  useEffect(() => {
    if (!loading && user) {
      // Early-access gate: if allowlist is set, only those emails can proceed
      if (ALLOWED_EMAILS.size > 0 && !ALLOWED_EMAILS.has(user.email.toLowerCase())) {
        router.replace("/waitlist");
        return;
      }
      router.replace(redirectTo);
    }
  }, [user, loading, router, redirectTo]);

  const handleGithub = () => {
    const state = redirectTo !== "/dashboard" ? encodeURIComponent(redirectTo) : "";
    const redirect = `${window.location.origin}/auth/callback?provider=github${state ? `&state=${state}` : ""}`;
    const url = `https://github.com/login/oauth/authorize?client_id=${GITHUB_CLIENT_ID}&redirect_uri=${encodeURIComponent(redirect)}&scope=read:user,user:email`;
    window.location.href = url;
  };

  const handleGoogle = () => {
    const state = redirectTo !== "/dashboard" ? encodeURIComponent(redirectTo) : "";
    const redirect = `${window.location.origin}/auth/callback?provider=google${state ? `&state=${state}` : ""}`;
    const url = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${GOOGLE_CLIENT_ID}&redirect_uri=${encodeURIComponent(redirect)}&response_type=code&scope=openid+email+profile&state=${state}`;
    window.location.href = url;
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <div className="h-5 w-5 animate-spin rounded-full border-2 border-border border-t-foreground" />
      </div>
    );
  }

  return (
    <div className="relative flex min-h-screen overflow-hidden bg-background">
      {/* ── Left panel: branding ── */}
      <div className="relative hidden w-1/2 items-center justify-center overflow-hidden border-r border-white/[0.06] lg:flex">
        {/* SVG circuit/node background pattern */}
        <svg
          className="pointer-events-none absolute inset-0 h-full w-full opacity-[0.04]"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <pattern id="circuit" x="0" y="0" width="120" height="120" patternUnits="userSpaceOnUse">
              <circle cx="60" cy="60" r="1.5" fill="white" />
              <circle cx="0" cy="0" r="1" fill="white" />
              <circle cx="120" cy="0" r="1" fill="white" />
              <circle cx="0" cy="120" r="1" fill="white" />
              <circle cx="120" cy="120" r="1" fill="white" />
              <line x1="60" y1="60" x2="120" y2="0" stroke="white" strokeWidth="0.5" />
              <line x1="60" y1="60" x2="0" y2="120" stroke="white" strokeWidth="0.5" />
              <line x1="60" y1="60" x2="120" y2="120" stroke="white" strokeWidth="0.5" />
              <line x1="60" y1="60" x2="0" y2="0" stroke="white" strokeWidth="0.5" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#circuit)" />
        </svg>

        {/* Gradient orbs */}
        <div
          className="pointer-events-none absolute -top-32 -left-32 h-[500px] w-[500px] rounded-full"
          style={{
            background:
              "radial-gradient(circle, rgba(129,140,248,0.12) 0%, transparent 65%)",
          }}
        />
        <div
          className="pointer-events-none absolute top-1/2 right-0 h-[400px] w-[400px] -translate-y-1/2 translate-x-1/2 rounded-full"
          style={{
            background:
              "radial-gradient(circle, rgba(168,85,247,0.08) 0%, transparent 65%)",
          }}
        />
        <div
          className="pointer-events-none absolute -bottom-20 left-1/3 h-[350px] w-[350px] rounded-full"
          style={{
            background:
              "radial-gradient(circle, rgba(59,130,246,0.08) 0%, transparent 65%)",
          }}
        />

        {/* Floating decorative rings */}
        <svg className="pointer-events-none absolute top-[15%] left-[10%] h-32 w-32 opacity-[0.06]" viewBox="0 0 100 100">
          <circle cx="50" cy="50" r="45" fill="none" stroke="white" strokeWidth="0.5" />
          <circle cx="50" cy="50" r="30" fill="none" stroke="white" strokeWidth="0.5" />
          <circle cx="50" cy="50" r="15" fill="none" stroke="white" strokeWidth="0.5" />
        </svg>
        <svg className="pointer-events-none absolute bottom-[20%] right-[15%] h-40 w-40 opacity-[0.04]" viewBox="0 0 100 100">
          <circle cx="50" cy="50" r="48" fill="none" stroke="white" strokeWidth="0.3" strokeDasharray="4 6" />
          <circle cx="50" cy="50" r="32" fill="none" stroke="white" strokeWidth="0.3" strokeDasharray="4 6" />
        </svg>

        {/* Top-left logo */}
        <Link href="/" className="absolute top-10 left-10 z-10 flex items-center gap-2.5 transition-opacity hover:opacity-70">
          <Image src="/creor-nobg-icon.png" alt="Creor" width={36} height={36} className="h-9 w-9" />
          <span className="text-lg font-semibold tracking-tight">Creor</span>
        </Link>

        {/* Content */}
        <div className="relative z-10 flex h-full w-full flex-col justify-center gap-8 p-14">
          {/* Tagline */}
          <div>
            <h2
              className="text-4xl font-normal tracking-tight xl:text-5xl"
              style={{ fontFamily: "var(--font-playfair), serif" }}
            >
              Code faster.{" "}
              <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-indigo-300 bg-clip-text text-transparent">
                Ship smarter.
              </span>
            </h2>
            <p className="mt-3 max-w-[440px] text-[14px] leading-relaxed text-white/35">
              AI agents that write, plan, and debug — across your entire
              codebase, with any model. Your code never leaves your machine.
            </p>
          </div>

          {/* Mock terminal with cycling funny prompts */}
          <FunTerminal />

          {/* Feature pills */}
          <div className="flex flex-wrap gap-2">
            {[
              "Multi-agent",
              "Any LLM",
              "Local-first",
              "MCP support",
              "Custom skills",
              "Full control",
            ].map((tag) => (
              <span
                key={tag}
                className="rounded-full border border-white/[0.08] bg-white/[0.03] px-3 py-1.5 text-[11px] text-white/35"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* ── Right panel: auth form ── */}
      <div className="relative flex flex-1 items-center justify-center px-6">
        {/* Subtle dot grid */}
        <svg
          className="pointer-events-none absolute inset-0 h-full w-full opacity-[0.025]"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <pattern id="dots" x="0" y="0" width="24" height="24" patternUnits="userSpaceOnUse">
              <circle cx="12" cy="12" r="0.8" fill="white" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#dots)" />
        </svg>

        {/* Glow */}
        <div
          className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[500px] w-[500px] rounded-full opacity-[0.05]"
          style={{
            background:
              "radial-gradient(circle, rgba(129,140,248,0.6) 0%, transparent 70%)",
          }}
        />

        <div className="relative z-10 w-full max-w-[380px]">
          {/* Logo (mobile only) */}
          <div className="mb-8 text-center lg:hidden">
            <Link href="/" className="inline-flex items-center gap-2.5">
              <Image
                src="/creor-nobg-icon.png"
                alt="Creor"
                width={48}
                height={48}
                className="h-12 w-12"
              />
            </Link>
          </div>

          <FunHeading />

          {/* Auth card */}
          <div className="mt-8 rounded-2xl border border-white/[0.08] bg-white/[0.02] p-7 backdrop-blur-sm">
            <div className="space-y-3">
              <button
                onClick={handleGithub}
                className="flex w-full items-center justify-center gap-2.5 rounded-xl bg-white px-4 py-3.5 text-[14px] font-semibold text-black transition-all hover:bg-white/90 active:scale-[0.98]"
              >
                <svg
                  className="h-5 w-5"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
                </svg>
                Continue with GitHub
              </button>

              <div className="relative flex items-center py-1">
                <div className="flex-1 border-t border-white/[0.06]" />
                <span className="px-3 text-[11px] text-white/20">or</span>
                <div className="flex-1 border-t border-white/[0.06]" />
              </div>

              <button
                onClick={handleGoogle}
                className="flex w-full items-center justify-center gap-2.5 rounded-xl border border-white/[0.10] bg-white/[0.04] px-4 py-3.5 text-[14px] font-medium text-white/80 transition-all hover:border-white/[0.18] hover:bg-white/[0.08] active:scale-[0.98]"
              >
                <svg className="h-5 w-5" viewBox="0 0 24 24">
                  <path
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
                    fill="#4285F4"
                  />
                  <path
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    fill="#34A853"
                  />
                  <path
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    fill="#FBBC05"
                  />
                  <path
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    fill="#EA4335"
                  />
                </svg>
                Continue with Google
              </button>
            </div>

            <p className="mt-5 text-center text-[11px] text-white/25">
              No account? One will be created automatically.
            </p>
          </div>

          {/* Footer */}
          <p className="mt-6 text-center text-[11px] text-white/25 lg:text-left">
            By continuing, you agree to our{" "}
            <Link
              href="/terms"
              className="text-white/40 underline underline-offset-2 hover:text-white/60"
            >
              Terms
            </Link>{" "}
            and{" "}
            <Link
              href="/privacy"
              className="text-white/40 underline underline-offset-2 hover:text-white/60"
            >
              Privacy Policy
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="flex h-screen items-center justify-center bg-background">
          <div className="h-5 w-5 animate-spin rounded-full border-2 border-border border-t-foreground" />
        </div>
      }
    >
      <LoginContent />
    </Suspense>
  );
}
