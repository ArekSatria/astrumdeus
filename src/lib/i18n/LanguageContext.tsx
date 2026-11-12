"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useMemo,
} from "react";

export type Locale = "id" | "en";

export interface NavItemConfig {
  key: "home" | "teams" | "matches" | "news" | "partners" | "about";
  href: string;
  label: {
    id: string;
    en: string;
  };
}

export const NAVIGATION_ITEMS: NavItemConfig[] = [
  { key: "home", href: "/", label: { id: "Beranda", en: "Home" } },
  {
    key: "teams",
    href: "/teams",
    label: { id: "Divisi & Roster", en: "Divisions & Roster" },
  },
  {
    key: "matches",
    href: "/matches",
    label: { id: "Pertandingan", en: "Matches" },
  },
  { key: "news", href: "/news", label: { id: "Berita", en: "News" } },
  {
    key: "partners",
    href: "/partners",
    label: { id: "Mitra", en: "Partners" },
  },
  {
    key: "about",
    href: "/about",
    label: { id: "Tentang Kami", en: "About Us" },
  },
];

export const DICTIONARY = {
  id: {
    nav: {
      cta: "Kontak Bisnis",
      mobileTitle: "Menu",
      langLabel: "Bahasa",
    },
    home: {
      heroBadge: "",
      heroTitle: "",
      heroSubtitle: "",
      rosterCta: "Lihat Roster",
      partnerCta: "Kontak Bisnis",
      partnersSectionTitle: "MITRA RESMI",
      partnersSectionSub: "",
      upcomingTitle: "BERLANGSUNG",
      upcomingSub: "",
      viewAllMatches: "Semua Pertandingan",
      divisionTitle: "DIVISI GAME",
      divisionSub: "",
      divisionBadge: "",
      divisionMeta: "",
      exploreDivisionBtn: "Lihat Roster",
      newsTitle: "BERITA",
      newsSub: "",
      viewAllNews: "Semua Berita",
      resultsTitle: "HASIL PERTANDINGAN",
      resultsSub: "",
      watchStream: "Tonton Siaran",
      pointsUnit: "POIN",
    },
    teamsPage: {
      catalogTitle: "DIVISI & ROSTER",
      catalogSub: "",
      activePersonnelLabel: "Anggota Tim",
      personnelComposition: "",
      openRosterCta: "Lihat Daftar Roster",
      expansionTitle: "",
      expansionDesc: "",
      backToCatalog: "Kembali ke Divisi",
      playersHeading: "PEMAIN",
      playersSub: "",
      managementHeading: "MANAJER & STAF PELATIH",
      managementSub: "Manajer tim, pelatih kepala, dan analis.",
      staffHeading: "MANAJER & STAF PELATIH",
      staffSub: "Manajer tim, pelatih kepala, dan analis.",
      achievementsHeading: "PRESTASI TIM",
      achievementsSub: "",
      scheduleCta: "Jadwal Pertandingan",
      roleLabels: {
        IGL: "Kapten & In-Game Leader",
        RUSHER: "Rusher",
        SUPPORT: "Support",
        SCOUT: "Scout",
        MANAGER: "Manajer Tim",
        COACH: "Pelatih Kepala",
        ANALYST: "Analis",
      },
    },
    matchesPage: {
      title: "PERTANDINGAN",
      subtitle: "",
      filterStatusAll: "Semua",
      filterStatusLive: "Berlangsung",
      filterStatusUpcoming: "Jadwal",
      filterStatusCompleted: "Hasil",
      filterGameAll: "Semua Divisi",
      watchStream: "Tonton Siaran",
      liveBadge: "BERLANGSUNG",
      upcomingBadge: "AKAN DATANG",
      completedBadge: "SELESAI",
      emptyState: "Belum ada pertandingan untuk kategori ini.",
      pointsUnit: "POIN",
    },
    newsPage: {
      title: "BERITA",
      subtitle: "",
      filterAllCategories: "Semua",
      readMore: "Baca Artikel",
      readTimeUnit: "",
      emptyState: "Belum ada berita di kategori ini.",
      backToNews: "Kembali ke Berita",
      publishedBy: "Oleh",
      relatedHeading: "BERITA LAINNYA",
    },
    partnersPage: {
      title: "MITRA RESMI",
      subtitle:
        "Daftar mitra resmi yang bekerja sama dengan PT Adre Gemilang Jaya.",
      visitPartner: "Situs Mitra",
      ctaBannerTitle: "Kerja Sama Sponsorship",
      ctaBannerDesc:
        "Hubungi tim kami di Jakarta untuk diskusi kerja sama dan sponsorship.",
      ctaButton: "Hubungi Kami",
    },
    aboutPage: {
      title: "TENTANG KAMI",
      subtitle: "",
      visionBadge: "VISI",
      visionTitle: "",
      visionText:
        "Menjadi organisasi esports profesional yang kompetitif di tingkat nasional dan Asia Tenggara melalui pembinaan tim yang terarah.",
      missionBadge: "MISI",
      missionTitle: "",
      missions: [
        {
          code: "1",
          heading: "Pembinaan Tim Kompetitif",
          desc: "Menyiapkan program latihan rutin bagi pemain bersama manajer, pelatih, dan analis.",
        },
        {
          code: "2",
          heading: "Kerja Sama Mitra",
          desc: "Menjalankan program kolaborasi yang saling menguntungkan bersama para sponsor resmi.",
        },
        {
          code: "3",
          heading: "Manajemen Operasional di Jakarta",
          desc: "Menyediakan fasilitas latihan dan dukungan penuh bagi kebutuhan skuad di Jakarta.",
        },
      ],
      milestonesHeading: "PERJALANAN KAMI",
      milestonesSub: "",
      officesHeading: "LOKASI OPERASIONAL",
      officesSub: "",
    },
    contactPage: {
      title: "KONTAK",
      subtitle: "",
      directInfoHeading: "KONTAK LANGSUNG",
      emailLabel: "Email Resmi",
      hqLabel: "Alamat Kantor",
      hqValue:
        "Kawasan Niaga Terpadu Sudirman (SCBD), Jakarta Selatan, DKI Jakarta",
      responseSla:
        "Tim kami akan membalas pesan Anda dalam 1 sampai 2 hari kerja.",
      formHeading: "KIRIM PESAN",
      fullNameLabel: "Nama Lengkap",
      fullNamePlaceholder: "Nama Anda",
      companyLabel: "Perusahaan / Instansi",
      companyPlaceholder: "Nama perusahaan atau organisasi",
      emailInputLabel: "Email",
      emailPlaceholder: "nama@perusahaan.com",
      inquiryTypeLabel: "Kategori Keperluan",
      inquiryOptions: {
        SPONSORSHIP: "Proposal Sponsorship",
        TOURNAMENT: "Undangan Turnamen",
        GENERAL: "Pertanyaan Umum",
      },
      validationErrors: {
        fullName: "Nama lengkap wajib diisi minimal 3 karakter.",
        companyName: "Nama perusahaan atau instansi wajib diisi.",
        email: "Format alamat email tidak valid.",
        message: "Pesan wajib diisi minimal 20 karakter.",
      },
      messageLabel: "Pesan",
      messagePlaceholder: "Tulis rincian keperluan Anda di sini...",
      submitButton: "Kirim Pesan",
      submittingButton: "Mengirim...",
      successTitle: "Pesan Terkirim",
      successDesc:
        "Terima kasih telah menghubungi PT Adre Gemilang Jaya. Kami akan segera membalas pesan Anda melalui email.",
      sendAnotherBtn: "Kirim Pesan Baru",
    },
    footer: {
      navHeading: "Navigasi",
      divisionHeading: "Divisi Game",
      divisionPrefix: "Tim",
      sponsorLink: "Pengajuan Sponsorship",
      contactHeading: "Kontak",
      addressText: "SCBD, Jakarta Selatan, DKI Jakarta, Indonesia",
      rights: "Seluruh hak cipta dilindungi.",
      aboutLink: "Tentang Kami",
      contactLink: "Kontak",
    },
  },
  en: {
    nav: {
      cta: "Contact Us",
      mobileTitle: "Menu",
      langLabel: "Language",
    },
    home: {
      heroBadge: "",
      heroTitle: "",
      heroSubtitle: "",
      rosterCta: "View Roster",
      partnerCta: "Contact Us",
      partnersSectionTitle: "OFFICIAL PARTNERS",
      partnersSectionSub: "",
      upcomingTitle: "LIVE",
      upcomingSub: "",
      viewAllMatches: "All Matches",
      divisionTitle: "GAME DIVISIONS",
      divisionSub: "",
      divisionBadge: "",
      divisionMeta: "",
      exploreDivisionBtn: "View Roster",
      newsTitle: "NEWS",
      newsSub: "",
      viewAllNews: "All News",
      resultsTitle: "MATCH RESULTS",
      resultsSub: "",
      watchStream: "Watch Stream",
      pointsUnit: "PTS",
    },
    teamsPage: {
      catalogTitle: "DIVISIONS & ROSTER",
      catalogSub: "",
      activePersonnelLabel: "Team Members",
      personnelComposition: "",
      openRosterCta: "View Roster",
      expansionTitle: "",
      expansionDesc: "",
      backToCatalog: "Back to Divisions",
      playersHeading: "PLAYERS",
      playersSub: "",
      managementHeading: "MANAGER & COACHING STAFF",
      managementSub: "Team manager, head coach, and analyst.",
      staffHeading: "MANAGER & COACHING STAFF",
      staffSub: "Team manager, head coach, and analyst.",
      achievementsHeading: "ACHIEVEMENTS",
      achievementsSub: "",
      scheduleCta: "Match Schedule",
      roleLabels: {
        IGL: "Captain & In-Game Leader",
        RUSHER: "Rusher",
        SUPPORT: "Support",
        SCOUT: "Scout",
        MANAGER: "Team Manager",
        COACH: "Head Coach",
        ANALYST: "Analyst",
      },
    },
    matchesPage: {
      title: "MATCHES",
      subtitle: "",
      filterStatusAll: "All",
      filterStatusLive: "Live",
      filterStatusUpcoming: "Schedule",
      filterStatusCompleted: "Results",
      filterGameAll: "All Divisions",
      watchStream: "Watch Stream",
      liveBadge: "LIVE",
      upcomingBadge: "UPCOMING",
      completedBadge: "COMPLETED",
      emptyState: "No matches available for this filter.",
      pointsUnit: "PTS",
    },
    newsPage: {
      title: "NEWS",
      subtitle: "",
      filterAllCategories: "All",
      readMore: "Read Article",
      readTimeUnit: "",
      emptyState: "No news articles in this category.",
      backToNews: "Back to News",
      publishedBy: "By",
      relatedHeading: "OTHER NEWS",
    },
    partnersPage: {
      title: "OFFICIAL PARTNERS",
      subtitle: "Official partners collaborating with PT Adre Gemilang Jaya.",
      visitPartner: "Partner Website",
      ctaBannerTitle: "Sponsorship Inquiries",
      ctaBannerDesc:
        "Get in touch with our team in Jakarta for sponsorship and partnership discussions.",
      ctaButton: "Contact Us",
    },
    aboutPage: {
      title: "ABOUT US",
      subtitle: "",
      visionBadge: "VISION",
      visionTitle: "",
      visionText:
        "To become a competitive professional esports organization at the national and Southeast Asian levels through structured team development.",
      missionBadge: "MISSION",
      missionTitle: "",
      missions: [
        {
          code: "1",
          heading: "Competitive Team Training",
          desc: "Provide regular training programs for players supported by a manager, coach, and analyst.",
        },
        {
          code: "2",
          heading: "Partner Collaboration",
          desc: "Deliver mutually beneficial brand programs with our official sponsors.",
        },
        {
          code: "3",
          heading: "Jakarta Operations",
          desc: "Maintain training facilities and operational support for our squad in Jakarta.",
        },
      ],
      milestonesHeading: "OUR JOURNEY",
      milestonesSub: "",
      officesHeading: "OPERATIONAL LOCATION",
      officesSub: "",
    },
    contactPage: {
      title: "CONTACT",
      subtitle: "",
      directInfoHeading: "DIRECT CONTACT",
      emailLabel: "Official Email",
      hqLabel: "Office Address",
      hqValue:
        "Sudirman Central Business District (SCBD), South Jakarta, DKI Jakarta",
      responseSla: "Our team typically replies within 1 to 2 business days.",
      formHeading: "SEND A MESSAGE",
      fullNameLabel: "Full Name",
      fullNamePlaceholder: "Your name",
      companyLabel: "Company / Organization",
      companyPlaceholder: "Company or organization name",
      emailInputLabel: "Email",
      emailPlaceholder: "name@company.com",
      inquiryTypeLabel: "Category",
      inquiryOptions: {
        SPONSORSHIP: "Sponsorship Proposal",
        TOURNAMENT: "Tournament Invitation",
        GENERAL: "General Inquiry",
      },
      validationErrors: {
        fullName: "Full name is required (minimum 3 characters).",
        companyName: "Company or organization name is required.",
        email: "Please enter a valid email address.",
        message: "Message must be at least 20 characters.",
      },
      messageLabel: "Message",
      messagePlaceholder: "Write the details of your inquiry here...",
      submitButton: "Send Message",
      submittingButton: "Sending...",
      successTitle: "Message Sent",
      successDesc:
        "Thank you for contacting PT Adre Gemilang Jaya. We will reply to your email shortly.",
      sendAnotherBtn: "Send Another Message",
    },
    footer: {
      navHeading: "Navigation",
      divisionHeading: "Game Divisions",
      divisionPrefix: "Team",
      sponsorLink: "Sponsorship Inquiry",
      contactHeading: "Contact",
      addressText: "SCBD, South Jakarta, DKI Jakarta, Indonesia",
      rights: "All rights reserved.",
      aboutLink: "About Us",
      contactLink: "Contact",
    },
  },
};

export type DictionaryType = (typeof DICTIONARY)["id"];

interface LanguageContextValue {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: DictionaryType;
}

const LanguageContext = createContext<LanguageContextValue | undefined>(
  undefined,
);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>("en");

  useEffect(() => {
    const saved = window.localStorage.getItem("adre_locale_v2");
    if (saved === "en" || saved === "id") {
      const timer = window.setTimeout(() => {
        setLocaleState(saved);
      }, 0);
      return () => window.clearTimeout(timer);
    }
  }, []);

  const setLocale = (nextLocale: Locale) => {
    setLocaleState(nextLocale);
    window.localStorage.setItem("adre_locale_v2", nextLocale);
  };

  const contextValue = useMemo(
    () => ({
      locale,
      setLocale,
      t: DICTIONARY[locale] as DictionaryType,
    }),
    [locale],
  );

  return (
    <LanguageContext.Provider value={contextValue}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage harus digunakan di dalam LanguageProvider");
  }
  return context;
}
