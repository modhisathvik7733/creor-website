"use client";

import { useState } from "react";
import { Share2, Copy, Check } from "lucide-react";

const SHARE_URL = "https://creor.ai/waitlist";
const SHARE_TEXT = "Check out Creor — an AI-native code editor with specialized agents, BYOK support, and full control. First 500 waitlist members get 3 months free!";

export function ShareButton() {
  const [copied, setCopied] = useState(false);

  const copyLink = async () => {
    await navigator.clipboard.writeText(SHARE_URL);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const shareNative = async () => {
    if (navigator.share) {
      await navigator.share({
        title: "Creor — AI-native code editor",
        text: SHARE_TEXT,
        url: SHARE_URL,
      });
    } else {
      copyLink();
    }
  };

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={shareNative}
        className="inline-flex items-center gap-1.5 rounded-full border border-white/[0.08] bg-white/[0.03] px-3.5 py-1.5 text-[14px] text-white/40 transition-colors hover:border-white/[0.15] hover:bg-white/[0.06] hover:text-white/60"
      >
        <Share2 className="h-3.5 w-3.5" />
        Share with friends
      </button>
      <button
        onClick={copyLink}
        className="inline-flex items-center gap-1.5 rounded-full border border-white/[0.08] bg-white/[0.03] px-3 py-1.5 text-[14px] text-white/40 transition-colors hover:border-white/[0.15] hover:bg-white/[0.06] hover:text-white/60"
        title="Copy link"
      >
        {copied ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
        {copied ? "Copied!" : "Copy link"}
      </button>
    </div>
  );
}
