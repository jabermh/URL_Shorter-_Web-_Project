import { useNavigate } from "react-router-dom";
import { FaRocket } from "react-icons/fa";
export default function Hero() {
  const navigate = useNavigate();

  return (
    <section id="home" className="max-w-6xl mx-auto px-4 py-24 text-center">

      <div className="inline-flex items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--card)] px-4 py-2 text-sm text-[var(--muted)]">
        <FaRocket className="text-[var(--accent)]" />
        <span>Fast • Secure • QR Ready</span>
      </div>
      <h1 className="mt-8 text-5xl sm:text-6xl lg:text-7xl font-extrabold leading-tight">
        Shorten, Share
        <br />
        <span className="text-[var(--accent)]">
          & Manage Links
        </span>
      </h1>

      <p className="mt-6 max-w-2xl mx-auto text-lg text-[var(--muted)] leading-8">
        Shorty helps you create short links, share them instantly,
        track total clicks, generate QR codes, and manage everything from one modern dashboard.
      </p>

      <div className="mt-10 flex flex-col sm:flex-row justify-center gap-4">

        <button
          onClick={() => navigate("/register")}
          className="px-7 py-3 rounded-xl bg-[var(--accent)] text-white font-medium hover:opacity-90 transition"
        >
          Get Started
        </button>

        <button
          onClick={() => navigate("/login")}
          className="px-7 py-3 rounded-xl border border-[var(--border)] hover:bg-[var(--hover)] transition"
        >
          Login
        </button>

      </div>

    </section>
  );
}