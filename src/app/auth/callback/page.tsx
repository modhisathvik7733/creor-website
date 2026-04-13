"use client";

import { useEffect, useRef, useState, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { useAuth } from "@/lib/auth";
import { api } from "@/lib/api";
import { Suspense } from "react";
import Image from "next/image";
import Link from "next/link";

function isValidRedirect(url: string): boolean {
  if (!url || !url.startsWith('/')) return false;
  if (url.startsWith('//')) return false;
  if (url.includes('://')) return false;
  return true;
}

function CallbackContent() {
  const searchParams = useSearchParams();
  const { login } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const calledRef = useRef(false);

  const code = useMemo(() => searchParams.get("code"), [searchParams]);
  const provider = useMemo(() => searchParams.get("provider"), [searchParams]);
  const stateRedirect = useMemo(() => {
    const s = searchParams.get("state");
    const decoded = s ? decodeURIComponent(s) : "/dashboard";
    return isValidRedirect(decoded) ? decoded : "/dashboard";
  }, [searchParams]);

  useEffect(() => {
    if (calledRef.current) return;

    if (!code || !provider) return;

    calledRef.current = true;

    (async () => {
      try {
        if (provider === "github") {
          const redirectUri = `${window.location.origin}/auth/callback?provider=github`;
          await api.authGithub(code, redirectUri);
        } else if (provider === "google") {
          const redirectUri = `${window.location.origin}/auth/callback?provider=google`;
          await api.authGoogle(code, redirectUri);
        } else {
          setError("Unknown provider");
          return;
        }
        await login();
        window.location.href = stateRedirect;
      } catch (err: unknown) {
        setError(
          err instanceof Error ? err.message : "Authentication failed"
        );
      }
    })();
  }, [searchParams, login, code, provider, stateRedirect]);

  if (!code || !provider) {
    return (
      <Shell>
        <ErrorState message="Missing authentication parameters" />
      </Shell>
    );
  }

  if (error) {
    return (
      <Shell>
        <ErrorState message={error} />
      </Shell>
    );
  }

  return (
    <Shell>
      {/* Spinner */}
      <div className="relative mb-6 flex h-16 w-16 items-center justify-center">
        <div className="absolute inset-0 animate-[spin_3s_linear_infinite] rounded-full border border-white/[0.06]" />
        <div className="absolute inset-0 animate-[spin_1.2s_ease-in-out_infinite] rounded-full border-2 border-transparent border-t-indigo-400/80" />
        <Image
          src="/creor-nobg-icon.png"
          alt="Creor"
          width={28}
          height={28}
          className="h-7 w-7"
        />
      </div>

      <h2 className="text-[15px] font-medium tracking-tight text-white/80">
        Signing you in
      </h2>
      <p className="mt-1.5 text-[13px] text-white/30">
        Connecting to {provider === "github" ? "GitHub" : provider === "google" ? "Google" : "your account"}...
      </p>
    </Shell>
  );
}

function Shell({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative flex min-h-screen items-center justify-center bg-background overflow-hidden">
      {/* Background gradient blobs */}
      <div
        className="pointer-events-none absolute top-1/3 left-1/4 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full"
        style={{
          background: "radial-gradient(circle, rgba(129,140,248,0.06) 0%, transparent 70%)",
        }}
      />
      <div
        className="pointer-events-none absolute bottom-1/4 right-1/4 h-[400px] w-[400px] rounded-full"
        style={{
          background: "radial-gradient(circle, rgba(168,85,247,0.05) 0%, transparent 70%)",
        }}
      />

      {/* Dot grid */}
      <svg
        className="pointer-events-none absolute inset-0 h-full w-full opacity-[0.02]"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <pattern id="dots" x="0" y="0" width="24" height="24" patternUnits="userSpaceOnUse">
            <circle cx="12" cy="12" r="0.8" fill="white" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#dots)" />
      </svg>

      {/* Top-left logo */}
      <Link
        href="/"
        className="absolute top-8 left-8 z-10 flex items-center gap-2 transition-opacity hover:opacity-70"
      >
        <Image src="/creor-nobg-icon.png" alt="Creor" width={28} height={28} className="h-7 w-7" />
        <span className="text-[15px] font-semibold tracking-tight text-white/70">Creor</span>
      </Link>

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center text-center">
        {children}
      </div>
    </div>
  );
}

function ErrorState({ message }: { message: string }) {
  return (
    <>
      <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-full border border-red-500/20 bg-red-500/[0.08]">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-red-400">
          <circle cx="12" cy="12" r="10" />
          <line x1="15" y1="9" x2="9" y2="15" />
          <line x1="9" y1="9" x2="15" y2="15" />
        </svg>
      </div>
      <h2 className="text-[15px] font-medium tracking-tight text-white/80">
        Authentication failed
      </h2>
      <p className="mt-1.5 max-w-[260px] text-[13px] leading-relaxed text-white/30">
        {message}
      </p>
      <a
        href="/login"
        className="mt-5 inline-flex items-center gap-1.5 rounded-lg border border-white/[0.08] bg-white/[0.03] px-4 py-2 text-[13px] font-medium text-white/60 transition-colors hover:bg-white/[0.06] hover:text-white/80"
      >
        Try again
      </a>
    </>
  );
}

export default function AuthCallbackPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-background">
          <div className="h-5 w-5 animate-spin rounded-full border-2 border-white/10 border-t-white/60" />
        </div>
      }
    >
      <CallbackContent />
    </Suspense>
  );
}
