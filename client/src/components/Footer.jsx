import {
  FaCopyright,
  FaGithub,
  FaEnvelope,
} from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="mt-24 border-t border-[var(--border)]">
      <div className="max-w-6xl mx-auto px-4 py-14">

        {/* Brand */}
        <div className="flex flex-col items-center text-center">

          <img
            src="/logo.png"
            alt="Shorty"
            className="w-12 h-12"
          />

          <h2 className="mt-4 text-3xl font-bold">
            Shorty
          </h2>

          <p className="mt-3 max-w-md text-[var(--muted)] leading-7">
            A modern URL shortening and link management platform
            with click tracking, QR code generation, and secure authentication.
          </p>

        </div>

        {/* Links */}

        <div className="mt-10 flex flex-wrap justify-center gap-8">

          <a
            href="https://github.com/jaber-and-rafsan"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-2 text-[var(--muted)] hover:text-[var(--accent)] transition"
          >
            <FaGithub />
            GitHub
          </a>

          <a
            href="mailto:jaber.rafsan@example.com"
            className="flex items-center gap-2 text-[var(--muted)] hover:text-[var(--accent)] transition"
          >
            <FaEnvelope />
            Contact
          </a>

        </div>

        {/* Tech Stack */}

        <div className="mt-10 flex flex-wrap justify-center gap-3">

          {[
            "Node.js/Express",
            "React",
            "PostgreSQL",
          ].map((tech) => (
            <span
              key={tech}
              className="
                rounded-full
                border
                border-[var(--border)]
                px-4
                py-2
                text-sm
                bg-[var(--card)]
              "
            >
              {tech}
            </span>
          ))}

        </div>

        {/* Bottom */}

        <div className="mt-12 pt-8 border-t border-[var(--border)] text-center">

          <p className="flex items-center justify-center gap-2 text-sm text-[var(--muted)] flex-wrap">
            <FaCopyright className="text-xs shrink-0" />
            <span>
              {new Date().getFullYear()} Shorty. Designed & Developed by Jaber & rafsan.
            </span>
          </p>

        </div>

      </div>
    </footer>
  );
}