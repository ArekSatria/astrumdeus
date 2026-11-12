"use client";

import React from "react";
import Link from "next/link";
import { Mail } from "lucide-react";
import type { GlobalSettings } from "@/lib/schemas";
import { NAVIGATION_ITEMS, useLanguage } from "@/lib/i18n/LanguageContext";
import { BrandLogo } from "@/components/ui/BrandElements";

interface ObsidianFooterProps {
  settings: GlobalSettings;
}

interface SocialEntry {
  key: "instagram" | "youtube" | "tiktok" | "x";
  label: string;
  url: string;
}

function FooterSocialSvg({
  platform,
  className = "h-4 w-4",
}: {
  platform: SocialEntry["key"];
  className?: string;
}) {
  switch (platform) {
    case "instagram":
      return (
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          className={className}
          aria-hidden="true"
        >
          <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
          <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
          <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
        </svg>
      );
    case "youtube":
      return (
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          className={className}
          aria-hidden="true"
        >
          <path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17" />
          <path d="m10 15 5-3-5-3v6Z" />
        </svg>
      );
    case "tiktok":
      return (
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          className={className}
          aria-hidden="true"
        >
          <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5" />
        </svg>
      );
    case "x":
      return (
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          className={className}
          aria-hidden="true"
        >
          <path d="M4 4l11.733 16h4.267l-11.733 -16z" />
          <path d="M4 20l6.768 -6.768m2.46 -2.46l6.772 -6.772" />
        </svg>
      );
  }
}

export function ObsidianFooter({ settings }: ObsidianFooterProps) {
  const { locale, t } = useLanguage();
  const currentYear = new Date().getFullYear();

  const rawSocials: Array<{
    key: "instagram" | "youtube" | "tiktok" | "x";
    label: string;
    url: string | null | undefined;
  }> = [
    {
      key: "instagram",
      label: "Instagram",
      url: settings.socials.instagram,
    },
    {
      key: "youtube",
      label: "YouTube",
      url: settings.socials.youtube,
    },
    {
      key: "tiktok",
      label: "TikTok",
      url: settings.socials.tiktok,
    },
    {
      key: "x",
      label: "X",
      url: settings.socials.x,
    },
  ];

  const socialEntries: SocialEntry[] = rawSocials.filter(
    (entry): entry is SocialEntry =>
      typeof entry.url === "string" && entry.url.length > 0,
  );

  return (
    <footer className="border-t border-white/10 bg-background text-slate-400">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="flex flex-col justify-between gap-8 lg:flex-row lg:items-center">
          <div className="flex items-center gap-4">
            <Link
              href="/"
              aria-label={settings.siteName}
              className="inline-flex items-center transition-opacity hover:opacity-90"
            >
              <BrandLogo logoUrl={settings.logoUrl} className="h-10 w-auto" />
            </Link>
          </div>

          <nav
            aria-label={t.footer.navHeading}
            className="flex flex-wrap items-center gap-x-7 gap-y-3 text-sm font-medium text-slate-300"
          >
            {NAVIGATION_ITEMS.map((item) => (
              <Link
                key={item.key}
                href={item.href}
                className="whitespace-nowrap transition-colors hover:text-brand"
              >
                {item.label[locale]}
              </Link>
            ))}
            <Link
              href="/contact"
              className="whitespace-nowrap transition-colors hover:text-brand"
            >
              {t.footer.contactLink}
            </Link>
          </nav>
        </div>

        <div className="mt-8 flex flex-col justify-between gap-4 border-t border-white/10 pt-6 text-xs text-slate-500 sm:flex-row sm:items-center">
          <p>
            &copy; {currentYear} {settings.siteName}. {t.footer.rights}
          </p>

          <div className="flex flex-wrap items-center gap-5">
            <a
              href={`mailto:${settings.contactQuick.businessEmail}`}
              className="inline-flex items-center gap-2 text-slate-400 transition-colors hover:text-brand"
            >
              <Mail className="h-3.5 w-3.5 text-brand" />
              <span>{settings.contactQuick.businessEmail}</span>
            </a>

            <div className="flex items-center gap-2">
              {socialEntries.map((social) => (
                <a
                  key={social.key}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.label}
                  className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-white/10 bg-surface text-slate-300 transition-colors hover:border-brand/40 hover:text-brand"
                >
                  <FooterSocialSvg
                    platform={social.key}
                    className="h-3.5 w-3.5"
                  />
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
