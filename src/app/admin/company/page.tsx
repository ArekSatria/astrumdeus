"use client";

import React, { useState, useEffect } from "react";
import {
  Building2,
  Save,
  CheckCircle,
  AlertCircle,
  Mail,
  MapPin,
  Target,
  FileText,
  Milestone,
  Plus,
  Trash2,
} from "lucide-react";

interface MilestoneItem {
  year: string;
  title: string;
  description: string;
}

interface MissionItem {
  title: string;
  description: string;
}

export default function AdminCompanyPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; message: string } | null>(null);

  const [formData, setFormData] = useState({
    companyName: "",
    aboutHtml: "",
    vision: "",
    officeAddress: "",
    businessEmail: "",
    partnershipEmail: "",
    mapEmbedUrl: "",
  });

  const [missions, setMissions] = useState<MissionItem[]>([]);
  const [milestones, setMilestones] = useState<MilestoneItem[]>([]);

  const htmlToPlainText = (html: string) => {
    if (!html) return "";
    return html
      .replace(/<\/p>\s*<p[^>]*>/gi, "\n\n")
      .replace(/<br\s*\/?>/gi, "\n")
      .replace(/<p[^>]*>/gi, "")
      .replace(/<\/p>/gi, "")
      .replace(/<[^>]+>/g, "")
      .trim();
  };

  const plainTextToHtml = (text: string) => {
    if (!text) return "";
    if (/<[a-z][\s\S]*>/i.test(text)) return text;
    return text
      .split(/\n\s*\n/)
      .map((p) => p.trim())
      .filter(Boolean)
      .map((p) => `<p>${p.replace(/\n/g, "<br/>")}</p>`)
      .join("\n");
  };

  const fetchCompanyData = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/v1/company");
      const data = await res.json();
      if (data.success && data.data) {
        const c = data.data;
        setFormData({
          companyName: c.companyName || "",
          aboutHtml: htmlToPlainText(c.aboutHtml || ""),
          vision: c.vision || "",
          officeAddress: c.contact?.officeAddress || "",
          businessEmail: c.contact?.businessEmail || "",
          partnershipEmail: c.contact?.partnershipEmail || "",
          mapEmbedUrl: c.contact?.mapEmbedUrl || "",
        });

        if (Array.isArray(c.missions)) {
          setMissions(
            c.missions.map((m: any, idx: number) => {
              if (typeof m === "object" && m !== null) {
                return {
                  title: m.title || m.heading || `Misi ${idx + 1}`,
                  description: m.description || m.desc || "",
                };
              }
              return {
                title: `Misi ${idx + 1}`,
                description: typeof m === "string" ? m : "",
              };
            })
          );
        }

        if (Array.isArray(c.milestones)) {
          setMilestones(
            c.milestones.map((m: any) => ({
              year: m.year?.toString() || "",
              title:
                typeof m.title === "object" && m.title !== null
                  ? m.title.id || m.title.en || ""
                  : m.title || "",
              description:
                typeof m.description === "object" && m.description !== null
                  ? m.description.id || m.description.en || ""
                  : m.description || "",
            }))
          );
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCompanyData();
  }, []);

  const handleAddMission = () => {
    setMissions((prev) => [
      ...prev,
      {
        title: `Misi ${prev.length + 1}`,
        description: "",
      },
    ]);
  };

  const handleUpdateMission = (
    index: number,
    field: keyof MissionItem,
    value: string
  ) => {
    setMissions((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
  };

  const handleRemoveMission = (index: number) => {
    setMissions((prev) => prev.filter((_, idx) => idx !== index));
  };

  const handleAddMilestone = () => {
    setMilestones((prev) => [
      ...prev,
      {
        year: new Date().getFullYear().toString(),
        title: "",
        description: "",
      },
    ]);
  };

  const handleUpdateMilestone = (
    index: number,
    field: keyof MilestoneItem,
    value: string
  ) => {
    setMilestones((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
  };

  const handleRemoveMilestone = (index: number) => {
    setMilestones((prev) => prev.filter((_, idx) => idx !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setFeedback(null);

    try {
      const payload = {
        companyName: formData.companyName,
        aboutHtml: plainTextToHtml(formData.aboutHtml),
        vision: formData.vision,
        missions: missions
          .filter((m) => m.title.trim().length > 0 || m.description.trim().length > 0)
          .map((m) => ({
            title: m.title.trim(),
            description: m.description.trim(),
          })),
        milestones: milestones
          .filter((m) => m.title.trim().length > 0 || m.year.trim().length > 0)
          .map((m) => ({
            year: m.year.trim(),
            title: m.title.trim(),
            description: m.description.trim(),
          })),
        contact: {
          officeAddress: formData.officeAddress,
          businessEmail: formData.businessEmail,
          partnershipEmail: formData.partnershipEmail,
          mapEmbedUrl: formData.mapEmbedUrl || null,
        },
      };

      const res = await fetch("/api/v1/company", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const result = await res.json();
      if (!res.ok || !result.success) {
        throw new Error(result.message || "Gagal menyimpan profil perusahaan.");
      }

      setFeedback({ type: "success", message: "Profil korporasi berhasil diperbarui!" });
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
          <Building2 className="text-blue-500" size={24} />
          Kelola Profil Perusahaan & Kontak
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          Perbarui visi, misi, deskripsi profil tentang perusahaan, dan informasi kontak resmi.
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
          Memuat data profil...
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Section: Identitas & Tentang Kami */}
          <div className="p-6 rounded-2xl bg-[#16161e] border border-[#262936] space-y-4">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <FileText size={18} className="text-amber-400" /> Identitas & Cerita Perusahaan
            </h2>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Nama Perusahaan / Organisasi</label>
              <input
                type="text"
                required
                value={formData.companyName}
                onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-[#0f131c] border border-[#262936] rounded-xl text-sm text-white focus:outline-none focus:border-amber-400 font-medium"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Deskripsi Tentang Perusahaan</label>
              <textarea
                rows={6}
                required
                value={formData.aboutHtml}
                onChange={(e) => setFormData({ ...formData, aboutHtml: e.target.value })}
                placeholder="Tuliskan cerita dan profil lengkap perusahaan di sini... Tekan Enter untuk membuat paragraf baru."
                className="w-full px-3.5 py-2.5 bg-[#0f131c] border border-[#262936] rounded-xl text-sm text-white focus:outline-none focus:border-amber-400 leading-relaxed"
              />
            </div>
          </div>

          {/* Section: Visi & Misi */}
          <div className="p-6 rounded-2xl bg-[#16161e] border border-[#262936] space-y-5">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <Target size={18} className="text-amber-400" /> Visi & Misi Organisasi
            </h2>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Visi Perusahaan</label>
              <textarea
                rows={2}
                required
                placeholder="Visi jangka panjang organisasi..."
                value={formData.vision}
                onChange={(e) => setFormData({ ...formData, vision: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-[#0f131c] border border-[#262936] rounded-xl text-sm text-white focus:outline-none focus:border-amber-400"
              />
            </div>

            <div className="pt-2 border-t border-[#262936] space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <label className="block text-xs font-semibold text-slate-300">
                    Daftar Misi Organisasi
                  </label>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    Kelola poin-poin misi dengan judul dan deskripsinya masing-masing yang tampil di halaman Tentang Kami.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleAddMission}
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-amber-500/10 hover:bg-amber-400 text-amber-400 hover:text-slate-950 border border-amber-500/30 text-xs font-semibold transition cursor-pointer self-start sm:self-auto transform -skew-x-12 hover:scale-[1.02] active:scale-[0.98]"
                >
                  <span className="inline-flex items-center gap-1.5 transform skew-x-12 font-bold italic">
                    <Plus size={14} /> Tambah Misi
                  </span>
                </button>
              </div>

              {missions.length === 0 ? (
                <div className="p-5 rounded-xl border border-dashed border-[#262936] text-center text-xs text-slate-500">
                  Belum ada misi. Klik tombol "+ Tambah Misi" untuk menambahkan misi baru.
                </div>
              ) : (
                <div className="space-y-3 pt-1">
                  {missions.map((item, idx) => (
                    <div
                      key={idx}
                      className="p-4 rounded-xl bg-[#0f131c] border border-[#262936] space-y-3"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-center gap-2 flex-1 min-w-0">
                          <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-amber-500/15 font-mono text-xs font-bold text-amber-400">
                            {idx + 1}
                          </span>
                          <div className="flex-1 min-w-0">
                            <label className="block text-[11px] font-semibold text-slate-400 mb-1">
                              Judul Misi
                            </label>
                            <input
                              type="text"
                              required
                              placeholder={`Contoh: Pembinaan Tim Kompetitif / Misi ${idx + 1}`}
                              value={item.title}
                              onChange={(e) =>
                                handleUpdateMission(idx, "title", e.target.value)
                              }
                              className="w-full px-3 py-2 bg-[#1f222e] border border-[#262936] rounded-xl text-sm text-white font-medium focus:outline-none focus:border-amber-400"
                            />
                          </div>
                        </div>

                        <div className="pt-5 shrink-0">
                          <button
                            type="button"
                            onClick={() => handleRemoveMission(idx)}
                            className="inline-flex items-center justify-center p-2 rounded-lg bg-rose-500/10 hover:bg-rose-500 text-rose-400 hover:text-white border border-rose-500/30 transform -skew-x-12 transition-all cursor-pointer shadow-sm hover:scale-105 active:scale-95"
                            title="Hapus misi ini"
                          >
                            <span className="transform skew-x-12"><Trash2 size={15} /></span>
                          </button>
                        </div>
                      </div>

                      <div>
                        <label className="block text-[11px] font-semibold text-slate-400 mb-1">
                          Deskripsi Misi
                        </label>
                        <textarea
                          rows={2}
                          required
                          placeholder="Penjelasan detail dari langkah atau misi perusahaan..."
                          value={item.description}
                          onChange={(e) =>
                            handleUpdateMission(idx, "description", e.target.value)
                          }
                          className="w-full px-3 py-2 bg-[#1f222e] border border-[#262936] rounded-xl text-sm text-slate-200 focus:outline-none focus:border-amber-400 leading-relaxed"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Section: Perjalanan Kami (Tonggak Sejarah) */}
          <div className="p-6 rounded-2xl bg-[#16161e] border border-[#262936] space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h2 className="text-base font-bold text-white flex items-center gap-2">
                  <Milestone size={18} className="text-amber-400" /> Perjalanan Kami (Tonggak Sejarah)
                </h2>
                <p className="text-xs text-slate-400 mt-1">
                  Kelola tonggak sejarah dan linimasa pencapaian yang tampil pada halaman Tentang Kami.
                </p>
              </div>
              <button
                type="button"
                onClick={handleAddMilestone}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-amber-500/10 hover:bg-amber-400 text-amber-400 hover:text-slate-950 border border-amber-500/30 text-xs font-semibold transition cursor-pointer self-start sm:self-auto transform -skew-x-12 hover:scale-[1.02] active:scale-[0.98]"
              >
                <span className="inline-flex items-center gap-1.5 transform skew-x-12 font-bold italic">
                  <Plus size={14} /> Tambah Tonggak
                </span>
              </button>
            </div>

            {milestones.length === 0 ? (
              <div className="p-6 rounded-xl border border-dashed border-[#262936] text-center text-xs text-slate-500">
                Belum ada data tonggak sejarah. Klik tombol "+ Tambah Tonggak" untuk menambahkan.
              </div>
            ) : (
              <div className="space-y-4 pt-2">
                {milestones.map((item, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-xl bg-[#0f131c] border border-[#262936] space-y-3"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="w-28 sm:w-36 shrink-0">
                        <label className="block text-xs font-semibold text-slate-400 mb-1">
                          Tahun
                        </label>
                        <input
                          type="text"
                          required
                          placeholder="Contoh: 2026"
                          value={item.year}
                          onChange={(e) =>
                            handleUpdateMilestone(idx, "year", e.target.value)
                          }
                          className="w-full px-3 py-2 bg-[#1f222e] border border-[#262936] rounded-xl text-sm text-amber-400 font-mono font-bold focus:outline-none focus:border-amber-400"
                        />
                      </div>

                      <div className="flex-1 min-w-0">
                        <label className="block text-xs font-semibold text-slate-400 mb-1">
                          Judul Tonggak Sejarah
                        </label>
                        <input
                          type="text"
                          required
                          placeholder="Contoh: Juara 1 PMNC Indonesia 2026"
                          value={item.title}
                          onChange={(e) =>
                            handleUpdateMilestone(idx, "title", e.target.value)
                          }
                          className="w-full px-3 py-2 bg-[#1f222e] border border-[#262936] rounded-xl text-sm text-white focus:outline-none focus:border-amber-400 font-medium"
                        />
                      </div>

                      <div className="pt-6 shrink-0">
                        <button
                          type="button"
                          onClick={() => handleRemoveMilestone(idx)}
                          className="inline-flex items-center justify-center p-2 rounded-lg bg-rose-500/10 hover:bg-rose-500 text-rose-400 hover:text-white border border-rose-500/30 transform -skew-x-12 transition-all cursor-pointer shadow-sm hover:scale-105 active:scale-95"
                          title="Hapus tonggak ini"
                        >
                          <span className="transform skew-x-12"><Trash2 size={15} /></span>
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-400 mb-1">
                        Deskripsi Pencapaian / Penjelasan
                      </label>
                      <textarea
                        rows={2}
                        required
                        placeholder="Contoh: Meraih 148 poin di babak Grand Finals dan lolos ke liga..."
                        value={item.description}
                        onChange={(e) =>
                          handleUpdateMilestone(idx, "description", e.target.value)
                        }
                        className="w-full px-3 py-2 bg-[#1f222e] border border-[#262936] rounded-xl text-sm text-slate-200 focus:outline-none focus:border-amber-400 leading-relaxed"
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Section: Kontak & Kantor */}
          <div className="p-6 rounded-2xl bg-[#16161e] border border-[#262936] space-y-4">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <Mail size={18} className="text-amber-400" /> Informasi Kontak & Kantor
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Email Bisnis Resmi</label>
                <input
                  type="email"
                  required
                  value={formData.businessEmail}
                  onChange={(e) => setFormData({ ...formData, businessEmail: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-[#0f131c] border border-[#262936] rounded-xl text-sm text-white focus:outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Email Sponsorship & Kemitraan</label>
                <input
                  type="email"
                  required
                  value={formData.partnershipEmail}
                  onChange={(e) => setFormData({ ...formData, partnershipEmail: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-[#0f131c] border border-[#262936] rounded-xl text-sm text-white focus:outline-none focus:border-amber-400"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Alamat Kantor Lengkap</label>
              <input
                type="text"
                required
                value={formData.officeAddress}
                onChange={(e) => setFormData({ ...formData, officeAddress: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-[#0f131c] border border-[#262936] rounded-xl text-sm text-white focus:outline-none focus:border-amber-400"
              />
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
                {saving ? "Menyimpan Perubahan..." : "Simpan Profil Korporasi"}
              </span>
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
