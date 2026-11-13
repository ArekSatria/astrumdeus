"use client";

import React, { useState, useEffect } from "react";
import {
  Settings,
  Save,
  CheckCircle,
  AlertCircle,
  Globe,
  Share2,
  Upload,
  Trash2,
  Image as ImageIcon,
} from "lucide-react";

export default function AdminSettingsPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; message: string } | null>(null);

  const [uploadingHero, setUploadingHero] = useState(false);

  const [formData, setFormData] = useState({
    siteName: "",
    tagline: "",
    logoUrl: "",
    heroImageUrl: "",
    socials: {
      instagram: "",
      youtube: "",
      tiktok: "",
      facebook: "",
      x: "",
    },
  });

  const handleHeroPhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      alert("Ukuran file foto maksimal 5MB.");
      return;
    }

    setUploadingHero(true);
    try {
      const data = new FormData();
      data.append("file", file);

      const res = await fetch("/api/v1/upload", {
        method: "POST",
        body: data,
      });

      const result = await res.json();
      if (!res.ok || !result.success) {
        throw new Error(result.message || "Gagal mengunggah foto.");
      }

      setFormData((prev) => ({ ...prev, heroImageUrl: result.url }));
    } catch (err: any) {
      alert(err.message || "Gagal mengunggah foto.");
    } finally {
      setUploadingHero(false);
    }
  };

  const fetchSettings = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/v1/settings");
      const data = await res.json();
      if (data.success && data.data) {
        const s = data.data;
        setFormData({
          siteName: s.siteName || "",
          tagline: s.tagline || "",
          logoUrl: s.logoUrl || "",
          heroImageUrl: s.heroImageUrl || "",
          socials: {
            instagram: s.socials?.instagram || "",
            youtube: s.socials?.youtube || "",
            tiktok: s.socials?.tiktok || "",
            facebook: s.socials?.facebook || "",
            x: s.socials?.x || "",
          },
        });
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setFeedback(null);

    try {
      const res = await fetch("/api/v1/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const result = await res.json();
      if (!res.ok || !result.success) {
        throw new Error(result.message || "Gagal menyimpan pengaturan.");
      }

      setFeedback({ type: "success", message: "Pengaturan global berhasil disimpan!" });
    } catch (err: any) {
      setFeedback({ type: "error", message: err.message });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white flex items-center gap-2">
          <Settings className="text-amber-400" size={24} />
          Pengaturan Global Website
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          Atur nama situs, slogan utama (tagline), logo, serta link sosial media resmi organisasi.
        </p>
      </div>

      {feedback && (
        <div
          className={`p-4 rounded-xl flex items-center gap-3 text-sm font-medium ${
            feedback.type === "success"
              ? "bg-emerald-950/50 border border-emerald-800 text-emerald-300"
              : "bg-rose-950/50 border border-rose-800 text-rose-300"
          }`}
        >
          {feedback.type === "success" ? <CheckCircle size={18} /> : <AlertCircle size={18} />}
          <span>{feedback.message}</span>
        </div>
      )}

      {loading ? (
        <div className="p-8 text-center text-slate-500 bg-[#16161e] border border-[#262936] rounded-2xl">
          Memuat pengaturan...
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Brand Info */}
          <div className="p-6 rounded-2xl bg-[#16161e] border border-[#262936] space-y-4">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <Globe size={18} className="text-amber-400" /> Identitas Dasar
            </h2>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Nama Situs / Tim</label>
              <input
                type="text"
                required
                value={formData.siteName}
                onChange={(e) => setFormData({ ...formData, siteName: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-[#0f131c] border border-[#262936] rounded-xl text-sm text-white focus:outline-none focus:border-amber-400 font-bold"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Tagline Utama</label>
              <input
                type="text"
                required
                value={formData.tagline}
                onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-[#0f131c] border border-[#262936] rounded-xl text-sm text-white focus:outline-none focus:border-amber-400"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">URL Logo (Opsional)</label>
              <input
                type="text"
                value={formData.logoUrl}
                onChange={(e) => setFormData({ ...formData, logoUrl: e.target.value })}
                placeholder="https://... atau /logo.png"
                className="w-full px-3.5 py-2.5 bg-[#0f131c] border border-[#262936] rounded-xl text-sm text-white focus:outline-none focus:border-amber-400"
              />
            </div>
          </div>

          {/* Section: Foto Utama Beranda (Foto Bersama Skuad AD) */}
          <div className="p-6 rounded-2xl bg-[#16161e] border border-[#262936] space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h2 className="text-base font-bold text-white flex items-center gap-2">
                  <ImageIcon size={18} className="text-amber-400" /> Foto Utama Beranda (Foto Bersama Skuad AD)
                </h2>
                <p className="text-xs text-slate-400 mt-1">
                  Foto banner tim utama yang tampil di beranda website. Jika dihapus, otomatis kembali ke ilustrasi default.
                </p>
              </div>
              <div>
                {formData.heroImageUrl ? (
                  <span className="px-2.5 py-1 rounded-md bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold">
                    Foto Kustom Aktif
                  </span>
                ) : (
                  <span className="px-2.5 py-1 rounded-md bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-semibold">
                    Ilustrasi Default
                  </span>
                )}
              </div>
            </div>

            {/* Preview Box */}
            <div className="relative aspect-[21/9] max-h-72 w-full rounded-2xl overflow-hidden border border-[#262936] bg-[#0f131c] flex items-center justify-center">
              <img
                src={formData.heroImageUrl || "/images/team-hero.svg"}
                alt="Foto Bersama Skuad AD"
                className="w-full h-full object-cover object-center"
              />
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-3 pt-1">
              <label className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 hover:from-amber-300 hover:to-amber-500 text-slate-950 text-xs font-bold transition cursor-pointer shadow-lg shadow-amber-500/20 transform -skew-x-12 hover:scale-[1.02] active:scale-[0.98]">
                <span className="inline-flex items-center gap-2 transform skew-x-12 font-bold italic">
                  <Upload size={15} />
                  {uploadingHero
                    ? "Mengunggah Foto..."
                    : formData.heroImageUrl
                    ? "Ganti Foto Bersama"
                    : "Unggah Foto Bersama AD"}
                </span>
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  disabled={uploadingHero}
                  onChange={handleHeroPhotoUpload}
                />
              </label>

              {formData.heroImageUrl && (
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, heroImageUrl: "" })}
                  className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#1f222e] hover:bg-rose-950/60 hover:text-rose-400 border border-[#262936] text-xs font-semibold text-slate-300 transition cursor-pointer transform -skew-x-12 hover:scale-[1.02] active:scale-[0.98]"
                >
                  <span className="inline-flex items-center gap-1.5 transform skew-x-12">
                    <Trash2 size={14} /> Hapus & Kembalikan ke Awal
                  </span>
                </button>
              )}
            </div>
          </div>

          {/* Social Media Links */}
          <div className="p-6 rounded-2xl bg-[#16161e] border border-[#262936] space-y-4">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <Share2 size={18} className="text-amber-400" /> Tautan Media Sosial Resmi
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Instagram URL</label>
                <input
                  type="text"
                  value={formData.socials.instagram}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      socials: { ...formData.socials, instagram: e.target.value },
                    })
                  }
                  placeholder="https://instagram.com/adregemilangjaya"
                  className="w-full px-3.5 py-2 bg-[#0f131c] border border-[#262936] rounded-xl text-sm text-white focus:outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">YouTube URL</label>
                <input
                  type="text"
                  value={formData.socials.youtube}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      socials: { ...formData.socials, youtube: e.target.value },
                    })
                  }
                  placeholder="https://youtube.com/@adregemilangjaya"
                  className="w-full px-3.5 py-2 bg-[#0f131c] border border-[#262936] rounded-xl text-sm text-white focus:outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">TikTok URL</label>
                <input
                  type="text"
                  value={formData.socials.tiktok}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      socials: { ...formData.socials, tiktok: e.target.value },
                    })
                  }
                  placeholder="https://tiktok.com/@adregemilangjaya"
                  className="w-full px-3.5 py-2 bg-[#0f131c] border border-[#262936] rounded-xl text-sm text-white focus:outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">X (Twitter) URL</label>
                <input
                  type="text"
                  value={formData.socials.x}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      socials: { ...formData.socials, x: e.target.value },
                    })
                  }
                  placeholder="https://x.com/adregemilangjaya"
                  className="w-full px-3.5 py-2 bg-[#0f131c] border border-[#262936] rounded-xl text-sm text-white focus:outline-none focus:border-amber-400"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center gap-2 px-7 py-3 rounded-xl bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 hover:from-amber-300 hover:to-amber-500 text-slate-950 font-bold text-sm shadow-lg shadow-amber-500/20 transition disabled:opacity-50 cursor-pointer transform -skew-x-12 hover:scale-[1.02] active:scale-[0.98]"
            >
              <span className="inline-flex items-center gap-2 transform skew-x-12 font-bold italic tracking-wide">
                <Save size={16} />
                {saving ? "Menyimpan..." : "Simpan Pengaturan"}
              </span>
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
