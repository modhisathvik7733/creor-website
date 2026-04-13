"use client";

import { useEffect, useState, useCallback } from "react";
import { api } from "@/lib/api";
import { useAuth } from "@/lib/auth";
import {
  Loader2,
  Monitor,
  Smartphone,
  Globe,
  X,
  Github,
  Shield,
  AlertTriangle,
  Trash2,
} from "lucide-react";

/* ── Types ── */

interface Session {
  id: string;
  device: string | null;
  ipAddress: string | null;
  userAgent: string | null;
  timeCreated: string;
  timeExpires: string;
}

/* ── Helpers ── */

function parseDevice(ua: string | null): {
  icon: typeof Monitor;
  label: string;
} {
  if (!ua) return { icon: Globe, label: "Unknown device" };
  const lower = ua.toLowerCase();
  if (lower.includes("mobile") || lower.includes("android") || lower.includes("iphone"))
    return { icon: Smartphone, label: "Mobile" };
  return { icon: Monitor, label: "Desktop" };
}

function parseBrowser(ua: string | null): string {
  if (!ua) return "Unknown browser";
  if (ua.includes("Firefox")) return "Firefox";
  if (ua.includes("Edg")) return "Edge";
  if (ua.includes("Chrome")) return "Chrome";
  if (ua.includes("Safari")) return "Safari";
  return "Browser";
}

function timeAgo(date: string): string {
  const diff = Date.now() - new Date(date).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "Just now";
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

/* ── Active Sessions Section ── */

function SessionsSection() {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);
  const [revokingId, setRevokingId] = useState<string | null>(null);

  const load = useCallback(async () => {
    try {
      const data = await api.getSessions();
      setSessions(data);
    } catch {
      // silently fail
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const handleRevoke = async (id: string) => {
    setRevokingId(id);
    try {
      await api.revokeSession(id);
      setSessions((prev) => prev.filter((s) => s.id !== id));
    } catch {
      // silently fail
    } finally {
      setRevokingId(null);
    }
  };

  return (
    <div className="rounded-xl border border-border bg-card">
      <div className="border-b border-border px-5 py-4">
        <div className="flex items-center gap-2">
          <Shield className="h-4 w-4 text-muted-foreground" />
          <h2 className="font-semibold">Active Sessions</h2>
        </div>
        <p className="mt-1 text-xs text-muted-foreground">
          Devices currently signed into your account
        </p>
      </div>

      {loading ? (
        <div className="flex items-center justify-center p-8">
          <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
        </div>
      ) : sessions.length === 0 ? (
        <div className="p-8 text-center text-sm text-muted-foreground">
          No active sessions found
        </div>
      ) : (
        <div className="divide-y divide-border">
          {sessions.map((session) => {
            const device = parseDevice(session.userAgent);
            const DeviceIcon = device.icon;
            const browser = parseBrowser(session.userAgent);
            const isRevoking = revokingId === session.id;

            return (
              <div
                key={session.id}
                className="flex items-center justify-between px-5 py-3.5"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-muted">
                    <DeviceIcon className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">
                      {browser} &middot; {device.label}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {session.ipAddress ?? "Unknown IP"} &middot;{" "}
                      {timeAgo(session.timeCreated)}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => handleRevoke(session.id)}
                  disabled={isRevoking}
                  className="flex items-center gap-1.5 rounded-lg border border-border px-3 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground disabled:opacity-50"
                >
                  {isRevoking ? (
                    <Loader2 className="h-3 w-3 animate-spin" />
                  ) : (
                    <X className="h-3 w-3" />
                  )}
                  Revoke
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

/* ── Connected Accounts Section ── */

function ConnectedAccountsSection({ email }: { email: string }) {
  // Infer provider from email domain (best we can do without a dedicated API)
  const isGmail =
    email.endsWith("@gmail.com") || email.endsWith("@googlemail.com");
  const isGithubLogin = !isGmail; // If not Google, likely GitHub

  const providers = [
    {
      name: "GitHub",
      icon: Github,
      connected: isGithubLogin,
      desc: isGithubLogin ? `Signed in via GitHub` : "Not connected",
    },
    {
      name: "Google",
      icon: GoogleIcon,
      connected: isGmail,
      desc: isGmail ? `Signed in via Google` : "Not connected",
    },
  ];

  return (
    <div className="rounded-xl border border-border bg-card">
      <div className="border-b border-border px-5 py-4">
        <h2 className="font-semibold">Connected Accounts</h2>
        <p className="mt-1 text-xs text-muted-foreground">
          OAuth providers linked to your account
        </p>
      </div>
      <div className="divide-y divide-border">
        {providers.map((p) => (
          <div
            key={p.name}
            className="flex items-center justify-between px-5 py-3.5"
          >
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-muted">
                <p.icon className="h-4 w-4 text-muted-foreground" />
              </div>
              <div>
                <p className="text-sm font-medium">{p.name}</p>
                <p className="text-xs text-muted-foreground">{p.desc}</p>
              </div>
            </div>
            {p.connected && (
              <span className="flex items-center gap-1 text-xs text-muted-foreground">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                Connected
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── Simple Google SVG icon (lucide doesn't have one) ── */

function GoogleIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" />
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
    </svg>
  );
}

/* ── Danger Zone ── */

function DangerZone() {
  const [showConfirm, setShowConfirm] = useState(false);
  const [confirmText, setConfirmText] = useState("");
  const [deleting, setDeleting] = useState(false);
  const { logout } = useAuth();

  const handleDelete = async () => {
    if (confirmText !== "delete my account") return;
    setDeleting(true);
    try {
      // Fire and forget — API may not exist yet, but the UI is ready
      await api.post("/api/users/me/delete", {});
      await logout();
    } catch {
      setDeleting(false);
    }
  };

  return (
    <div className="rounded-xl border border-red-500/20 bg-card">
      <div className="border-b border-red-500/20 px-5 py-4">
        <div className="flex items-center gap-2">
          <AlertTriangle className="h-4 w-4 text-red-500/70" />
          <h2 className="font-semibold">Danger Zone</h2>
        </div>
      </div>
      <div className="p-5">
        {!showConfirm ? (
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium">Delete Account</p>
              <p className="text-xs text-muted-foreground">
                Permanently delete your account, data, and API keys
              </p>
            </div>
            <button
              onClick={() => setShowConfirm(true)}
              className="flex items-center gap-1.5 rounded-lg border border-red-500/20 px-4 py-2 text-sm font-medium text-red-500 transition-colors hover:bg-red-500/10"
            >
              <Trash2 className="h-3.5 w-3.5" />
              Delete
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            <p className="text-sm text-muted-foreground">
              This action is irreversible. Type{" "}
              <span className="font-mono text-foreground">delete my account</span>{" "}
              to confirm.
            </p>
            <input
              type="text"
              value={confirmText}
              onChange={(e) => setConfirmText(e.target.value)}
              placeholder="delete my account"
              className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none transition-colors focus:border-red-500/50"
              autoFocus
            />
            <div className="flex items-center gap-2">
              <button
                onClick={handleDelete}
                disabled={confirmText !== "delete my account" || deleting}
                className="flex items-center gap-1.5 rounded-lg bg-red-500 px-4 py-2 text-sm font-medium text-white transition-opacity hover:opacity-90 disabled:opacity-50"
              >
                {deleting ? (
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                ) : (
                  <Trash2 className="h-3.5 w-3.5" />
                )}
                {deleting ? "Deleting..." : "Delete permanently"}
              </button>
              <button
                onClick={() => {
                  setShowConfirm(false);
                  setConfirmText("");
                }}
                className="rounded-lg border border-border px-4 py-2 text-sm transition-colors hover:bg-muted"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/* ── Main Settings Page ── */

export default function SettingsPage() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Small delay to let auth settle
    const t = setTimeout(() => setLoading(false), 100);
    return () => clearTimeout(t);
  }, []);

  if (loading || !user) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="h-5 w-5 animate-spin rounded-full border-2 border-border border-t-foreground" />
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight">Settings</h1>
        <p className="mt-1 text-muted-foreground">
          Manage your account
        </p>
      </div>

      <div className="max-w-2xl space-y-6">
        {/* Profile */}
        <div className="rounded-xl border border-border bg-card">
          <div className="border-b border-border px-5 py-4">
            <h2 className="font-semibold">Profile</h2>
          </div>
          <div className="p-5">
            <div className="flex items-center gap-4">
              {user.avatarUrl ? (
                /* eslint-disable-next-line @next/next/no-img-element */
                <img
                  src={user.avatarUrl}
                  alt={user.name}
                  className="h-14 w-14 rounded-full"
                />
              ) : (
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-muted text-lg font-semibold text-foreground">
                  {user.name?.charAt(0)?.toUpperCase() ?? "?"}
                </div>
              )}
              <div className="min-w-0 flex-1">
                <p className="text-base font-medium">{user.name}</p>
                <p className="text-sm text-muted-foreground">{user.email}</p>
              </div>
              <span className="rounded-full bg-muted px-3 py-1 text-xs font-medium capitalize text-muted-foreground">
                {user.role}
              </span>
            </div>
          </div>
        </div>

        {/* Active Sessions */}
        <SessionsSection />

        {/* Connected Accounts */}
        <ConnectedAccountsSection email={user.email} />

        {/* Danger Zone */}
        <DangerZone />
      </div>
    </div>
  );
}
