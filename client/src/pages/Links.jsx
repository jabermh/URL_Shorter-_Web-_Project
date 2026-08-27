import { useEffect, useState, useCallback } from "react";
import API_BASE from "../api/api";
import toast from "react-hot-toast";

import UrlList from "../components/UrlList";
import SearchBar from "../components/SearchBar";

import QRModal from "../components/QRModal";
import DeleteModal from "../components/DeleteModal";

export default function Links() {
  const [urls, setUrls] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [sort, setSort] = useState("newest");
  const [view, setView] = useState("list");

  const [copiedId, setCopiedId] = useState(null);

  const [showQR, setShowQR] = useState(false);
  const [qrValue, setQrValue] = useState("");

  const [showDelete, setShowDelete] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  const [page, setPage] = useState(1);
  const limit = 10;

  // 🔥 MOBILE DETECTION
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 640);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  const getToken = useCallback(() => localStorage.getItem("token"), []);

  // reset page on filter change
  useEffect(() => {
    setPage(1);
  }, [search, sort]);

  // FETCH
  const fetchUrls = useCallback(async () => {
    try {
      setLoading(true);

      const res = await fetch(`${API_BASE}/user/urls`, {
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      });

      const data = await res.json();

      const list = Array.isArray(data.data)
        ? data.data
        : Array.isArray(data)
        ? data
        : [];

      setUrls(list);
      setPage(1);
    } catch {
      toast.error("Failed to load links");
    } finally {
      setLoading(false);
    }
  }, [getToken]);

  useEffect(() => {
    fetchUrls();
    const onFocus = () => fetchUrls();
    window.addEventListener("focus", onFocus);
    return () => window.removeEventListener("focus", onFocus);
  }, [fetchUrls]);

  // COPY
  const copyLink = async (shortUrl, id) => {
    await navigator.clipboard.writeText(shortUrl);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 1000);
  };

  // QR
  const openQR = (shortUrl) => {
    setQrValue(shortUrl);
    setShowQR(true);
  };

  // DELETE
  const openDelete = (id) => {
    setDeleteId(id);
    setShowDelete(true);
  };

  const confirmDelete = async () => {
    try {
      const res = await fetch(`${API_BASE}/user/urls/${deleteId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      });

      if (res.ok) {
        toast.success("Deleted!");
        fetchUrls();
        setPage(1);
      }
    } catch {
      toast.error("Delete failed");
    } finally {
      setShowDelete(false);
      setDeleteId(null);
    }
  };

  // FILTER + SORT
  const filtered = urls
    .filter((u) =>
      u.url?.toLowerCase().includes(search.toLowerCase())
    )
    .sort((a, b) => {
      const dateA = new Date(a.created_at || 0);
      const dateB = new Date(b.created_at || 0);

      if (sort === "newest") return dateB - dateA;
      if (sort === "oldest") return dateA - dateB;
      if (sort === "clicks")
        return (Number(b.clicks) || 0) - (Number(a.clicks) || 0);

      return 0;
    });

  // PAGINATION
  const startIndex = (page - 1) * limit;
  const paginated = filtered.slice(startIndex, startIndex + limit);
  const totalPages = Math.ceil(filtered.length / limit);

  if (loading) {
    return (
      <div className="text-center py-16 text-[var(--muted)] animate-pulse">
        Loading...
      </div>
    );
  }

  return (
    <div className="space-y-8">

      {/* HEADER */}
      <div>
        <h1 className="text-2xl font-bold">All Links</h1>
        <p className="text-sm text-[var(--muted)]">
          Manage, track, and control all your shortened URLs
        </p>
      </div>

      {/* SEARCH */}
      <SearchBar search={search} setSearch={setSearch} />

      {/* CONTROLS */}
      <div className="flex items-center justify-between flex-wrap gap-3">

        <p className="text-sm text-[var(--muted)]">
          All Links ({filtered.length})
        </p>

        <div className="flex items-center gap-3">

          {/* SORT */}
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="bg-[var(--bg)] border border-[var(--border)] rounded-lg px-3 py-2 text-sm"
          >
            <option value="newest">Newest</option>
            <option value="oldest">Oldest</option>
            <option value="clicks">Most Clicked</option>
          </select>

          {/* VIEW TOGGLE (DESKTOP ONLY) */}
          {!isMobile && (
            <div className="flex gap-2">
              <button
                onClick={() => setView("list")}
                className={`px-3 py-1 text-sm rounded-lg border transition ${
                  view === "list"
                    ? "bg-blue-500/10 text-blue-400 border-blue-400/30"
                    : "text-[var(--muted)] border-[var(--border)]"
                }`}
              >
                List
              </button>

              <button
                onClick={() => setView("grid")}
                className={`px-3 py-1 text-sm rounded-lg border transition ${
                  view === "grid"
                    ? "bg-blue-500/10 text-blue-400 border-blue-400/30"
                    : "text-[var(--muted)] border-[var(--border)]"
                }`}
              >
                Grid
              </button>
            </div>
          )}

        </div>
      </div>

      {/* LIST */}
      {filtered.length === 0 ? (
        <div className="text-center py-20">
          <p className="font-medium">No links found</p>
          <p className="text-sm text-[var(--muted)] mt-2">
            Create your first shortened URL
          </p>
        </div>
      ) : (
        <UrlList
          urls={paginated}
          filteredUrls={paginated}
          loading={loading}
          onCopy={copyLink}
          copiedId={copiedId}
          onQR={openQR}
          onDelete={openDelete}
          API_BASE={API_BASE}
          viewMode={isMobile ? "list" : view}
        />
      )}

      {/* PAGINATION */}
      {totalPages > 1 && (
        <div className="flex justify-center gap-3 pt-6">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="px-3 py-1 border rounded-lg disabled:opacity-40"
          >
            Prev
          </button>

          <span className="text-xs text-[var(--muted)]">
            {page} / {totalPages}
          </span>

          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="px-3 py-1 border rounded-lg disabled:opacity-40"
          >
            Next
          </button>
        </div>
      )}

      {/* MODALS */}
      <QRModal show={showQR} value={qrValue} onClose={() => setShowQR(false)} />
      <DeleteModal show={showDelete} onClose={() => setShowDelete(false)} onConfirm={confirmDelete} />

    </div>
  );
}