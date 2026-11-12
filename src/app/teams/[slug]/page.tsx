import React from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  getActiveDivisions,
  getDivisionBySlug,
  getMatchesData,
} from "@/lib/api/client";
import { DivisionDetailView } from "@/components/sections/DivisionDetailView";

interface DivisionPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const divisions = await getActiveDivisions();
  return divisions.map((div) => ({
    slug: div.slug,
  }));
}

export async function generateMetadata({
  params,
}: DivisionPageProps): Promise<Metadata> {
  const { slug } = await params;
  const division = await getDivisionBySlug(slug);

  if (!division) {
    return {
      title: "Division Not Found",
    };
  }

  return {
    title: `${division.name} — Roster & Achievements`,
    description:
      division.description ||
      `Official roster and match achievements of ${division.name} division at PT Adre Gemilang Jaya.`,
  };
}

export const dynamic = "force-dynamic";

export default async function DivisionDetailPage({
  params,
}: DivisionPageProps) {
  const { slug } = await params;
  const [division, matchesPayload] = await Promise.all([
    getDivisionBySlug(slug),
    getMatchesData(),
  ]);

  if (!division) {
    notFound();
  }

  return (
    <DivisionDetailView division={division} matches={matchesPayload.items} />
  );
}
