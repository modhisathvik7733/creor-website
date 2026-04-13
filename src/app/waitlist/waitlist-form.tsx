"use client";

import { useState } from "react";
import { ArrowRight, Check, Loader2 } from "lucide-react";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "";

export function WaitlistForm() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    setStatus("loading");
    setErrorMsg("");

    try {
      // Try posting to backend API
      if (API_URL) {
        const res = await fetch(`${API_URL}/api/waitlist`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: email.trim() }),
        });

        if (!res.ok) {
          const data = await res.json().catch(() => ({}));
          throw new Error(data.error ?? "Something went wrong");
        }
      }

      // Store locally as fallback/backup
      const existing = JSON.parse(localStorage.getItem("creor_waitlist") ?? "[]");
      if (!existing.includes(email.trim())) {
        existing.push(email.trim());
        localStorage.setItem("creor_waitlist", JSON.stringify(existing));
      }

      setStatus("success");
    } catch (err) {
      // If API fails, still save locally and show success
      const existing = JSON.parse(localStorage.getItem("creor_waitlist") ?? "[]");
      if (!existing.includes(email.trim())) {
        existing.push(email.trim());
        localStorage.setItem("creor_waitlist", JSON.stringify(existing));
      }

      if (API_URL) {
        setErrorMsg((err as Error).message);
        setStatus("error");
      } else {
        setStatus("success");
      }
    }
  };

  if (status === "success") {
    return (
      <div className="mt-10 rounded-xl border border-emerald-500/20 bg-emerald-500/[0.05] p-8 text-center">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500/20">
          <Check className="h-6 w-6 text-emerald-400" />
        </div>
        <h3 className="text-lg font-semibold text-emerald-300">
          You&apos;re on the list!
        </h3>
        <p className="mx-auto mt-2 max-w-sm text-[16px] text-white/40">
          We&apos;ll notify you at{" "}
          <span className="font-medium text-white/60">{email}</span> as soon as
          Creor is ready to download.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="mt-10">
      <div className="flex gap-3">
        <input
          type="email"
          required
          placeholder="you@email.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="flex-1 rounded-xl border border-white/[0.10] bg-white/[0.04] px-4 py-3.5 text-[16px] text-white placeholder:text-white/25 outline-none transition-colors focus:border-indigo-500/40 focus:bg-white/[0.06]"
        />
        <button
          type="submit"
          disabled={status === "loading"}
          className="inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3.5 text-[16px] font-semibold text-black transition-all hover:bg-white/90 active:scale-[0.98] disabled:opacity-60"
        >
          {status === "loading" ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <>
              Notify Me
              <ArrowRight className="h-4 w-4" />
            </>
          )}
        </button>
      </div>
      {status === "error" && (
        <p className="mt-2 text-[14px] text-red-400/70">{errorMsg}</p>
      )}
      <p className="mt-3 text-center text-[13px] text-white/20">
        No spam. One email when we launch. That&apos;s it.
      </p>
    </form>
  );
}
