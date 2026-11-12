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
      {/* BAR INDIKATOR LIVE */}
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

      {/* 1. FOTO TIM UTAMA FULL-BLEED */}
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
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-background via-background/15 to-transparent" />
          <div className="pointer-events-none absolute inset-x-0 top-0 h-20 bg-gradient-to-b from-background/50 to-transparent" />
        </div>
      </section>

      <div className="mx-auto max-w-7xl space-y-20 px-4 sm:px-6 lg:px-8">
        {/* URUTAN 1: HASIL PERTANDINGAN */}
        <section className="space-y-6">
          <div className="flex items-center justify-between gap-4 border-b border-white/15 pb-4">
            <SectionHeading title={t.home.resultsTitle} />
            <Link
              href="/matches"
              className="text-xs font-bold tracking-wider text-brand uppercase transition-opacity hover:opacity-80"
            >
              {t.home.viewAllMatches}
            </Link>
          </div>

          {completedMatches.length === 0 ? (
            <div className="rounded-xl border border-white/10 bg-zinc-900/60 p-8 text-center text-sm text-slate-400">
              {t.matchesPage.emptyState}
            </div>
          ) : (
            <div className="divide-y divide-white/10 overflow-hidden rounded-xl border border-white/10 bg-zinc-900/60">
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

        {/* URUTAN 2: DIVISI GAME */}
        <section className="space-y-6">
          <div className="border-b border-white/15 pb-4">
            <SectionHeading title={t.home.divisionTitle} />
          </div>

          {data.activeDivisions && data.activeDivisions.length > 0 ? (
            <div className="flex flex-wrap justify-center gap-5 sm:gap-6">
              {data.activeDivisions.map((division, idx) => (
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
                  <div className="relative flex h-24 w-24 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/5 p-4 transition-colors duration-300 group-hover:border-brand/30 group-hover:bg-brand/10 sm:h-32 sm:w-32">
                    <div className="relative h-full w-full">
                      <Image
                        src={
                          division.bannerImageUrl || "/images/pubg-logo-bg.svg"
                        }
                        alt={`Logo ${division.name}`}
                        fill
                        unoptimized
                        sizes="(max-width: 128px) 100vw, 128px"
                        className="object-contain opacity-70 transition-opacity duration-300 group-hover:opacity-100 motion-reduce:transition-none"
                      />
                    </div>
                  </div>

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
          ) : (
            <div className="rounded-xl border border-white/10 bg-zinc-900/60 p-10 text-center text-sm text-slate-400">
              {locale === "id"
                ? "Belum ada divisi game yang aktif."
                : "No active game divisions."}
            </div>
          )}
        </section>

        {/* URUTAN 3: MITRA RESMI (SMART FLEX WRAP) */}
        <section className="space-y-6">
          <div className="border-b border-white/15 pb-4">
            <SectionHeading title={t.home.partnersSectionTitle} />
          </div>

          {/* UBAH: Layout grid mitra diubah menjadi flex-wrap justify-center agar merespons dinamis ketika data berkurang atau bertambah */}
          <div className="flex flex-wrap justify-center gap-4 sm:gap-5 lg:gap-6">
            {partnersList.map((partner) => {
              const targetUrl = partner.websiteUrl || "/partners";
              const isExternal =
                targetUrl.startsWith("http://") ||
                targetUrl.startsWith("https://");

              const wrapperClass =
                "group relative flex flex-auto items-center justify-center aspect-square w-[calc(50%-0.5rem)] max-w-[170px] sm:w-[calc(33.33%-1rem)] sm:max-w-[220px] lg:w-[calc(20%-1.2rem)] lg:max-w-[240px] overflow-hidden rounded-2xl border border-white/10 bg-background transition-all duration-300 hover:-translate-y-1 hover:border-brand/50 hover:shadow-[0_0_30px_-10px] hover:shadow-brand/30 active:scale-[0.99]";

              return isExternal ? (
                <a
                  key={partner.id}
                  href={targetUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={partner.name}
                  className={wrapperClass}
                >
                  <PartnerLogoGraphic
                    partnerId={partner.id}
                    name={partner.name}
                    logoUrl={partner.logoUrl}
                    className="transition-transform duration-500 group-hover:scale-105 motion-reduce:transform-none"
                  />
                </a>
              ) : (
                <Link
                  key={partner.id}
                  href={targetUrl}
                  aria-label={partner.name}
                  className={wrapperClass}
                >
                  <PartnerLogoGraphic
                    partnerId={partner.id}
                    name={partner.name}
                    logoUrl={partner.logoUrl}
                    className="transition-transform duration-500 group-hover:scale-105 motion-reduce:transform-none"
                  />
                </Link>
              );
            })}
          </div>
        </section>

        {/* URUTAN 4: BERITA */}
        <section className="space-y-6">
          <div className="flex items-center justify-between gap-4 border-b border-white/15 pb-4">
            <SectionHeading title={t.home.newsTitle} />
            <Link
              href="/news"
              className="text-xs font-bold tracking-wider text-brand uppercase transition-opacity hover:opacity-80"
            >
              {t.home.viewAllNews}
            </Link>
          </div>

          {localizedNews.length === 0 ? (
            <div className="rounded-xl border border-white/10 bg-zinc-900/60 p-8 text-center text-sm text-slate-400">
              {t.newsPage.emptyState}
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
              {localizedNews.map((article) => (
                <Link
                  key={article.id}
                  href={`/news/${article.slug}`}
                  className="group flex flex-col justify-between rounded-xl border border-white/10 bg-zinc-900/60 p-6 transition-all duration-300 hover:-translate-y-1 hover:border-brand/50 hover:shadow-[0_0_30px_-10px] hover:shadow-brand/30 active:scale-[0.99] motion-reduce:transform-none motion-reduce:transition-none"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-xs text-slate-400">
                      <span className="inline-block rounded border border-brand/30 bg-brand/10 px-2 py-0.5 font-mono font-bold text-brand uppercase">
                        {article.category.name}
                      </span>
                      <span className="font-mono">
                        {formatDate(article.publishedAt)}
                      </span>
                    </div>
                    <h3 className="font-display text-lg font-bold tracking-wide text-white transition-colors group-hover:text-brand">
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
