"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import type { DivisionSummary } from "@/lib/schemas";
import { useLanguage } from "@/lib/i18n/LanguageContext";

interface TeamsCatalogViewProps {
  divisions?: DivisionSummary[];
}

export function TeamsCatalogView({ divisions }: TeamsCatalogViewProps) {
  const { locale, t } = useLanguage();
  const activeDivisions = divisions || [];

  return (
    <div className="mx-auto max-w-7xl space-y-10 px-4 py-12 sm:px-6 lg:px-8">
      {/* Header Halaman & Pemisah */}
      <div className="border-b border-white/15 pb-6">
        <h1 className="font-display text-3xl font-bold tracking-tight text-foreground uppercase sm:text-5xl">
          {t.teamsPage.catalogTitle}
        </h1>
      </div>

      {/* Daftar Card Divisi (SMART FLEX WRAP - TINGGI MAKSIMAL) */}
      {activeDivisions.length === 0 ? (
        <div className="rounded-2xl border border-white/10 bg-zinc-900/60 p-12 text-center text-sm text-slate-400">
          {locale === "id"
            ? "Belum ada divisi game yang aktif."
            : "No active game divisions."}
        </div>
      ) : (
        <div className="flex flex-wrap justify-center gap-5 sm:gap-6">
          {activeDivisions.map((division, idx) => (
            <Link
              key={division.id}
              href={`/teams/${division.slug}`}
              aria-label={`Lihat roster ${division.name}`}
              className="group relative flex w-full max-w-[460px] flex-auto items-center gap-6 rounded-2xl border border-white/10 bg-zinc-900/60 p-6 transition-all duration-300 hover:-translate-y-1 hover:border-brand/60 hover:bg-zinc-800/40 hover:shadow-[0_0_20px_-10px] hover:shadow-brand/20 active:scale-[0.99] motion-reduce:animate-none motion-reduce:transform-none motion-reduce:transition-none animate-in fade-in slide-in-from-bottom-4 sm:w-[360px] sm:p-8 min-h-[160px] sm:min-h-[200px] lg:min-h-[230px]"
              style={{
                animationDelay: `${idx * 50}ms`,
                animationFillMode: "both",
              }}
            >
              {/* Box Kotak Logo Diperbesar */}
              <div className="relative flex h-24 w-24 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/5 p-4 transition-colors duration-300 group-hover:border-brand/30 group-hover:bg-brand/10 sm:h-32 sm:w-32">
                <div className="relative h-full w-full">
                  <Image
                    src={division.bannerImageUrl || "/images/pubg-logo-bg.svg"}
                    alt={`Logo ${division.name}`}
                    fill
                    unoptimized
                    sizes="(max-width: 128px) 100vw, 128px"
                    className="object-contain opacity-70 transition-opacity duration-300 group-hover:opacity-100 motion-reduce:transition-none"
                  />
                </div>
              </div>

              {/* Teks Judul & Subtitle Diperbesar */}
              <div className="flex flex-col justify-center space-y-2">
                <h3 className="font-display text-2xl font-bold leading-tight text-white uppercase transition-colors duration-300 group-hover:text-brand sm:text-3xl">
                  {division.name}
                </h3>
                <span className="font-mono text-xs font-bold tracking-widest text-brand uppercase sm:text-sm">
                  {division.shortCode || "DIV"}
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
