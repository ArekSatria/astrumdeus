"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import type { DivisionDetail, MatchItem } from "@/lib/schemas";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { cn } from "@/lib/utils/cn";

interface DivisionDetailViewProps {
  division: DivisionDetail;
  matches?: MatchItem[];
}

type RosterMember = DivisionDetail["roster"][number];

function MemberCard({
  member,
  roleLabel,
}: {
  member: RosterMember;
  roleLabel: string;
}) {
  const [imgError, setImgError] = useState(false);
  const hasPhoto =
    member.photoUrl && member.photoUrl.trim() !== "" && !imgError;

  return (
    <div className="group relative flex flex-col justify-between overflow-hidden rounded-xl border border-white/10 bg-surface/80 transition-colors duration-300 hover:border-brand/60">
      <div className="relative aspect-[4/5] w-full overflow-hidden border-b border-white/5 bg-slate-950">
        {hasPhoto ? (
          <Image
            src={member.photoUrl!}
            alt={member.ign}
            fill
            unoptimized
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 300px"
            className="object-cover object-top transition-transform duration-500 group-hover:scale-105"
            onError={() => setImgError(true)}
          />
        ) : (
          <div className="flex h-full w-full flex-col items-center justify-center bg-slate-950 p-6 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-xl border border-brand/20 bg-brand/10 font-display text-xl font-black text-brand">
              {member.ign.slice(0, 2).toUpperCase()}
            </div>
          </div>
        )}

        {hasPhoto && (
          <div className="absolute inset-0 bg-gradient-to-t from-surface via-transparent to-transparent opacity-80" />
        )}

        <div className="absolute top-3 left-3 z-10">
          <span className="inline-block rounded border border-brand/40 bg-background/90 px-2.5 py-0.5 font-mono text-[10px] font-bold text-brand uppercase backdrop-blur-sm">
            {member.role}
          </span>
        </div>
      </div>

      <div className="flex flex-1 flex-col justify-between space-y-3 p-5">
        <div>
          <h3 className="font-display text-xl font-bold tracking-tight text-foreground uppercase transition-colors group-hover:text-brand sm:text-2xl">
            {member.ign.replace(/[_-]/g, " ")}
          </h3>
          <p className="mt-0.5 text-xs text-slate-400">{member.fullName}</p>
        </div>

        <div className="border-t border-white/10 pt-3 text-[11px] font-medium text-slate-400">
          {roleLabel}
        </div>
      </div>
    </div>
  );
}

export function DivisionDetailView({
  division,
  matches = [],
}: DivisionDetailViewProps) {
  const { locale, t } = useLanguage();

  const players = division.roster.filter((m) => m.roleType === "PLAYER");
  const staff = division.roster.filter((m) => m.roleType === "STAFF");

  // Filter hasil pertandingan yang sudah selesai untuk divisi ini (Poin 6)
  const divisionCompletedMatches = matches.filter(
    (m) =>
      m.status === "COMPLETED" &&
      (m.division.slug === division.slug ||
        m.division.name.toLowerCase() === division.name.toLowerCase()),
  );

  const getRoleTranslation = (roleKey: string) => {
    const normalized = roleKey.toUpperCase();
    const dictRoles = t.teamsPage.roleLabels as Record<string, string>;
    return dictRoles[normalized] || roleKey;
  };

  const formatDate = (iso: string) =>
    new Intl.DateTimeFormat(locale === "id" ? "id-ID" : "en-US", {
      day: "numeric",
      month: "short",
      year: "numeric",
    }).format(new Date(iso));

  return (
    <div className="mx-auto max-w-7xl space-y-16 px-4 py-12 sm:px-6 lg:px-8">
      {/* Header Halaman Detail Minimalis Tanpa Tombol Jadwal Pertandingan (Poin 6) */}
      <div className="space-y-4 border-b border-white/10 pb-8">
        <Link
          href="/teams"
          className="inline-block text-xs font-semibold text-slate-400 transition-colors hover:text-brand"
        >
          &larr; {t.teamsPage.backToCatalog}
        </Link>

        <div className="space-y-2">
          <span className="font-mono text-xs font-bold tracking-widest text-brand uppercase">
            {division.shortCode}
          </span>
          <h1 className="font-display text-4xl font-black tracking-tight text-foreground uppercase sm:text-5xl">
            {division.name}
          </h1>
        </div>
      </div>

      {/* Seksi Pemain */}
      <section className="space-y-6">
        <SectionHeading title={t.teamsPage.playersHeading} />
        {players.length === 0 ? (
          <div className="rounded-xl border border-white/10 bg-surface/60 p-10 text-center text-sm text-slate-400">
            {locale === "id"
              ? "Belum ada data pemain untuk divisi ini."
              : "No players registered for this division."}
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {players.map((player) => (
              <MemberCard
                key={player.id}
                member={player}
                roleLabel={getRoleTranslation(player.role)}
              />
            ))}
          </div>
        )}
      </section>

      {/* Seksi Manajer & Staf Pelatih */}
      <section className="space-y-6">
        <SectionHeading title={t.teamsPage.managementHeading} />
        {staff.length === 0 ? (
          <div className="rounded-xl border border-white/10 bg-surface/60 p-10 text-center text-sm text-slate-400">
            {locale === "id"
              ? "Belum ada data manajer & staf pelatih untuk divisi ini."
              : "No management or coaching staff registered for this division."}
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3">
            {staff.map((member) => (
              <MemberCard
                key={member.id}
                member={member}
                roleLabel={getRoleTranslation(member.role)}
              />
            ))}
          </div>
        )}
      </section>

      {/* Seksi Prestasi Tim — Mengikuti Hasil Pertandingan (Poin 6) */}
      <section className="space-y-6">
        <SectionHeading title={t.teamsPage.achievementsHeading} />

        {divisionCompletedMatches.length > 0 ? (
          <div className="divide-y divide-white/10 overflow-hidden rounded-xl border border-white/10 bg-surface/70">
            {divisionCompletedMatches.map((match) => {
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
        ) : division.achievements.length > 0 ? (
          <div className="divide-y divide-white/10 overflow-hidden rounded-xl border border-white/10 bg-surface/70">
            {division.achievements.map((ach) => {
              const rankMatch = ach.placement.match(/\d+/);
              const rankNumber = rankMatch ? rankMatch[0] : "-";

              return (
                <div
                  key={ach.id}
                  className="flex flex-col justify-between gap-4 px-5 py-4 transition-colors hover:bg-white/[0.02] sm:flex-row sm:items-center sm:px-6 sm:py-5"
                >
                  <div className="flex items-center gap-5">
                    <div
                      className={cn(
                        "flex h-11 w-11 shrink-0 items-center justify-center border-l-2 font-display text-2xl font-black",
                        rankNumber === "1"
                          ? "border-brand text-brand"
                          : "border-white/20 text-slate-300",
                      )}
                    >
                      {rankNumber !== "-" ? `#${rankNumber}` : "-"}
                    </div>

                    <div className="space-y-1">
                      <h3 className="font-display text-base font-bold tracking-wide text-foreground uppercase sm:text-lg">
                        {ach.title}
                      </h3>
                      <p className="font-mono text-xs text-slate-400">
                        {ach.year}
                      </p>
                    </div>
                  </div>

                  <div className="pl-16 sm:pl-0">
                    <span className="font-mono text-xs font-bold text-brand uppercase">
                      {ach.placement.replace(/[_-]/g, " ")}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="rounded-xl border border-white/10 bg-surface/60 p-8 text-center text-sm text-slate-400">
            {t.matchesPage.emptyState}
          </div>
        )}
      </section>
    </div>
  );
}
