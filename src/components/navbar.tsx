"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  ChevronDown,
  Menu,
  X,
  Newspaper,
  FileText,
} from "lucide-react";
import { useAuth } from "@/lib/auth";

interface DropdownItem {
  label: string;
  href: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
}

interface NavLink {
  label: string;
  href: string;
  items?: never;
}

interface NavDropdown {
  label: string;
  href?: never;
  items: DropdownItem[];
}

type NavItem = NavLink | NavDropdown;

const navItems: NavItem[] = [
  {
    label: "Resources",
    items: [
      {
        label: "Blog",
        href: "/blog",
        description: "Updates and announcements",
        icon: Newspaper,
      },
      {
        label: "Changelog",
        href: "/changelog",
        description: "Release history",
        icon: FileText,
      },
    ],
  },
  { label: "Pricing", href: "/pricing" },
  { label: "Docs", href: "/docs" },
  { label: "Support", href: "/support" },
];

function Dropdown({
  items,
  isOpen,
  onClose,
}: {
  items: DropdownItem[];
  isOpen: boolean;
  onClose: () => void;
}) {
  if (!isOpen) return null;

  return (
    <div className="absolute left-1/2 top-full pt-2 -translate-x-1/2">
      <div className="animate-dropdown w-[320px] overflow-hidden rounded-xl border border-border bg-background/95 shadow-[0_12px_48px_rgba(0,0,0,0.08)] backdrop-blur-xl dark:shadow-[0_12px_48px_rgba(0,0,0,0.6)]">
        <div className="h-px bg-gradient-to-r from-transparent via-foreground/10 to-transparent" />
        <div className="p-2">
          {items.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={onClose}
              className="group flex items-start gap-3 rounded-lg px-3 py-3 transition-colors hover:bg-muted"
            >
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-muted transition-colors group-hover:bg-foreground">
                <item.icon className="h-4 w-4 text-muted-foreground transition-colors group-hover:text-background" />
              </div>
              <div className="min-w-0 pt-0.5">
                <p className="text-[14px] font-medium text-foreground">
                  {item.label}
                </p>
                <p className="text-[12px] leading-snug text-muted-foreground">
                  {item.description}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

function MobileMenu({
  isOpen,
  onClose,
  user,
}: {
  isOpen: boolean;
  onClose: () => void;
  user: { name: string } | null;
}) {
  const pathname = usePathname();

  useEffect(() => {
    onClose();
  }, [pathname, onClose]);

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-40 bg-black/95 backdrop-blur-2xl md:hidden">
      <div className="flex h-full flex-col overflow-y-auto px-6 pb-8 pt-20">
        {navItems.map((item) => (
          <div key={item.label} className="border-b border-white/[0.05] py-4">
            {"items" in item && item.items ? (
              <>
                <p className="mb-3 text-[12px] font-semibold uppercase tracking-[0.08em] text-muted-foreground">
                  {item.label}
                </p>
                <div className="space-y-0.5">
                  {item.items.map((sub) => (
                    <Link
                      key={sub.href}
                      href={sub.href}
                      onClick={onClose}
                      className="flex items-center gap-2.5 rounded-md px-2 py-2 text-[15px] text-foreground hover:bg-muted"
                    >
                      <sub.icon className="h-3.5 w-3.5 text-muted-foreground" />
                      {sub.label}
                    </Link>
                  ))}
                </div>
              </>
            ) : (
              <Link
                href={item.href!}
                onClick={onClose}
                className="block text-[15px] font-medium text-foreground"
              >
                {item.label}
              </Link>
            )}
          </div>
        ))}
        <div className="mt-auto space-y-3 pt-6">
          {user ? (
            <Link
              href="/dashboard"
              onClick={onClose}
              className="block w-full rounded-full bg-foreground py-2.5 text-center text-[14px] font-semibold text-background transition-transform active:scale-95"
            >
              Dashboard
            </Link>
          ) : (
            <>
              <Link
                href="/login"
                onClick={onClose}
                className="block w-full rounded-full bg-foreground py-2.5 text-center text-[14px] font-semibold text-background transition-transform active:scale-95"
              >
                Sign in
              </Link>
              <Link
                href="/waitlist"
                onClick={onClose}
                className="block w-full rounded-full border border-white/10 bg-white/5 py-2.5 text-center text-[14px] font-medium text-foreground transition-transform active:scale-95"
              >
                Join Waitlist
              </Link>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export function Navbar() {
  const { user } = useAuth();
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const navRef = useRef<HTMLElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 4);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(e.target as Node)) {
        setOpenDropdown(null);
      }
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpenDropdown(null);
        setMobileOpen(false);
      }
    };
    document.addEventListener("mousedown", onClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onClick);
      document.removeEventListener("keydown", onKey);
    };
  }, []);

  const handleEnter = useCallback((label: string) => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setOpenDropdown(label);
  }, []);

  const handleLeave = useCallback(() => {
    timeoutRef.current = setTimeout(() => setOpenDropdown(null), 150);
  }, []);

  const closeMobile = useCallback(() => setMobileOpen(false), []);

  return (
    <>
      <div className="fixed top-0 z-50 w-full flex justify-center px-4 pointer-events-none">
        <nav
          ref={navRef}
          className={cn(
            "pointer-events-auto border w-full max-w-[1440px] transition-[background-color,border-color,border-radius,box-shadow,backdrop-filter,margin] duration-500 ease-[cubic-bezier(0.4,0,0.2,1)]",
            scrolled
              ? "mt-0 border-transparent bg-transparent shadow-none backdrop-blur-none md:mt-3 md:rounded-full md:border-white/[0.10] md:bg-white/[0.05] md:backdrop-blur-2xl md:shadow-[0_8px_32px_rgba(0,0,0,0.4)]"
              : "mt-0 md:mt-5 rounded-none border-transparent bg-transparent shadow-none backdrop-blur-none"
          )}
        >
          <div className="relative flex h-14 w-full items-center px-3 md:px-6">
            {/* Left: Logo */}
            <div className="flex items-center">
              <Link href="/" className="flex items-center gap-2.5 transition-opacity hover:opacity-70">
                <Image
                  src="/creor-nobg-icon.png"
                  alt="Creor"
                  width={44}
                  height={44}
                  className="h-11 w-11"
                />
                <span className="text-[17px] font-semibold tracking-[-0.03em]">
                  Creor
                </span>
              </Link>
            </div>

            {/* Center: Desktop Nav */}
            <div className="absolute left-1/2 hidden -translate-x-1/2 items-center gap-1 md:flex">
              {navItems.map((item) => {
                const hasDropdown = "items" in item && item.items;

                if (hasDropdown) {
                  return (
                    <div
                      key={item.label}
                      className="relative"
                      onMouseEnter={() => handleEnter(item.label)}
                      onMouseLeave={handleLeave}
                    >
                      <button
                        onClick={() =>
                          setOpenDropdown(
                            openDropdown === item.label ? null : item.label
                          )
                        }
                        className={cn(
                          "flex items-center gap-1 rounded-md px-3 py-1.5 text-[15px] font-medium transition-colors",
                          openDropdown === item.label
                            ? "text-white"
                            : "text-white/55 hover:text-white"
                        )}
                      >
                        {item.label}
                        <ChevronDown
                          className={cn(
                            "h-3.5 w-3.5 transition-transform duration-200",
                            openDropdown === item.label && "rotate-180"
                          )}
                        />
                      </button>
                      <Dropdown
                        items={item.items!}
                        isOpen={openDropdown === item.label}
                        onClose={() => setOpenDropdown(null)}
                      />
                    </div>
                  );
                }

                return (
                  <Link
                    key={item.label}
                    href={item.href!}
                    className="rounded-md px-3 py-1.5 text-[15px] font-medium text-white/55 transition-colors hover:text-white"
                  >
                    {item.label}
                  </Link>
                );
              })}
            </div>

            {/* Right: CTA */}
            <div className="ml-auto hidden items-center gap-3 md:flex">
              {user ? (
                <Link
                  href="/dashboard"
                  className="inline-flex items-center rounded-full bg-white px-4 py-1.5 text-[14px] font-semibold text-black transition-colors hover:bg-white/90 active:scale-[0.97]"
                >
                  Dashboard
                </Link>
              ) : (
                <>
                  <Link
                    href="/waitlist"
                    className="inline-flex items-center rounded-full bg-white px-4 py-1.5 text-[14px] font-semibold text-black transition-colors hover:bg-white/90 active:scale-[0.97]"
                  >
                    Join Waitlist
                  </Link>
                  <Link
                    href="/login"
                    className="inline-flex items-center rounded-full border border-white/[0.15] bg-white/[0.08] px-4 py-1.5 text-[14px] font-medium text-white/90 transition-colors hover:bg-white/[0.14] active:scale-[0.97]"
                  >
                    Sign in
                  </Link>
                </>
              )}
            </div>

            {/* Mobile toggle */}
            <div className="ml-auto flex md:hidden">
              <button
                onClick={() => setMobileOpen(!mobileOpen)}
                className="rounded-md p-1.5 text-foreground"
                aria-label={mobileOpen ? "Close menu" : "Open menu"}
              >
                {mobileOpen ? (
                  <X className="h-5 w-5" />
                ) : (
                  <Menu className="h-5 w-5" />
                )}
              </button>
            </div>
          </div>
        </nav>
      </div>

      <MobileMenu isOpen={mobileOpen} onClose={closeMobile} user={user} />
    </>
  );
}
