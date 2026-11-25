"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

interface Application {
  id: number;
  name: string;
  email: string;
  message: string;
  filename: string;
  status: string;
  created_at: string;
}

export default function ApplicationsClient() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchApplications();
  }, []);

  async function fetchApplications() {
    const res = await fetch("/api/admin/applications");
    if (res.ok) {
      const data = await res.json();
      setApplications(data);
    }
    setLoading(false);
  }

  async function downloadResume(id: number, filename: string) {
    const res = await fetch(`/api/admin/applications/${id}/download`);
    if (res.ok) {
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = filename || `resume-${id}.pdf`;
      a.click();
      window.URL.revokeObjectURL(url);
    }
  }

  async function updateStatus(id: number, status: string) {
    const res = await fetch(`/api/admin/applications/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    if (res.ok) fetchApplications();
  }

  async function deleteApplication(id: number) {
    if (!confirm("Delete this application?")) return;
    const res = await fetch(`/api/admin/applications/${id}`, { method: "DELETE" });
    if (res.ok) fetchApplications();
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "#05060c" }}>
        <p className="text-white">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ background: "#05060c" }}>
      <header
        className="flex items-center justify-between px-10 py-6 border-b"
        style={{ borderColor: "rgba(255,255,255,0.08)" }}
      >
        <div>
          <Link href="/admin/dashboard">
            <p
              className="text-[22px] tracking-[0.28em] text-white font-normal cursor-pointer hover:opacity-80 transition-opacity"
              style={{ fontFamily: "var(--font-optima), ui-serif, Georgia, serif" }}
            >
              KŌZO
            </p>
          </Link>
          <p className="text-[10px] tracking-[0.2em] uppercase mt-0.5" style={{ color: "#b89a5a" }}>
            Career Applications
          </p>
        </div>
        <Link
          href="/admin/dashboard"
          className="text-[11px] tracking-[0.14em] uppercase px-4 py-2 rounded-[3px] transition-colors"
          style={{ border: "1px solid rgba(255,255,255,0.2)", color: "rgba(255,255,255,0.6)" }}
        >
          ← Back
        </Link>
      </header>

      <main className="px-10 py-14 max-w-[1200px]">
        <h1
          className="text-[32px] font-normal text-white mb-2"
          style={{ fontFamily: "var(--font-optima), ui-serif, Georgia, serif" }}
        >
          Career Applications
        </h1>
        <p className="text-[13px] mb-10" style={{ color: "rgba(255,255,255,0.45)" }}>
          {applications.length} application{applications.length !== 1 ? "s" : ""} received
        </p>

        {applications.length === 0 ? (
          <div className="rounded-[4px] px-8 py-12 text-center" style={{ background: "rgba(255,255,255,0.03)" }}>
            <p className="text-[14px]" style={{ color: "rgba(255,255,255,0.4)" }}>
              No applications yet
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {applications.map((app) => (
              <div
                key={app.id}
                className="rounded-[4px] px-6 py-5"
                style={{ background: "rgba(242,228,177,0.05)", border: "1px solid rgba(242,228,177,0.12)" }}
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <p className="text-[16px] font-medium text-white mb-1">{app.name}</p>
                    <p className="text-[12px]" style={{ color: "rgba(255,255,255,0.5)" }}>
                      {app.email}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span
                      className="text-[10px] tracking-[0.14em] uppercase px-3 py-1 rounded-full"
                      style={{
                        background:
                          app.status === "pending"
                            ? "rgba(234,179,8,0.15)"
                            : app.status === "reviewed"
                            ? "rgba(59,130,246,0.15)"
                            : "rgba(34,197,94,0.15)",
                        color:
                          app.status === "pending"
                            ? "#fbbf24"
                            : app.status === "reviewed"
                            ? "#60a5fa"
                            : "#4ade80",
                      }}
                    >
                      {app.status}
                    </span>
                    <p className="text-[11px]" style={{ color: "rgba(255,255,255,0.35)" }}>
                      {new Date(app.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                <p className="text-[13px] leading-[1.7] mb-4" style={{ color: "rgba(255,255,255,0.6)" }}>
                  {app.message}
                </p>

                <div className="flex items-center gap-3 flex-wrap">
                  {app.filename && (
                    <button
                      onClick={() => downloadResume(app.id, app.filename)}
                      className="text-[11px] tracking-[0.12em] uppercase px-4 py-2 rounded-[3px] transition-colors"
                      style={{ background: "#F2E4B1", color: "#1b232b" }}
                    >
                      📄 Download Resume
                    </button>
                  )}
                  <select
                    value={app.status}
                    onChange={(e) => updateStatus(app.id, e.target.value)}
                    className="text-[11px] px-3 py-2 rounded-[3px]"
                    style={{ background: "rgba(255,255,255,0.08)", color: "white", border: "1px solid rgba(255,255,255,0.15)" }}
                  >
                    <option value="pending">Pending</option>
                    <option value="reviewed">Reviewed</option>
                    <option value="accepted">Accepted</option>
                    <option value="rejected">Rejected</option>
                  </select>
                  <button
                    onClick={() => deleteApplication(app.id)}
                    className="text-[11px] tracking-[0.12em] uppercase px-4 py-2 rounded-[3px] transition-colors ml-auto"
                    style={{ border: "1px solid rgba(239,68,68,0.3)", color: "#ef4444" }}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
