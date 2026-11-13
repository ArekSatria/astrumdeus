import React from "react";
import Link from "next/link";
import { db } from "@/lib/db";
import {
  Newspaper,
  Swords,
  ShieldAlert,
  Handshake,
  AlertTriangle,
  ArrowUpRight,
} from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  let isDbConnected = false;
  let stats = {
    newsCount: 0,
    matchesCount: 0,
    divisionsCount: 0,
    partnersCount: 0,
  };
  let dbError = "";

  try {
    const [news, matches, divisions, partners] = await Promise.all([
      db.article.count(),
      db.match.count(),
      db.division.count(),
      db.partner.count(),
    ]);

    stats = {
      newsCount: news,
      matchesCount: matches,
      divisionsCount: divisions,
      partnersCount: partners,
    };
    isDbConnected = true;
  } catch (error: any) {
    isDbConnected = false;
    dbError = error.message || "Tidak dapat terhubung ke database.";
  }

  return (
    <div className="space-y-6">
      {/* Page Title */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          Dashboard
        </h1>
      </div>

      {/* Database Connection Alert (Hanya muncul jika gagal) */}
      {!isDbConnected && (
        <div className="p-5 rounded-2xl bg-amber-950/40 border border-amber-800/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3.5">
            <div className="p-2.5 rounded-xl bg-amber-900/50 text-amber-400 shrink-0 mt-0.5 sm:mt-0">
              <AlertTriangle size={22} />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-amber-200">
                Koneksi Database Belum Terhubung
              </h3>
              <p className="text-xs text-amber-300/80 mt-1 leading-relaxed max-w-2xl">
                Pastikan konfigurasi string database di file{" "}
                <code className="bg-amber-950 px-1.5 py-0.5 rounded text-amber-200 font-mono">.env</code> sudah benar.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Stats Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* News */}
        <div className="p-5 rounded-2xl bg-[#16161e] border border-[#262936] flex flex-col justify-between hover:border-amber-400/40 hover:shadow-lg hover:shadow-amber-500/5 transition">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400">Artikel & Berita</span>
            <div className="w-9 h-9 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center">
              <Newspaper size={18} />
            </div>
          </div>
          <div className="mt-4">
            <div className="text-3xl font-black text-white">{stats.newsCount}</div>
            <Link
              href="/admin/news"
              className="text-xs text-blue-400 hover:text-blue-300 inline-flex items-center gap-1 mt-2 font-medium"
            >
              Kelola Berita <ArrowUpRight size={13} />
            </Link>
          </div>
        </div>

        {/* Matches */}
        <div className="p-5 rounded-2xl bg-[#16161e] border border-[#262936] flex flex-col justify-between hover:border-amber-400/40 hover:shadow-lg hover:shadow-amber-500/5 transition">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400">Total Pertandingan</span>
            <div className="w-9 h-9 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center">
              <Swords size={18} />
            </div>
          </div>
          <div className="mt-4">
            <div className="text-3xl font-black text-white">{stats.matchesCount}</div>
            <Link
              href="/admin/matches"
              className="text-xs text-amber-400 hover:text-amber-300 inline-flex items-center gap-1 mt-2 font-medium"
            >
              Jadwal & Skor <ArrowUpRight size={13} />
            </Link>
          </div>
        </div>

        {/* Teams & Roster */}
        <div className="p-5 rounded-2xl bg-[#16161e] border border-[#262936] flex flex-col justify-between hover:border-amber-400/40 hover:shadow-lg hover:shadow-amber-500/5 transition">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400">Divisi & Roster</span>
            <div className="w-9 h-9 rounded-xl bg-amber-400/10 text-amber-400 flex items-center justify-center">
              <ShieldAlert size={18} />
            </div>
          </div>
          <div className="mt-4">
            <div className="text-3xl font-black text-white">{stats.divisionsCount} Divisi</div>
            <Link
              href="/admin/teams"
              className="text-xs text-amber-400 hover:text-amber-300 inline-flex items-center gap-1 mt-2 font-medium"
            >
              Kelola Roster <ArrowUpRight size={13} />
            </Link>
          </div>
        </div>

        {/* Partners */}
        <div className="p-5 rounded-2xl bg-[#16161e] border border-[#262936] flex flex-col justify-between hover:border-amber-400/40 hover:shadow-lg hover:shadow-amber-500/5 transition">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400">Mitra & Sponsor</span>
            <div className="w-9 h-9 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
              <Handshake size={18} />
            </div>
          </div>
          <div className="mt-4">
            <div className="text-3xl font-black text-white">{stats.partnersCount}</div>
            <Link
              href="/admin/partners"
              className="text-xs text-emerald-400 hover:text-emerald-300 inline-flex items-center gap-1 mt-2 font-medium"
            >
              Kelola Sponsor <ArrowUpRight size={13} />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
