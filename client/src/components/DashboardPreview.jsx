export default function DashboardPreview() {
  return (
    <section className="max-w-6xl mx-auto px-4 py-24">
      {/* Heading */}
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-bold">
          Beautiful Dashboard
        </h2>

        <p className="mt-4 text-[var(--muted)] max-w-2xl mx-auto leading-7">
          Create, organize, and manage your shortened links from one clean dashboard,
          complete with click counts and QR code generation.
        </p>
      </div>

      <div className="relative">
        {/* Background Glow */}
        <div
          className="
            absolute
            inset-0
            bg-[var(--accent)]
            opacity-10
            blur-3xl
            rounded-full
            -z-10
          "
        />

        {/* Browser Window */}
        <div
          className="
            group
            overflow-hidden
            rounded-2xl
            border
            border-[var(--border)]
            bg-[var(--card)]
            shadow-2xl
            transition-all
            duration-500
            hover:-translate-y-2
            hover:shadow-[0_25px_60px_rgba(0,0,0,0.35)]
          "
        >
          {/* Browser Top Bar */}
          <div
            className="
              h-12
              border-b
              border-[var(--border)]
              bg-[var(--bg)]
              flex
              items-center
              justify-between
              px-5
            "
          >
            {/* Mac Buttons */}
            <div className="flex gap-2">
              <div className="w-3 h-3 rounded-full bg-red-500" />
              <div className="w-3 h-3 rounded-full bg-yellow-500" />
              <div className="w-3 h-3 rounded-full bg-green-500" />
            </div>

            {/* Fake URL */}
            <div className="hidden sm:flex flex-1 justify-center px-6">
              <div
                className="
                  w-full
                  max-w-md
                  rounded-full
                  border
                  border-[var(--border)]
                  bg-[var(--card)]
                  px-4
                  py-1.5
                  text-xs
                  text-center
                  text-[var(--muted)]
                  truncate
                "
              >
                https://shorty.local
              </div>
            </div>

            {/* Spacer */}
            <div className="w-16" />
          </div>

          {/* Screenshot */}
          <img
            src="/dashboard-preview.png"
            alt="Shorty Dashboard"
            className="
              w-full
              object-cover
              transition-transform
              duration-500
              group-hover:scale-[1.01]
            "
          />
        </div>
      </div>
    </section>
  );
}