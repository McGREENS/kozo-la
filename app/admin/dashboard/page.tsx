"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  FaEye,
  FaEyeSlash,
  FaUsers,
  FaFileAlt,
  FaEnvelope,
  FaUser,
  FaDownload,
  FaTimes,
  FaFilePdf,
  FaLock,
  FaCheck,
} from "react-icons/fa";

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
  cv_filename?: string | null;
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

interface JWTPayload {
  userId: number;
  email: string;
  name: string;
  role: string;
  iat: number;
  exp: number;
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

  // Profile management state
  const [currentUser, setCurrentUser] = useState<AdminUser | null>(null);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [profileForm, setProfileForm] = useState({ name: "", email: "" });
  const [passwordForm, setPasswordForm] = useState({ password: "" });
  const [profileLoading, setProfileLoading] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [profileMessage, setProfileMessage] = useState({ type: "", message: "" });

  useEffect(() => {
    fetchData();
    fetchCurrentUser();
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

  async function fetchCurrentUser() {
    try {
      // Check if we have JWT stored in sessionStorage from login
      const storedToken = sessionStorage.getItem("admin_token");
      if (storedToken) {
        try {
          // Decode JWT without verification (just to get payload on client side)
          const decoded = JSON.parse(atob(storedToken.split('.')[1])) as JWTPayload;
          setCurrentUser({
            id: decoded.userId,
            email: decoded.email,
            name: decoded.name,
            role: decoded.role,
            is_active: 1,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          });
        } catch (err) {
          console.error("Failed to decode token:", err);
        }
      }
    } catch (err) {
      console.error("Failed to fetch current user:", err);
    }
  }

  function openProfileModal() {
    if (currentUser) {
      setProfileForm({ name: currentUser.name, email: currentUser.email });
      setPasswordForm({ password: "" });
      setProfileMessage({ type: "", message: "" });
      setShowProfileModal(true);
    }
  }

  async function handleUpdateProfile(e: React.FormEvent) {
    e.preventDefault();
    setProfileLoading(true);
    setProfileMessage({ type: "", message: "" });

    try {
      const res = await fetch("/api/admin/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "update_profile",
          name: profileForm.name,
          email: profileForm.email,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setProfileMessage({ type: "error", message: data.error || "Failed to update profile" });
        return;
      }

      // Update current user state
      if (currentUser) {
        setCurrentUser({ ...currentUser, name: profileForm.name, email: profileForm.email });
      }
      setProfileMessage({ type: "success", message: "Profile updated successfully" });
      setTimeout(() => setShowProfileModal(false), 1500);
    } catch (err) {
      console.error(err);
      setProfileMessage({ type: "error", message: "Error updating profile" });
    } finally {
      setProfileLoading(false);
    }
  }

  async function handleUpdatePassword(e: React.FormEvent) {
    e.preventDefault();

    if (!passwordForm.password || passwordForm.password.length < 8) {
      setProfileMessage({ type: "error", message: "Password must be at least 8 characters" });
      return;
    }

    setProfileLoading(true);
    setProfileMessage({ type: "", message: "" });

    try {
      const res = await fetch("/api/admin/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "update_password",
          password: passwordForm.password,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setProfileMessage({ type: "error", message: data.error || "Failed to update password" });
        return;
      }

      setPasswordForm({ password: "" });
      setShowNewPassword(false);
      setProfileMessage({ type: "success", message: "Password updated successfully" });
      setTimeout(() => setShowProfileModal(false), 1500);
    } catch (err) {
      console.error(err);
      setProfileMessage({ type: "error", message: "Error updating password" });
    } finally {
      setProfileLoading(false);
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
    // Clear sessionStorage token
    sessionStorage.removeItem("admin_token");
    fetch("/api/admin/logout", { method: "POST" }).catch(() => {});
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
          <div style={{ display: "flex", gap: "16px", alignItems: "center" }}>
            {currentUser && (
              <button
                onClick={openProfileModal}
                style={{
                  padding: "10px 16px",
                  background: "rgba(160, 216, 179, 0.15)",
                  color: "#A0D8B3",
                  border: "1px solid rgba(160, 216, 179, 0.3)",
                  borderRadius: "6px",
                  cursor: "pointer",
                  fontSize: "12px",
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  fontWeight: "600",
                  transition: "all 0.3s ease",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "rgba(160, 216, 179, 0.25)";
                  e.currentTarget.style.borderColor = "rgba(160, 216, 179, 0.5)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "rgba(160, 216, 179, 0.15)";
                  e.currentTarget.style.borderColor = "rgba(160, 216, 179, 0.3)";
                }}
              >
                <FaUser style={{ marginRight: "6px", fontSize: "14px" }} />
                {currentUser.name || currentUser.email}
              </button>
            )}
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
                <FaDownload style={{ marginRight: "6px", fontSize: "12px" }} />
                Export CSV
              </button>
            )}

            {!loading && activeTab === "users" && currentUser?.role === "super_admin" && (
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
                {showNewUserForm ? (
                  <>
                    <FaTimes style={{ marginRight: "6px", fontSize: "12px" }} />
                    Cancel
                  </>
                ) : (
                  <>
                    <FaUser style={{ marginRight: "6px", fontSize: "12px" }} />
                    Add User
                  </>
                )}
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
              <div style={{ textAlign: "center", color: "#A0D8B3", padding: "60px 40px", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px" }}>
                Loading...
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
                <UsersTable
                  users={users}
                  onDelete={handleDeleteUser}
                  currentUserId={currentUser?.id}
                  isSuperAdmin={currentUser?.role === "super_admin"}
                />
              </>
            )}
          </div>

          {/* Profile Edit Modal */}
          {showProfileModal && currentUser && (
            <ProfileModal
              currentUser={currentUser}
              profileForm={profileForm}
              setProfileForm={setProfileForm}
              passwordForm={passwordForm}
              setPasswordForm={setPasswordForm}
              showNewPassword={showNewPassword}
              setShowNewPassword={setShowNewPassword}
              onUpdateProfile={handleUpdateProfile}
              onUpdatePassword={handleUpdatePassword}
              loading={profileLoading}
              message={profileMessage}
              onClose={() => setShowProfileModal(false)}
            />
          )}
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
        <FaUser style={{ marginRight: "8px", fontSize: "14px", verticalAlign: "text-bottom" }} />
        Create New User
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
  currentUserId,
  isSuperAdmin,
}: {
  users: AdminUser[];
  onDelete: (userId: number) => void;
  currentUserId?: number;
  isSuperAdmin?: boolean;
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
              <td style={{ textAlign: "center", padding: "14px 16px", display: "flex", gap: "8px", justifyContent: "center", flexWrap: "wrap" }}>
                {u.id === currentUserId && (
                  <span
                    style={{
                      padding: "6px 12px",
                      background: "rgba(160, 216, 179, 0.2)",
                      color: "#A0D8B3",
                      borderRadius: "4px",
                      fontSize: "11px",
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "4px",
                    }}
                  >
                    <FaCheck style={{ fontSize: "11px" }} />
                    Current
                  </span>
                )}
                {isSuperAdmin && u.role !== "super_admin" && u.id !== currentUserId && (
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
                )}
                {u.role === "super_admin" && (
                  <span style={{ fontSize: "11px", color: "rgba(248, 113, 113, 0.7)", padding: "6px 12px", display: "inline-flex", alignItems: "center", gap: "4px" }}>
                    <FaLock style={{ fontSize: "11px" }} />
                    Protected
                  </span>
                )}
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
  const [selectedMessage, setSelectedMessage] = useState<string | null>(null);

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
              Applied Role
            </th>
            <th style={{ textAlign: "left", padding: "16px", color: "#F0C2B2", fontWeight: "600" }}>
              Message Preview
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
              <td style={{ padding: "14px 16px", textTransform: "capitalize" }}>{app.role || "—"}</td>
              <td
                style={{
                  padding: "14px 16px",
                  maxWidth: "300px",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                  fontSize: "12px",
                  color: "rgba(242, 228, 177, 0.7)",
                }}
              >
                {app.message || "—"}
              </td>
              <td style={{ textAlign: "center", padding: "14px 16px", display: "flex", gap: "8px", justifyContent: "center", flexWrap: "wrap" }}>
                {app.message && (
                  <button
                    onClick={() => setSelectedMessage(app.message || "")}
                    style={{
                      padding: "6px 12px",
                      background: "rgba(160, 216, 179, 0.2)",
                      color: "#A0D8B3",
                      border: "1px solid rgba(160, 216, 179, 0.3)",
                      borderRadius: "4px",
                      cursor: "pointer",
                      fontSize: "11px",
                      transition: "all 0.3s ease",
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "4px",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = "rgba(160, 216, 179, 0.3)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = "rgba(160, 216, 179, 0.2)";
                    }}
                  >
                    <FaEye style={{ fontSize: "11px" }} />
                    View
                  </button>
                )}
                {app.cv_filename && (
                  <a
                    href={`/api/admin/careers/download?email=${encodeURIComponent(app.email)}`}
                    download
                    style={{
                      padding: "6px 12px",
                      background: "rgba(145, 130, 93, 0.9)",
                      color: "#fff",
                      border: "none",
                      borderRadius: "4px",
                      cursor: "pointer",
                      fontSize: "11px",
                      textDecoration: "none",
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "4px",
                      transition: "all 0.3s ease",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = "rgba(145, 130, 93, 1)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = "rgba(145, 130, 93, 0.9)";
                    }}
                  >
                    <FaFilePdf style={{ fontSize: "11px" }} />
                    Download
                  </a>
                )}
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

      {/* Message Modal */}
      {selectedMessage && (
        <>
          <div
            onClick={() => setSelectedMessage(null)}
            style={{
              position: "fixed",
              inset: 0,
              background: "rgba(0, 0, 0, 0.7)",
              zIndex: 100,
            }}
          />
          <div
            style={{
              position: "fixed",
              inset: 0,
              zIndex: 101,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              pointerEvents: "none",
            }}
          >
            <div
              onClick={(e) => e.stopPropagation()}
              style={{
                background: "rgba(26, 26, 26, 0.95)",
                backdropFilter: "blur(10px)",
                border: "1px solid rgba(240, 194, 178, 0.2)",
                borderRadius: "12px",
                padding: "32px",
                maxWidth: "600px",
                width: "90%",
                pointerEvents: "auto",
                maxHeight: "80vh",
                overflowY: "auto",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
                <h3 style={{ color: "#F2E4B1", margin: 0, fontSize: "16px" }}>
                  Application Message
                </h3>
                <button
                  onClick={() => setSelectedMessage(null)}
                  style={{
                    background: "none",
                    border: "none",
                    color: "#A0D8B3",
                    cursor: "pointer",
                    fontSize: "20px",
                    padding: "0",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <FaTimes />
                </button>
              </div>
              <p style={{ color: "rgba(242, 228, 177, 0.8)", fontSize: "14px", lineHeight: "1.6", whiteSpace: "pre-wrap", wordWrap: "break-word" }}>
                {selectedMessage}
              </p>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

function ProfileModal({
  currentUser,
  profileForm,
  setProfileForm,
  passwordForm,
  setPasswordForm,
  showNewPassword,
  setShowNewPassword,
  onUpdateProfile,
  onUpdatePassword,
  loading,
  message,
  onClose,
}: {
  currentUser: AdminUser;
  profileForm: { name: string; email: string };
  setProfileForm: (form: { name: string; email: string }) => void;
  passwordForm: { password: string };
  setPasswordForm: (form: { password: string }) => void;
  showNewPassword: boolean;
  setShowNewPassword: (show: boolean) => void;
  onUpdateProfile: (e: React.FormEvent) => void;
  onUpdatePassword: (e: React.FormEvent) => void;
  loading: boolean;
  message: { type: string; message: string };
  onClose: () => void;
}) {
  return (
    <>
      {/* Modal Overlay */}
      <div
        onClick={onClose}
        style={{
          position: "fixed",
          inset: 0,
          background: "rgba(0, 0, 0, 0.7)",
          zIndex: 100,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      />

      {/* Modal */}
      <div
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 101,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          pointerEvents: "none",
        }}
      >
        <div
          onClick={(e) => e.stopPropagation()}
          style={{
            background: "rgba(26, 26, 26, 0.95)",
            backdropFilter: "blur(10px)",
            border: "1px solid rgba(160, 216, 179, 0.2)",
            borderRadius: "12px",
            padding: "40px",
            maxWidth: "500px",
            width: "90%",
            pointerEvents: "auto",
            maxHeight: "90vh",
            overflowY: "auto",
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
            <h2 style={{ color: "#F2E4B1", margin: 0, fontSize: "20px" }}>
              Edit Profile
            </h2>
            <button
              onClick={onClose}
              style={{
                background: "none",
                border: "none",
                color: "#A0D8B3",
                cursor: "pointer",
                fontSize: "20px",
                padding: "0",
                width: "32px",
                height: "32px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <FaTimes />
            </button>
          </div>

          {/* Message */}
          {message.message && (
            <div
              style={{
                marginBottom: "16px",
                padding: "12px 14px",
                borderRadius: "6px",
                fontSize: "12px",
                background:
                  message.type === "success"
                    ? "rgba(160, 216, 179, 0.2)"
                    : "rgba(248, 113, 113, 0.2)",
                color: message.type === "success" ? "#A0D8B3" : "#f87171",
                border: `1px solid ${
                  message.type === "success"
                    ? "rgba(160, 216, 179, 0.3)"
                    : "rgba(248, 113, 113, 0.3)"
                }`,
              }}
            >
              {message.message}
            </div>
          )}

          {/* Profile Form */}
          <form onSubmit={onUpdateProfile} style={{ marginBottom: "24px" }}>
            <h3 style={{ color: "#A0D8B3", fontSize: "14px", marginBottom: "16px" }}>
              Profile Information
            </h3>
            <div style={{ marginBottom: "12px" }}>
              <label style={{ display: "block", color: "#A0D8B3", fontSize: "11px", marginBottom: "6px", textTransform: "uppercase" }}>
                Full Name
              </label>
              <input
                type="text"
                value={profileForm.name}
                onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                style={{
                  width: "100%",
                  padding: "10px 12px",
                  background: "rgba(242, 228, 177, 0.08)",
                  border: "1px solid rgba(242, 228, 177, 0.2)",
                  borderRadius: "6px",
                  color: "#F2E4B1",
                  fontSize: "13px",
                  fontFamily: "inherit",
                  boxSizing: "border-box",
                }}
                required
              />
            </div>
            <div style={{ marginBottom: "16px" }}>
              <label style={{ display: "block", color: "#A0D8B3", fontSize: "11px", marginBottom: "6px", textTransform: "uppercase" }}>
                Email Address
              </label>
              <input
                type="email"
                value={profileForm.email}
                onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })}
                style={{
                  width: "100%",
                  padding: "10px 12px",
                  background: "rgba(242, 228, 177, 0.08)",
                  border: "1px solid rgba(242, 228, 177, 0.2)",
                  borderRadius: "6px",
                  color: "#F2E4B1",
                  fontSize: "13px",
                  fontFamily: "inherit",
                  boxSizing: "border-box",
                }}
                required
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              style={{
                width: "100%",
                padding: "10px 16px",
                background: "#A0D8B3",
                color: "#0A1B2A",
                border: "none",
                borderRadius: "6px",
                cursor: loading ? "not-allowed" : "pointer",
                fontSize: "12px",
                fontWeight: "600",
                opacity: loading ? 0.6 : 1,
              }}
            >
              {loading ? "Updating..." : "Update Profile"}
            </button>
          </form>

          {/* Password Form */}
          <form onSubmit={onUpdatePassword}>
            <h3 style={{ color: "#A0D8B3", fontSize: "14px", marginBottom: "16px", paddingTop: "16px", borderTop: "1px solid rgba(160, 216, 179, 0.2)" }}>
              Change Password
            </h3>
            <div style={{ marginBottom: "16px" }}>
              <label style={{ display: "block", color: "#A0D8B3", fontSize: "11px", marginBottom: "6px", textTransform: "uppercase" }}>
                New Password (min 8 characters)
              </label>
              <div style={{ display: "flex", gap: "8px", alignItems: "center", background: "rgba(242, 228, 177, 0.08)", border: "1px solid rgba(242, 228, 177, 0.2)", borderRadius: "6px", padding: "0 10px" }}>
                <input
                  type={showNewPassword ? "text" : "password"}
                  value={passwordForm.password}
                  onChange={(e) => setPasswordForm({ password: e.target.value })}
                  style={{
                    flex: 1,
                    padding: "10px 0",
                    background: "transparent",
                    border: "none",
                    color: "#F2E4B1",
                    fontSize: "13px",
                    fontFamily: "inherit",
                    outline: "none",
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  style={{
                    background: "none",
                    border: "none",
                    color: "#A0D8B3",
                    cursor: "pointer",
                    fontSize: "12px",
                    padding: "0",
                  }}
                >
                  {showNewPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
            </div>
            <button
              type="submit"
              disabled={loading}
              style={{
                width: "100%",
                padding: "10px 16px",
                background: "rgba(248, 113, 113, 0.9)",
                color: "#fff",
                border: "none",
                borderRadius: "6px",
                cursor: loading ? "not-allowed" : "pointer",
                fontSize: "12px",
                fontWeight: "600",
                opacity: loading ? 0.6 : 1,
              }}
            >
              {loading ? "Updating..." : "Update Password"}
            </button>
          </form>
        </div>
      </div>
    </>
  );
}
