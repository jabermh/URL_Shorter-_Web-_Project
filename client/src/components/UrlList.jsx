import UrlCard from "./UrlCard";
import SkeletonList from "./SkeletonList";
import { FaSearchMinus, FaLink } from "react-icons/fa";

export default function UrlList({
  urls,
  filteredUrls,
  loading,
  onCopy,
  copiedId,
  onDelete,
  onQR,
  API_BASE,
  viewMode,
}) {
  if (loading) return <SkeletonList />;

  if (!urls.length) {
    return (
      <div className="bg-[var(--card)] backdrop-blur-md border border-[var(--border)] rounded-2xl p-10 text-center">
        <FaLink className="mx-auto text-5xl text-blue-400 mb-4" />
        <h2 className="text-2xl font-bold text-[var(--text)]">
          No URLs yet
        </h2>
        <p className="text-[var(--muted)]mt-2">
          Create your first shortened link
        </p>
      </div>
    );
  }

  if(urls.length>0 && filteredUrls.length===0){
    return (
      <div className="bg-[var(--bg)] backdrop-blur-md border border-[var(--border)] rounded-2xl p-10 text-center">
        <FaSearchMinus className="mx-auto text-5xl text-[var(--muted)] mb-4" />

        <h2 className="text-2xl font-bold text-[var(--text)]">
          No matching URLs
        </h2>

        <p className="text-[var(--muted)]mt-2">
          Try searching with another keyword
        </p>
      </div>
    );
  }

  return (
      <div
        className={
          filteredUrls.length > 0
            ? viewMode === "grid"
              ? "grid grid-cols-1 sm:grid-cols-2 gap-5"
              : "space-y-3"
            : ""
        }
      >
        {filteredUrls.map((u) => (
          <UrlCard
            key={u.id}
            u={u}
            onCopy={onCopy}
            onDelete={onDelete}
            onQR={onQR}
            API_BASE={API_BASE}
            copied={copiedId===u.id}
            viewMode={viewMode}
          />
        ))}
      </div>
    );
}