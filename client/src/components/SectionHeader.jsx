export default function SectionHeader({ title }) {
  return (
    <div className="flex items-center gap-2">
      
      {/* BLUE DOT */}
      <div className="w-1.5 h-1.5 rounded-full bg-blue-400" />

      {/* TITLE */}
      <p className="text-xs uppercase tracking-wider text-[var(--muted)]">
        {title}
      </p>

    </div>
  );
}