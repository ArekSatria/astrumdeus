import { NextRequest } from "next/server";
import { unstable_noStore as noStore } from "next/cache";
import {
  GlobalSettingsSchema,
  HomePayloadSchema,
  DivisionSummarySchema,
  DivisionDetailSchema,
  MatchesPayloadSchema,
  NewsListPayloadSchema,
  NewsDetailSchema,
  type GlobalSettings,
  type HomePayload,
  type DivisionSummary,
  type DivisionDetail,
  type MatchesPayload,
  type NewsListPayload,
} from "@/lib/schemas";
import {
  mockGlobalSettings,
  mockHomePayload,
  mockDivisionsCatalog,
  mockDivisionDetails,
  mockMatchesPayload,
  mockNewsCatalog,
  mockNewsDetailsBySlug,
} from "./mock-data";
import { CORPORATE_PARTNERS_DATA } from "@/lib/utils/corporate-helpers";
import { z } from "zod";

import { GET as getSettingsRoute } from "@/app/api/v1/settings/route";
import { GET as getHomeRoute } from "@/app/api/v1/home/route";
import { GET as getTeamsRoute } from "@/app/api/v1/teams/route";
import { GET as getTeamBySlugRoute } from "@/app/api/v1/teams/[slug]/route";
import { GET as getMatchesRoute } from "@/app/api/v1/matches/route";
import { GET as getNewsRoute } from "@/app/api/v1/news/route";
import { GET as getNewsBySlugRoute } from "@/app/api/v1/news/[slug]/route";
import { GET as getPartnersRoute } from "@/app/api/v1/partners/route";
import { GET as getCompanyRoute } from "@/app/api/v1/company/route";

const USE_MOCK_API = process.env.NEXT_PUBLIC_USE_MOCK_API === "true";

async function invokeDirectRoute<T>(
  endpoint: string,
  schema: z.ZodType<T>
): Promise<T | null> {
  if (USE_MOCK_API) return null;
  noStore();

  try {
    let res: Response | null = null;
    const dummyUrl = `http://localhost:3000/api/v1${endpoint}`;
    const req = new NextRequest(dummyUrl);

    if (endpoint === "/settings") {
      res = await getSettingsRoute();
    } else if (endpoint === "/home") {
      res = await getHomeRoute();
    } else if (endpoint.startsWith("/teams/")) {
      const slug = endpoint.replace("/teams/", "").split("?")[0];
      res = await (getTeamBySlugRoute as any)(req, {
        params: Promise.resolve({ slug }),
      });
    } else if (endpoint.startsWith("/teams")) {
      res = await (getTeamsRoute as any)(req);
    } else if (endpoint.startsWith("/matches")) {
      res = await (getMatchesRoute as any)(req);
    } else if (endpoint.startsWith("/news/")) {
      const slug = endpoint.replace("/news/", "").split("?")[0];
      res = await (getNewsBySlugRoute as any)(req, {
        params: Promise.resolve({ slug }),
      });
    } else if (endpoint.startsWith("/news")) {
      res = await (getNewsRoute as any)(req);
    } else if (endpoint === "/partners") {
      res = await getPartnersRoute();
    } else if (endpoint === "/company") {
      res = await getCompanyRoute();
    }

    if (!res || !res.ok) return null;
    const json = await res.json();
    if (!json.success || !json.data) return null;

    const parsed = schema.safeParse(json.data);
    if (!parsed.success) {
      return json.data as T;
    }

    return parsed.data;
  } catch (err) {
    console.error(`[CMS Direct Route Error] on ${endpoint}:`, err);
    return null;
  }
}

// 1. Global Settings
export async function getGlobalSettings(): Promise<GlobalSettings> {
  const fromCms = await invokeDirectRoute("/settings", GlobalSettingsSchema);
  if (fromCms) return fromCms;
  return GlobalSettingsSchema.parse(mockGlobalSettings);
}

// 2. Home Page Data
export async function getHomeData(): Promise<HomePayload> {
  const fromCms = await invokeDirectRoute("/home", HomePayloadSchema);
  if (fromCms) return fromCms;
  return HomePayloadSchema.parse(mockHomePayload);
}

// 3. Divisions Catalog
export async function getActiveDivisions(): Promise<DivisionSummary[]> {
  const fromCms = await invokeDirectRoute(
    "/teams?active=true",
    z.array(DivisionSummarySchema)
  );
  if (fromCms && Array.isArray(fromCms) && fromCms.length > 0) return fromCms;
  return z.array(DivisionSummarySchema).parse(mockDivisionsCatalog);
}

// 4. Division Detail
export async function getDivisionBySlug(
  slug: string
): Promise<DivisionDetail | null> {
  const fromCms = await invokeDirectRoute(`/teams/${slug}`, DivisionDetailSchema);
  if (fromCms) return fromCms;
  const detail = mockDivisionDetails[slug];
  if (!detail) return null;
  return DivisionDetailSchema.parse(detail);
}

// 5. Matches Data
export async function getMatchesPayload(): Promise<MatchesPayload> {
  const fromCms = await invokeDirectRoute("/matches", MatchesPayloadSchema);
  if (fromCms) return fromCms;
  return MatchesPayloadSchema.parse(mockMatchesPayload);
}

export const getMatches = getMatchesPayload;
export const getMatchesData = getMatchesPayload;

// 6. News Catalog
export async function getNewsCatalog(): Promise<NewsListPayload> {
  const fromCms = await invokeDirectRoute("/news", NewsListPayloadSchema);
  if (fromCms) return fromCms;
  return mockNewsCatalog;
}

// 7. News Detail
export async function getNewsBySlug(slug: string) {
  const fromCms = await invokeDirectRoute(`/news/${slug}`, NewsDetailSchema);
  if (fromCms) return fromCms;
  return mockNewsDetailsBySlug[slug] ?? null;
}

// 8. Partners
export async function getPartners() {
  const fromCms = await invokeDirectRoute("/partners", z.array(z.any()));
  if (fromCms && Array.isArray(fromCms) && fromCms.length > 0) {
    return fromCms;
  }
  return CORPORATE_PARTNERS_DATA;
}

// 9. Company Profile
export async function getCompanyProfile() {
  const fromCms = await invokeDirectRoute("/company", z.any());
  if (fromCms) return fromCms;
  return null;
}
