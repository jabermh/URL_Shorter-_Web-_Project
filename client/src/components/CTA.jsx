import { useNavigate } from "react-router-dom";
import { FaArrowRight } from "react-icons/fa";

export default function CTA() {
  const navigate = useNavigate();

  return (
    <section className="max-w-4xl mx-auto px-4 py-28 text-center">

      <h2 className="text-3xl md:text-4xl font-bold">
        Ready to start managing your links?
      </h2>

      <p className="mt-6 max-w-2xl mx-auto text-[var(--muted)] leading-8">
        Join Shorty to shorten URLs, organize your links,
        track total clicks, generate QR codes, and manage everything from one clean dashboard.
      </p>

      <button
        onClick={() => navigate("/register")}
        className="
          mt-10
          inline-flex
          items-center
          gap-2
          rounded-xl
          bg-[var(--accent)]
          px-7
          py-3
          text-white
          font-medium
          transition-all
          duration-300
          hover:opacity-90
          hover:scale-105
        "
      >
        Create Account
        <FaArrowRight />
      </button>

      <p className="mt-6 text-sm text-[var(--muted)]">
        Already have an account?{" "}
        <button
          onClick={() => navigate("/login")}
          className="
            text-[var(--accent)]
            font-medium
            hover:underline
          "
        >
          Sign In
        </button>
      </p>

    </section>
  );
}