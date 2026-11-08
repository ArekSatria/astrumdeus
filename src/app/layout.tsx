import type { Metadata } from "next";
import { Oswald, Inter } from "next/font/google";
import "./globals.css";
import { getGlobalSettings } from "@/lib/api/client";
import { LanguageProvider } from "@/lib/i18n/LanguageContext";
import { FloatingGlassNavbar } from "@/components/layout/FloatingGlassNavbar";
import { ObsidianFooter } from "@/components/layout/ObsidianFooter";
import { PublicLayoutShell } from "@/components/layout/PublicLayoutShell";

export const dynamic = "force-dynamic";

const oswald = Oswald({
  subsets: ["latin"],
  weight: ["600", "700"],
  variable: "--font-oswald",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "PT Adre Gemilang Jaya | Official Esports Organization",
    template: "%s | PT Adre Gemilang Jaya",
  },
  description:
    "Portal resmi PT Adre Gemilang Jaya. Manajemen skuad kompetitif PUBG Mobile (Juara 1 PMNC 2026), jadwal turnamen PMSL SEA, dan kemitraan esports.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const settings = await getGlobalSettings();

  return (
    <html lang="id" className={`${oswald.variable} ${inter.variable} dark`}>
      <body className="flex min-h-screen flex-col esports-grid-bg font-sans text-foreground antialiased">
        <LanguageProvider>
          <PublicLayoutShell
            navbar={
              <FloatingGlassNavbar
                siteName={settings.siteName}
                logoUrl={settings.logoUrl}
              />
            }
            footer={<ObsidianFooter settings={settings} />}
          >
            {children}
          </PublicLayoutShell>
        </LanguageProvider>
      </body>
    </html>
  );
}
