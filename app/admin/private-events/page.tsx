"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import * as XLSX from "xlsx";

interface Inquiry {
  id: number;
  name: string;
  email: string;
  phone: string | null;
  event_date: string | null;
  guests: number | null;
  message: string | null;
  submitted_at: string;
  status?: string;
}

export default function PrivateEventsPage() {
  const router = useRouter();
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState<"all" | "pending" | "contacted" | "completed">("all");

  useEffect(() => {
    fetchInquiries();
  }, []);

  async function fetchInquiries() {
    try {
      const res = await fetch("/api/admin/private-events");
      if (res.status === 401) {
        router.push("/admin/login");
        return;
      }
      if (!res.ok) throw new Error("Failed to fetch inquiries");
      const data = await res.json();
      setInquiries(data.inquiries || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load inquiries");
    } finally {
      setLoading(false);
    }
  }

  async function updateStatus(id: number, status: string) {
    try {
      const res = await fetch(`/api/admin/private-events/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });
      
      if (res.ok) {
        setInquiries(inquiries.map(inq => 
          inq.id === id ? { ...inq, status } : inq
        ));
      }
    } catch (err) {
      console.error("Failed to update status:", err);
    }
  }

  async function deleteInquiry(id: number) {
    if (!confirm("Are you sure you want to delete this inquiry?")) return;
    
    try {
      const res = await fetch(`/api/admin/private-events/${id}`, {
        method: 'DELETE'
      });
      
      if (res.ok) {
        setInquiries(inquiries.filter(inq => inq.id !== id));
      }
    } catch (err) {
      console.error("Failed to delete inquiry:", err);
    }
  }

  async function handleLogout() {
    await fetch("/api/admin/auth/logout", { method: "POST" });
    router.push("/admin/login");
  }

  function exportToExcel() {
    const filteredInquiries = inquiries.filter(inq => 
      filter === "all" || 
      (filter === "pending" && (!inq.status || inq.status === "pending")) ||
      inq.status === filter
    );

    const data = filteredInquiries.map(inquiry => ({
      Name: inquiry.name,
      Email: inquiry.email,
      Phone: inquiry.phone || "",
      "Event Date": inquiry.event_date ? new Date(inquiry.event_date).toLocaleDateString() : "",
      Guests: inquiry.guests || "",
      Message: inquiry.message || "",
      Status: inquiry.status || "pending",
      "Submitted At": new Date(inquiry.submitted_at).toLocaleString()
    }));

    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Private Event Inquiries");
    
    const timestamp = new Date().toISOString().split('T')[0];
    const filterLabel = filter === "all" ? "all" : filter;
    XLSX.writeFile(wb, `private-events-${filterLabel}-${timestamp}.xlsx`);
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-gray-600">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ background: "#05060c" }}>
      <header className="border-b" style={{ borderColor: "rgba(255,255,255,0.08)" }}>
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-white">Private Event Inquiries</h1>
            <p className="text-sm mt-1" style={{ color: "rgba(255,255,255,0.5)" }}>
              {inquiries.length} total {inquiries.length === 1 ? "inquiry" : "inquiries"}
            </p>
          </div>
          <div className="flex gap-4">
            {inquiries.length > 0 && (
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

        {/* Filter Tabs */}
        <div className="mb-6 flex gap-2">
          <button
            onClick={() => setFilter("all")}
            className={`px-4 py-2 rounded-[3px] text-sm font-medium transition-colors ${
              filter === "all" 
                ? "text-black" 
                : "text-white/70 hover:text-white"
            }`}
            style={filter === "all" ? { background: "#F2E4B1" } : { background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)" }}
          >
            All ({inquiries.length})
          </button>
          <button
            onClick={() => setFilter("pending")}
            className={`px-4 py-2 rounded-[3px] text-sm font-medium transition-colors ${
              filter === "pending" 
                ? "text-black" 
                : "text-white/70 hover:text-white"
            }`}
            style={filter === "pending" ? { background: "#F2E4B1" } : { background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)" }}
          >
            Pending ({inquiries.filter(i => !i.status || i.status === "pending").length})
          </button>
          <button
            onClick={() => setFilter("contacted")}
            className={`px-4 py-2 rounded-[3px] text-sm font-medium transition-colors ${
              filter === "contacted" 
                ? "text-black" 
                : "text-white/70 hover:text-white"
            }`}
            style={filter === "contacted" ? { background: "#F2E4B1" } : { background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)" }}
          >
            Contacted ({inquiries.filter(i => i.status === "contacted").length})
          </button>
          <button
            onClick={() => setFilter("completed")}
            className={`px-4 py-2 rounded-[3px] text-sm font-medium transition-colors ${
              filter === "completed" 
                ? "text-black" 
                : "text-white/70 hover:text-white"
            }`}
            style={filter === "completed" ? { background: "#F2E4B1" } : { background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)" }}
          >
            Completed ({inquiries.filter(i => i.status === "completed").length})
          </button>
        </div>

        {inquiries.filter(inq => 
          filter === "all" || 
          (filter === "pending" && (!inq.status || inq.status === "pending")) ||
          inq.status === filter
        ).length === 0 ? (
          <div className="rounded-lg shadow p-12 text-center" style={{ background: "rgba(242,228,177,0.07)", border: "1px solid rgba(242,228,177,0.18)" }}>
            <p style={{ color: "rgba(255,255,255,0.5)" }}>No inquiries in this category</p>
          </div>
        ) : (
          <div className="space-y-4">
            {inquiries.filter(inq => 
              filter === "all" || 
              (filter === "pending" && (!inq.status || inq.status === "pending")) ||
              inq.status === filter
            ).map((inquiry) => (
              <div key={inquiry.id} className="rounded-lg shadow p-6" style={{ background: "rgba(242,228,177,0.07)", border: "1px solid rgba(242,228,177,0.18)" }}>
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-white">{inquiry.name}</h3>
                    <p className="text-sm" style={{ color: "rgba(255,255,255,0.7)" }}>
                      <a href={`mailto:${inquiry.email}`} className="hover:text-[#F2E4B1] transition-colors">
                        {inquiry.email}
                      </a>
                    </p>
                    {inquiry.phone && (
                      <p className="text-sm" style={{ color: "rgba(255,255,255,0.7)" }}>
                        <a href={`tel:${inquiry.phone}`} className="hover:text-[#F2E4B1] transition-colors">
                          {inquiry.phone}
                        </a>
                      </p>
                    )}
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <span className="text-xs" style={{ color: "rgba(255,255,255,0.4)" }}>
                      {new Date(inquiry.submitted_at).toLocaleString()}
                    </span>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      inquiry.status === "completed" 
                        ? "bg-green-900/50 text-green-300"
                        : inquiry.status === "contacted"
                        ? "bg-blue-900/50 text-blue-300"
                        : "bg-yellow-900/50 text-yellow-300"
                    }`}>
                      {inquiry.status || "pending"}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                  {inquiry.event_date && (
                    <div>
                      <span className="font-medium" style={{ color: "rgba(255,255,255,0.8)" }}>Preferred Date:</span>
                      <span className="ml-2" style={{ color: "rgba(255,255,255,0.6)" }}>
                        {new Date(inquiry.event_date).toLocaleDateString()}
                      </span>
                    </div>
                  )}
                  {inquiry.guests && (
                    <div>
                      <span className="font-medium" style={{ color: "rgba(255,255,255,0.8)" }}>Guests:</span>
                      <span className="ml-2" style={{ color: "rgba(255,255,255,0.6)" }}>{inquiry.guests}</span>
                    </div>
                  )}
                </div>

                {inquiry.message && (
                  <div className="mt-4 p-4 rounded" style={{ background: "rgba(0,0,0,0.3)" }}>
                    <p className="text-sm font-medium mb-2" style={{ color: "rgba(255,255,255,0.8)" }}>Message:</p>
                    <p className="text-sm whitespace-pre-wrap" style={{ color: "rgba(255,255,255,0.7)" }}>{inquiry.message}</p>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="mt-4 pt-4 flex gap-2" style={{ borderTop: "1px solid rgba(255,255,255,0.1)" }}>
                  <select
                    value={inquiry.status || "pending"}
                    onChange={(e) => updateStatus(inquiry.id, e.target.value)}
                    className="px-3 py-2 text-sm rounded focus:outline-none focus:ring-2 focus:ring-[#F2E4B1] text-white"
                    style={{ background: "rgba(0,0,0,0.3)", border: "1px solid rgba(255,255,255,0.2)" }}
                  >
                    <option value="pending">Pending</option>
                    <option value="contacted">Contacted</option>
                    <option value="completed">Completed</option>
                  </select>
                  
                  <a
                    href={`mailto:${inquiry.email}?subject=RE: Private Event Inquiry - ${inquiry.name}`}
                    className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded hover:bg-blue-700 transition-colors"
                  >
                    Email
                  </a>
                  
                  {inquiry.phone && (
                    <a
                      href={`tel:${inquiry.phone}`}
                      className="px-4 py-2 text-sm font-medium text-white bg-green-600 rounded hover:bg-green-700 transition-colors"
                    >
                      Call
                    </a>
                  )}
                  
                  <button
                    onClick={() => deleteInquiry(inquiry.id)}
                    className="ml-auto px-4 py-2 text-sm font-medium text-white bg-red-600 rounded hover:bg-red-700 transition-colors"
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
