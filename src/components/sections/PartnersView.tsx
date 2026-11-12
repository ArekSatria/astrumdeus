"use client";

import React from "react";
import Link from "next/link";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { CORPORATE_PARTNERS_DATA } from "@/lib/utils/corporate-helpers";
import { PartnerLogoGraphic } from "@/components/ui/BrandElements";

interface PartnerDisplayItem {
  id: string;
  name: string;
  tier?: string;
  logoUrl?: string | null;
  websiteUrl: string;
  description?: string | { id: string; en: string };
}

interface PartnersViewProps {
  initialPartners?: PartnerDisplayItem[];
}

export function PartnersView({ initialPartners }: PartnersViewProps) {
  const { locale, t } = useLanguage();

  const partners =
    initialPartners && initialPartners.length > 0
      ? initialPartners
      : CORPORATE_PARTNERS_DATA;

  return (
    <div className="mx-auto max-w-7xl space-y-10 px-4 py-12 sm:px-6 lg:px-8">
      {/* Header Halaman Minimalis */}
      <div className="border-b border-white/10 pb-8">
        <h1 className="font-display text-3xl font-bold tracking-tight text-foreground uppercase sm:text-5xl">
          {t.partnersPage.title}
        </h1>
      </div>

      {/* Grid Mitra Resmi (SMART FLEX WRAP) */}
      <div className="flex flex-wrap justify-center gap-6">
        {partners.map((partner, idx) => {
          const desc =
            typeof partner.description === "object" &&
            partner.description !== null
              ? (partner.description as any)[locale] ||
                (partner.description as any)["id"]
              : partner.description || "";

          const targetUrl = partner.websiteUrl || "#";
          const isExternal =
            targetUrl.startsWith("http://") || targetUrl.startsWith("https://");

          const Wrapper = isExternal ? "a" : Link;
          const wrapperProps = isExternal
            ? { href: targetUrl, target: "_blank", rel: "noopener noreferrer" }
            : { href: targetUrl };

          return (
            <Wrapper
              key={partner.id}
              {...wrapperProps}
              /* Menggunakan w-full dengan flex-auto dan max-w-[420px] agar kartu mengisi grid dengan rapi & memusat jika ganjil */
              className="group flex flex-col justify-start flex-auto w-full sm:w-[calc(50%-0.75rem)] lg:w-[calc(33.333%-1rem)] max-w-[420px] overflow-hidden rounded-2xl border border-white/10 bg-zinc-900/60 transition-all duration-300 hover:-translate-y-1 hover:border-brand/50 hover:shadow-[0_0_30px_-10px] hover:shadow-brand/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand active:scale-[0.99] motion-reduce:animate-none motion-reduce:transform-none motion-reduce:transition-none animate-in fade-in slide-in-from-bottom-4"
              style={{
                animationDelay: `${idx * 50}ms`,
                animationFillMode: "both",
              }}
              aria-label={partner.name}
            >
              {/* Kontainer Logo Mitra */}
              <div className="relative aspect-square w-full border-b border-white/5 bg-background overflow-hidden">
                <PartnerLogoGraphic
                  partnerId={partner.id}
                  name={partner.name}
                  logoUrl={partner.logoUrl}
                  className="transition-transform duration-500 group-hover:scale-105"
                />
              </div>

              {/* Nama & Deskripsi Mitra */}
              <div className="p-6 sm:p-8 space-y-2">
                <h2 className="font-display text-xl font-bold tracking-wide text-foreground transition-colors group-hover:text-brand sm:text-2xl">
                  {partner.name}
                </h2>
                {desc && (
                  <p className="text-sm leading-relaxed text-slate-400">
                    {desc}
                  </p>
                )}
              </div>
            </Wrapper>
          );
        })}
      </div>
    </div>
  );
}
