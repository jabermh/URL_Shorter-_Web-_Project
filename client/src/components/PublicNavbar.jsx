import { useState } from "react";
import { Link } from "react-router-dom";
import { FaBars, FaTimes } from "react-icons/fa";

export default function PublicNavbar() {
  const [open, setOpen] = useState(false);

  const closeMenu = () => setOpen(false);

  return (
    <header className="sticky top-0 z-50 border-b border-[var(--border)] bg-[var(--bg)]/80 backdrop-blur-xl">

      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">

        {/* LEFT */}
        <div className="flex items-center gap-10">

          {/* Logo */}
          <a href="#home" className="flex items-center">
            <img
              src="/logo.png"
              alt="Shorty"
              className="h-10 w-auto"
            />
          </a>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">

            <a
              href="#home"
              className="text-[var(--muted)] hover:text-[var(--text)] transition"
            >
              Home
            </a>

            <a
              href="#features"
              className="text-[var(--muted)] hover:text-[var(--text)] transition"
            >
              Features
            </a>

            <a
              href="#how-it-works"
              className="text-[var(--muted)] hover:text-[var(--text)] transition"
            >
              How It Works
            </a>

          </nav>

        </div>

        {/* RIGHT */}
        <div className="hidden md:flex items-center gap-3">

          <Link
            to="/login"
            className="
              px-4
              py-2
              rounded-xl
              border
              border-[var(--border)]
              hover:bg-[var(--hover)]
              transition
            "
          >
            Login
          </Link>

          <Link
            to="/register"
            className="
              px-4
              py-2
              rounded-xl
              bg-[var(--accent)]
              text-white
              hover:opacity-90
              transition
            "
          >
            Register
          </Link>

        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setOpen(!open)}
          className="md:hidden text-xl"
        >
          {open ? <FaTimes /> : <FaBars />}
        </button>

      </div>

      {/* Mobile Menu */}
      {open && (
        <div
          className="
            lg:hidden
            border-t
            border-[var(--border)]
            bg-[var(--bg)]
          "
        >
          <nav className="flex flex-col p-4">

            <a
              href="#home"
              onClick={closeMenu}
              className="py-3"
            >
              Home
            </a>

            <a
              href="#features"
              onClick={closeMenu}
              className="py-3"
            >
              Features
            </a>

            <a
              href="#how-it-works"
              onClick={closeMenu}
              className="py-3"
            >
              How It Works
            </a>

            <hr className="my-3 border-[var(--border)]" />

            <Link
              to="/login"
              onClick={closeMenu}
              className="py-3"
            >
              Login
            </Link>

            <Link
              to="/register"
              onClick={closeMenu}
              className="
                py-3
                text-[var(--accent)]
                hover:text-[var(--text)]
                transition
              "
            >
              Register
            </Link>

          </nav>
        </div>
      )}

    </header>
  );
}