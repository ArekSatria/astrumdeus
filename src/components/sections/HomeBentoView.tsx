"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import type { HomePayload } from "@/lib/schemas";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import {
  CORPORATE_PARTNERS_DATA,
  translateArticleContent,
} from "@/lib/utils/corporate-helpers";
import { PartnerLogoGraphic } from "@/components/ui/BrandElements";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { SmartLink } from "@/components/ui/SmartLink";
import { cn } from "@/lib/utils/cn";

interface HomeBentoViewProps {
  data: HomePayload;
}

function stripHtmlTags(text: string): string {
  return text.replace(/<[^>]*>/g, "").trim();
}

export function HomeBentoView({ data }: HomeBentoViewProps) {
  const { locale, t } = useLanguage();

  // Hanya tampilkan indikator jika ada pertandingan yang sedang LIVE (Poin 4)
  const liveMatch =
    data.nextMatch && data.nextMatch.status === "LIVE" ? data.nextMatch : null;

  const completedMatches = data.recentResults || [];
  const localizedNews = data.latestNews.map((item) =>
    translateArticleContent(item, locale),
  );

  const partnersList =
    data.partnersStrip && data.partnersStrip.length > 0
      ? data.partnersStrip
      : CORPORATE_PARTNERS_DATA;

  const formatDate = (iso: string) =>
    new Intl.DateTimeFormat(locale === "id" ? "id-ID" : "en-US", {
      day: "numeric",
      month: "short",
      year: "numeric",
    }).format(new Date(iso));

  return (
    <div className="space-y-20 pb-24">
      {/* BAR INDIKATOR LIVE (Hanya muncul apabila sedang ada pertandingan LIVE) */}
      {liveMatch && (
        <div className="w-full border-b border-brand/30 bg-brand text-background">
          <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 px-4 py-2.5 text-xs font-bold uppercase sm:px-6 lg:px-8">
            <div className="flex items-center gap-3">
              <span className="inline-flex items-center gap-1.5 rounded bg-background px-2 py-0.5 font-mono text-[11px] font-bold text-brand">
                <span className="h-2 w-2 rounded-full bg-rose-500 animate-pulse" />
                {locale === "id" ? "BERLANGSUNG" : "LIVE"}
              </span>
              <span className="tracking-wide">{liveMatch.tournamentName}</span>
            </div>
            {liveMatch.streamUrl && (
              <SmartLink
                href={liveMatch.streamUrl}
                className="underline decoration-background/60 underline-offset-4 hover:opacity-80"
              >
                {t.home.watchStream}
              </SmartLink>
            )}
          </div>
        </div>
      )}

      {/* 1. FOTO TIM UTAMA FULL-BLEED MINIMALIS (Poin 1) */}
      <section className="relative w-full overflow-hidden border-b border-white/5 bg-background">
        <div className="relative aspect-[16/9] w-full sm:aspect-[21/9] lg:aspect-[24/9]">
          <Image
            src={data.hero?.heroImageUrl || "/images/team-hero.svg"}
            alt="Astrum Deus — PT Adre Gemilang Jaya"
            fill
            unoptimized
            priority
            fetchPriority="high"
            sizes="100vw"
            className="object-cover object-center"
          />
          {/* Gradasi halus agar menyatu dan tidak kaku */}
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-background via-background/15 to-transparent" />
          <div className="pointer-events-none absolute inset-x-0 top-0 h-20 bg-gradient-to-b from-background/50 to-transparent" />
        </div>
      </section>

      <div className="mx-auto max-w-7xl space-y-20 px-4 sm:px-6 lg:px-8">
        {/* URUTAN 1: HASIL PERTANDINGAN (Poin 4 & 5 — Gaya Baris Minimalis) */}
        <section className="space-y-6">
          <div className="flex items-center justify-between gap-4 border-b border-white/10 pb-4">
            <SectionHeading title={t.home.resultsTitle} />
            <Link
              href="/matches"
              className="text-xs font-bold tracking-wider text-brand uppercase transition-opacity hover:opacity-80"
            >
              {t.home.viewAllMatches}
            </Link>
          </div>

          {completedMatches.length === 0 ? (
            <div className="rounded-xl border border-white/10 bg-surface/60 p-8 text-center text-sm text-slate-400">
              {t.matchesPage.emptyState}
            </div>
          ) : (
            <div className="divide-y divide-white/10 overflow-hidden rounded-xl border border-white/10 bg-surface/70">
              {completedMatches.map((match) => {
                const placement = match.resultBattleRoyale?.placement;
                const totalPoints = match.resultBattleRoyale?.totalPoints;
                const wwcdCount = match.resultBattleRoyale?.wwcdCount;

                return (
                  <div
                    key={match.id}
                    className="flex flex-col justify-between gap-4 px-5 py-4 transition-colors hover:bg-white/[0.02] sm:flex-row sm:items-center sm:px-6 sm:py-5"
                  >
                    <div className="flex items-center gap-5">
                      {/* Angka Peringkat Minimalis di Sisi Kiri */}
                      <div
                        className={cn(
                          "flex h-11 w-11 shrink-0 items-center justify-center border-l-2 font-display text-2xl font-black",
                          placement === 1
                            ? "border-brand text-brand"
                            : "border-white/20 text-slate-300",
                        )}
                      >
                        {placement ? `#${placement}` : "-"}
                      </div>

                      <div className="space-y-1">
                        <h3 className="font-display text-base font-bold tracking-wide text-foreground uppercase sm:text-lg">
                          {match.tournamentName}
                        </h3>
                        <div className="flex flex-wrap items-center gap-2.5 text-xs text-slate-400">
                          <span className="font-semibold text-brand uppercase">
                            {match.division.name}
                          </span>
                          <span>&bull;</span>
                          <span className="font-mono">
                            {formatDate(match.scheduledAt)}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Statistik Poin & WWCD Minimalis di Sisi Kanan */}
                    <div className="flex items-center gap-6 pl-16 sm:pl-0">
                      {totalPoints !== undefined && (
                        <div className="text-left sm:text-right">
                          <div className="font-display text-lg font-bold text-foreground sm:text-xl">
                            {totalPoints}
                          </div>
                          <div className="font-mono text-[10px] tracking-wider text-slate-400 uppercase">
                            {t.home.pointsUnit}
                          </div>
                        </div>
                      )}
                      {wwcdCount !== undefined && wwcdCount > 0 && (
                        <div className="text-left sm:text-right">
                          <div className="font-display text-lg font-bold text-brand sm:text-xl">
                            {wwcdCount}x
                          </div>
                          <div className="font-mono text-[10px] tracking-wider text-slate-400 uppercase">
                            WWCD
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>

        {/* URUTAN 2: DIVISI GAME (Poin 2 & 5) */}
        <section className="space-y-6">
          <div className="border-b border-white/10 pb-4">
            <SectionHeading title={t.home.divisionTitle} />
          </div>

          {data.activeDivisions && data.activeDivisions.length > 0 ? (
            <div
              className={cn(
                "grid gap-6",
                data.activeDivisions.length > 1
                  ? "grid-cols-1 md:grid-cols-2"
                  : "grid-cols-1",
              )}
            >
              {data.activeDivisions.map((division) => (
                <Link
                  key={division.id}
                  href={`/teams/${division.slug}`}
                  className="group relative block aspect-[2/1] w-full overflow-hidden rounded-xl border border-white/10 bg-surface transition-colors hover:border-brand/60"
                >
                  <div className="pointer-events-none absolute inset-0">
                    <Image
                      src={
                        division.bannerImageUrl || "/images/pubg-logo-bg.svg"
                      }
                      alt={division.name}
                      fill
                      unoptimized
                      sizes="(max-width: 1280px) 100vw, 640px"
                      className="object-cover object-center opacity-75 transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-background/95 via-background/40 to-transparent" />
                  </div>

                  <div className="relative z-10 flex h-full w-full flex-col justify-end p-6 sm:p-8">
                    <div className="flex items-end justify-between gap-4">
                      <div className="space-y-1.5">
                        {division.shortCode && (
                          <span className="inline-block font-mono text-xs font-bold tracking-widest text-brand uppercase">
                            {division.shortCode}
                          </span>
                        )}
                        <h3 className="font-display text-3xl font-black tracking-tight text-foreground uppercase transition-colors group-hover:text-brand sm:text-5xl">
                          {division.name}
                        </h3>
                      </div>
                      <span className="text-xs font-bold tracking-wider text-slate-300 uppercase transition-colors group-hover:text-brand">
                        {t.home.exploreDivisionBtn} &rarr;
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="rounded-xl border border-white/10 bg-surface/60 p-10 text-center text-sm text-slate-400">
              {locale === "id"
                ? "Belum ada divisi game yang aktif."
                : "No active game divisions."}
            </div>
          )}
        </section>

        {/* URUTAN 3: MITRA RESMI (Poin 5 & 7 — Langsung Klik ke Website Mitra) */}
        <section className="space-y-6">
          <div className="border-b border-white/10 pb-4">
            <SectionHeading title={t.home.partnersSectionTitle} />
          </div>

          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
            {partnersList.map((partner) => {
              const targetUrl = partner.websiteUrl || "/partners";
              const isExternal =
                targetUrl.startsWith("http://") ||
                targetUrl.startsWith("https://");

              return isExternal ? (
                <a
                  key={partner.id}
                  href={targetUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={partner.name}
                  className="group relative aspect-[16/10] w-full overflow-hidden rounded-xl border border-white/10 bg-surface transition-all duration-300 hover:border-brand/60"
                >
                  <PartnerLogoGraphic
                    partnerId={partner.id}
                    name={partner.name}
                    logoUrl={partner.logoUrl}
                    className="transition-transform duration-500 group-hover:scale-105"
                  />
                </a>
              ) : (
                <Link
                  key={partner.id}
                  href={targetUrl}
                  aria-label={partner.name}
                  className="group relative aspect-[16/10] w-full overflow-hidden rounded-xl border border-white/10 bg-surface transition-all duration-300 hover:border-brand/60"
                >
                  <PartnerLogoGraphic
                    partnerId={partner.id}
                    name={partner.name}
                    logoUrl={partner.logoUrl}
                    className="transition-transform duration-500 group-hover:scale-105"
                  />
                </Link>
              );
            })}
          </div>
        </section>

        {/* URUTAN 4: BERITA (Poin 3 & 5) */}
        <section className="space-y-6">
          <div className="flex items-center justify-between gap-4 border-b border-white/10 pb-4">
            <SectionHeading title={t.home.newsTitle} />
            <Link
              href="/news"
              className="text-xs font-bold tracking-wider text-brand uppercase transition-opacity hover:opacity-80"
            >
              {t.home.viewAllNews}
            </Link>
          </div>

          {localizedNews.length === 0 ? (
            <div className="rounded-xl border border-white/10 bg-surface/60 p-8 text-center text-sm text-slate-400">
              {t.newsPage.emptyState}
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
              {localizedNews.map((article) => (
                <Link
                  key={article.id}
                  href={`/news/${article.slug}`}
                  className="group flex flex-col justify-between rounded-xl border border-white/10 bg-surface/70 p-6 transition-colors hover:border-brand/60"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-xs text-slate-400">
                      <span className="font-mono font-bold text-brand uppercase">
                        {article.category.name}
                      </span>
                      <span className="font-mono">
                        {formatDate(article.publishedAt)}
                      </span>
                    </div>
                    <h3 className="font-display text-lg font-bold tracking-wide text-foreground transition-colors group-hover:text-brand">
                      {article.title}
                    </h3>
                    <p className="line-clamp-2 text-sm leading-relaxed text-slate-400">
                      {stripHtmlTags(article.excerpt)}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
