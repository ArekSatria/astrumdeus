"use client";

import React from "react";
import { useLanguage } from "@/lib/i18n/LanguageContext";

interface AboutViewProps {
  company?: {
    companyName?: string | null;
    aboutHtml?: string | null;
    vision?: string | null;
    missions?: any;
    officeAddress?: string | null;
    milestones?: any;
  } | null;
}

export function AboutView({ company }: AboutViewProps = {}) {
  const { t } = useLanguage();

  const visionText =
    company?.vision && company.vision.trim().length > 0
      ? company.vision
      : t.aboutPage.visionText;

  const missionsList =
    Array.isArray(company?.missions) && company.missions.length > 0
      ? company.missions.map((m: any, idx: number) => {
          if (typeof m === "object" && m !== null) {
            return {
              code: `${idx + 1}`,
              heading: m.title || m.heading || `Misi ${idx + 1}`,
              desc: m.description || m.desc || "",
            };
          }
          return {
            code: `${idx + 1}`,
            heading: `Misi ${idx + 1}`,
            desc: typeof m === "string" ? m : "",
          };
        })
      : Array.isArray(company?.missions) && company.missions.length === 0
        ? []
        : t.aboutPage.missions;

  return (
    <div className="mx-auto max-w-4xl space-y-12 px-4 py-12 sm:px-6 lg:px-8">
      {/* Header & Paragraf Cerita Perusahaan */}
      <div className="space-y-6 border-b border-white/10 pb-10">
        <h1 className="font-display text-3xl font-bold tracking-tight text-foreground uppercase sm:text-5xl">
          {t.aboutPage.title}
        </h1>
        {company?.aboutHtml && company.aboutHtml.trim().length > 0 && (
          <div
            className="prose prose-invert max-w-none text-base leading-relaxed text-slate-300 sm:text-lg"
            dangerouslySetInnerHTML={{ __html: company.aboutHtml }}
          />
        )}
      </div>

      {/* Seksi Visi & Misi */}
      <section className="space-y-6">
        {/* Card Visi */}
        <div className="rounded-xl border border-white/10 bg-surface/70 p-8 sm:p-10">
          <h2 className="mb-4 font-display text-2xl font-black tracking-tight text-brand uppercase sm:text-3xl">
            {t.aboutPage.visionBadge}
          </h2>
          <p className="text-base leading-relaxed text-slate-200 sm:text-lg">
            {visionText}
          </p>
        </div>

        {/* Card Misi */}
        <div className="rounded-xl border border-white/10 bg-surface/70 p-8 sm:p-10">
          <h2 className="mb-6 font-display text-2xl font-black tracking-tight text-brand uppercase sm:text-3xl">
            {t.aboutPage.missionBadge}
          </h2>
          {missionsList.length === 0 ? (
            <div className="text-sm text-slate-400">
              Belum ada data misi yang ditambahkan.
            </div>
          ) : (
            <ul className="space-y-6">
              {missionsList.map((mission: any) => (
                <li key={mission.code} className="flex items-start gap-4">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-brand/15 font-mono text-sm font-bold text-brand">
                    {mission.code}
                  </span>
                  <div className="space-y-1">
                    <h3 className="font-display text-lg font-bold text-foreground">
                      {mission.heading}
                    </h3>
                    <p className="text-sm leading-relaxed text-slate-300">
                      {mission.desc}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>
    </div>
  );
}
