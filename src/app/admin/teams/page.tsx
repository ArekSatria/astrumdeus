"use client";

import React, { useState, useEffect } from "react";
import {
  ShieldAlert,
  Plus,
  Pencil,
  Trash2,
  UserPlus,
  Users,
  CheckCircle,
  AlertCircle,
  X,
  Trophy,
  Upload,
} from "lucide-react";

interface RosterMember {
  id: string;
  ign: string;
  fullName: string;
  role: "IGL" | "RUSHER" | "SUPPORT" | "SCOUT" | "MANAGER" | "COACH" | "ANALYST";
  roleType: "PLAYER" | "STAFF";
  countryCode: string;
  photoUrl: string | null;
  joinDate?: string;
  displayOrder: number;
}

interface Achievement {
  id: string;
  title: string;
  placement: string;
  year: string;
}

interface DivisionDetail {
  id: string;
  name: string;
  slug: string;
  shortCode?: string;
  gameTitle?: string;
  tagline?: string;
  description?: string;
  isActive: boolean;
  roster: RosterMember[];
  achievements?: Achievement[];
}

export default function AdminTeamsPage() {
  const [divisions, setDivisions] = useState<{ name: string; slug: string }[]>([]);
  const [selectedSlug, setSelectedSlug] = useState<string>("pubg-mobile");
  const [divisionDetail, setDivisionDetail] = useState<DivisionDetail | null>(null);
  const [loading, setLoading] = useState(true);

  // Division Modal State
  const [divisionModalOpen, setDivisionModalOpen] = useState(false);
  const [editingDivision, setEditingDivision] = useState<DivisionDetail | null>(null);
  const [divisionForm, setDivisionForm] = useState({
    name: "",
    slug: "",
    shortCode: "",
    gameTitle: "",
    bannerImageUrl: "",
    tagline: "",
    description: "",
    isActive: true,
  });
  const [uploadingBanner, setUploadingBanner] = useState(false);

  // Roster Modal State
  const [rosterModalOpen, setRosterModalOpen] = useState(false);
  const [editingRoster, setEditingRoster] = useState<RosterMember | null>(null);
  const [rosterForm, setRosterForm] = useState({
    ign: "",
    fullName: "",
    role: "RUSHER" as "IGL" | "RUSHER" | "SUPPORT" | "SCOUT" | "MANAGER" | "COACH" | "ANALYST",
    roleType: "PLAYER" as "PLAYER" | "STAFF",
    countryCode: "ID",
    joinDate: "",
    photoUrl: "",
  });

  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; message: string } | null>(null);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);

  const handleBannerUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      alert("Ukuran file banner maksimal 5MB.");
      return;
    }

    setUploadingBanner(true);
    try {
      const data = new FormData();
      data.append("file", file);

      const res = await fetch("/api/v1/upload", {
        method: "POST",
        body: data,
      });

      const result = await res.json();
      if (!res.ok || !result.success) {
        throw new Error(result.message || "Gagal mengunggah banner.");
      }

      setDivisionForm((prev) => ({ ...prev, bannerImageUrl: result.url }));
    } catch (err: any) {
      alert(err.message || "Gagal mengunggah banner.");
    } finally {
      setUploadingBanner(false);
    }
  };

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      alert("Ukuran file foto maksimal 5MB.");
      return;
    }

    setUploadingPhoto(true);
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

      setRosterForm((prev) => ({ ...prev, photoUrl: result.url }));
    } catch (err: any) {
      alert(err.message || "Gagal mengunggah foto.");
    } finally {
      setUploadingPhoto(false);
    }
  };

  const fetchDivisions = async () => {
    try {
      const res = await fetch("/api/v1/teams");
      const data = await res.json();
      if (data.success && data.data) {
        setDivisions(data.data);
        if (data.data.length > 0) {
          setSelectedSlug((current) => {
            if (!current || !data.data.some((d: any) => d.slug === current)) {
              return data.data[0].slug;
            }
            return current;
          });
        } else {
          setSelectedSlug("");
          setDivisionDetail(null);
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  const fetchDivisionDetail = async (slug: string) => {
    if (!slug) {
      setDivisionDetail(null);
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`/api/v1/teams/${slug}`);
      const data = await res.json();
      if (data.success && data.data) {
        setDivisionDetail(data.data);
      } else {
        setDivisionDetail(null);
      }
    } catch (err) {
      console.error(err);
      setDivisionDetail(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDivisions();
  }, []);

  useEffect(() => {
    if (selectedSlug) {
      fetchDivisionDetail(selectedSlug);
    } else {
      setDivisionDetail(null);
      setLoading(false);
    }
  }, [selectedSlug]);

  const openAddDivision = () => {
    setEditingDivision(null);
    setDivisionForm({
      name: "",
      slug: "",
      shortCode: "",
      gameTitle: "",
      bannerImageUrl: "",
      tagline: "",
      description: "",
      isActive: true,
    });
    setDivisionModalOpen(true);
    setFeedback(null);
  };

  const openEditDivision = (div: DivisionDetail) => {
    setEditingDivision(div);
    setDivisionForm({
      name: div.name,
      slug: div.slug,
      shortCode: div.shortCode || "",
      gameTitle: div.gameTitle || div.name,
      bannerImageUrl: (div as any).bannerImageUrl || "",
      tagline: div.tagline || "",
      description: div.description || "",
      isActive: div.isActive ?? true,
    });
    setDivisionModalOpen(true);
    setFeedback(null);
  };

  const handleDivisionNameChange = (name: string) => {
    if (!editingDivision) {
      const generatedSlug = name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)+/g, "");
      const generatedShortCode = name
        .split(" ")
        .map((w) => w[0])
        .join("")
        .toUpperCase();
      setDivisionForm((prev) => ({
        ...prev,
        name,
        slug: generatedSlug,
        shortCode: prev.shortCode || generatedShortCode,
        gameTitle: prev.gameTitle || name,
      }));
    } else {
      setDivisionForm((prev) => ({ ...prev, name }));
    }
  };

  const handleDivisionSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setFeedback(null);

    try {
      const payload = {
        ...divisionForm,
        shortCode: divisionForm.shortCode || divisionForm.name.slice(0, 4).toUpperCase(),
        gameTitle: divisionForm.gameTitle || divisionForm.name,
      };

      const url = editingDivision
        ? `/api/v1/teams/${editingDivision.slug}`
        : `/api/v1/teams`;
      const method = editingDivision ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const result = await res.json();
      if (!res.ok || !result.success) {
        throw new Error(result.message || "Gagal menyimpan data divisi.");
      }

      setFeedback({ type: "success", message: "Data divisi berhasil disimpan!" });
      setDivisionModalOpen(false);
      await fetchDivisions();
      setSelectedSlug(divisionForm.slug);
    } catch (err: any) {
      setFeedback({ type: "error", message: err.message });
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteDivision = async (slug: string, name: string) => {
    if (
      !confirm(
        `Yakin ingin menghapus divisi "${name}"?\nSemua data atlet/roster dan prestasi divisi ini akan ikut terhapus.`
      )
    )
      return;

    try {
      const res = await fetch(`/api/v1/teams/${slug}`, { method: "DELETE" });
      const result = await res.json();
      if (!res.ok || !result.success) {
        throw new Error(result.message || "Gagal menghapus divisi.");
      }

      setFeedback({ type: "success", message: `Divisi ${name} berhasil dihapus.` });
      const updatedRes = await fetch("/api/v1/teams");
      const updatedData = await updatedRes.json();
      if (updatedData.success && updatedData.data) {
        setDivisions(updatedData.data);
        if (updatedData.data.length > 0) {
          setSelectedSlug(updatedData.data[0].slug);
        } else {
          setSelectedSlug("");
          setDivisionDetail(null);
        }
      }
    } catch (err: any) {
      setFeedback({ type: "error", message: err.message });
    }
  };

  const openAddRoster = () => {
    setEditingRoster(null);
    setRosterForm({
      ign: "",
      fullName: "",
      role: "RUSHER",
      roleType: "PLAYER",
      countryCode: "ID",
      joinDate: new Date().toISOString().slice(0, 10),
      photoUrl: "",
    });
    setRosterModalOpen(true);
    setFeedback(null);
  };

  const openEditRoster = (r: RosterMember) => {
    setEditingRoster(r);
    setRosterForm({
      ign: r.ign,
      fullName: r.fullName,
      role: r.role,
      roleType: r.roleType,
      countryCode: r.countryCode || "ID",
      joinDate: r.joinDate || "",
      photoUrl: r.photoUrl || "",
    });
    setRosterModalOpen(true);
    setFeedback(null);
  };

  const handleRoleChange = (role: typeof rosterForm.role) => {
    const isStaff = role === "MANAGER" || role === "COACH" || role === "ANALYST";
    setRosterForm((prev) => ({
      ...prev,
      role,
      roleType: isStaff ? "STAFF" : "PLAYER",
    }));
  };

  const handleRosterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setFeedback(null);

    try {
      const url = editingRoster
        ? `/api/v1/roster/${editingRoster.id}`
        : `/api/v1/teams/${selectedSlug}/roster`;
      const method = editingRoster ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(rosterForm),
      });

      const result = await res.json();
      if (!res.ok || !result.success) {
        throw new Error(result.message || "Gagal menyimpan data atlet.");
      }

      setFeedback({ type: "success", message: "Data roster berhasil disimpan!" });
      setTimeout(() => {
        setRosterModalOpen(false);
        fetchDivisionDetail(selectedSlug);
      }, 1000);
    } catch (err: any) {
      setFeedback({ type: "error", message: err.message });
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteRoster = async (id: string) => {
    if (!confirm("Hapus anggota ini dari roster?")) return;
    try {
      const res = await fetch(`/api/v1/roster/${id}`, { method: "DELETE" });
      const result = await res.json();
      if (result.success) {
        fetchDivisionDetail(selectedSlug);
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <ShieldAlert className="text-amber-400" /> Divisi & Roster Atlet
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Kelola skuad pemain inti, manajer, pelatih, analis, serta profil atlet per divisi game.
          </p>
        </div>
      </div>

      {/* Division Tabs & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#262936] pb-3">
        <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0 flex-1">
          {divisions.map((div) => (
            <button
              key={div.slug}
              onClick={() => setSelectedSlug(div.slug)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition cursor-pointer ${
                selectedSlug === div.slug
                  ? "bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 text-slate-950 font-bold shadow-md shadow-amber-500/20"
                  : "bg-[#16161e] border border-[#262936] text-slate-400 hover:text-white hover:bg-[#1f222e]"
              }`}
            >
              {div.name}
            </button>
          ))}

          <button
            onClick={openAddDivision}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#16161e] border border-[#262936] hover:border-amber-400/40 text-slate-300 hover:text-white text-xs font-semibold whitespace-nowrap transition cursor-pointer transform -skew-x-12 hover:scale-[1.02] active:scale-[0.98]"
          >
            <span className="inline-flex items-center gap-1.5 transform skew-x-12 font-bold italic">
              <Plus size={14} className="text-amber-400" /> Tambah Divisi
            </span>
          </button>
        </div>

        {divisionDetail && (
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => openEditDivision(divisionDetail)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#16161e] hover:bg-[#1f222e] text-slate-300 hover:text-white border border-[#262936] text-xs font-medium transition cursor-pointer transform -skew-x-12 hover:scale-105 active:scale-95"
            >
              <span className="inline-flex items-center gap-1.5 transform skew-x-12">
                <Pencil size={13} className="text-amber-400" /> Edit Divisi
              </span>
            </button>
            <button
              onClick={() => handleDeleteDivision(divisionDetail.slug, divisionDetail.name)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#16161e] hover:bg-rose-950/50 text-slate-400 hover:text-rose-400 border border-[#262936] text-xs font-medium transition cursor-pointer transform -skew-x-12 hover:scale-105 active:scale-95"
            >
              <span className="inline-flex items-center gap-1.5 transform skew-x-12">
                <Trash2 size={13} /> Hapus Divisi
              </span>
            </button>
          </div>
        )}
      </div>

      {/* Selected Division Header Card */}
      {divisionDetail && (
        <div className="relative overflow-hidden rounded-2xl border border-[#262936] bg-[#16161e] p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-md bg-amber-400/10 border border-amber-400/30 text-amber-300 font-mono text-xs font-bold uppercase">
                {divisionDetail.shortCode || "DIVISI"}
              </span>
              <span className="text-xs text-slate-400">
                Game: {divisionDetail.gameTitle || divisionDetail.name}
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-white uppercase tracking-tight">
              {divisionDetail.name}
            </h2>
            {divisionDetail.tagline && (
              <p className="text-xs text-slate-400">{divisionDetail.tagline}</p>
            )}
          </div>

          <div className="flex items-center gap-4">
            {(divisionDetail as any).bannerImageUrl && (
              <div className="w-32 aspect-[2/1] rounded-xl overflow-hidden border border-[#262936] bg-[#0f131c] shrink-0">
                <img
                  src={(divisionDetail as any).bannerImageUrl}
                  alt={divisionDetail.name}
                  className="w-full h-full object-cover"
                />
              </div>
            )}
          </div>
        </div>
      )}

      {/* Roster Section */}
      <div className="bg-[#16161e] border border-[#262936] rounded-2xl overflow-hidden shadow-xl p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Users size={18} className="text-amber-400" />
              Daftar Roster & Staf ({divisionDetail?.name || "Divisi"})
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Daftar pemain inti dan staf pelatih divisi ini.
            </p>
          </div>
          <button
            onClick={openAddRoster}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 hover:from-amber-300 hover:to-amber-500 text-slate-950 text-xs font-bold shadow-lg shadow-amber-500/20 transition cursor-pointer transform -skew-x-12 hover:scale-[1.02] active:scale-[0.98]"
          >
            <span className="inline-flex items-center gap-1.5 transform skew-x-12 font-bold italic tracking-wide">
              <UserPlus size={15} /> Tambah Anggota Roster
            </span>
          </button>
        </div>

        {/* Table of Members */}
        <div className="border border-[#262936] rounded-xl overflow-hidden">
          <table className="w-full text-left text-sm text-slate-300">
            <thead className="bg-[#0f131c]/90 text-xs uppercase font-semibold text-slate-400 border-b border-[#262936]">
              <tr>
                <th className="px-4 py-3">Pemain / Atlet</th>
                <th className="px-4 py-3">Role / Jabatan</th>
                <th className="px-4 py-3">Tipe</th>
                <th className="px-4 py-3 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#262936]">
              {loading ? (
                <tr>
                  <td colSpan={4} className="px-4 py-8 text-center text-slate-500">
                    Memuat data roster...
                  </td>
                </tr>
              ) : !divisionDetail?.roster || divisionDetail.roster.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-4 py-8 text-center text-slate-500">
                    Belum ada anggota roster di divisi ini.
                  </td>
                </tr>
              ) : (
                divisionDetail.roster.map((member) => (
                  <tr key={member.id} className="hover:bg-slate-800/40 transition">
                    <td className="px-4 py-3">
                      <div className="font-bold text-white">{member.ign}</div>
                      {member.fullName && <div className="text-xs text-slate-400 mt-0.5">{member.fullName}</div>}
                    </td>
                    <td className="px-4 py-3">
                      <span className="px-2.5 py-1 rounded-md text-xs font-semibold bg-slate-800 text-slate-200">
                        {member.role}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-xs">
                      {member.roleType === "PLAYER" ? (
                        <span className="text-emerald-400 font-medium">Atlet Inti</span>
                      ) : (
                        <span className="text-amber-400 font-medium">Ofisial / Staf</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-right space-x-2">
                      <button
                        onClick={() => openEditRoster(member)}
                        className="inline-flex items-center justify-center p-2 rounded-lg bg-amber-500/10 hover:bg-amber-400 text-amber-400 hover:text-slate-950 border border-amber-500/30 transform -skew-x-12 transition-all cursor-pointer shadow-sm hover:scale-105 active:scale-95"
                        title="Edit Anggota"
                      >
                        <span className="transform skew-x-12"><Pencil size={14} /></span>
                      </button>
                      <button
                        onClick={() => handleDeleteRoster(member.id)}
                        className="inline-flex items-center justify-center p-2 rounded-lg bg-rose-500/10 hover:bg-rose-500 text-rose-400 hover:text-white border border-rose-500/30 transform -skew-x-12 transition-all cursor-pointer shadow-sm hover:scale-105 active:scale-95"
                        title="Hapus Anggota"
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

      {/* Modal Add / Edit Roster */}
      {rosterModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm overflow-y-auto">
          <div className="bg-[#16161e] border border-[#262936] rounded-2xl w-full max-w-md max-h-[90vh] flex flex-col shadow-2xl overflow-hidden my-auto">
            <div className="px-6 py-4 border-b border-[#262936] flex items-center justify-between">
              <h2 className="font-bold text-lg text-white">
                {editingRoster ? "Edit Anggota Roster" : "Tambah Anggota Roster"}
              </h2>
              <button
                onClick={() => setRosterModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-[#1f222e]"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleRosterSubmit} className="p-6 space-y-4 overflow-y-auto flex-1">
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
                <label className="block text-xs font-semibold text-slate-300 mb-1">In-Game Name (IGN)</label>
                <input
                  type="text"
                  required
                  value={rosterForm.ign}
                  onChange={(e) => setRosterForm({ ...rosterForm, ign: e.target.value })}
                  placeholder="Contoh: ADRExValkyrie"
                  className="w-full px-3.5 py-2 bg-[#0f131c] border border-[#262936] rounded-xl text-sm text-white focus:outline-none focus:border-amber-400 font-bold"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Nama Lengkap</label>
                <input
                  type="text"
                  required
                  value={rosterForm.fullName}
                  onChange={(e) => setRosterForm({ ...rosterForm, fullName: e.target.value })}
                  placeholder="Contoh: M. Rizky Pratama"
                  className="w-full px-3.5 py-2 bg-[#0f131c] border border-[#262936] rounded-xl text-sm text-white focus:outline-none focus:border-amber-400"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Role / Posisi</label>
                  <select
                    value={rosterForm.role}
                    onChange={(e) => handleRoleChange(e.target.value as any)}
                    className="w-full px-3.5 py-2 bg-[#0f131c] border border-[#262936] rounded-xl text-sm text-white focus:outline-none focus:border-amber-400"
                  >
                    <optgroup label="Pemain Inti">
                      <option value="RUSHER">RUSHER</option>
                      <option value="IGL">IGL (Kapten)</option>
                      <option value="SUPPORT">SUPPORT</option>
                      <option value="SCOUT">SCOUT</option>
                    </optgroup>
                    <optgroup label="Staf / Ofisial">
                      <option value="MANAGER">MANAGER (Manajer Tim)</option>
                      <option value="COACH">COACH (Pelatih Kepala)</option>
                      <option value="ANALYST">ANALYST (Analis)</option>
                    </optgroup>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Tipe Anggota</label>
                  <select
                    value={rosterForm.roleType}
                    onChange={(e) => setRosterForm({ ...rosterForm, roleType: e.target.value as any })}
                    className="w-full px-3.5 py-2 bg-[#0f131c] border border-[#262936] rounded-xl text-sm text-white focus:outline-none focus:border-amber-400"
                  >
                    <option value="PLAYER">Atlet (Player)</option>
                    <option value="STAFF">Staf / Ofisial</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Kode Negara</label>
                  <input
                    type="text"
                    maxLength={3}
                    value={rosterForm.countryCode}
                    onChange={(e) => setRosterForm({ ...rosterForm, countryCode: e.target.value.toUpperCase() })}
                    placeholder="ID"
                    className="w-full px-3.5 py-2 bg-[#0f131c] border border-[#262936] rounded-xl text-sm text-white font-mono focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Tanggal Bergabung (Opsional)</label>
                  <input
                    type="date"
                    value={rosterForm.joinDate}
                    onChange={(e) => setRosterForm({ ...rosterForm, joinDate: e.target.value })}
                    className="w-full px-3.5 py-2 bg-[#0f131c] border border-[#262936] rounded-xl text-sm text-white focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>

              {/* Upload Foto Atlet */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Foto Atlet / Personil
                </label>

                {rosterForm.photoUrl ? (
                  <div className="flex items-center gap-4 p-3.5 bg-[#0f131c] border border-[#262936] rounded-xl">
                    <div className="relative w-16 h-20 rounded-lg overflow-hidden bg-[#16161e] border border-[#262936] shrink-0">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={rosterForm.photoUrl}
                        alt="Preview"
                        className="w-full h-full object-cover object-top"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium text-white truncate font-mono">
                        {rosterForm.photoUrl}
                      </p>
                      <p className="text-[11px] text-emerald-400 mt-1 flex items-center gap-1">
                        <CheckCircle size={12} /> Foto siap ditampilkan di kartu web
                      </p>
                      <div className="flex items-center gap-3 mt-2">
                        <label className="text-xs text-amber-400 hover:text-amber-300 font-medium transition cursor-pointer">
                          Ganti Foto
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={handlePhotoUpload}
                            disabled={uploadingPhoto}
                          />
                        </label>
                        <span className="text-slate-600">•</span>
                        <button
                          type="button"
                          onClick={() => setRosterForm({ ...rosterForm, photoUrl: "" })}
                          className="text-xs text-rose-400 hover:text-rose-300 font-medium transition cursor-pointer"
                        >
                          Hapus Foto
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
                      onChange={handlePhotoUpload}
                      disabled={uploadingPhoto}
                    />
                    <div className="p-3 rounded-full bg-[#16161e] text-slate-400 group-hover:text-amber-400 transition mb-2">
                      <Upload size={20} />
                    </div>
                    <span className="text-xs font-semibold text-white group-hover:text-amber-400 transition">
                      {uploadingPhoto ? "Sedang Mengunggah Foto..." : "Klik untuk Upload File Foto Atlet"}
                    </span>
                    <span className="text-[11px] text-slate-500 mt-1 text-center">
                      PNG, JPG, atau WEBP • Ukuran otomatis disesuaikan ke rasio kartu pemain (4:5)
                    </span>
                  </label>
                )}
              </div>

              <div className="pt-4 border-t border-[#262936] flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setRosterModalOpen(false)}
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
                    {saving ? "Menyimpan..." : editingRoster ? "Perbarui Atlet" : "Simpan Anggota"}
                  </span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Division Modal */}
      {divisionModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="relative w-full max-w-lg bg-[#16161e] border border-[#262936] rounded-2xl shadow-2xl overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-[#262936]">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <ShieldAlert className="text-amber-400" size={18} />
                {editingDivision ? "Edit Informasi Divisi" : "Tambah Divisi Game Baru"}
              </h3>
              <button
                onClick={() => setDivisionModalOpen(false)}
                className="p-1 text-slate-400 hover:text-white rounded-lg hover:bg-[#1f222e] transition"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleDivisionSubmit} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Nama Divisi
                </label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Mobile Legends"
                  value={divisionForm.name}
                  onChange={(e) => handleDivisionNameChange(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-[#0f131c] border border-[#262936] rounded-xl text-sm text-white focus:outline-none focus:border-amber-400"
                />
              </div>

              {/* Banner / Foto Background Upload */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Foto Banner / Latar Belakang Card (Format Rasio 2:1)
                </label>
                <p className="text-[11px] text-slate-400 mb-2">
                  Format rasio 2:1 (misal 1200 x 600 px) agar pas dan tidak terpotong pada kartu divisi di website.
                </p>
                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    <label className="flex items-center gap-2 px-4 py-2 bg-[#0f131c] hover:bg-[#1f222e] border border-[#262936] hover:border-amber-400/40 text-slate-200 text-xs font-medium rounded-xl cursor-pointer transition">
                      <Upload size={14} className="text-amber-400" />
                      {uploadingBanner ? "Mengunggah..." : "Upload Foto Banner (2:1)"}
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        disabled={uploadingBanner}
                        onChange={handleBannerUpload}
                      />
                    </label>

                    {divisionForm.bannerImageUrl && (
                      <button
                        type="button"
                        onClick={() => setDivisionForm({ ...divisionForm, bannerImageUrl: "" })}
                        className="text-xs text-rose-400 hover:underline cursor-pointer"
                      >
                        Hapus Foto
                      </button>
                    )}
                  </div>

                  {divisionForm.bannerImageUrl && (
                    <div className="relative aspect-[2/1] max-h-48 w-full rounded-xl overflow-hidden border border-[#262936] bg-[#0f131c]">
                      <img
                        src={divisionForm.bannerImageUrl}
                        alt="Preview Banner"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Tagline / Slogan Divisi (Opsional)
                </label>
                <input
                  type="text"
                  placeholder="Contoh: Divisi Utama Mobile Legends Indonesia"
                  value={divisionForm.tagline}
                  onChange={(e) =>
                    setDivisionForm({ ...divisionForm, tagline: e.target.value })
                  }
                  className="w-full px-3.5 py-2.5 bg-[#0f131c] border border-[#262936] rounded-xl text-sm text-white focus:outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Deskripsi Divisi (Opsional)
                </label>
                <textarea
                  rows={2}
                  placeholder="Deskripsi singkat mengenai divisi ini..."
                  value={divisionForm.description}
                  onChange={(e) =>
                    setDivisionForm({ ...divisionForm, description: e.target.value })
                  }
                  className="w-full px-3.5 py-2.5 bg-[#0f131c] border border-[#262936] rounded-xl text-sm text-white focus:outline-none focus:border-amber-400 leading-relaxed"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#262936]">
                <button
                  type="button"
                  onClick={() => setDivisionModalOpen(false)}
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
                    {saving ? "Menyimpan..." : editingDivision ? "Perbarui Divisi" : "Simpan Divisi"}
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
