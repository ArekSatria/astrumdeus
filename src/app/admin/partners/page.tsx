"use client";

import React, { useState, useEffect } from "react";
import {
  Handshake,
  Plus,
  Pencil,
  Trash2,
  ExternalLink,
  CheckCircle,
  AlertCircle,
  X,
  Upload,
} from "lucide-react";

interface PartnerItem {
  id: string;
  name: string;
  tier: "PRINCIPAL" | "OFFICIAL" | "SUPPLIER";
  logoUrl: string | null;
  description: string;
  websiteUrl: string | null;
  displayOrder: number;
}

export default function AdminPartnersPage() {
  const [partners, setPartners] = useState<PartnerItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingPartner, setEditingPartner] = useState<PartnerItem | null>(null);

  const [formData, setFormData] = useState({
    name: "",
    tier: "OFFICIAL" as "PRINCIPAL" | "OFFICIAL" | "SUPPLIER",
    description: "",
    websiteUrl: "",
    logoUrl: "",
    displayOrder: 1,
  });

  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; message: string } | null>(null);
  const [uploadingLogo, setUploadingLogo] = useState(false);

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      alert("Ukuran file logo maksimal 5MB.");
      return;
    }

    setUploadingLogo(true);
    try {
      const data = new FormData();
      data.append("file", file);
      data.append("folder", "partners");

      const res = await fetch("/api/v1/upload", {
        method: "POST",
        body: data,
      });

      const result = await res.json();
      if (!res.ok || !result.success) {
        throw new Error(result.message || "Gagal mengunggah logo.");
      }

      setFormData((prev) => ({ ...prev, logoUrl: result.url }));
    } catch (err: any) {
      alert(err.message || "Gagal mengunggah logo.");
    } finally {
      setUploadingLogo(false);
    }
  };

  const fetchPartners = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/v1/partners");
      const data = await res.json();
      if (data.success && data.data) {
        setPartners(data.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPartners();
  }, []);

  const openAddModal = () => {
    setEditingPartner(null);
    setFormData({
      name: "",
      tier: "OFFICIAL",
      description: "",
      websiteUrl: "",
      logoUrl: "",
      displayOrder: partners.length + 1,
    });
    setModalOpen(true);
    setFeedback(null);
  };

  const openEditModal = (p: PartnerItem) => {
    setEditingPartner(p);
    setFormData({
      name: p.name,
      tier: p.tier,
      description: p.description || "",
      websiteUrl: p.websiteUrl || "",
      logoUrl: p.logoUrl || "",
      displayOrder: p.displayOrder,
    });
    setModalOpen(true);
    setFeedback(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setFeedback(null);

    try {
      const url = editingPartner
        ? `/api/v1/partners/${editingPartner.id}`
        : "/api/v1/partners";
      const method = editingPartner ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const result = await res.json();
      if (!res.ok || !result.success) {
        throw new Error(result.message || "Gagal menyimpan mitra.");
      }

      setFeedback({ type: "success", message: "Mitra berhasil disimpan!" });
      setTimeout(() => {
        setModalOpen(false);
        fetchPartners();
      }, 1000);
    } catch (err: any) {
      setFeedback({ type: "error", message: err.message });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Hapus mitra sponsor ini?")) return;
    try {
      const res = await fetch(`/api/v1/partners/${id}`, { method: "DELETE" });
      const result = await res.json();
      if (result.success) {
        fetchPartners();
      } else {
        alert(result.message || "Gagal menghapus.");
      }
    } catch (err) {
      console.error(err);
    }
  };

  const tierBadge = (tier: string) => {
    switch (tier) {
      case "PRINCIPAL":
        return "bg-amber-950/50 text-amber-400 border-amber-800/60";
      case "OFFICIAL":
        return "bg-blue-950/50 text-blue-400 border-blue-800/60";
      default:
        return "bg-slate-800 text-slate-300 border-slate-700";
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <Handshake className="text-emerald-500" size={24} />
            Kelola Mitra & Sponsor
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Atur kemitraan komersial, tingkatan sponsor (Tier), dan tautan website resmi.
          </p>
        </div>
        <button
          onClick={openAddModal}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 hover:from-amber-300 hover:to-amber-500 text-slate-950 font-bold text-xs sm:text-sm shadow-lg shadow-amber-500/20 transition self-start sm:self-auto cursor-pointer transform -skew-x-12 hover:scale-[1.02] active:scale-[0.98]"
        >
          <span className="inline-flex items-center gap-2 transform skew-x-12 font-bold italic tracking-wide">
            <Plus size={16} /> Tambah Mitra Baru
          </span>
        </button>
      </div>

      {/* Partners Table */}
      <div className="bg-[#16161e] border border-[#262936] rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-300">
            <thead className="bg-[#0f131c]/80 text-xs uppercase font-semibold text-slate-400 border-b border-[#262936]">
              <tr>
                <th className="px-5 py-4">Nama Mitra</th>
                <th className="px-5 py-4">Kategori Tier</th>
                <th className="px-5 py-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#262936]">
              {loading ? (
                <tr>
                  <td colSpan={3} className="px-5 py-8 text-center text-slate-500">
                    Memuat data mitra...
                  </td>
                </tr>
              ) : partners.length === 0 ? (
                <tr>
                  <td colSpan={3} className="px-5 py-8 text-center text-slate-500">
                    Belum ada mitra sponsor.
                  </td>
                </tr>
              ) : (
                partners.map((item) => (
                  <tr key={item.id} className="hover:bg-[#1f222e]/60 transition">
                    <td className="px-5 py-4">
                      <div className="font-semibold text-white">{item.name}</div>
                      {item.websiteUrl && (
                        <a
                          href={item.websiteUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="text-xs text-emerald-400 hover:underline inline-flex items-center gap-1 mt-0.5"
                        >
                          {item.websiteUrl} <ExternalLink size={11} />
                        </a>
                      )}
                    </td>
                    <td className="px-5 py-4">
                      <span className={`px-2.5 py-0.5 rounded text-xs font-semibold border ${tierBadge(item.tier)}`}>
                        {item.tier}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-right space-x-2">
                      <button
                        onClick={() => openEditModal(item)}
                        className="inline-flex items-center justify-center p-2 rounded-lg bg-amber-500/10 hover:bg-amber-400 text-amber-400 hover:text-slate-950 border border-amber-500/30 transform -skew-x-12 transition-all cursor-pointer shadow-sm hover:scale-105 active:scale-95"
                        title="Edit Mitra"
                      >
                        <span className="transform skew-x-12"><Pencil size={14} /></span>
                      </button>
                      <button
                        onClick={() => handleDelete(item.id)}
                        className="inline-flex items-center justify-center p-2 rounded-lg bg-rose-500/10 hover:bg-rose-500 text-rose-400 hover:text-white border border-rose-500/30 transform -skew-x-12 transition-all cursor-pointer shadow-sm hover:scale-105 active:scale-95"
                        title="Hapus Mitra"
                      >
                        <span className="transform skew-x-12"><Trash2 size={14} /></span>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Add / Edit */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm overflow-y-auto">
          <div className="bg-[#16161e] border border-[#262936] rounded-2xl w-full max-w-md max-h-[90vh] flex flex-col shadow-2xl overflow-hidden my-auto">
            <div className="px-6 py-4 border-b border-[#262936] flex items-center justify-between">
              <h2 className="font-bold text-lg text-white">
                {editingPartner ? "Edit Mitra Sponsor" : "Tambah Mitra Sponsor"}
              </h2>
              <button
                onClick={() => setModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-[#1f222e]"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto flex-1">
              {feedback && (
                <div
                  className={`p-3 rounded-xl flex items-center gap-2 text-xs font-medium ${
                    feedback.type === "success"
                      ? "bg-emerald-950/50 border border-emerald-800 text-emerald-300"
                      : "bg-rose-950/50 border border-rose-800 text-rose-300"
                  }`}
                >
                  {feedback.type === "success" ? <CheckCircle size={16} /> : <AlertCircle size={16} />}
                  <span>{feedback.message}</span>
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Nama Brand / Perusahaan</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Contoh: Asus ROG / RedBull"
                  className="w-full px-3.5 py-2 bg-[#0f131c] border border-[#262936] rounded-xl text-sm text-white focus:outline-none focus:border-amber-400 font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Kategori Tier Sponsor</label>
                <select
                  value={formData.tier}
                  onChange={(e) => setFormData({ ...formData, tier: e.target.value as any })}
                  className="w-full px-3.5 py-2 bg-[#0f131c] border border-[#262936] rounded-xl text-sm text-white focus:outline-none focus:border-amber-400 font-semibold"
                >
                  <option value="PRINCIPAL">PRINCIPAL (Sponsor Utama)</option>
                  <option value="OFFICIAL">OFFICIAL (Sponsor Resmi)</option>
                  <option value="SUPPLIER">SUPPLIER (Penyedia Perlengkapan)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Deskripsi Kemitraan</label>
                <textarea
                  rows={3}
                  required
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Bentuk dukungan atau peran mitra dalam tim..."
                  className="w-full px-3.5 py-2 bg-[#0f131c] border border-[#262936] rounded-xl text-sm text-white focus:outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Website URL Mitra</label>
                <input
                  type="text"
                  value={formData.websiteUrl}
                  onChange={(e) => setFormData({ ...formData, websiteUrl: e.target.value })}
                  placeholder="https://..."
                  className="w-full px-3.5 py-2 bg-[#0f131c] border border-[#262936] rounded-xl text-sm text-white focus:outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Urutan Tampil</label>
                <input
                  type="number"
                  value={formData.displayOrder}
                  onChange={(e) => setFormData({ ...formData, displayOrder: parseInt(e.target.value) || 1 })}
                  className="w-full px-3.5 py-2 bg-[#0f131c] border border-[#262936] rounded-xl text-sm text-white focus:outline-none focus:border-amber-400"
                />
              </div>

              {/* Upload Logo Mitra */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Logo Brand / Mitra
                </label>

                {formData.logoUrl ? (
                  <div className="flex items-center gap-4 p-3.5 bg-[#0f131c] border border-[#262936] rounded-xl">
                    <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-[#16161e] border border-[#262936] shrink-0 p-1 flex items-center justify-center">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={formData.logoUrl}
                        alt="Preview Logo"
                        className="w-full h-full object-contain"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium text-white truncate font-mono">
                        {formData.logoUrl}
                      </p>
                      <p className="text-[11px] text-emerald-400 mt-1 flex items-center gap-1">
                        <CheckCircle size={12} /> Logo siap ditampilkan di kartu web
                      </p>
                      <div className="flex items-center gap-3 mt-2">
                        <label className="text-xs text-amber-400 hover:text-amber-300 font-medium transition cursor-pointer">
                          Ganti Logo
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={handleLogoUpload}
                            disabled={uploadingLogo}
                          />
                        </label>
                        <span className="text-slate-600">•</span>
                        <button
                          type="button"
                          onClick={() => setFormData({ ...formData, logoUrl: "" })}
                          className="text-xs text-rose-400 hover:text-rose-300 font-medium transition cursor-pointer"
                        >
                          Hapus Logo
                        </button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <label className="flex flex-col items-center justify-center border-2 border-dashed border-[#262936] hover:border-amber-400/60 bg-[#0f131c]/60 hover:bg-[#0f131c] rounded-xl p-5 cursor-pointer transition group">
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleLogoUpload}
                      disabled={uploadingLogo}
                    />
                    <div className="p-3 rounded-full bg-[#16161e] text-slate-400 group-hover:text-amber-400 transition mb-2">
                      <Upload size={20} />
                    </div>
                    <span className="text-xs font-semibold text-white group-hover:text-amber-400 transition">
                      {uploadingLogo ? "Sedang Mengunggah Logo..." : "Klik untuk Upload File Logo Mitra"}
                    </span>
                    <span className="text-[11px] text-slate-500 mt-1 text-center">
                      Format PNG, JPG, WEBP, atau SVG (Rekomendasi rasio persegi 1:1)
                    </span>
                  </label>
                )}
              </div>

              <div className="pt-4 border-t border-[#262936] flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white hover:bg-[#1f222e] transition transform -skew-x-12"
                >
                  <span className="transform skew-x-12 inline-block">Batal</span>
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 hover:from-amber-300 hover:to-amber-500 text-slate-950 text-xs font-bold shadow-lg shadow-amber-500/20 transition disabled:opacity-50 cursor-pointer transform -skew-x-12 hover:scale-[1.02] active:scale-[0.98]"
                >
                  <span className="inline-flex items-center gap-1.5 transform skew-x-12 font-bold italic tracking-wide">
                    {saving ? "Menyimpan..." : "Simpan Mitra"}
                  </span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
