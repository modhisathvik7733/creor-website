"use client";

import { useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth";
import { cn } from "@/lib/utils";

// Early-access allowlist
const ALLOWED_EMAILS: Set<string> = new Set(
  (process.env.NEXT_PUBLIC_ALLOWED_EMAILS ?? "").split(",").map((e) => e.trim().toLowerCase()).filter(Boolean)
);
import {
  LayoutDashboard,
  Settings,
  Activity,
  FolderOpen,
  ChevronLeft,
  CreditCard,
  Key,
  BarChart3,
  LogOut,
  FileText,
} from "lucide-react";

const sidebarItems = [
  { href: "/dashboard", label: "Overview", icon: LayoutDashboard },
  { href: "/dashboard/projects", label: "Projects", icon: FolderOpen },
  { href: "/dashboard/activity", label: "Activity", icon: Activity },
  { href: "/dashboard/billing", label: "Billing", icon: CreditCard },
  { href: "/dashboard/keys", label: "API Keys", icon: Key },
  { href: "/dashboard/usage", label: "Usage", icon: BarChart3 },
  { href: "/docs", label: "Docs", icon: FileText },
  { href: "/dashboard/settings", label: "Account", icon: Settings },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, loading, logout } = useAuth();

  useEffect(() => {
    if (!loading && !user) {
      router.replace("/login");
    }
    if (!loading && user && ALLOWED_EMAILS.size > 0 && !ALLOWED_EMAILS.has(user.email.toLowerCase())) {
      router.replace("/waitlist");
    }
  }, [loading, user, router]);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <div className="h-5 w-5 animate-spin rounded-full border-2 border-border border-t-foreground" />
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="flex h-screen bg-background">
      <aside className="flex w-60 flex-col border-r border-white/[0.06] bg-[#0c0c0e]">
        {/* Logo */}
        <Link href="/" className="flex h-16 items-center gap-3 px-5 transition-opacity hover:opacity-70">
          <Image
            src="/creor-nobg-icon.png"
            alt="Creor"
            width={36}
            height={36}
            className="h-9 w-9"
          />
          <span className="text-[17px] font-bold tracking-[-0.03em] text-white">
            Creor
          </span>
        </Link>

        {/* Divider */}
        <div className="mx-4 h-px bg-white/[0.06]" />

        {/* Nav */}
        <nav className="flex-1 space-y-1 px-3 py-4">
          {sidebarItems.map((item) => {
            const isActive =
              pathname === item.href ||
              (item.href !== "/dashboard" && pathname.startsWith(item.href));
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2.5 text-[14px] transition-all",
                  isActive
                    ? "bg-white/[0.08] font-medium text-white shadow-[0_0_0_1px_rgba(255,255,255,0.06)]"
                    : "text-white/40 hover:bg-white/[0.04] hover:text-white/70"
                )}
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Bottom section */}
        <div className="mx-3 mb-3 space-y-2">
          {/* User card */}
          <div className="rounded-lg border border-white/[0.06] bg-white/[0.03] p-3">
            <div className="flex items-center gap-3">
              {user.avatarUrl ? (
                /* eslint-disable-next-line @next/next/no-img-element */
                <img
                  src={user.avatarUrl}
                  alt={user.name}
                  className="h-8 w-8 rounded-full"
                />
              ) : (
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white/[0.08] text-[12px] font-semibold text-white/60">
                  {user.name?.charAt(0)?.toUpperCase() ?? "?"}
                </div>
              )}
              <div className="min-w-0 flex-1">
                <p className="truncate text-[13px] font-medium text-white/80">
                  {user.name}
                </p>
                <p className="truncate text-[11px] text-white/30">
                  {user.email}
                </p>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-2">
            <Link
              href="/"
              className="flex flex-1 items-center justify-center gap-2 rounded-lg border border-white/[0.06] bg-white/[0.03] px-3 py-2 text-[12px] text-white/40 transition-colors hover:bg-white/[0.06] hover:text-white/70"
            >
              <ChevronLeft className="h-3.5 w-3.5" />
              Home
            </Link>
            <button
              onClick={logout}
              className="flex flex-1 items-center justify-center gap-2 rounded-lg border border-white/[0.06] bg-white/[0.03] px-3 py-2 text-[12px] text-white/40 transition-colors hover:bg-red-500/10 hover:text-red-400 hover:border-red-500/20"
            >
              <LogOut className="h-3.5 w-3.5" />
              Sign out
            </button>
          </div>
        </div>
      </aside>

      <main className="flex-1 overflow-y-auto">{children}</main>
    </div>
  );
}
