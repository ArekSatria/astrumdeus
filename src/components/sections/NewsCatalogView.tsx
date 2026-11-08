"use client";

import React, { useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { mockNewsCatalog } from "@/lib/api/mock-data";
import { type NewsListPayload } from "@/lib/schemas";
import { translateArticleContent } from "@/lib/utils/corporate-helpers";
import { cn } from "@/lib/utils/cn";

type NewsCatalogData = NewsListPayload | typeof mockNewsCatalog;

interface NewsCatalogViewProps {
  data?: NewsCatalogData;
  initialData?: NewsCatalogData;
  catalog?: NewsCatalogData;
}

export function NewsCatalogView({
  data,
  initialData,
  catalog,
}: NewsCatalogViewProps) {
  const { locale, t } = useLanguage();
  const [activeCategory, setActiveCategory] = useState<string>("ALL");

  const payload = data ?? initialData ?? catalog ?? mockNewsCatalog;

  const categories = useMemo(() => payload.categories || [], [payload.categories]);

  const filteredArticles = useMemo(() => {
    const validItems = payload.items || [];
    const byCategory =
      activeCategory === "ALL"
        ? validItems
        : validItems.filter((item) => item.category.slug === activeCategory);

    return byCategory.map((item) => translateArticleContent(item, locale));
  }, [payload.items, activeCategory, locale]);

  const translateCategoryLabel = (slug: string, fallbackName: string) => {
    if (locale === "id") return fallbackName;
    if (slug === "tournament" || slug === "hasil-turnamen") return "Tournament";
    if (slug === "announcement" || slug === "pengumuman") return "Announcement";
    if (slug === "corporate" || slug === "korporasi") return "Corporate";
    return fallbackName;
  };

  const formatDate = (iso: string) =>
    new Intl.DateTimeFormat(locale === "id" ? "id-ID" : "en-US", {
      day: "numeric",
      month: "short",
      year: "numeric",
    }).format(new Date(iso));

  return (
    <div className="mx-auto max-w-7xl space-y-10 px-4 py-12 sm:px-6 lg:px-8">
      {/* Header Halaman & Filter Kategori */}
      <div className="flex flex-col justify-between gap-6 border-b border-white/10 pb-8 sm:flex-row sm:items-center">
        <h1 className="font-display text-3xl font-bold tracking-tight text-foreground uppercase sm:text-5xl">
          {t.newsPage.title}
        </h1>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => setActiveCategory("ALL")}
            className={cn(
              "rounded-xl px-4 py-2.5 text-xs font-bold uppercase transition-colors",
              activeCategory === "ALL"
                ? "bg-brand text-background"
                : "border border-white/10 bg-surface text-slate-300 hover:border-brand hover:text-foreground",
            )}
          >
            {t.newsPage.filterAllCategories}
          </button>

          {categories.map((cat) => {
            const isActive = activeCategory === cat.slug;
            return (
              <button
                key={cat.slug}
                type="button"
                onClick={() => setActiveCategory(cat.slug)}
                className={cn(
                  "rounded-xl px-4 py-2.5 text-xs font-bold uppercase transition-colors",
                  isActive
                    ? "bg-brand text-background"
                    : "border border-white/10 bg-surface text-slate-300 hover:border-brand hover:text-foreground",
                )}
              >
                {translateCategoryLabel(cat.slug, cat.name)}
              </button>
            );
          })}
        </div>
      </div>

      {/* Grid Artikel Berita */}
      {filteredArticles.length === 0 ? (
        <div className="rounded-2xl border border-white/10 bg-surface p-12 text-center text-sm text-slate-300">
          {t.newsPage.emptyState}
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredArticles.map((article) => (
            <Link
              key={article.id}
              href={`/news/${article.slug}`}
              className="group flex flex-col justify-between overflow-hidden rounded-2xl border border-white/10 bg-surface transition-colors hover:border-brand"
            >
              <div>
                {article.coverImageUrl && (
                  <div className="relative aspect-[16/9] w-full overflow-hidden border-b border-white/10 bg-background">
                    <Image
                      src={article.coverImageUrl}
                      alt={article.coverImageAlt || article.title}
                      fill
                      unoptimized
                      sizes="(max-width: 768px) 100vw, 400px"
                      className="object-cover object-center transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                )}

                <div className="space-y-4 p-6 sm:p-8">
                  <div className="flex items-center justify-between gap-2 text-xs text-slate-300">
                    <span className="inline-block rounded-md border border-brand/40 bg-brand/15 px-3 py-1 font-mono font-bold text-brand uppercase">
                      {article.category.name}
                    </span>
                    <span className="font-mono">
                      {formatDate(article.publishedAt)}
                    </span>
                  </div>

                  <h2 className="font-display text-xl font-bold tracking-tight text-foreground transition-colors group-hover:text-brand">
                    {article.title}
                  </h2>

                  <p className="line-clamp-3 text-sm leading-relaxed text-slate-300">
                    {article.excerpt}
                  </p>
                </div>
              </div>

              <div className="px-6 pb-6 sm:px-8 sm:pb-8">
                <div className="flex items-center justify-between border-t border-white/10 pt-4 text-xs font-bold text-brand uppercase">
                  <span>{t.newsPage.readMore}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
