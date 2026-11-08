import React from "react";
import type { Metadata } from "next";
import { getGlobalSettings, getCompanyProfile } from "@/lib/api/client";
import { ContactView } from "@/components/sections/ContactView";

export const metadata: Metadata = {
  title: "Kontak & Kemitraan Bisnis",
  description:
    "Hubungi manajemen PT Adre Gemilang Jaya untuk proposal sponsorship, kemitraan komersial, dan undangan turnamen resmi.",
};

export const dynamic = "force-dynamic";

export default async function ContactPage() {
  const [settings, company] = await Promise.all([
    getGlobalSettings(),
    getCompanyProfile(),
  ]);

  const email =
    company?.contact?.partnershipEmail ||
    company?.contact?.businessEmail ||
    settings.contactQuick.partnershipEmail;

  return <ContactView contactEmail={email} />;
}
