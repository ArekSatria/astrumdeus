"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import DOMPurify from "isomorphic-dompurify";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { translateArticleContent } from "@/lib/utils/corporate-helpers";
import { SectionHeading } from "@/components/ui/SectionHeading";

export interface ArticleCategoryInfo {
  id?: string;
  name: string;
  slug: string;
}

export interface ArticleAuthorInfo {
  name: string;
  role?: string;
  avatarUrl?: string | null;
}

export interface ArticleSummaryItem {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  coverImageUrl?: string | null;
  coverImageAlt?: string;
  publishedAt: string;
  readingTimeMinutes?: number;
  readTimeMinutes?: number;
  category: ArticleCategoryInfo;
}

export interface ArticleDetailItem extends ArticleSummaryItem {
  author?: ArticleAuthorInfo;
  contentHtml?: string;
  content?: string | string[];
  body?: string | string[];
  contentParagraphs?: string[];
  relatedNews?: ArticleSummaryItem[];
}

interface NewsArticleDetailViewProps {
  article: ArticleDetailItem;
  relatedArticles?: ArticleSummaryItem[];
}

export function NewsArticleDetailView({
  article,
  relatedArticles = [],
}: NewsArticleDetailViewProps) {
  const { locale, t } = useLanguage();

  const localizedArticle = translateArticleContent(article, locale);

  const sourceRelated =
    relatedArticles.length > 0
      ? relatedArticles
      : localizedArticle.relatedNews || [];

  const localizedRelated = sourceRelated
    .filter((item) => item.slug !== article.slug)
    .slice(0, 2)
    .map((item) => translateArticleContent(item, locale));

  const formatDate = (iso: string) =>
    new Intl.DateTimeFormat(locale === "id" ? "id-ID" : "en-US", {
      day: "numeric",
      month: "long",
      year: "numeric",
    }).format(new Date(iso));

  // Ambil konten utama dari contentHtml atau fallback ke teks paragraf
  const rawHtml = localizedArticle.contentHtml?.trim() || "";
  const hasHtmlTags = /<[a-z][\s\S]*>/i.test(rawHtml);

  const plainParagraphs: string[] = !hasHtmlTags
    ? (
        rawHtml ||
        (Array.isArray(localizedArticle.contentParagraphs)
          ? localizedArticle.contentParagraphs.join("\n\n")
          : typeof localizedArticle.content === "string"
            ? localizedArticle.content
            : localizedArticle.excerpt)
      )
        .replace(/<[^>]*>/g, "")
        .split(/\n+/)
        .map((p) => p.trim())
        .filter(Boolean)
    : [];

  return (
    <div className="mx-auto max-w-4xl space-y-12 px-4 py-12 sm:px-6 lg:px-8">
      <div className="space-y-6">
        <Link
          href="/news"
          className="inline-block text-xs font-semibold text-slate-400 transition-colors hover:text-brand"
        >
          &larr; {t.newsPage.backToNews}
        </Link>

        <div className="space-y-4 border-b border-white/10 pb-8">
          <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400">
            <span className="font-mono font-bold text-brand uppercase">
              {localizedArticle.category.name}
            </span>
            <span>&bull;</span>
            <span className="font-mono">
              {formatDate(localizedArticle.publishedAt)}
            </span>
          </div>

          <h1 className="font-display text-3xl font-bold tracking-tight text-foreground sm:text-5xl">
            {localizedArticle.title}
          </h1>
        </div>
      </div>

      {localizedArticle.coverImageUrl && (
        <div className="relative aspect-[16/9] w-full overflow-hidden rounded-xl border border-white/10 bg-surface">
          <Image
            src={localizedArticle.coverImageUrl}
            alt={localizedArticle.coverImageAlt || localizedArticle.title}
            fill
            unoptimized
            priority
            sizes="(max-width: 896px) 100vw, 896px"
            className="object-cover object-center"
          />
        </div>
      )}

      {/* Konten Artikel Langsung Tanpa Tagline HTML */}
      {hasHtmlTags ? (
        <article
          className="prose prose-invert max-w-none space-y-4 text-base leading-relaxed text-slate-200 sm:text-lg [&_h2]:font-display [&_h2]:text-2xl [&_h2]:font-bold [&_h2]:text-foreground [&_h3]:font-display [&_h3]:text-xl [&_h3]:font-bold [&_h3]:text-foreground [&_p]:leading-relaxed"
          dangerouslySetInnerHTML={{
            __html: DOMPurify.sanitize(rawHtml),
          }}
        />
      ) : (
        <article className="space-y-5">
          {plainParagraphs.map((paragraph, index) => (
            <p
              key={index}
              className="text-base leading-relaxed text-slate-200 sm:text-lg"
            >
              {paragraph}
            </p>
          ))}
        </article>
      )}

      {localizedRelated.length > 0 && (
        <section className="space-y-6 border-t border-white/10 pt-12">
          <SectionHeading title={t.newsPage.relatedHeading} />
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {localizedRelated.map((item) => (
              <Link
                key={item.id}
                href={`/news/${item.slug}`}
                className="group flex flex-col justify-between rounded-xl border border-white/10 bg-surface/70 p-6 transition-colors hover:border-brand/60"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs text-slate-400">
                    <span className="font-mono font-bold text-brand uppercase">
                      {item.category.name}
                    </span>
                    <span className="font-mono">
                      {formatDate(item.publishedAt)}
                    </span>
                  </div>
                  <h3 className="font-display text-lg font-bold text-foreground transition-colors group-hover:text-brand">
                    {item.title}
                  </h3>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
