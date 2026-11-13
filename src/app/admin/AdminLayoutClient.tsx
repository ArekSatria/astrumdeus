"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Newspaper,
  Swords,
  ShieldAlert,
  Handshake,
  Building2,
  Settings,
  LogOut,
  ExternalLink,
  Menu,
  X,
} from "lucide-react";

export function AdminLayoutClient({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);

  // Jika di halaman login, tampilkan layar penuh tanpa sidebar
  if (pathname === "/admin/login") {
    return <main className="min-h-screen bg-slate-950 text-slate-100">{children}</main>;
  }

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      router.push("/admin/login");
      router.refresh();
    } catch (e) {
      console.error(e);
    }
  };

  const navItems = [
    { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
    { label: "Berita & Artikel", href: "/admin/news", icon: Newspaper },
    { label: "Pertandingan", href: "/admin/matches", icon: Swords },
    { label: "Divisi & Roster", href: "/admin/teams", icon: ShieldAlert },
    { label: "Mitra & Sponsor", href: "/admin/partners", icon: Handshake },
    { label: "Profil Perusahaan", href: "/admin/company", icon: Building2 },
    { label: "Pengaturan Global", href: "/admin/settings", icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-[#0f131c] text-slate-100 flex flex-col md:flex-row font-sans">
      {/* Mobile Topbar */}
      <header className="md:hidden flex items-center justify-between px-4 py-3 bg-[#16161e] border-b border-[#262936] sticky top-0 z-50">
        <div className="flex items-center gap-2.5">
          <div className="relative w-8 h-8 rounded-lg overflow-hidden bg-black/80 border border-white/10 flex items-center justify-center p-1 shadow-md">
            <Image
              src="/images/logo-ad.png"
              alt="Astrum Deus Logo"
              width={32}
              height={32}
              className="w-full h-full object-contain"
              unoptimized
            />
          </div>
          <div>
            <span className="font-bold text-sm tracking-wide text-white leading-tight block">ADRE CMS</span>
            <span className="text-[10px] text-slate-400 font-medium block">Astrum Deus</span>
          </div>
        </div>
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-[#1f222e]"
        >
          {mobileOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </header>

      {/* Sidebar Desktop */}
      <aside
        className={`fixed md:sticky top-0 h-screen z-40 w-64 bg-[#16161e] backdrop-blur-md border-r border-[#262936] flex flex-col transition-transform duration-200 ${
          mobileOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
      >
        {/* Brand Header */}
        <div className="p-5 border-b border-[#262936] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative w-10 h-10 rounded-xl overflow-hidden bg-black/80 border border-white/10 flex items-center justify-center p-1.5 shadow-lg">
              <Image
                src="/images/logo-ad.png"
                alt="Astrum Deus Logo"
                width={40}
                height={40}
                className="w-full h-full object-contain"
                unoptimized
              />
            </div>
            <div>
              <h2 className="font-bold text-sm tracking-wide text-white leading-tight">ADRE CMS</h2>
              <p className="text-[11px] text-slate-400 font-medium">Astrum Deus Esports</p>
            </div>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive =
              item.href === "/admin"
                ? pathname === "/admin"
                : pathname.startsWith(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm transition-all ${
                  isActive
                    ? "bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 text-slate-950 font-bold shadow-lg shadow-amber-500/25"
                    : "text-slate-400 hover:text-amber-300 hover:bg-[#1f222e]"
                }`}
              >
                <Icon size={18} className={isActive ? "text-slate-950" : "text-slate-400"} />
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Footer Actions */}
        <div className="p-3 border-t border-[#262936] space-y-1">
          <Link
            href="/"
            target="_blank"
            className="flex items-center justify-between px-3.5 py-2 rounded-lg text-xs text-slate-400 hover:text-amber-400 hover:bg-[#1f222e] transition"
          >
            <span className="flex items-center gap-2">
              <ExternalLink size={14} /> Lihat Website Publik
            </span>
          </Link>

          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs text-rose-400 hover:text-rose-300 hover:bg-rose-950/30 transition text-left cursor-pointer"
          >
            <LogOut size={14} /> Keluar (Logout)
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <main className="flex-1 p-4 md:p-8 max-w-7xl w-full mx-auto">{children}</main>
      </div>
    </div>
  );
}
