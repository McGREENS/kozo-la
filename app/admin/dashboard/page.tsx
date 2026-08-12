"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { FaUsers, FaFileAlt, FaEnvelope } from "react-icons/fa";

type Tab = "subscribers" | "careers" | "users";

interface Subscriber {
  id: string;
  name: string;
  email: string;
}

interface Application {
  id: string;
  name: string;
  email: string;
  role: string | null;
  message: string | null;
}

interface AdminUser {
  id: number;
  email: string;
  name: string;
  role: string;
  is_active: number;
  created_at: string;
  updated_at: string;
}

export default function AdminDashboard() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<Tab>("subscribers");
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [applications, setApplications] = useState<Application[]>([]);
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [showNewUserForm, setShowNewUserForm] = useState(false);
  const [newUser, setNewUser] = useState({ email: "", password: "", name: "", role: "admin" });
  const [createLoading, setCreateLoading] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    setLoading(true);
    setError("");

    try {
      const [subRes, carRes, usersRes] = await Promise.all([
        fetch("/api/admin/subscribers"),
        fetch("/api/admin/careers"),
        fetch("/api/admin/users"),
      ]);

      if (!subRes.ok || !carRes.ok || !usersRes.ok) {
        router.push("/admin/login");
        return;
      }

      const subData = await subRes.json();
      const carData = await carRes.json();
      const usersData = await usersRes.json();

      setSubscribers(subData.subscribers || []);
      setApplications(carData.applications || []);
      setUsers(usersData.users || []);
    } catch (err) {
      setError("Failed to load data");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  async function deleteSubscriber(email: string) {
    if (!confirm(`Delete ${email}?`)) return;

    try {
      const res = await fetch("/api/admin/subscribers", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      if (res.ok) {
        setSubscribers(subscribers.filter((s) => s.email !== email));
      }
    } catch (err) {
      console.error(err);
    }
  }

  async function deleteApplication(email: string) {
    if (!confirm(`Delete ${email}?`)) return;

    try {
      const res = await fetch("/api/admin/careers", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      if (res.ok) {
        setApplications(applications.filter((a) => a.email !== email));
      }
    } catch (err) {
      console.error(err);
    }
  }

  function exportToCSV(data: any[], filename: string) {
    const csv = [
      Object.keys(data[0] || {}).join(","),
      ...data.map((row) =>
        Object.values(row)
          .map((v) => `"${String(v || "").replace(/"/g, '""')}"`)
          .join(",")
      ),
    ].join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    window.URL.revokeObjectURL(url);
  }

  function handleLogout() {
    // Clear httpOnly cookie by calling logout endpoint or just redirect
    // The cookie will be cleared on the server
    fetch("/api/admin/auth", { method: "GET" }).catch(() => {});
    router.push("/admin/login");
  }

  async function handleCreateUser(e: React.FormEvent) {
    e.preventDefault();
    setCreateLoading(true);

    try {
      const res = await fetch("/api/admin/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newUser),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.error || "Failed to create user");
        return;
      }

      setNewUser({ email: "", password: "", name: "", role: "admin" });
      setShowNewUserForm(false);
      await fetchData();
    } catch (err) {
      console.error(err);
      alert("Error creating user");
    } finally {
      setCreateLoading(false);
    }
  }

  async function handleDeleteUser(userId: number) {
    if (!confirm("Delete this user? This action cannot be undone.")) return;

    try {
      const res = await fetch("/api/admin/users", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId }),
      });

      if (res.ok) {
        setUsers(users.filter((u) => u.id !== userId));
      } else {
        alert("Failed to delete user");
      }
    } catch (err) {
      console.error(err);
      alert("Error deleting user");
    }
  }

  const filteredSubscribers = subscribers.filter(
    (s) =>
      s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredApplications = applications.filter(
    (a) =>
      a.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div
      style={{
        background: `url(/image1.jpeg) center center / cover fixed`,
        minHeight: "100vh",
        fontFamily: "'Optima', Georgia, serif",
        position: "relative",
      }}
    >
      {/* Background Overlay */}
      <div
        style={{
          position: "fixed",
          inset: 0,
          background: "linear-gradient(135deg, rgba(10, 27, 42, 0.93) 0%, rgba(10, 27, 42, 0.87) 100%)",
          zIndex: 0,
        }}
      />

      {/* Main Content */}
      <div style={{ position: "relative", zIndex: 1 }}>
        {/* Header */}
        <div
          style={{
            background: "rgba(26, 26, 26, 0.8)",
            backdropFilter: "blur(10px)",
            borderBottom: "1px solid rgba(160, 216, 179, 0.15)",
            padding: "24px 48px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <h1 style={{ fontSize: "28px", color: "#F2E4B1", margin: 0, letterSpacing: "0.05em" }}>
            Dashboard
          </h1>
          <button
            onClick={handleLogout}
            style={{
              padding: "10px 20px",
              background: "rgba(248, 113, 113, 0.9)",
              color: "#fff",
              border: "none",
              borderRadius: "6px",
              cursor: "pointer",
              fontSize: "12px",
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              fontWeight: "600",
              transition: "all 0.3s ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "#f87171";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "rgba(248, 113, 113, 0.9)";
            }}
          >
            Logout
          </button>
        </div>

        {/* Stats Cards */}
        <div style={{ padding: "40px 48px" }}>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
              gap: "20px",
              marginBottom: "40px",
            }}
          >
            {/* Subscribers Card */}
            <div
              style={{
                background: "rgba(160, 216, 179, 0.1)",
                border: "1px solid rgba(160, 216, 179, 0.2)",
                borderRadius: "12px",
                padding: "24px",
                backdropFilter: "blur(10px)",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "16px" }}>
                <h3 style={{ fontSize: "12px", color: "#A0D8B3", letterSpacing: "0.1em", textTransform: "uppercase", margin: 0 }}>
                  Newsletter Subscribers
                </h3>
                <FaEnvelope style={{ color: "#A0D8B3", fontSize: "20px" }} />
              </div>
              <p style={{ fontSize: "32px", color: "#F2E4B1", fontWeight: "600", margin: 0 }}>
                {subscribers.length}
              </p>
              <p style={{ fontSize: "12px", color: "rgba(160, 216, 179, 0.6)", margin: "8px 0 0" }}>
                Active signups
              </p>
            </div>

            {/* Careers Card */}
            <div
              style={{
                background: "rgba(240, 194, 178, 0.1)",
                border: "1px solid rgba(240, 194, 178, 0.2)",
                borderRadius: "12px",
                padding: "24px",
                backdropFilter: "blur(10px)",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "16px" }}>
                <h3 style={{ fontSize: "12px", color: "#F0C2B2", letterSpacing: "0.1em", textTransform: "uppercase", margin: 0 }}>
                  Career Applications
                </h3>
                <FaFileAlt style={{ color: "#F0C2B2", fontSize: "20px" }} />
              </div>
              <p style={{ fontSize: "32px", color: "#F2E4B1", fontWeight: "600", margin: 0 }}>
                {applications.length}
              </p>
              <p style={{ fontSize: "12px", color: "rgba(240, 194, 178, 0.6)", margin: "8px 0 0" }}>
                Pending review
              </p>
            </div>

            {/* Users Card */}
            <div
              style={{
                background: "rgba(0, 84, 111, 0.1)",
                border: "1px solid rgba(0, 84, 111, 0.2)",
                borderRadius: "12px",
                padding: "24px",
                backdropFilter: "blur(10px)",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "16px" }}>
                <h3 style={{ fontSize: "12px", color: "#00546F", letterSpacing: "0.1em", textTransform: "uppercase", margin: 0 }}>
                  Admin Users
                </h3>
                <FaUsers style={{ color: "#00546F", fontSize: "20px" }} />
              </div>
              <p style={{ fontSize: "32px", color: "#F2E4B1", fontWeight: "600", margin: 0 }}>
                {users.length}
              </p>
              <p style={{ fontSize: "12px", color: "rgba(0, 84, 111, 0.6)", margin: "8px 0 0" }}>
                Team members
              </p>
            </div>
          </div>

          {/* Tabs */}
          <div style={{ display: "flex", gap: "12px", marginBottom: "24px", flexWrap: "wrap" }}>
            {(["subscribers", "careers", "users"] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                style={{
                  padding: "10px 20px",
                  background: activeTab === tab ? "#A0D8B3" : "rgba(160, 216, 179, 0.1)",
                  color: activeTab === tab ? "#0A1B2A" : "#A0D8B3",
                  border: activeTab === tab ? "none" : "1px solid rgba(160, 216, 179, 0.2)",
                  borderRadius: "6px",
                  cursor: "pointer",
                  fontSize: "12px",
                  textTransform: "uppercase",
                  letterSpacing: "0.1em",
                  fontWeight: "600",
                  transition: "all 0.3s ease",
                  backdropFilter: "blur(10px)",
                }}
              >
                {tab === "subscribers"
                  ? `Subscribers (${subscribers.length})`
                  : tab === "careers"
                  ? `Careers (${applications.length})`
                  : `Users (${users.length})`}
              </button>
            ))}
          </div>

          {/* Search Bar */}
          <div style={{ marginBottom: "24px" }}>
            <input
              type="text"
              placeholder="Search by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                width: "100%",
                maxWidth: "400px",
                padding: "10px 14px",
                background: "rgba(242, 228, 177, 0.08)",
                border: "1px solid rgba(242, 228, 177, 0.2)",
                borderRadius: "6px",
                color: "#F2E4B1",
                fontSize: "14px",
                boxSizing: "border-box",
                transition: "all 0.3s ease",
              }}
              onFocus={(e) => {
                e.currentTarget.style.borderColor = "rgba(160, 216, 179, 0.4)";
                e.currentTarget.style.background = "rgba(242, 228, 177, 0.12)";
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = "rgba(242, 228, 177, 0.2)";
                e.currentTarget.style.background = "rgba(242, 228, 177, 0.08)";
              }}
            />
          </div>

          {/* Action Buttons */}
          <div style={{ marginBottom: "24px", display: "flex", gap: "12px", flexWrap: "wrap" }}>
            {!loading && activeTab !== "users" && (
              <button
                onClick={() => {
                  if (activeTab === "subscribers") {
                    exportToCSV(filteredSubscribers, "subscribers.csv");
                  } else {
                    exportToCSV(filteredApplications, "career-applications.csv");
                  }
                }}
                style={{
                  padding: "10px 16px",
                  background: "rgba(145, 130, 93, 0.9)",
                  color: "#fff",
                  border: "none",
                  borderRadius: "6px",
                  cursor: "pointer",
                  fontSize: "12px",
                  textTransform: "uppercase",
                  letterSpacing: "0.08em",
                  fontWeight: "600",
                  transition: "all 0.3s ease",
                }}
              >
                📥 Export CSV
              </button>
            )}

            {!loading && activeTab === "users" && (
              <button
                onClick={() => setShowNewUserForm(!showNewUserForm)}
                style={{
                  padding: "10px 16px",
                  background: "#A0D8B3",
                  color: "#0A1B2A",
                  border: "none",
                  borderRadius: "6px",
                  cursor: "pointer",
                  fontSize: "12px",
                  textTransform: "uppercase",
                  letterSpacing: "0.08em",
                  fontWeight: "600",
                  transition: "all 0.3s ease",
                }}
              >
                {showNewUserForm ? "✕ Cancel" : "+ Add User"}
              </button>
            )}
          </div>

          {/* Data Table */}
          <div
            style={{
              background: "rgba(26, 26, 26, 0.8)",
              backdropFilter: "blur(10px)",
              border: "1px solid rgba(160, 216, 179, 0.15)",
              borderRadius: "12px",
              overflow: "hidden",
            }}
          >
            {loading ? (
              <div style={{ textAlign: "center", color: "#A0D8B3", padding: "60px 40px" }}>
                ⏳ Loading...
              </div>
            ) : error ? (
              <div style={{ color: "#f87171", padding: "20px", textAlign: "center" }}>
                ❌ {error}
              </div>
            ) : activeTab === "subscribers" ? (
              <SubscribersTable
                subscribers={filteredSubscribers}
                onDelete={deleteSubscriber}
              />
            ) : activeTab === "careers" ? (
              <CareersTable
                applications={filteredApplications}
                onDelete={deleteApplication}
              />
            ) : (
              <>
                {showNewUserForm && (
                  <NewUserForm
                    newUser={newUser}
                    setNewUser={setNewUser}
                    onSubmit={handleCreateUser}
                    loading={createLoading}
                  />
                )}
                <UsersTable users={users} onDelete={handleDeleteUser} />
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function NewUserForm({
  newUser,
  setNewUser,
  onSubmit,
  loading,
}: {
  newUser: any;
  setNewUser: any;
  onSubmit: (e: React.FormEvent) => void;
  loading: boolean;
}) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <form
      onSubmit={onSubmit}
      style={{
        background: "rgba(160, 216, 179, 0.08)",
        borderBottom: "1px solid rgba(160, 216, 179, 0.15)",
        padding: "24px",
      }}
    >
      <h3 style={{ color: "#F2E4B1", marginTop: 0, marginBottom: "16px", fontSize: "14px" }}>
        ➕ Create New User
      </h3>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "16px" }}>
        <input
          type="email"
          placeholder="Email"
          value={newUser.email}
          onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
          style={{
            padding: "10px",
            background: "rgba(242, 228, 177, 0.08)",
            border: "1px solid rgba(242, 228, 177, 0.2)",
            borderRadius: "6px",
            color: "#F2E4B1",
            fontSize: "12px",
            fontFamily: "inherit",
          }}
          required
        />
        <input
          type="text"
          placeholder="Full Name"
          value={newUser.name}
          onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
          style={{
            padding: "10px",
            background: "rgba(242, 228, 177, 0.08)",
            border: "1px solid rgba(242, 228, 177, 0.2)",
            borderRadius: "6px",
            color: "#F2E4B1",
            fontSize: "12px",
            fontFamily: "inherit",
          }}
          required
        />
        <div style={{ display: "flex", gap: "8px", alignItems: "center", background: "rgba(242, 228, 177, 0.08)", border: "1px solid rgba(242, 228, 177, 0.2)", borderRadius: "6px", padding: "0 10px" }}>
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Password (min 8)"
            value={newUser.password}
            onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
            style={{
              flex: 1,
              padding: "10px 0",
              background: "transparent",
              border: "none",
              color: "#F2E4B1",
              fontSize: "12px",
              fontFamily: "inherit",
              outline: "none",
            }}
            required
          />
          <button type="button" onClick={() => setShowPassword(!showPassword)} style={{ background: "none", border: "none", color: "#A0D8B3", cursor: "pointer", fontSize: "12px" }}>
            {showPassword ? <FaEyeSlash /> : <FaEye />}
          </button>
        </div>
        <select
          value={newUser.role}
          onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
          style={{
            padding: "10px",
            background: "rgba(242, 228, 177, 0.08)",
            border: "1px solid rgba(242, 228, 177, 0.2)",
            borderRadius: "6px",
            color: "#F2E4B1",
            fontSize: "12px",
            fontFamily: "inherit",
          }}
        >
          <option value="admin">Admin</option>
          <option value="moderator">Moderator</option>
        </select>
      </div>
      <button
        type="submit"
        disabled={loading}
        style={{
          padding: "10px 20px",
          background: "#A0D8B3",
          color: "#0A1B2A",
          border: "none",
          borderRadius: "6px",
          cursor: loading ? "not-allowed" : "pointer",
          fontSize: "12px",
          fontWeight: "600",
          opacity: loading ? 0.6 : 1,
          transition: "all 0.3s ease",
        }}
      >
        {loading ? "Creating..." : "Create User"}
      </button>
    </form>
  );
}

function UsersTable({
  users,
  onDelete,
}: {
  users: AdminUser[];
  onDelete: (userId: number) => void;
}) {
  return (
    <div style={{ overflowX: "auto" }}>
      <table
        style={{
          width: "100%",
          borderCollapse: "collapse",
          fontSize: "13px",
        }}
      >
        <thead>
          <tr style={{ background: "rgba(0, 84, 111, 0.1)", borderBottom: "2px solid rgba(0, 84, 111, 0.2)" }}>
            <th style={{ textAlign: "left", padding: "16px", color: "#00546F", fontWeight: "600" }}>
              Name
            </th>
            <th style={{ textAlign: "left", padding: "16px", color: "#00546F", fontWeight: "600" }}>
              Email
            </th>
            <th style={{ textAlign: "left", padding: "16px", color: "#00546F", fontWeight: "600" }}>
              Role
            </th>
            <th style={{ textAlign: "left", padding: "16px", color: "#00546F", fontWeight: "600" }}>
              Status
            </th>
            <th style={{ textAlign: "left", padding: "16px", color: "#00546F", fontWeight: "600" }}>
              Created
            </th>
            <th style={{ textAlign: "center", padding: "16px", color: "#00546F", fontWeight: "600" }}>
              Action
            </th>
          </tr>
        </thead>
        <tbody>
          {users.map((u) => (
            <tr
              key={u.id}
              style={{
                borderBottom: "1px solid rgba(0, 84, 111, 0.1)",
                transition: "background 0.3s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "rgba(0, 84, 111, 0.05)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "transparent";
              }}
            >
              <td style={{ padding: "14px 16px" }}>{u.name}</td>
              <td style={{ padding: "14px 16px", color: "#F2E4B1" }}>{u.email}</td>
              <td style={{ padding: "14px 16px", textTransform: "capitalize" }}>
                {u.role}
              </td>
              <td style={{ padding: "14px 16px" }}>
                <span
                  style={{
                    padding: "4px 10px",
                    background: u.is_active ? "rgba(160, 216, 179, 0.2)" : "rgba(248, 113, 113, 0.2)",
                    color: u.is_active ? "#A0D8B3" : "#f87171",
                    borderRadius: "4px",
                    fontSize: "11px",
                    fontWeight: "600",
                  }}
                >
                  {u.is_active ? "Active" : "Inactive"}
                </span>
              </td>
              <td style={{ padding: "14px 16px", fontSize: "12px", color: "rgba(242, 228, 177, 0.7)" }}>
                {new Date(u.created_at).toLocaleDateString()}
              </td>
              <td style={{ textAlign: "center", padding: "14px 16px" }}>
                <button
                  onClick={() => onDelete(u.id)}
                  style={{
                    padding: "6px 12px",
                    background: "rgba(248, 113, 113, 0.9)",
                    color: "#fff",
                    border: "none",
                    borderRadius: "4px",
                    cursor: "pointer",
                    fontSize: "11px",
                    transition: "all 0.3s ease",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = "#f87171";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "rgba(248, 113, 113, 0.9)";
                  }}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {users.length === 0 && (
        <div style={{ textAlign: "center", padding: "40px", color: "rgba(0, 84, 111, 0.5)" }}>
          No users found
        </div>
      )}
    </div>
  );
}

function SubscribersTable({
  subscribers,
  onDelete,
}: {
  subscribers: Subscriber[];
  onDelete: (email: string) => void;
}) {
  return (
    <div style={{ overflowX: "auto" }}>
      <table
        style={{
          width: "100%",
          borderCollapse: "collapse",
          fontSize: "13px",
        }}
      >
        <thead>
          <tr style={{ background: "rgba(160, 216, 179, 0.1)", borderBottom: "2px solid rgba(160, 216, 179, 0.2)" }}>
            <th style={{ textAlign: "left", padding: "16px", color: "#A0D8B3", fontWeight: "600" }}>
              Name
            </th>
            <th style={{ textAlign: "left", padding: "16px", color: "#A0D8B3", fontWeight: "600" }}>
              Email
            </th>
            <th style={{ textAlign: "center", padding: "16px", color: "#A0D8B3", fontWeight: "600" }}>
              Action
            </th>
          </tr>
        </thead>
        <tbody>
          {subscribers.map((sub) => (
            <tr
              key={sub.email}
              style={{
                borderBottom: "1px solid rgba(160, 216, 179, 0.1)",
                transition: "background 0.3s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "rgba(160, 216, 179, 0.05)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "transparent";
              }}
            >
              <td style={{ padding: "14px 16px" }}>{sub.name}</td>
              <td style={{ padding: "14px 16px", color: "#F2E4B1" }}>{sub.email}</td>
              <td style={{ textAlign: "center", padding: "14px 16px" }}>
                <button
                  onClick={() => onDelete(sub.email)}
                  style={{
                    padding: "6px 12px",
                    background: "rgba(248, 113, 113, 0.9)",
                    color: "#fff",
                    border: "none",
                    borderRadius: "4px",
                    cursor: "pointer",
                    fontSize: "11px",
                    transition: "all 0.3s ease",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = "#f87171";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "rgba(248, 113, 113, 0.9)";
                  }}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {subscribers.length === 0 && (
        <div style={{ textAlign: "center", padding: "40px", color: "rgba(160, 216, 179, 0.5)" }}>
          No subscribers found
        </div>
      )}
    </div>
  );
}

function CareersTable({
  applications,
  onDelete,
}: {
  applications: Application[];
  onDelete: (email: string) => void;
}) {
  return (
    <div style={{ overflowX: "auto" }}>
      <table
        style={{
          width: "100%",
          borderCollapse: "collapse",
          fontSize: "13px",
        }}
      >
        <thead>
          <tr style={{ background: "rgba(240, 194, 178, 0.1)", borderBottom: "2px solid rgba(240, 194, 178, 0.2)" }}>
            <th style={{ textAlign: "left", padding: "16px", color: "#F0C2B2", fontWeight: "600" }}>
              Name
            </th>
            <th style={{ textAlign: "left", padding: "16px", color: "#F0C2B2", fontWeight: "600" }}>
              Email
            </th>
            <th style={{ textAlign: "left", padding: "16px", color: "#F0C2B2", fontWeight: "600" }}>
              Role
            </th>
            <th style={{ textAlign: "left", padding: "16px", color: "#F0C2B2", fontWeight: "600" }}>
              Message
            </th>
            <th style={{ textAlign: "center", padding: "16px", color: "#F0C2B2", fontWeight: "600" }}>
              Action
            </th>
          </tr>
        </thead>
        <tbody>
          {applications.map((app) => (
            <tr
              key={app.email}
              style={{
                borderBottom: "1px solid rgba(240, 194, 178, 0.1)",
                transition: "background 0.3s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "rgba(240, 194, 178, 0.05)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "transparent";
              }}
            >
              <td style={{ padding: "14px 16px" }}>{app.name}</td>
              <td style={{ padding: "14px 16px", color: "#F2E4B1" }}>{app.email}</td>
              <td style={{ padding: "14px 16px" }}>{app.role || "—"}</td>
              <td
                style={{
                  padding: "14px 16px",
                  maxWidth: "200px",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                  fontSize: "12px",
                  color: "rgba(242, 228, 177, 0.7)",
                }}
              >
                {app.message || "—"}
              </td>
              <td style={{ textAlign: "center", padding: "14px 16px" }}>
                <button
                  onClick={() => onDelete(app.email)}
                  style={{
                    padding: "6px 12px",
                    background: "rgba(248, 113, 113, 0.9)",
                    color: "#fff",
                    border: "none",
                    borderRadius: "4px",
                    cursor: "pointer",
                    fontSize: "11px",
                    transition: "all 0.3s ease",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = "#f87171";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "rgba(248, 113, 113, 0.9)";
                  }}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {applications.length === 0 && (
        <div style={{ textAlign: "center", padding: "40px", color: "rgba(240, 194, 178, 0.5)" }}>
          No applications found
        </div>
      )}
    </div>
  );
}
