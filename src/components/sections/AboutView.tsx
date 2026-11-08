"use client";

import React from "react";
import { useLanguage, type Locale } from "@/lib/i18n/LanguageContext";
import {
  CORPORATE_MILESTONES,
  CORPORATE_OFFICES,
} from "@/lib/utils/corporate-helpers";
import { SectionHeading } from "@/components/ui/SectionHeading";

function resolveLocalized(
  value: string | { id: string; en: string } | undefined,
  locale: Locale,
): string {
  if (!value) return "";
  if (typeof value === "string") return value;
  return value[locale];
}

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
  const { locale, t } = useLanguage();

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

  const milestonesList =
    Array.isArray(company?.milestones) && company.milestones.length > 0
      ? company.milestones.map((m: any) => ({
          year: m.year,
          title:
            typeof m.title === "object" && m.title !== null
              ? m.title[locale] || m.title["id"]
              : m.title,
          description:
            typeof m.description === "object" && m.description !== null
              ? m.description[locale] || m.description["id"]
              : m.description,
        }))
      : Array.isArray(company?.milestones) && company.milestones.length === 0
      ? []
      : CORPORATE_MILESTONES.map((item) => ({
          year: item.year,
          title: resolveLocalized(item.title, locale),
          description: resolveLocalized(item.description, locale),
        }));

  const officesList =
    company?.officeAddress && company.officeAddress.trim().length > 0
      ? [
          {
            city: company.companyName || "Kantor Operasional",
            address: company.officeAddress,
          },
        ]
      : CORPORATE_OFFICES.map((office) => ({
          city: resolveLocalized(office.city, locale),
          address: resolveLocalized(office.address, locale),
        }));

  return (
    <div className="mx-auto max-w-7xl space-y-16 px-4 py-12 sm:px-6 lg:px-8">
      {/* Header Halaman & Deskripsi Perusahaan dari CMS */}
      <div className="border-b border-white/10 pb-8 space-y-4">
        <h1 className="font-display text-3xl font-bold tracking-tight text-foreground uppercase sm:text-5xl">
          {t.aboutPage.title}
        </h1>
        {company?.aboutHtml && company.aboutHtml.trim().length > 0 && (
          <div
            className="prose prose-invert max-w-4xl text-sm sm:text-base leading-relaxed text-slate-300"
            dangerouslySetInnerHTML={{ __html: company.aboutHtml }}
          />
        )}
      </div>

      {/* Seksi Visi & Misi */}
      <section className="grid grid-cols-1 gap-8 lg:grid-cols-12">
        {/* Card VISI */}
        <div className="flex flex-col justify-between rounded-2xl border border-white/10 bg-surface p-8 sm:p-10 lg:col-span-5">
          <div className="space-y-6">
            <h2 className="font-display text-3xl font-black tracking-tight text-brand uppercase sm:text-5xl">
              {t.aboutPage.visionBadge}
            </h2>
            <p className="text-base leading-relaxed text-slate-200 sm:text-lg">
              {visionText}
            </p>
          </div>
        </div>

        {/* Card MISI */}
        <div className="flex flex-col justify-between rounded-2xl border border-white/10 bg-surface p-8 sm:p-10 lg:col-span-7">
          <div className="space-y-6">
            <h2 className="font-display text-3xl font-black tracking-tight text-brand uppercase sm:text-5xl">
              {t.aboutPage.missionBadge}
            </h2>

            {missionsList.length === 0 ? (
              <div className="rounded-xl border border-white/10 bg-background/60 p-6 text-center text-sm text-slate-400">
                Belum ada data misi yang ditambahkan.
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4">
                {missionsList.map((mission) => (
                  <div
                    key={mission.code}
                    className="flex items-start gap-4 rounded-xl border border-white/10 bg-background/60 p-5"
                  >
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-brand/15 font-mono text-sm font-bold text-brand">
                      {mission.code}
                    </span>
                    <div className="space-y-1">
                      <h3 className="font-display text-base font-bold text-foreground sm:text-lg">
                        {mission.heading}
                      </h3>
                      <p className="text-sm leading-relaxed text-slate-300">
                        {mission.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Seksi Perjalanan Kami */}
      <section className="space-y-6">
        <SectionHeading title={t.aboutPage.milestonesHeading} />

        {milestonesList.length === 0 ? (
          <div className="rounded-2xl border border-white/10 bg-surface p-12 text-center text-sm text-slate-300">
            Belum ada data tonggak perjalanan sejarah.
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {milestonesList.map((item: any, idx: number) => (
              <div
                key={item.year + idx}
                className="flex flex-col justify-between rounded-2xl border border-white/10 bg-surface p-6 sm:p-8"
              >
                <div className="space-y-3">
                  <span className="inline-block rounded-md border border-brand/40 bg-brand/15 px-3 py-1 font-mono text-sm font-bold text-brand">
                    {item.year}
                  </span>
                  <h3 className="font-display text-xl font-bold text-foreground">
                    {item.title}
                  </h3>
                  <p className="text-sm leading-relaxed text-slate-300">
                    {item.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Seksi Lokasi Operasional */}
      <section className="space-y-6">
        <SectionHeading title={t.aboutPage.officesHeading} />

        <div className="grid grid-cols-1 gap-6">
          {officesList.map((office, index) => (
            <div
              key={office.city + index}
              className="rounded-2xl border border-white/10 bg-surface p-6 sm:p-8"
            >
              <div className="space-y-2">
                <h3 className="font-display text-xl font-bold text-brand uppercase sm:text-2xl">
                  {office.city}
                </h3>
                <p className="text-sm leading-relaxed text-slate-300 sm:text-base">
                  {office.address}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
