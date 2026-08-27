import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  FaArrowLeft,
  FaCopy,
  FaLink,
  FaMousePointer,
  FaCalendarAlt,
  FaChartLine,
  FaExternalLinkAlt,
} from "react-icons/fa";
import API_BASE from "../api/api";
import toast from "react-hot-toast";

export default function UrlDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [urlData, setUrlData] = useState(null);

  const shortUrl = `${API_BASE}/r/${id}`;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(`${API_BASE}/user/urls`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        const data = await res.json();

        const list = Array.isArray(data)
          ? data
          : Array.isArray(data.data)
          ? data.data
          : [];

        const found = list.find((u) => String(u.id) === String(id));

        setUrlData(found);
      } catch {
        toast.error("Failed to load URL");
      }
    };

    fetchData();
  }, [id]);

  const copy = async (text) => {
    await navigator.clipboard.writeText(text);
    toast.success("Copied!");
  };

  if (!urlData) {
    return (
      <div className="min-h-screen bg-[var(--bg)] flex items-center justify-center">
        <p className="text-[var(--muted)]">Loading...</p>
      </div>
    );
  }

  const clicks = Number(urlData.clicks) || 0;

  const status =
    clicks === 0
      ? "No Activity"
      : clicks < 10
      ? "Low Traffic"
      : clicks < 50
      ? "Growing"
      : "Popular";

  const statusColor =
    clicks === 0
      ? "text-gray-400"
      : clicks < 10
      ? "text-yellow-400"
      : clicks < 50
      ? "text-blue-400"
      : "text-green-400";

  return (
    <div className="min-h-screen bg-[var(--bg)] text-[var(--text)] px-4 py-8">
      <div className="max-w-5xl mx-auto space-y-8">

        {/* Header */}

        <div>
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-[var(--muted)] hover:text-[var(--text)] transition"
          >
            <FaArrowLeft />
            Back
          </button>

          <h1 className="text-3xl font-bold mt-4">
            Link Details
          </h1>

          <p className="text-[var(--muted)] mt-2">
            View information about this shortened link.
          </p>
        </div>

        {/* Stats */}

        <div className="grid md:grid-cols-3 gap-5">

          <div className="bg-[var(--card)] border border-[var(--border)] rounded-2xl p-6">

            <FaMousePointer className="text-blue-500 text-2xl" />

            <p className="text-[var(--muted)] mt-4">
              Total Clicks
            </p>

            <h2 className="text-4xl font-bold mt-2">
              {clicks}
            </h2>

          </div>

          <div className="bg-[var(--card)] border border-[var(--border)] rounded-2xl p-6">

            <FaCalendarAlt className="text-green-500 text-2xl" />

            <p className="text-[var(--muted)] mt-4">
              Created
            </p>

            <h2 className="font-semibold mt-2">
              {new Date(urlData.created_at).toLocaleDateString()}
            </h2>

          </div>

          <div className="bg-[var(--card)] border border-[var(--border)] rounded-2xl p-6">

            <FaChartLine className="text-purple-500 text-2xl" />

            <p className="text-[var(--muted)] mt-4">
              Status
            </p>

            <h2 className={`font-semibold mt-2 ${statusColor}`}>
              {status}
            </h2>

          </div>

        </div>

        {/* Original URL */}

        <div className="bg-[var(--card)] border border-[var(--border)] rounded-2xl p-6">

          <div className="flex justify-between items-center">

            <h3 className="font-semibold">
              Original URL
            </h3>

            <button
              onClick={() => copy(urlData.url)}
              className="hover:text-[var(--accent)]"
            >
              <FaCopy />
            </button>

          </div>

          <p className="break-all mt-4 text-[var(--muted)]">
            {urlData.url}
          </p>

        </div>

        {/* Short URL */}

        <div className="bg-[var(--card)] border border-[var(--border)] rounded-2xl p-6">

          <div className="flex justify-between items-center">

            <h3 className="font-semibold">
              Short URL
            </h3>

            <button
              onClick={() => copy(shortUrl)}
              className="hover:text-[var(--accent)]"
            >
              <FaCopy />
            </button>

          </div>

          <div className="mt-4 flex items-center gap-3">

            <FaLink className="text-blue-500" />

            <a
              href={shortUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 underline break-all"
            >
              {shortUrl}
            </a>

            <FaExternalLinkAlt className="text-xs text-[var(--muted)]" />

          </div>

        </div>

        {/* Summary */}

        <div className="bg-[var(--card)] border border-[var(--border)] rounded-2xl p-6">

          <h3 className="font-semibold mb-4">
            Performance Summary
          </h3>

          <p className="text-[var(--muted)] leading-7">

            This shortened URL has received{" "}
            <span className="font-semibold text-[var(--text)]">
              {clicks}
            </span>{" "}
            click{clicks !== 1 && "s"} since it was created on{" "}
            <span className="font-semibold text-[var(--text)]">
              {new Date(urlData.created_at).toLocaleDateString()}
            </span>.

            {clicks === 0 &&
              " This link hasn't been visited yet."}

            {clicks > 0 &&
              clicks < 10 &&
              " The link has started receiving traffic."}

            {clicks >= 10 &&
              clicks < 50 &&
              " The link is receiving a healthy number of visits."}

            {clicks >= 50 &&
              " This link is performing well with strong engagement."}

          </p>

        </div>

      </div>
    </div>
  );
}