import { NextResponse } from "next/server";
import { getAuthSession } from "@/lib/auth";

export async function POST(request: Request) {
  const session = await getAuthSession();
  if (!session) {
    return NextResponse.json(
      { success: false, message: "Unauthorized. Silakan login kembali." },
      { status: 401 }
    );
  }

  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json(
        { success: false, message: "Tidak ada berkas gambar yang dikirim." },
        { status: 400 }
      );
    }

    const allowedTypes = [
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/webp",
      "image/svg+xml",
      "image/gif",
    ];

    if (file.type && !allowedTypes.includes(file.type)) {
      return NextResponse.json(
        {
          success: false,
          message: "Format berkas tidak didukung. Gunakan PNG, JPG, WEBP, SVG, atau GIF.",
        },
        { status: 400 }
      );
    }

    // Batas ukuran 4 MB agar optimal disimpan sebagai Data URI di PostgreSQL
    const maxSizeBytes = 4 * 1024 * 1024;
    if (file.size > maxSizeBytes) {
      return NextResponse.json(
        {
          success: false,
          message: "Ukuran gambar maksimal adalah 4 MB.",
        },
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const mimeType = file.type || "image/png";
    const dataUrl = `data:${mimeType};base64,${buffer.toString("base64")}`;

    return NextResponse.json({
      success: true,
      message: "Gambar berhasil diunggah.",
      url: dataUrl,
      fileUrl: dataUrl,
      data: {
        url: dataUrl,
        fileUrl: dataUrl,
        fileName: file.name,
        mimeType,
        size: file.size,
      },
    });
  } catch (error) {
    console.error("POST /api/v1/upload error:", error);
    return NextResponse.json(
      { success: false, message: "Gagal mengunggah gambar." },
      { status: 500 }
    );
  }
}
