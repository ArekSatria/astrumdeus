"use client";

import React, { useState, useEffect } from "react";
import {
  Swords,
  Plus,
  Pencil,
  Trash2,
  CheckCircle,
  AlertCircle,
  X,
  ExternalLink,
  Radio,
} from "lucide-react";

interface MatchItem {
  id: string;
  tournamentName: string;
  stage: string;
  scheduledAt: string;
  status: "UPCOMING" | "LIVE" | "COMPLETED";
  formatType: "BATTLE_ROYALE" | "TACTICAL_5V5";
  division: {
    name: string;
    slug: string;
    shortCode: string;
  };
  streamUrl: string | null;
  resultBattleRoyale: {
    placement: number;
    placementLabel: string;
    totalPoints: number;
    wwcdCount?: number;
  } | null;
}

export default function AdminMatchesPage() {
  const [matches, setMatches] = useState<MatchItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingMatch, setEditingMatch] = useState<MatchItem | null>(null);

  const [formData, setFormData] = useState({
    tournamentName: "",
    divisionSlug: "pubg-mobile",
    status: "UPCOMING" as "UPCOMING" | "LIVE" | "COMPLETED",
    scheduledAt: new Date().toISOString().slice(0, 16),
    streamUrl: "",
  });

  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; message: string } | null>(null);

  const fetchMatches = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/v1/matches");
      const data = await res.json();
      if (data.success && data.data?.items) {
        setMatches(data.data.items);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMatches();
  }, []);

  const openAddModal = () => {
    setEditingMatch(null);
    setFormData({
      tournamentName: "",
      divisionSlug: "pubg-mobile",
      status: "UPCOMING",
      scheduledAt: new Date().toISOString().slice(0, 16),
      streamUrl: "",
    });
    setModalOpen(true);
    setFeedback(null);
  };

  const openEditModal = (m: MatchItem) => {
    setEditingMatch(m);
    setFormData({
      tournamentName: m.tournamentName,
      divisionSlug: m.division.slug,
      status: m.status,
      scheduledAt: new Date(m.scheduledAt).toISOString().slice(0, 16),
      streamUrl: m.streamUrl || "",
    });
    setModalOpen(true);
    setFeedback(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setFeedback(null);

    try {
      const payload: any = {
        tournamentName: formData.tournamentName,
        stage: editingMatch?.stage || "Turnamen Resmi",
        scheduledAt: new Date(formData.scheduledAt).toISOString(),
        status: formData.status,
        formatType: "BATTLE_ROYALE",
        streamUrl: formData.streamUrl || null,
        divisionSlug: formData.divisionSlug,
      };

      const url = editingMatch
        ? `/api/v1/matches/${editingMatch.id}`
        : "/api/v1/matches";
      const method = editingMatch ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const result = await res.json();
      if (!res.ok || !result.success) {
        throw new Error(result.message || "Gagal menyimpan jadwal pertandingan.");
      }

      setFeedback({ type: "success", message: "Jadwal pertandingan berhasil disimpan!" });
      setTimeout(() => {
        setModalOpen(false);
        fetchMatches();
      }, 1000);
    } catch (err: any) {
      setFeedback({ type: "error", message: err.message });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Hapus data pertandingan ini?")) return;
    try {
      const res = await fetch(`/api/v1/matches/${id}`, { method: "DELETE" });
      const result = await res.json();
      if (result.success) {
        fetchMatches();
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
            <Swords className="text-amber-500" /> Kelola Jadwal & Hasil Pertandingan
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Atur jadwal turnamen mendatang, status LIVE pertandingan, skor poin, WWCD, dan link siaran langsung.
          </p>
        </div>
        <button
          onClick={openAddModal}
          className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 hover:from-amber-300 hover:to-amber-500 text-slate-950 px-5 py-2.5 rounded-xl font-bold text-sm transition shadow-lg shadow-amber-500/20 cursor-pointer transform -skew-x-12 hover:scale-[1.02] active:scale-[0.98]"
        >
          <span className="inline-flex items-center gap-2 transform skew-x-12 font-bold italic tracking-wide">
            <Plus size={18} /> Tambah Pertandingan
          </span>
        </button>
      </div>

      {/* Table */}
      <div className="bg-[#16161e] border border-[#262936] rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-300">
            <thead className="bg-[#0f131c]/80 text-xs uppercase font-semibold text-slate-400 border-b border-[#262936]">
              <tr>
                <th className="px-5 py-4">Nama Turnamen</th>
                <th className="px-5 py-4">Divisi</th>
                <th className="px-5 py-4">Waktu Jadwal</th>
                <th className="px-5 py-4">Status</th>
                <th className="px-5 py-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#262936]">
              {loading ? (
                <tr>
                  <td colSpan={5} className="px-5 py-8 text-center text-slate-500">
                    Memuat data jadwal...
                  </td>
                </tr>
              ) : matches.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-5 py-8 text-center text-slate-500">
                    Belum ada data pertandingan.
                  </td>
                </tr>
              ) : (
                matches.map((item) => (
                  <tr key={item.id} className="hover:bg-[#1f222e]/60 transition">
                    <td className="px-5 py-4">
                      <div className="font-semibold text-white">{item.tournamentName}</div>
                    </td>
                    <td className="px-5 py-4">
                      <span className="px-2 py-0.5 rounded text-xs font-semibold bg-amber-400/10 border border-amber-400/30 text-amber-300">
                        {item.division.shortCode || item.division.name}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-xs font-mono text-slate-300">
                      {new Date(item.scheduledAt).toLocaleString("id-ID", {
                        dateStyle: "medium",
                        timeStyle: "short",
                      })}
                    </td>
                    <td className="px-5 py-4">
                      {item.status === "LIVE" ? (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-rose-500/20 text-rose-400 border border-rose-500/40 animate-pulse">
                          <Radio size={12} /> LIVE
                        </span>
                      ) : item.status === "COMPLETED" ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-950/50 text-emerald-400 border border-emerald-800/50">
                          Selesai
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-950/50 text-blue-400 border border-blue-800/50">
                          Mendatang
                        </span>
                      )}
                    </td>
                    <td className="px-5 py-4 text-right space-x-2">
                      {item.streamUrl && (
                        <a
                          href={item.streamUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center justify-center p-2 rounded-lg bg-[#1f222e] hover:bg-[#262936] text-slate-400 hover:text-white border border-[#262936] transform -skew-x-12 transition-all shadow-sm hover:scale-105 active:scale-95"
                          title="Tonton Live Stream"
                        >
                          <span className="transform skew-x-12"><ExternalLink size={14} /></span>
                        </a>
                      )}
                      <button
                        onClick={() => openEditModal(item)}
                        className="inline-flex items-center justify-center p-2 rounded-lg bg-amber-500/10 hover:bg-amber-400 text-amber-400 hover:text-slate-950 border border-amber-500/30 transform -skew-x-12 transition-all cursor-pointer shadow-sm hover:scale-105 active:scale-95"
                        title="Edit Pertandingan"
                      >
                        <span className="transform skew-x-12"><Pencil size={14} /></span>
                      </button>
                      <button
                        onClick={() => handleDelete(item.id)}
                        className="inline-flex items-center justify-center p-2 rounded-lg bg-rose-500/10 hover:bg-rose-500 text-rose-400 hover:text-white border border-rose-500/30 transform -skew-x-12 transition-all cursor-pointer shadow-sm hover:scale-105 active:scale-95"
                        title="Hapus Pertandingan"
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
          <div className="bg-[#16161e] border border-[#262936] rounded-2xl w-full max-w-xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden my-auto">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-[#262936] flex items-center justify-between">
              <h2 className="font-bold text-lg text-white">
                {editingMatch ? "Edit Pertandingan" : "Tambah Jadwal Pertandingan"}
              </h2>
              <button
                onClick={() => setModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-[#1f222e]"
              >
                <X size={18} />
              </button>
            </div>

            {/* Modal Form */}
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
                <label className="block text-xs font-semibold text-slate-300 mb-1">Nama Turnamen</label>
                <input
                  type="text"
                  required
                  value={formData.tournamentName}
                  onChange={(e) => setFormData({ ...formData, tournamentName: e.target.value })}
                  placeholder="Contoh: PMNC Indonesia 2026 atau PMSL SEA Fall"
                  className="w-full px-3.5 py-2.5 bg-[#0f131c] border border-[#262936] rounded-xl text-sm text-white focus:outline-none focus:border-amber-400"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Divisi Tim</label>
                  <select
                    value={formData.divisionSlug}
                    onChange={(e) => setFormData({ ...formData, divisionSlug: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-[#0f131c] border border-[#262936] rounded-xl text-sm text-white focus:outline-none focus:border-amber-400"
                  >
                    <option value="pubg-mobile">PUBG Mobile</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Status Pertandingan</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                    className="w-full px-3.5 py-2.5 bg-[#0f131c] border border-[#262936] rounded-xl text-sm text-white focus:outline-none focus:border-amber-400"
                  >
                    <option value="UPCOMING">Mendatang (Upcoming)</option>
                    <option value="LIVE">Sedang Berlangsung (LIVE)</option>
                    <option value="COMPLETED">Selesai (Completed)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Waktu & Tanggal Pertandingan</label>
                <input
                  type="datetime-local"
                  required
                  value={formData.scheduledAt}
                  onChange={(e) => setFormData({ ...formData, scheduledAt: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-[#0f131c] border border-[#262936] rounded-xl text-sm text-white focus:outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">URL Siaran Langsung (Stream Link - Opsional)</label>
                <input
                  type="text"
                  value={formData.streamUrl}
                  onChange={(e) => setFormData({ ...formData, streamUrl: e.target.value })}
                  placeholder="https://youtube.com/watch?v=... atau https://vidio.com/..."
                  className="w-full px-3.5 py-2.5 bg-[#0f131c] border border-[#262936] rounded-xl text-sm text-white focus:outline-none focus:border-amber-400"
                />
              </div>

              {/* Submit Buttons */}
              <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#262936]">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-sm font-medium text-slate-400 hover:text-white hover:bg-[#1f222e] transition transform -skew-x-12"
                >
                  <span className="transform skew-x-12 inline-block">Batal</span>
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-6 py-2.5 rounded-xl text-sm font-bold bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 hover:from-amber-300 hover:to-amber-500 text-slate-950 transition disabled:opacity-50 cursor-pointer shadow-lg shadow-amber-500/20 transform -skew-x-12 hover:scale-[1.02] active:scale-[0.98]"
                >
                  <span className="inline-flex items-center gap-2 transform skew-x-12 font-bold italic tracking-wide">
                    {saving ? "Menyimpan..." : editingMatch ? "Perbarui Pertandingan" : "Simpan Pertandingan"}
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
