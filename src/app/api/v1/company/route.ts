import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getAuthSession } from "@/lib/auth";
import { revalidatePath, revalidateTag } from "next/cache";

export async function GET() {
  try {
    let company = await db.companyProfile.findUnique({
      where: { id: "default" },
    });

    if (!company) {
      company = await db.companyProfile.create({
        data: {
          id: "default",
          companyName: "PT Adre Gemilang Jaya",
          aboutHtml:
            "<p>PT Adre Gemilang Jaya adalah perusahaan manajemen esports profesional yang berbasis di Indonesia.</p>",
          vision:
            "Menjadi pilar utama pengembangan ekosistem esports profesional di Indonesia.",
          missions: [
            "Mengembangkan talenta atlet esports.",
            "Menjunjung profesionalisme.",
          ],
          coreValues: [],
          milestones: [],
          businessEmail: "business@adregemilangjaya.com",
          partnershipEmail: "partnership@adregemilangjaya.com",
          officeAddress: "Jakarta, Indonesia",
          socials: {},
        },
      });
    }

    const defaultMilestones = [
      {
        year: "2024",
        title: "Pendirian PT Adre Gemilang Jaya di Jakarta",
        description:
          "Resmi berdiri di Jakarta sebagai perusahaan manajemen tim esports profesional.",
      },
      {
        year: "2025",
        title: "Pembentukan Tim PUBG Mobile",
        description:
          "Merekrut 4 pemain inti, 1 manajer tim, dan 2 staf pelatih di Jakarta serta meraih Juara 2 di SEA Esports Pro Invitational Fall 2025.",
      },
      {
        year: "2026",
        title: "Juara 1 PMNC Indonesia 2026",
        description:
          "Meraih 148 poin di babak Grand Finals PMNC Indonesia 2026 dan lolos ke liga PMSL SEA Fall 2026.",
      },
    ];

    const milestones =
      Array.isArray(company.milestones) && company.milestones.length > 0
        ? (company.milestones as any[])
        : company.milestones === null
        ? defaultMilestones
        : (company.milestones as any[]);

    const payload = {
      companyName: company.companyName,
      aboutHtml: company.aboutHtml,
      companyImageUrl: company.companyImageUrl,
      vision: company.vision,
      missions: (company.missions as any[]) || [],
      coreValues: (company.coreValues as any[]) || [],
      milestones,
      officeAddress: company.officeAddress,
      contact: {
        businessEmail: company.businessEmail,
        partnershipEmail: company.partnershipEmail,
        officeAddress: company.officeAddress,
        mapEmbedUrl: company.mapEmbedUrl,
        socials: (company.socials as any) || {},
      },
    };

    return NextResponse.json({
      success: true,
      message: "Profil korporasi berhasil dimuat.",
      data: payload,
    });
  } catch (error) {
    console.error("GET /api/v1/company error:", error);
    return NextResponse.json(
      { success: false, message: "Gagal memuat profil perusahaan." },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  const session = await getAuthSession();
  if (!session) {
    return NextResponse.json(
      { success: false, message: "Unauthorized." },
      { status: 401 }
    );
  }

  try {
    const body = await request.json();
    const businessEmail = body.contact?.businessEmail ?? body.businessEmail;
    const partnershipEmail = body.contact?.partnershipEmail ?? body.partnershipEmail;
    const officeAddress = body.contact?.officeAddress ?? body.officeAddress;

    const updated = await db.companyProfile.upsert({
      where: { id: "default" },
      update: {
        companyName: body.companyName,
        aboutHtml: body.aboutHtml,
        companyImageUrl: body.companyImageUrl,
        vision: body.vision,
        missions: body.missions,
        coreValues: body.coreValues,
        milestones: body.milestones,
        businessEmail,
        partnershipEmail,
        officeAddress,
        mapEmbedUrl: body.contact?.mapEmbedUrl ?? body.mapEmbedUrl,
        socials: body.contact?.socials ?? body.socials,
      },
      create: {
        id: "default",
        companyName: body.companyName || "PT Adre Gemilang Jaya",
        aboutHtml: body.aboutHtml || "",
        companyImageUrl: body.companyImageUrl || null,
        vision: body.vision || "",
        missions: body.missions || [],
        coreValues: body.coreValues || [],
        milestones: body.milestones || [],
        businessEmail: businessEmail || "business@adregemilangjaya.com",
        partnershipEmail: partnershipEmail || "partnership@adregemilangjaya.com",
        officeAddress: officeAddress || "Jakarta, Indonesia",
        mapEmbedUrl: body.contact?.mapEmbedUrl || null,
        socials: body.contact?.socials || {},
      },
    });

    // Sinkronkan juga kontak & alamat ke globalSetting agar Footer dan halaman Kontak ikut terbarui
    try {
      await db.globalSetting.updateMany({
        where: { id: "default" },
        data: {
          ...(businessEmail ? { businessEmail } : {}),
          ...(partnershipEmail ? { partnershipEmail } : {}),
          ...(officeAddress ? { addressShort: officeAddress } : {}),
        },
      });
    } catch {}

    try {
      revalidateTag("about", { expire: 0 });
      revalidateTag("settings", { expire: 0 });
      revalidateTag("home", { expire: 0 });
      revalidatePath("/", "layout");
      revalidatePath("/about");
      revalidatePath("/contact");
    } catch {}

    return NextResponse.json({
      success: true,
      message: "Profil perusahaan berhasil diperbarui.",
      data: updated,
    });
  } catch (error) {
    console.error("PUT /api/v1/company error:", error);
    return NextResponse.json(
      { success: false, message: "Gagal memperbarui profil perusahaan." },
      { status: 500 }
    );
  }
}
