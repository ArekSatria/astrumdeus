"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Mail,
  Lock,
  ArrowRight,
  AlertCircle,
  Eye,
  EyeOff,
  ShieldCheck,
  ArrowLeft,
} from "lucide-react";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [logoError, setLogoError] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.message || "Email atau kata sandi tidak valid.");
      }

      router.push("/admin");
      router.refresh();
    } catch (err: any) {
      setError(err.message || "Gagal masuk ke sistem CMS.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative flex min-h-screen w-full flex-col items-center justify-center overflow-hidden bg-background esports-grid-bg px-4 py-12 text-foreground">
      {/* Efek Pencahayaan Ambient Brand */}
      <div className="pointer-events-none absolute -top-40 left-1/2 h-96 w-96 -translate-x-1/2 rounded-full bg-brand/10 blur-[120px]" />
      <div className="pointer-events-none absolute -bottom-40 right-1/4 h-80 w-80 rounded-full bg-brand/5 blur-[100px]" />

      <div className="relative z-10 w-full max-w-md space-y-6">
        {/* Kartu Utama Login */}
        <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-surface/95 p-8 shadow-2xl backdrop-blur-xl sm:p-10">
          {/* Garis Aksen Brand di Bagian Atas Kartu */}
          <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-transparent via-brand to-transparent" />

          {/* Header & Logo */}
          <div className="flex flex-col items-center text-center">
            <div className="relative mb-5 flex h-20 w-20 items-center justify-center rounded-2xl border border-brand/30 bg-background/80 p-3 shadow-lg shadow-brand/10">
              {!logoError ? (
                <Image
                  src="/images/logo-adre.png"
                  alt="Astrum Deus Logo"
                  width={56}
                  height={56}
                  unoptimized
                  className="h-12 w-auto object-contain"
                  onError={() => setLogoError(true)}
                />
              ) : (
                <span className="font-display text-2xl font-black tracking-wider text-brand">
                  AD
                </span>
              )}
            </div>

            <div className="mb-2 inline-flex items-center gap-1.5 rounded-full border border-brand/30 bg-brand/10 px-3 py-1 text-[11px] font-mono font-bold uppercase tracking-widest text-brand">
              <ShieldCheck size={13} />
              Authorized Access
            </div>

            <h1 className="font-display text-3xl font-black uppercase tracking-tight text-foreground sm:text-4xl">
              CMS ASTRUMDEUS
            </h1>
            <p className="mt-1.5 text-xs sm:text-sm text-slate-400">
              Portal Pengelolaan Konten PT Adre Gemilang Jaya
            </p>
          </div>

          {/* Notifikasi Error */}
          {error && (
            <div className="mt-6 flex items-center gap-2.5 rounded-xl border border-rose-500/30 bg-rose-950/40 p-3.5 text-xs font-medium text-rose-300">
              <AlertCircle size={16} className="shrink-0 text-rose-400" />
              <span>{error}</span>
            </div>
          )}

          {/* Form Login */}
          <form onSubmit={handleSubmit} className="mt-8 space-y-5">
            <div className="space-y-2">
              <label
                htmlFor="email"
                className="block font-mono text-xs font-bold uppercase tracking-wider text-slate-300"
              >
                Email Administrator
              </label>
              <div className="relative">
                <Mail
                  size={18}
                  className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
                />
                <input
                  id="email"
                  type="email"
                  required
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@adregemilangjaya.com"
                  className="w-full rounded-xl border border-white/10 bg-background/90 py-3.5 pl-11 pr-4 text-sm text-foreground placeholder-slate-500 transition focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand/40"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label
                htmlFor="password"
                className="block font-mono text-xs font-bold uppercase tracking-wider text-slate-300"
              >
                Kata Sandi
              </label>
              <div className="relative">
                <Lock
                  size={18}
                  className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
                />
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  required
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full rounded-xl border border-white/10 bg-background/90 py-3.5 pl-11 pr-11 text-sm text-foreground placeholder-slate-500 transition focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand/40"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 rounded-lg p-1 text-slate-400 transition hover:text-brand"
                  aria-label={
                    showPassword ? "Sembunyikan kata sandi" : "Lihat kata sandi"
                  }
                >
                  {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="group mt-2 flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-brand px-6 py-3.5 font-display text-sm font-bold uppercase tracking-wider text-background shadow-lg shadow-brand/20 transition-all hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <span>{loading ? "Memverifikasi..." : "Masuk Dashboard"}</span>
              {!loading && (
                <ArrowRight
                  size={17}
                  className="transition-transform duration-200 group-hover:translate-x-1"
                />
              )}
            </button>
          </form>
        </div>

        {/* Tautan Kembali ke Beranda Publik */}
        <div className="text-center">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 transition-colors hover:text-brand"
          >
            <ArrowLeft size={14} />
            Kembali ke Website Utama
          </Link>
        </div>
      </div>
    </div>
  );
}
