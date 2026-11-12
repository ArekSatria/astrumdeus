"use client";

import React, { useState, useMemo } from "react";
import type { MatchesPayload, MatchItem } from "@/lib/schemas";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { SmartLink } from "@/components/ui/SmartLink";
import { cn } from "@/lib/utils/cn";

type MatchStatusFilter = "ALL" | "LIVE" | "UPCOMING" | "COMPLETED";

interface MatchesViewProps {
  data?: MatchesPayload;
  initialData?: MatchesPayload;
}

export function MatchesView({ data, initialData }: MatchesViewProps) {
  const { locale, t } = useLanguage();
  const [statusFilter, setStatusFilter] = useState<MatchStatusFilter>("ALL");
  const [divisionFilter, setDivisionFilter] = useState<string>("ALL");

  const sourceMatches = useMemo(
    () => data?.items ?? initialData?.items ?? [],
    [data, initialData],
  );

  const divisions = useMemo(() => {
    const map = new Map<string, string>();
    sourceMatches.forEach((m) => {
      map.set(m.division.slug, m.division.name);
    });
    return Array.from(map.entries()).map(([slug, name]) => ({ slug, name }));
  }, [sourceMatches]);

  const filteredMatches = useMemo(() => {
    return sourceMatches.filter((match) => {
      const matchDiv =
        divisionFilter === "ALL" || match.division.slug === divisionFilter;
      const matchStat = statusFilter === "ALL" || match.status === statusFilter;
      return matchDiv && matchStat;
    });
  }, [sourceMatches, divisionFilter, statusFilter]);

  const scheduleMatches = useMemo(
    () =>
      filteredMatches.filter(
        (m) => m.status === "LIVE" || m.status === "UPCOMING",
      ),
    [filteredMatches],
  );

  const completedMatches = useMemo(
    () => filteredMatches.filter((m) => m.status === "COMPLETED"),
    [filteredMatches],
  );

  const formatDate = (iso: string) =>
    new Intl.DateTimeFormat(locale === "id" ? "id-ID" : "en-US", {
      day: "numeric",
      month: "short",
      year: "numeric",
    }).format(new Date(iso));

  const renderMatchRow = (match: MatchItem, index: number) => {
    const isCompleted = match.status === "COMPLETED";
    const isLive = match.status === "LIVE";
    const placement = match.resultBattleRoyale?.placement;
    const totalPoints = match.resultBattleRoyale?.totalPoints;
    const wwcdCount = match.resultBattleRoyale?.wwcdCount;

    return (
      <div
        key={match.id}
        className="flex flex-col justify-between gap-4 px-5 py-4 transition-colors hover:bg-white/[0.02] sm:flex-row sm:items-center sm:px-6 sm:py-5"
      >
        <div className="flex items-center gap-5">
          {/* Kolom Angka / Indikator di Sisi Kiri */}
          <div
            className={cn(
              "flex h-11 w-11 shrink-0 items-center justify-center border-l-2 font-display text-2xl font-black",
              isCompleted
                ? placement === 1
                  ? "border-brand text-brand"
                  : "border-white/20 text-slate-300"
                : isLive
                  ? "border-rose-500 text-rose-500"
                  : "border-brand/50 text-slate-400",
            )}
          >
            {isCompleted ? (placement ? `${placement}` : "-") : `${index + 1}`}
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
              <span className="font-mono">{formatDate(match.scheduledAt)}</span>
            </div>
          </div>
        </div>

        {/* Kolom Skor / Status di Sisi Kanan */}
        <div className="flex items-center gap-6 pl-16 sm:pl-0">
          {isCompleted ? (
            <>
              {totalPoints !== undefined && (
                <div className="text-left sm:text-right">
                  <div className="font-display text-lg font-bold text-foreground sm:text-xl">
                    {totalPoints}
                  </div>
                  <div className="font-mono text-[10px] tracking-wider text-slate-400 uppercase">
                    {t.matchesPage.pointsUnit}
                  </div>
                </div>
              )}
              {wwcdCount !== undefined && wwcdCount > 0 && (
                <div className="text-left sm:text-right">
                  <div className="font-display text-lg font-bold text-brand sm:text-xl">
                    {wwcdCount}
                  </div>
                  <div className="font-mono text-[10px] tracking-wider text-slate-400 uppercase">
                    WWCD
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="flex items-center gap-4">
              <span
                className={cn(
                  "inline-flex items-center gap-1.5 font-mono text-xs font-bold uppercase",
                  isLive ? "text-rose-500" : "text-brand",
                )}
              >
                {isLive && (
                  <span className="inline-block h-2 w-2 rounded-full bg-rose-500 animate-pulse" />
                )}
                {isLive ? t.matchesPage.liveBadge : t.matchesPage.upcomingBadge}
              </span>

              {match.streamUrl && (
                <SmartLink
                  href={match.streamUrl}
                  className="text-xs font-bold text-slate-300 uppercase transition-colors hover:text-brand"
                >
                  {t.matchesPage.watchStream}
                </SmartLink>
              )}
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="mx-auto max-w-7xl space-y-12 px-4 py-12 sm:px-6 lg:px-8">
      {/* Header & Filter Dropdown Minimalis */}
      <div className="space-y-6 border-b border-white/10 pb-8">
        <h1 className="font-display text-3xl font-bold tracking-tight text-foreground uppercase sm:text-5xl">
          {t.matchesPage.title}
        </h1>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:max-w-lg">
          <select
            aria-label="Filter Division"
            value={divisionFilter}
            onChange={(e) => setDivisionFilter(e.target.value)}
            className="w-full rounded-lg border border-white/10 bg-surface px-4 py-2.5 text-xs font-semibold text-slate-200 uppercase focus:border-brand focus:outline-none"
          >
            <option value="ALL">{t.matchesPage.filterGameAll}</option>
            {divisions.map((div) => (
              <option key={div.slug} value={div.slug}>
                {div.name}
              </option>
            ))}
          </select>

          <select
            aria-label="Filter Status"
            value={statusFilter}
            onChange={(e) =>
              setStatusFilter(e.target.value as MatchStatusFilter)
            }
            className="w-full rounded-lg border border-white/10 bg-surface px-4 py-2.5 text-xs font-semibold text-slate-200 uppercase focus:border-brand focus:outline-none"
          >
            <option value="ALL">{t.matchesPage.filterStatusAll}</option>
            <option value="LIVE">{t.matchesPage.filterStatusLive}</option>
            <option value="UPCOMING">
              {t.matchesPage.filterStatusUpcoming}
            </option>
            <option value="COMPLETED">
              {t.matchesPage.filterStatusCompleted}
            </option>
          </select>
        </div>
      </div>

      {filteredMatches.length === 0 ? (
        <div className="rounded-xl border border-white/10 bg-surface/60 p-12 text-center text-sm text-slate-400">
          {t.matchesPage.emptyState}
        </div>
      ) : (
        <div className="space-y-12">
          {/* Seksi JADWAL (Upcoming / Live) */}
          {scheduleMatches.length > 0 && (
            <section className="space-y-4">
              <h2 className="font-display text-xl font-bold tracking-wider text-foreground uppercase">
                {locale === "id" ? "JADWAL" : "SCHEDULE"}
              </h2>
              <div className="divide-y divide-white/10 overflow-hidden rounded-xl border border-white/10 bg-surface/70">
                {scheduleMatches.map((match, idx) =>
                  renderMatchRow(match, idx),
                )}
              </div>
            </section>
          )}

          {/* Seksi HASIL (Completed) */}
          {completedMatches.length > 0 && (
            <section className="space-y-4">
              <h2 className="font-display text-xl font-bold tracking-wider text-foreground uppercase">
                {locale === "id" ? "HASIL" : "RESULTS"}
              </h2>
              <div className="divide-y divide-white/10 overflow-hidden rounded-xl border border-white/10 bg-surface/70">
                {completedMatches.map((match, idx) =>
                  renderMatchRow(match, idx),
                )}
              </div>
            </section>
          )}
        </div>
      )}
    </div>
  );
}
