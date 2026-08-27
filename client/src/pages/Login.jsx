import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaEye,
  FaEyeSlash,
  FaArrowLeft,
} from "react-icons/fa";
import API_BASE from "../api/api";
import toast from "react-hot-toast";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const [errors, setErrors] = useState({
    email: "",
    password: "",
  });

  const navigate = useNavigate();

  const handleLogin = async () => {
    const newErrors = {
      email: "",
      password: "",
    };

    if (!email.trim())
      newErrors.email = "Email is required";

    if (!password.trim())
      newErrors.password = "Password is required";

    setErrors(newErrors);

    if (newErrors.email || newErrors.password) return;

    try {
      setLoading(true);

      const res = await fetch(`${API_BASE}/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        localStorage.setItem("token", data.data.token);

        toast.success("Login successful");

        setTimeout(() => {
          navigate("/dashboard");
        }, 500);
      } else {
        toast.error(data.error || "Login failed");
      }
    } catch {
      toast.error("Server error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="
        min-h-screen
        relative
        overflow-hidden
        bg-[var(--bg)]
        text-[var(--text)]
        flex
        items-center
        justify-center
        px-4
      "
    >
      {/* Background Glow */}

      <div className="absolute -top-32 -left-32 w-80 h-80 bg-[var(--accent)] opacity-10 blur-[120px] rounded-full" />

      <div className="absolute -bottom-32 -right-32 w-80 h-80 bg-[var(--accent)] opacity-10 blur-[120px] rounded-full" />

      {/* Card */}

      <div
        className="
          relative
          z-10
          w-full
          max-w-md
          rounded-3xl
          border
          border-[var(--border)]
          bg-[var(--card)]
          backdrop-blur-xl
          shadow-xl
          p-8
        "
      >
        {/* Back */}

        <div className="flex justify-start">
            <button
                onClick={() => navigate("/")}
                className="
                inline-flex
                items-center
                gap-2
                px-3
                py-2
                rounded-lg
                text-sm
                font-medium
                text-[var(--muted)]
                hover:bg-[var(--hover)]
                hover:text-[var(--text)]
                transition-all
                duration-200
                "
            >
                <FaArrowLeft className="text-xs" />
                Back
            </button>
        </div>

        {/* Logo */}

        <img
          src="/logo.png"
          alt="Shorty"
          className="w-10 h-10 mx-auto mt-5 mb-4 select-none"
        />

        {/* Title */}

        <h1 className="mt-2 text-center text-3xl font-bold">
          Welcome Back
        </h1>

        <p className="mt-2 text-center text-[var(--muted)] leading-6">
          Sign in to continue to your dashboard.
        </p>

        {/* Form */}

        <form
          className="mt-8 space-y-5"
          onSubmit={(e) => {
            e.preventDefault();
            handleLogin();
          }}
        >
          {/* Email */}

          <div>
            <input
              autoFocus
              autoComplete="email"
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);

                if (errors.email) {
                  setErrors((prev) => ({
                    ...prev,
                    email: "",
                  }));
                }
              }}
              className="
                w-full
                rounded-xl
                border
                border-[var(--border)]
                bg-[var(--bg)]
                px-4
                py-3
                outline-none
                transition
                focus:border-[var(--accent)]
                focus:ring-2
                focus:ring-[var(--accent)]
              "
            />

            {errors.email && (
              <p className="mt-1 text-sm text-red-500">
                {errors.email}
              </p>
            )}
          </div>

          {/* Password */}

          <div>
            <div className="relative">
              <input
                autoComplete="current-password"
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);

                  if (errors.password) {
                    setErrors((prev) => ({
                      ...prev,
                      password: "",
                    }));
                  }
                }}
                className="
                  w-full
                  rounded-xl
                  border
                  border-[var(--border)]
                  bg-[var(--bg)]
                  px-4
                  py-3
                  pr-11
                  outline-none
                  transition
                  focus:border-[var(--accent)]
                  focus:ring-2
                  focus:ring-[var(--accent)]
                "
              />

              <button
                type="button"
                onClick={() =>
                  setShowPassword(!showPassword)
                }
                className="
                  absolute
                  right-3
                  top-1/2
                  -translate-y-1/2
                  p-1
                  rounded-md
                  text-[var(--muted)]
                  hover:bg-[var(--hover)]
                  hover:text-[var(--text)]
                  transition
                "
              >
                {showPassword ? (
                  <FaEyeSlash />
                ) : (
                  <FaEye />
                )}
              </button>
            </div>

            {errors.password && (
              <p className="mt-1 text-sm text-red-500">
                {errors.password}
              </p>
            )}
          </div>

          {/* Button */}

          <button
            type="submit"
            disabled={loading}
            className="
              w-full
              rounded-xl
              bg-[var(--accent)]
              py-3
              font-semibold
              text-white
              transition
              hover:opacity-90
              disabled:opacity-60
              disabled:cursor-not-allowed
            "
          >
            {loading ? "Signing In..." : "Sign In"}
          </button>
        </form>


        {/* Register */}

        <div className="mt-8 text-center">
          <p className="text-[var(--muted)]">
            Don't have an account?
          </p>

          <button
            onClick={() => navigate("/register")}
            className="
              mt-3
              font-semibold
              text-[var(--accent)]
              hover:underline
              transition
            "
          >
            Create Account
          </button>
        </div>
      </div>
    </div>
  );
}