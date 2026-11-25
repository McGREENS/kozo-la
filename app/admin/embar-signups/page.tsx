"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import * as XLSX from "xlsx";

interface Signup {
  id: number;
  email: string;
  subscribed_at: string;
  created_at: string;
}

export default function EmbarSignupsPage() {
  const router = useRouter();
  const [signups, setSignups] = useState<Signup[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchSignups();
  }, []);

  async function fetchSignups() {
    try {
      const res = await fetch("/api/admin/embar-signups");
      if (res.status === 401) {
        router.push("/admin/login");
        return;
      }
      if (!res.ok) throw new Error("Failed to fetch signups");
      const data = await res.json();
      setSignups(data.signups || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load signups");
    } finally {
      setLoading(false);
    }
  }

  async function handleLogout() {
    await fetch("/api/admin/auth/logout", { method: "POST" });
    router.push("/admin/login");
  }

  function exportToExcel() {
    const data = signups.map(signup => ({
      Email: signup.email,
      "Subscribed At": new Date(signup.subscribed_at).toLocaleString(),
      "Created At": new Date(signup.created_at).toLocaleString()
    }));

    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Embār Signups");
    
    const timestamp = new Date().toISOString().split('T')[0];
    XLSX.writeFile(wb, `embar-signups-${timestamp}.xlsx`);
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "#05060c" }}>
        <p style={{ color: "rgba(255,255,255,0.6)" }}>Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ background: "#05060c" }}>
      <header className="border-b" style={{ borderColor: "rgba(255,255,255,0.08)" }}>
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-white">Embār Signups</h1>
            <p className="text-sm mt-1" style={{ color: "rgba(255,255,255,0.5)" }}>
              {signups.length} total {signups.length === 1 ? "signup" : "signups"}
            </p>
          </div>
          <div className="flex gap-4">
            {signups.length > 0 && (
              <button
                onClick={exportToExcel}
                className="px-4 py-2 text-sm font-medium transition-colors rounded-[3px]"
                style={{ 
                  color: "#000", 
                  background: "#F2E4B1",
                  border: "1px solid #F2E4B1" 
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "rgba(242,228,177,0.8)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "#F2E4B1";
                }}
              >
                Download Excel
              </button>
            )}
            <button
              onClick={() => router.push("/admin/dashboard")}
              className="px-4 py-2 text-sm font-medium transition-colors rounded-[3px]"
              style={{ 
                color: "rgba(255,255,255,0.6)", 
                border: "1px solid rgba(255,255,255,0.2)" 
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = "rgba(242,228,177,0.4)";
                e.currentTarget.style.color = "rgba(255,255,255,0.9)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = "rgba(255,255,255,0.2)";
                e.currentTarget.style.color = "rgba(255,255,255,0.6)";
              }}
            >
              Dashboard
            </button>
            <button
              onClick={handleLogout}
              className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded hover:bg-red-700"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">
        {error && (
          <div className="mb-6 p-4 rounded" style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.3)" }}>
            <p style={{ color: "#fca5a5" }}>{error}</p>
          </div>
        )}

        {signups.length === 0 ? (
          <div className="rounded-lg shadow p-12 text-center" style={{ background: "rgba(242,228,177,0.07)", border: "1px solid rgba(242,228,177,0.18)" }}>
            <p style={{ color: "rgba(255,255,255,0.5)" }}>No signups yet</p>
          </div>
        ) : (
          <div className="rounded-lg shadow overflow-hidden" style={{ background: "rgba(242,228,177,0.07)", border: "1px solid rgba(242,228,177,0.18)" }}>
            <table className="min-w-full">
              <thead style={{ background: "rgba(0,0,0,0.3)" }}>
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider" style={{ color: "rgba(255,255,255,0.7)" }}>
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider" style={{ color: "rgba(255,255,255,0.7)" }}>
                    Subscribed At
                  </th>
                </tr>
              </thead>
              <tbody style={{ borderTop: "1px solid rgba(255,255,255,0.1)" }}>
                {signups.map((signup, index) => (
                  <tr 
                    key={signup.id} 
                    className="transition-colors hover:bg-black/20"
                    style={index > 0 ? { borderTop: "1px solid rgba(255,255,255,0.08)" } : {}}
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm" style={{ color: "rgba(255,255,255,0.9)" }}>
                      <a href={`mailto:${signup.email}`} className="hover:text-[#F2E4B1] transition-colors">
                        {signup.email}
                      </a>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm" style={{ color: "rgba(255,255,255,0.6)" }}>
                      {new Date(signup.subscribed_at).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  );
}
