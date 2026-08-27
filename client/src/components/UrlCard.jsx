import {
  FaArrowRight,
  FaChartBar,
  FaCopy,
  FaQrcode,
  FaTrash
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";

export default function UrlCard({ u, onCopy, onDelete, onQR, API_BASE, copied }) {
  const navigate = useNavigate();
  const shortUrl = `${API_BASE}/r/${u.id}`;

  return (
    <div
      className="
        bg-[var(--card)]
        border border-[var(--border)]
        rounded-2xl p-6
        hover:-translate-y-1 hover:shadow-xl
        transition-all duration-300
        flex flex-col gap-5
      "
    >

      {/* ORIGINAL URL */}
      <div className="space-y-1">
        <p className="text-xs uppercase tracking-wider text-[var(--muted)]">
          Original URL
        </p>
        <a
          href={u.url}
          target="_blank"
          rel="noreferrer"
          className="text-sm text-[var(--text)] break-words hover:text-blue-400"
        >
          {u.url}
        </a>
      </div>

      {/* SHORT URL (PRIMARY FOCUS) */}
      <div className="space-y-1">
        <p className="text-xs uppercase tracking-wider text-[var(--muted)]">
          Short URL
        </p>
        <a
          href={shortUrl}
          target="_blank"
          rel="noreferrer"
          className="text-sm text-blue-400 font-medium hover:underline break-all"
        >
          {shortUrl}
        </a>
      </div>

      {/* ANALYTICS (SECONDARY INFO) */}
      <div className="flex items-center justify-between pt-2">
        <div>
          <p className="text-xs text-[var(--muted)]">Total Clicks</p>
          <p className="text-xl font-bold text-[var(--text)]">
            {Number(u.clicks) || 0}
          </p>
        </div>

        <button
          onClick={() => navigate(`/url/${u.id}`)}
          className="
            flex items-center gap-2
            text-blue-400 hover:text-blue-300
            text-sm font-medium
            transition
          "
        >
          <FaChartBar />
          Details
          <FaArrowRight />
        </button>
      </div>

      {/* ACTIONS GROUP (PRIMARY INTERACTION ZONE) */}
      <div className="flex items-center justify-between pt-2">

        <div className="flex items-center gap-2">
          <button
            onClick={() => onCopy(shortUrl, u.id)}
            className={`
              flex items-center gap-2
              px-4 py-2 rounded-xl text-sm
              transition-all duration-200

              ${copied
                ? "bg-green-500/20 text-green-400 scale-105"
                : "bg-[var(--bg)] hover:bg-[var(--hover)] text-[var(--text)]"
              }
            `}
          >
            <FaCopy />
            {copied ? "Copied!" : "Copy"}
          </button>

          <button
            onClick={() => onQR(shortUrl)}
            className="
              flex items-center gap-2
              px-4 py-2 rounded-xl
              bg-[var(--bg)] hover:bg-[var(--hover)]
              text-sm transition
            "
          >
            <FaQrcode />
            QR
          </button>
        </div>

        {/* DELETE (SEPARATED + SAFER VISUAL WEIGHT) */}
        <button
          onClick={() => onDelete(u.id)}
          className="
            flex items-center gap-2
            px-3 py-2 rounded-xl
            text-sm
            text-red-400
            hover:bg-red-500/10
            transition
          "
        >
          <FaTrash />
          Delete
        </button>

      </div>

    </div>
  );
}