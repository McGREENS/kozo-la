"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { FaEye, FaEyeSlash } from "react-icons/fa";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/admin/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Login failed");
        setPassword("");
        return;
      }

      // Store token in sessionStorage for client-side access
      sessionStorage.setItem("admin_token", data.token);
      router.push("/admin/dashboard");
    } catch {
      setError("Something went wrong. Please try again.");
      setPassword("");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
        background: `url(/image1.jpeg) center center / cover no-repeat`,
        fontFamily: "'Optima', Georgia, serif",
        position: "relative",
      }}
    >
      {/* Overlay */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "linear-gradient(135deg, rgba(10, 27, 42, 0.92) 0%, rgba(10, 27, 42, 0.85) 100%)",
          zIndex: 0,
        }}
      />

      {/* Content */}
      <div style={{ position: "relative", zIndex: 1 }}>
        <div
          style={{
            background: "rgba(26, 26, 26, 0.95)",
            backdropFilter: "blur(10px)",
            border: "1px solid rgba(160, 216, 179, 0.2)",
            borderRadius: "12px",
            padding: "48px",
            maxWidth: "420px",
            width: "100%",
            boxShadow: "0 8px 32px rgba(0, 0, 0, 0.3)",
          }}
        >
          {/* Logo Area */}
          <div style={{ textAlign: "center", marginBottom: "40px" }}>
            <h1
              style={{
                color: "#F2E4B1",
                fontSize: "32px",
                marginBottom: "8px",
                letterSpacing: "0.05em",
                fontWeight: "400",
              }}
            >
              Kōzo Admin
            </h1>
            <p
              style={{
                color: "rgba(160, 216, 179, 0.7)",
                fontSize: "12px",
                letterSpacing: "0.1em",
                textTransform: "uppercase",
              }}
            >
              Secure Portal
            </p>
          </div>

          <form onSubmit={handleLogin}>
            {/* Email Field */}
            <div style={{ marginBottom: "24px" }}>
              <label
                style={{
                  display: "block",
                  color: "#A0D8B3",
                  fontSize: "11px",
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  marginBottom: "8px",
                  fontWeight: "500",
                }}
              >
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@kozousa.com"
                style={{
                  width: "100%",
                  padding: "12px 14px",
                  background: "rgba(242, 228, 177, 0.08)",
                  border: "1px solid rgba(242, 228, 177, 0.2)",
                  borderRadius: "6px",
                  color: "#F2E4B1",
                  fontSize: "14px",
                  fontFamily: "inherit",
                  boxSizing: "border-box",
                  transition: "all 0.3s ease",
                  outline: "none",
                }}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = "rgba(160, 216, 179, 0.4)";
                  e.currentTarget.style.background = "rgba(242, 228, 177, 0.12)";
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = "rgba(242, 228, 177, 0.2)";
                  e.currentTarget.style.background = "rgba(242, 228, 177, 0.08)";
                }}
                required
              />
            </div>

            {/* Password Field */}
            <div style={{ marginBottom: "28px" }}>
              <label
                style={{
                  display: "block",
                  color: "#A0D8B3",
                  fontSize: "11px",
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  marginBottom: "8px",
                  fontWeight: "500",
                }}
              >
                Password
              </label>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  background: "rgba(242, 228, 177, 0.08)",
                  border: "1px solid rgba(242, 228, 177, 0.2)",
                  borderRadius: "6px",
                  padding: "0 12px",
                  transition: "all 0.3s ease",
                }}
              >
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  style={{
                    flex: 1,
                    padding: "12px 0",
                    background: "transparent",
                    border: "none",
                    color: "#F2E4B1",
                    fontSize: "14px",
                    fontFamily: "inherit",
                    outline: "none",
                  }}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    background: "none",
                    border: "none",
                    color: "#A0D8B3",
                    cursor: "pointer",
                    padding: "0",
                    display: "flex",
                    alignItems: "center",
                    fontSize: "16px",
                  }}
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div
                style={{
                  color: "#f87171",
                  fontSize: "13px",
                  marginBottom: "16px",
                  textAlign: "center",
                  background: "rgba(248, 113, 113, 0.1)",
                  border: "1px solid rgba(248, 113, 113, 0.2)",
                  padding: "10px",
                  borderRadius: "4px",
                }}
              >
                {error}
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              style={{
                width: "100%",
                padding: "12px 16px",
                background: "#A0D8B3",
                color: "#0A1B2A",
                border: "none",
                borderRadius: "6px",
                fontSize: "12px",
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                fontWeight: "600",
                cursor: loading ? "not-allowed" : "pointer",
                opacity: loading ? 0.7 : 1,
                fontFamily: "inherit",
                transition: "all 0.3s ease",
              }}
              onMouseEnter={(e) => {
                if (!loading) {
                  e.currentTarget.style.background = "#8dd4a3";
                  e.currentTarget.style.transform = "translateY(-2px)";
                }
              }}
              onMouseLeave={(e) => {
                if (!loading) {
                  e.currentTarget.style.background = "#A0D8B3";
                  e.currentTarget.style.transform = "translateY(0)";
                }
              }}
            >
              {loading ? "Logging in..." : "Sign In"}
            </button>
          </form>

          {/* Footer */}
          <p
            style={{
              color: "rgba(195, 197, 200, 0.5)",
              fontSize: "11px",
              marginTop: "28px",
              textAlign: "center",
              lineHeight: "1.6",
              letterSpacing: "0.02em",
            }}
          >
            Kōzo Los Angeles Admin Portal
          </p>
        </div>
      </div>
    </div>
  );
}
