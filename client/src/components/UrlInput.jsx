import { useState } from "react";
import { FaLink, FaSpinner } from "react-icons/fa";

export default function UrlInput({ onShorten }) {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!url.trim()) return;

    try {
      setLoading(true);
      await onShorten(url);
      setUrl("");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="
        bg-[var(--card)] border border-[var(--border)]
        rounded-2xl p-3
        flex flex-col sm:flex-row gap-3
        items-stretch
        hover:bg-white/10 transition
      "
    >

      {/* INPUT SECTION */}
      <div className="flex items-center gap-3 flex-1 min-w-0">

        <FaLink className="text-gray-400 text-sm shrink-0" />

        <input
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") handleSubmit();
          }}
          placeholder="Paste a long URL here..."
          className="
            w-full bg-transparent
            outline-none text-[var(--text)]
            placeholder-[var(--muted)]
            text-sm sm:text-base
            min-w-0
          "
        />
      </div>

      {/* BUTTON */}
      <button
        onClick={handleSubmit}
        disabled={loading || !url.trim()}
        className={`
          w-full sm:w-auto
          px-4 sm:px-5
          py-2 sm:py-3
          rounded-xl font-medium
          flex items-center justify-center gap-2
          transition text-sm sm:text-base

          ${
            loading || !url.trim()
              ? "bg-blue-500/20 text-blue-300 opacity-50 cursor-not-allowed"
              : "bg-gradient-to-r from-blue-500 to-purple-500 hover:opacity-90 text-white"
          }
        `}
      >
        {loading ? (
          <>
            <FaSpinner className="animate-spin" />
            Shortening...
          </>
        ) : (
          "Shorten URL"
        )}
      </button>

    </div>
  );
}