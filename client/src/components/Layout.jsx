import { NavLink, Outlet, useNavigate } from "react-router-dom";
import {
  FaLink,
  FaChartBar,
  FaMoon,
  FaSun,
  FaSignOutAlt
} from "react-icons/fa";
import Footer from "./Footer";

export default function Layout({ theme, setTheme }) {
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <div className="min-h-screen flex flex-col bg-[var(--bg)] text-[var(--text)]">

      {/* NAVBAR */}
      <header className="sticky top-0 z-50 border-b border-[var(--border)] bg-[var(--bg)]/80 backdrop-blur-xl">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">

            {/* LEFT */}
            <div className="flex items-center gap-4 sm:gap-6">

            <h1 className="font-bold text-sm sm:text-base">
                Shorty
            </h1>

            <nav className="flex items-center gap-3 sm:gap-5 text-sm">

                <NavLink
                to="/dashboard"
                className={({ isActive }) =>
                    `flex items-center gap-2 px-2 py-1 rounded-lg transition ${
                    isActive
                        ? "text-blue-400 bg-blue-500/10"
                        : "text-[var(--muted)] hover:text-[var(--text)]"
                    }`
                }
                >
                <FaChartBar />
                <span className="hidden sm:inline">Dashboard</span>
                </NavLink>

                <NavLink
                to="/links"
                className={({ isActive }) =>
                    `flex items-center gap-2 px-2 py-1 rounded-lg transition ${
                    isActive
                        ? "text-blue-400 bg-blue-500/10"
                        : "text-[var(--muted)] hover:text-[var(--text)]"
                    }`
                }
                >
                <FaLink />
                <span className="hidden sm:inline">Links</span>
                </NavLink>

            </nav>
            </div>

            {/* RIGHT */}
            <div className="flex items-center gap-1 sm:gap-2">

            {/* THEME */}
            <button
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center rounded-lg hover:bg-[var(--hover)] transition"
            >
              {theme === "dark" ? (
                <FaSun className="text-yellow-400 text-sm sm:text-base" />
              ) : (
                <FaMoon className="text-blue-400 text-sm sm:text-base" />
              )}
            </button>

            {/* LOGOUT */}
            <button
              onClick={logout}
              className="w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center rounded-lg hover:bg-red-500/10 text-red-400 transition"
            >
              <FaSignOutAlt className="text-sm sm:text-base" />
            </button>

          </div>
        </div>
        </header>

      {/* CONTENT */}
      <main className="flex-1 max-w-6xl mx-auto w-full p-3 sm:p-6">
        <Outlet />
      </main>

      <Footer />

    </div>
  );
}