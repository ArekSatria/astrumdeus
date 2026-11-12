"use client";

import React, { useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils/cn";

interface BrandLogoProps {
  logoUrl?: string | null;
  height?: number;
  fullWidth?: boolean;
  className?: string;
}

export function BrandLogo({
  logoUrl,
  height = 46,
  fullWidth = false,
  className,
}: BrandLogoProps) {
  const [imgError, setImgError] = useState(false);
  const resolvedSrc = logoUrl || "/images/logo-adre.png";

  if (!imgError) {
    if (fullWidth) {
      return (
        <Image
          src={resolvedSrc}
          alt="PT Adre Gemilang Jaya"
          width={900}
          height={320}
          sizes="(max-width: 1024px) 90vw, 420px"
          className={cn("h-auto w-full object-contain object-left", className)}
          onError={() => setImgError(true)}
        />
      );
    }
    return (
      <Image
        src={resolvedSrc}
        alt="PT Adre Gemilang Jaya"
        width={160}
        height={52}
        sizes="160px"
        priority
        fetchPriority="high"
        className={cn("object-contain", className)}
        style={{ height: `${height}px`, width: "auto" }}
        onError={() => setImgError(true)}
      />
    );
  }

  return (
    <span className="font-display text-xl font-bold tracking-tight text-foreground">
      ADRE ESPORTS
    </span>
  );
}

interface PartnerLogoGraphicProps {
  partnerId: string;
  name: string;
  logoUrl?: string | null;
  className?: string;
}

export function PartnerLogoGraphic({
  partnerId,
  name,
  logoUrl,
  className,
}: PartnerLogoGraphicProps) {
  const [imgError, setImgError] = useState(false);

  if (logoUrl && !imgError) {
    return (
      <Image
        src={logoUrl}
        alt={name}
        fill
        unoptimized
        sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 250px"
        // Menggunakan object-cover agar gambar (beserta background aslinya) benar-benar memenuhi seluruh layout card
        className={cn("object-cover object-center", className)}
        onError={() => setImgError(true)}
      />
    );
  }

  return (
    <div
      className={cn(
        "flex h-full w-full items-center justify-center bg-zinc-900/50 p-4 text-center font-display text-sm font-bold text-slate-500 uppercase transition-colors group-hover:text-brand",
        className,
      )}
      aria-label={name || partnerId}
    >
      {name}
    </div>
  );
}
