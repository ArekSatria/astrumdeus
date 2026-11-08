"use client";

import React, { useState, useEffect } from "react";
import {
  Newspaper,
  Plus,
  Pencil,
  Trash2,
  Search,
  Star,
  CheckCircle,
  AlertCircle,
  X,
  ExternalLink,
  Upload,
} from "lucide-react";

interface ArticleItem {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  contentHtml: string;
  coverImageUrl: string | null;
  coverImageAlt: string;
  isFeatured: boolean;
  publishedAt: string;
  readingTimeMinutes: number;
  category: { name: string; slug: string };
  division: { name: string; slug: string } | null;
}

export default function AdminNewsPage() {
  const [articles, setArticles] = useState<ArticleItem[]>([]);
  const [divisions, setDivisions] = useState<{ name: string; slug: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingArticle, setEditingArticle] = useState<ArticleItem | null>(null);
  const [uploadingCover, setUploadingCover] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    excerpt: "",
    contentHtml: "",
    coverImageUrl: "",
    coverImageAlt: "",
    isFeatured: false,
    categoryId: "pengumuman",
    divisionId: "",
  });
  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; message: string } | null>(null);

  const fetchArticles = async () => {
    setLoading(true);
    try {
      const [newsRes, teamsRes] = await Promise.all([
        fetch("/api/v1/news"),
        fetch("/api/v1/teams"),
      ]);
      const data = await newsRes.json();
      if (data.success && data.data?.items) {
        setArticles(data.data.items);
      }
      const teamsData = await teamsRes.json();
      if (teamsData.success && Array.isArray(teamsData.data)) {
        setDivisions(teamsData.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchArticles();
  }, []);

  const handleCoverUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 4 * 1024 * 1024) {
      alert("Ukuran gambar sampul maksimal 4 MB.");
      return;
    }

    setUploadingCover(true);
    try {
      const data = new FormData();
      data.append("file", file);

      const res = await fetch("/api/v1/upload", {
        method: "POST",
        body: data,
      });

      const result = await res.json();
      if (!res.ok || !result.success) {
        throw new Error(result.message || "Gagal mengunggah gambar sampul.");
      }

      setFormData((prev) => ({ ...prev, coverImageUrl: result.url }));
    } catch (err: any) {
      alert(err.message || "Gagal mengunggah gambar sampul.");
    } finally {
      setUploadingCover(false);
    }
  };

  const openAddModal = () => {
    setEditingArticle(null);
    setFormData({
      title: "",
      slug: "",
      excerpt: "",
      contentHtml: "<p>Tuliskan detail artikel di sini...</p>",
      coverImageUrl: "",
      coverImageAlt: "",
      isFeatured: false,
      categoryId: "pengumuman",
      divisionId: "",
    });
    setModalOpen(true);
    setFeedback(null);
  };

  const openEditModal = async (article: ArticleItem) => {
    setEditingArticle(article);
    setModalOpen(true);
    setFeedback(null);

    try {
      const res = await fetch(`/api/v1/news/${article.slug}`);
      const detail = await res.json();
      const fullArticle = detail.success && detail.data ? detail.data : article;
      setFormData({
        title: fullArticle.title,
        slug: fullArticle.slug,
        excerpt: fullArticle.excerpt,
        contentHtml: fullArticle.contentHtml || "<p></p>",
        coverImageUrl: fullArticle.coverImageUrl || "",
        coverImageAlt: fullArticle.coverImageAlt || "",
        isFeatured: Boolean(fullArticle.isFeatured),
        categoryId: fullArticle.category?.slug || "pengumuman",
        divisionId: article.division?.slug || "",
      });
    } catch {
      setFormData({
        title: article.title,
        slug: article.slug,
        excerpt: article.excerpt,
        contentHtml: article.contentHtml || "<p></p>",
        coverImageUrl: article.coverImageUrl || "",
        coverImageAlt: article.coverImageAlt || "",
        isFeatured: article.isFeatured,
        categoryId: article.category.slug,
        divisionId: article.division?.slug || "",
      });
    }
  };

  const handleTitleChange = (val: string) => {
    setFormData((prev) => ({
      ...prev,
      title: val,
      slug: editingArticle
        ? prev.slug
        : val
            .toLowerCase()
            .replace(/[^\w\s-]/g, "")
            .replace(/[\s_-]+/g, "-")
            .replace(/^-+|-+$/g, ""),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setFeedback(null);

    try {
      const url = editingArticle
        ? `/api/v1/news/${editingArticle.slug}`
        : "/api/v1/news";
      const method = editingArticle ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const result = await res.json();
      if (!res.ok || !result.success) {
        throw new Error(result.message || "Gagal menyimpan artikel.");
      }

      setFeedback({ type: "success", message: "Artikel berhasil disimpan!" });
      setTimeout(() => {
        setModalOpen(false);
        fetchArticles();
      }, 800);
    } catch (err: any) {
      setFeedback({ type: "error", message: err.message });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (slug: string) => {
    if (!confirm("Apakah kamu yakin ingin menghapus artikel ini?")) return;
    try {
      const res = await fetch(`/api/v1/news/${slug}`, { method: "DELETE" });
      const result = await res.json();
      if (result.success) {
        fetchArticles();
      } else {
        alert(result.message || "Gagal menghapus.");
      }
    } catch (err) {
      console.error(err);
    }
  };

  const filtered = articles.filter(
    (a) =>
      a.title.toLowerCase().includes(search.toLowerCase()) ||
      a.category.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <Newspaper className="text-red-500" size={24} />
            Kelola Berita & Artikel
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Publikasikan pengumuman tim, liputan prestasi, dan rilis resmi.
          </p>
        </div>
        <button
          onClick={openAddModal}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-semibold text-xs sm:text-sm shadow-lg shadow-red-900/40 transition self-start sm:self-auto cursor-pointer"
        >
          <Plus size={16} /> Tulis Berita Baru
        </button>
      </div>

      {/* Filter & Search */}
      <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center gap-3">
        <Search size={18} className="text-slate-500" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Cari judul berita atau kategori..."
          className="bg-transparent text-sm text-white placeholder-slate-500 focus:outline-none w-full"
        />
      </div>

      {/* News Table */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-300">
            <thead className="bg-slate-950/80 text-xs uppercase font-semibold text-slate-400 border-b border-slate-800">
              <tr>
                <th className="px-5 py-4">Judul Artikel</th>
                <th className="px-5 py-4">Kategori</th>
                <th className="px-5 py-4">Status</th>
                <th className="px-5 py-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {loading ? (
                <tr>
                  <td colSpan={4} className="px-5 py-8 text-center text-slate-500">
                    Memuat data artikel...
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-5 py-8 text-center text-slate-500">
                    Belum ada artikel yang cocok.
                  </td>
                </tr>
              ) : (
                filtered.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-800/40 transition">
                    <td className="px-5 py-4">
                      <div className="font-semibold text-white line-clamp-1">{item.title}</div>
                      <div className="text-xs text-slate-500 font-mono mt-0.5">{item.slug}</div>
                    </td>
                    <td className="px-5 py-4">
                      <span className="px-2.5 py-1 rounded-md text-xs font-medium bg-slate-800 text-slate-300">
                        {item.category.name}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      {item.isFeatured ? (
                        <span className="inline-flex items-center gap-1 text-xs font-semibold text-amber-400 bg-amber-950/40 border border-amber-800/50 px-2 py-0.5 rounded">
                          <Star size={11} className="fill-amber-400" /> Featured
                        </span>
                      ) : (
                        <span className="text-xs text-slate-500">Standar</span>
                      )}
                    </td>
                    <td className="px-5 py-4 text-right space-x-2">
                      <a
                        href={`/news/${item.slug}`}
                        target="_blank"
                        className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 inline-block"
                        title="Lihat Pratinjau Publik"
                      >
                        <ExternalLink size={15} />
                      </a>
                      <button
                        onClick={() => openEditModal(item)}
                        className="p-1.5 rounded-lg text-blue-400 hover:text-blue-300 hover:bg-blue-950/40 cursor-pointer"
                        title="Edit Artikel"
                      >
                        <Pencil size={15} />
                      </button>
                      <button
                        onClick={() => handleDelete(item.slug)}
                        className="p-1.5 rounded-lg text-rose-400 hover:text-rose-300 hover:bg-rose-950/40 cursor-pointer"
                        title="Hapus Artikel"
                      >
                        <Trash2 size={15} />
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
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-2xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden my-auto">
            <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between">
              <h2 className="font-bold text-lg text-white">
                {editingArticle ? "Edit Artikel Berita" : "Tulis Artikel Berita Baru"}
              </h2>
              <button
                onClick={() => setModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
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
                <label className="block text-xs font-semibold text-slate-300 mb-1">Judul Artikel</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => handleTitleChange(e.target.value)}
                  placeholder="Contoh: PT Adre Gemilang Jaya Juara 1 Turnamen Nasional"
                  className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white focus:outline-none focus:border-red-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Slug URL</label>
                <input
                  type="text"
                  required
                  value={formData.slug}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                  placeholder="pt-adre-gemilang-jaya-juara-1"
                  className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white font-mono focus:outline-none focus:border-red-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Kategori</label>
                  <select
                    value={formData.categoryId}
                    onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                    className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white focus:outline-none focus:border-red-500"
                  >
                    <option value="pengumuman">Pengumuman</option>
                    <option value="hasil-turnamen">Hasil Turnamen</option>
                    <option value="korporasi">Korporasi</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Divisi Terkait</label>
                  <select
                    value={formData.divisionId}
                    onChange={(e) => setFormData({ ...formData, divisionId: e.target.value })}
                    className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white focus:outline-none focus:border-red-500"
                  >
                    <option value="">Umum / Semua Divisi</option>
                    {divisions.length > 0 ? (
                      divisions.map((div) => (
                        <option key={div.slug} value={div.slug}>
                          {div.name}
                        </option>
                      ))
                    ) : (
                      <option value="pubg-mobile">PUBG Mobile</option>
                    )}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Ringkasan / Excerpt</label>
                <textarea
                  rows={2}
                  value={formData.excerpt}
                  onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                  placeholder="Ringkasan singkat yang akan muncul di kartu berita..."
                  className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white focus:outline-none focus:border-red-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Konten Lengkap (HTML)</label>
                <textarea
                  rows={6}
                  required
                  value={formData.contentHtml}
                  onChange={(e) => setFormData({ ...formData, contentHtml: e.target.value })}
                  placeholder="<p>Isi artikel lengkap dapat menggunakan tag HTML...</p>"
                  className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white font-mono focus:outline-none focus:border-red-500"
                />
              </div>

              {/* Gambar Sampul dengan Tombol Upload */}
              <div className="space-y-2">
                <label className="block text-xs font-semibold text-slate-300">
                  Gambar Sampul Artikel (Cover Image)
                </label>

                {formData.coverImageUrl && (
                  <div className="relative aspect-[16/9] max-h-44 w-full overflow-hidden rounded-xl border border-slate-800 bg-slate-950">
                    <img
                      src={formData.coverImageUrl}
                      alt="Preview Sampul"
                      className="h-full w-full object-cover object-center"
                    />
                  </div>
                )}

                <div className="flex flex-wrap items-center gap-2">
                  <label className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-semibold transition cursor-pointer">
                    <Upload size={14} />
                    {uploadingCover
                      ? "Mengunggah..."
                      : formData.coverImageUrl
                      ? "Ganti Gambar Sampul"
                      : "Unggah Gambar Sampul"}
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      disabled={uploadingCover}
                      onChange={handleCoverUpload}
                    />
                  </label>

                  {formData.coverImageUrl && (
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, coverImageUrl: "" })}
                      className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-rose-950/60 hover:text-rose-400 text-xs font-semibold text-slate-300 transition cursor-pointer"
                    >
                      Hapus Gambar
                    </button>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="featuredCheck"
                  checked={formData.isFeatured}
                  onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
                  className="w-4 h-4 rounded text-red-600 focus:ring-red-500"
                />
                <label htmlFor="featuredCheck" className="text-xs text-slate-300 cursor-pointer font-medium">
                  Jadikan sebagai Artikel Utama (Featured Article di Beranda)
                </label>
              </div>

              <div className="pt-4 border-t border-slate-800 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white hover:bg-slate-800 transition"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={saving || uploadingCover}
                  className="px-5 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-semibold shadow-lg shadow-red-900/40 transition disabled:opacity-50 cursor-pointer"
                >
                  {saving ? "Menyimpan..." : "Simpan Artikel"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
