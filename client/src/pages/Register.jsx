import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaEye,
  FaEyeSlash,
  FaArrowLeft,
} from "react-icons/fa";
import API_BASE from "../api/api";
import toast from "react-hot-toast";

export default function Register() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [errors, setErrors] = useState({
        email: "",
        password: "",
    });

    const navigate = useNavigate();

    const handleRegister = async () => {
        const newErrors = {
            email: "",
            password: "",
        };

        if (!email.trim()) newErrors.email = "Email is required";
        if (!password.trim()) newErrors.password = "Password is required";

        setErrors(newErrors);
        if (newErrors.email || newErrors.password) return;

        try {
            setLoading(true);

            const res = await fetch(`${API_BASE}/register`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email, password }),
            });

            const data = await res.json();

            if (res.ok) {
                toast.success("Account created successfully!");

                setTimeout(() => {
                    navigate("/login");
                }, 800);
            } else {
                toast.error(data.error || "Register failed", {
                    id: data.error || "register-failed",
                });
            }
        } catch {
            toast.error("Server error", {
                id: "server-error",
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen relative overflow-hidden bg-[var(--bg)] flex items-center justify-center px-4">

            {/* background glow */}
            <div className="absolute -top-32 -left-32 w-80 h-80 bg-[var(--accent)] opacity-10 blur-[120px] rounded-full" />
            <div className="absolute -bottom-32 -right-32 w-80 h-80 bg-[var(--accent)] opacity-10 blur-[120px] rounded-full" />
            
            {/* card */}
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
                        "
                    >
                        <FaArrowLeft className="text-xs" />
                        Back
                    </button>
                </div>

                <img
                src="/logo.png"
                alt="Shorty"
                className="w-10 h-10 mx-auto mt-5 mb-4 select-none"
                />

                <h1 className="text-3xl font-bold text-center">
                Create Account
                </h1>

                <p className="mt-2 text-center text-[var(--muted)] leading-6">
                Start shortening and managing your links today.
                </p>

                <form
                className="mt-8 space-y-4"
                onSubmit={(e) => {
                    e.preventDefault();
                    handleRegister();
                }}
                >
                    {/* EMAIL */}
                    <input
                        type="email"
                        autoFocus
                        autoComplete="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => {
                            setEmail(e.target.value);
                            if (errors.email) {
                                setErrors((prev) => ({ ...prev, email: "" }));
                            }
                        }}
                        
                        className="w-full bg-[var(--bg)] border border-[var(--border)] rounded-xl px-4 py-3 text-[var(--text)] placeholder-[var(--muted)] outline-none focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent)] transition-all"
                    />

                    {errors.email && (
                        <p className="text-sm text-red-400">{errors.email}</p>
                    )}

                    {/* PASSWORD */}
                    <div className="relative">
                        <input
                            type={showPassword ? "text" : "password"}
                            autoComplete="current-password"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => {
                                setPassword(e.target.value);
                                if (errors.password) {
                                    setErrors((prev) => ({ ...prev, password: "" }));
                                }
                            }}
                            
                            className="w-full bg-[var(--bg)] border border-[var(--border)] rounded-xl px-4 py-3 pr-10 text-[var(--text)] placeholder-[var(--muted)] outline-none focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent)] transition-all"
                        />

                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
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
                            {showPassword ? <FaEyeSlash /> : <FaEye />}
                        </button>
                    </div>

                    {errors.password && (
                        <p className="text-sm text-red-500">{errors.password}</p>
                    )}

                    {/* BUTTON */}
                    <button
                        type="submit"
                        disabled={loading}
                        className="
                        w-full
                        py-3
                        rounded-xl
                        font-semibold
                        bg-[var(--accent)]
                        text-white
                        hover:opacity-90
                        transition
                        disabled:opacity-60
                        disabled:cursor-not-allowed
                        "
                    >
                        {loading ? "Creating Account..." : "Create Account"}
                    </button>
                </form>

                <div className="mt-8 text-center">

                    <p className="text-[var(--muted)]">
                        Already have an account?
                    </p>

                    <button
                        onClick={() => navigate("/login")}
                        className="
                        mt-3
                        font-semibold
                        text-[var(--accent)]
                        hover:underline
                        transition
                        "
                    >
                        Sign In
                    </button>

                </div>
            </div>
        </div>
    );
}