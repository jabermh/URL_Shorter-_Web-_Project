import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useState, useEffect } from "react";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import UrlDetails from "./pages/UrlDetails";
import Links from "./pages/Links";
import Home from "./pages/Home";

import Layout from "./components/Layout";
import ProtectedRoute from "./routes/ProtectedRoute";

function App() {
  const [theme, setTheme] = useState(
    localStorage.getItem("theme") || "dark"
  );

  useEffect(() => {
    document.documentElement.classList.remove("dark", "light");
    document.documentElement.classList.add(theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  return (
    <BrowserRouter>
      <Routes>

        {/* PUBLIC */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* PROTECTED APP SHELL */}
        <Route
          element={
            <ProtectedRoute>
              <Layout theme={theme} setTheme={setTheme} />
            </ProtectedRoute>
          }
        >

          <Route path="/dashboard" element={<Dashboard />} />

          {/* FULL LINKS PAGE (IMPORTANT) */}
          <Route path="/links" element={<Links />} />

          <Route path="/url/:id" element={<UrlDetails />} />

        </Route>

      </Routes>
    </BrowserRouter>
  );
}

export default App;