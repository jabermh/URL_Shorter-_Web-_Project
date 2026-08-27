import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import API_BASE from "../api/api";
import toast from "react-hot-toast";

import StatsCards from "../components/StatsCards";
import UrlInput from "../components/UrlInput";
import UrlList from "../components/UrlList";
import SearchBar from "../components/SearchBar";

import QRModal from "../components/QRModal";
import DeleteModal from "../components/DeleteModal";
import { FaArrowRight } from "react-icons/fa";

export default function Dashboard() {
  const [urls, setUrls] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);

  const [copiedId, setCopiedId] = useState(null);

  // MODALS
  const [showQR, setShowQR] = useState(false);
  const [qrValue, setQrValue] = useState("");

  const [showDelete, setShowDelete] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  const navigate = useNavigate();

  const getToken = useCallback(() => localStorage.getItem("token"), []);

  // FETCH URLS
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
    } catch {
      toast.error("Failed to load URLs");
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

  // SHORTEN URL
  const shorten = async (url) => {

    try {
      const res = await fetch(`${API_BASE}/shorten`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getToken()}`,
        },
        body: JSON.stringify({ url }),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data?.error || "Failed to shorten URL");
        return;
      }

      toast.success("Shortened successfully!");
      fetchUrls();

    } catch (err) {
      console.error(err);
      toast.error("Server error. Try again later.");
    }
  };

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
      }
    } catch {
      toast.error("Delete failed");
    } finally {
      setShowDelete(false);
      setDeleteId(null);
    }
  };

  // FILTER
  const recent = urls
    .filter((u) =>
      u.url.toLowerCase().includes(search.toLowerCase())
    )
    .slice(0, 4);

  return (
    <div className="space-y-10">

      {/* ================= OVERVIEW ================= */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <div className="w-1.5 h-1.5 rounded-full bg-blue-400" />
          <p className="text-xs uppercase tracking-wider text-[var(--muted)]">
            Overview
          </p>
        </div>

        <StatsCards urls={urls} />
      </div>

      {/* ================= CREATE & SEARCH ================= */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <div className="w-1.5 h-1.5 rounded-full bg-blue-400" />
          <p className="text-xs uppercase tracking-wider text-[var(--muted)]">
            Create & Search
          </p>
        </div>

        <UrlInput onShorten={shorten} />
        <SearchBar search={search} setSearch={setSearch} />
      </div>

      {/* ================= RECENT LINKS ================= */}
      <div className="space-y-4">

        <div className="flex justify-between items-center">

          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-blue-400" />
            <p className="text-xs uppercase tracking-wider text-[var(--muted)]">
              Recent Links
            </p>
          </div>

          <button
            onClick={() => navigate("/links")}
            className="flex items-center gap-2
            text-blue-400 hover:text-blue-300
            text-sm font-medium
            transition"
          >
            View All
            <FaArrowRight />
          </button>

        </div>

        <UrlList
          urls={recent}
          filteredUrls={recent}
          loading={loading}
          onCopy={copyLink}
          copiedId={copiedId}
          onQR={openQR}
          onDelete={openDelete}
          API_BASE={API_BASE}
          viewMode="list"
        />

      </div>

      {/* ================= MODALS ================= */}
      <QRModal
        show={showQR}
        value={qrValue}
        onClose={() => setShowQR(false)}
      />

      <DeleteModal
        show={showDelete}
        onClose={() => setShowDelete(false)}
        onConfirm={confirmDelete}
      />

    </div>
  );
}