import { useState, useEffect } from "react";
import { UsersTable } from "./UsersTable";
import type { User } from "./types";
import { userFormat } from "./types";
import { useNavigate } from "react-router-dom";
import { AIQueryAgent } from "../AIQueryAgent";
import { X } from "lucide-react";

const USERS_URL = "http://localhost:3333/users";
const token = localStorage.getItem("token");

export function Dashboard() {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingUser, setEditingUser] = useState<User>(userFormat);
  const navigate = useNavigate();

  const fetchUsers = () => {
    setLoading(true);
    fetch(`${USERS_URL}/all`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        setUsers(data);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleEdit = (user: User) => {
    setEditingUser(user);
    setShowModal(true);
  };

  const handleDelete = (id: string) => {
    if (!confirm("Are you sure you want to delete this user?")) return;
    fetch(`${USERS_URL}/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    }).then(() => fetchUsers());
  };

  const handleViewBooks = (userId: string) => {
    navigate(`/admin/books?userId=${userId}`);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const method = editingUser.id ? "PATCH" : "POST";
    const url = editingUser.id ? `${USERS_URL}/${editingUser.id}` : USERS_URL;

    fetch(url, {
      method,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(editingUser),
    }).then(() => {
      setShowModal(false);
      setEditingUser(userFormat);
      fetchUsers();
    });
  };

  return (
    <div style={{ minHeight: "100vh" }}>
      <div style={{ maxWidth: "1400px", margin: "0 auto" }}>
        <div style={{ padding: "20px" }}>
          <h1
            className="color-1"
            style={{
              fontSize: "32px",
              fontWeight: "bold",
              marginBottom: "24px",
            }}
          >
            Admin Dashboard
          </h1>

          <UsersTable
            isLoading={isLoading}
            users={users}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onViewBooks={handleViewBooks}
          />
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <>
          {/* Backdrop */}
          <div
            style={{
              position: "fixed",
              inset: 0,
              backgroundColor: "rgba(0, 0, 0, 0.5)",
              zIndex: 40,
              animation: "fadeIn 0.2s ease-out",
            }}
            onClick={() => setShowModal(false)}
          />
          <style>{`
            @keyframes fadeIn {
              from { opacity: 0; }
              to { opacity: 1; }
            }
            @keyframes slideIn {
              from { opacity: 0; transform: translate(-50%, -48%) scale(0.95); }
              to { opacity: 1; transform: translate(-50%, -50%) scale(1); }
            }
          `}</style>

          {/* Modal Content */}
          <div
            style={{
              position: "fixed",
              left: "50%",
              top: "50%",
              transform: "translate(-50%, -50%)",
              backgroundColor: "white",
              borderRadius: "12px",
              boxShadow:
                "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
              width: "90%",
              maxWidth: "500px",
              zIndex: 50,
              animation: "slideIn 0.2s ease-out",
            }}
          >
            {/* Header */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "20px 24px",
                borderBottom: "1px solid #e5e7eb",
              }}
            >
              <h2
                style={{
                  margin: 0,
                  fontSize: "20px",
                  fontWeight: "600",
                  color: "#111827",
                }}
              >
                Edit User: {editingUser.name}
              </h2>
              <button
                onClick={() => setShowModal(false)}
                style={{
                  padding: "8px",
                  backgroundColor: "transparent",
                  border: "none",
                  borderRadius: "6px",
                  cursor: "pointer",
                  color: "#6b7280",
                  display: "flex",
                  alignItems: "center",
                  transition: "background-color 0.2s",
                }}
                onMouseOver={(e) =>
                  (e.currentTarget.style.backgroundColor = "#f3f4f6")
                }
                onMouseOut={(e) =>
                  (e.currentTarget.style.backgroundColor = "transparent")
                }
              >
                <X size={20} />
              </button>
            </div>

            {/* Body */}
            <div style={{ padding: "24px" }}>
              <div style={{ marginBottom: "20px" }}>
                <label
                  style={{
                    display: "block",
                    fontSize: "14px",
                    fontWeight: "500",
                    color: "#374151",
                    marginBottom: "8px",
                  }}
                >
                  Name
                </label>
                <input
                  type="text"
                  value={editingUser.name ?? ""}
                  onChange={(e) =>
                    setEditingUser({ ...editingUser, name: e.target.value })
                  }
                  style={{
                    width: "100%",
                    padding: "10px 12px",
                    fontSize: "14px",
                    border: "1px solid #d1d5db",
                    borderRadius: "6px",
                    outline: "none",
                    transition: "border-color 0.2s, box-shadow 0.2s",
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = "#3b82f6";
                    e.target.style.boxShadow =
                      "0 0 0 3px rgba(59, 130, 246, 0.1)";
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = "#d1d5db";
                    e.target.style.boxShadow = "none";
                  }}
                />
              </div>

              <div style={{ marginBottom: "20px" }}>
                <label
                  style={{
                    display: "block",
                    fontSize: "14px",
                    fontWeight: "500",
                    color: "#374151",
                    marginBottom: "8px",
                  }}
                >
                  Email
                </label>
                <input
                  type="email"
                  value={editingUser.email}
                  onChange={(e) =>
                    setEditingUser({ ...editingUser, email: e.target.value })
                  }
                  style={{
                    width: "100%",
                    padding: "10px 12px",
                    fontSize: "14px",
                    border: "1px solid #d1d5db",
                    borderRadius: "6px",
                    outline: "none",
                    transition: "border-color 0.2s, box-shadow 0.2s",
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = "#3b82f6";
                    e.target.style.boxShadow =
                      "0 0 0 3px rgba(59, 130, 246, 0.1)";
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = "#d1d5db";
                    e.target.style.boxShadow = "none";
                  }}
                />
              </div>

              <div style={{ marginBottom: "24px" }}>
                <label
                  style={{
                    display: "block",
                    fontSize: "14px",
                    fontWeight: "500",
                    color: "#374151",
                    marginBottom: "8px",
                  }}
                >
                  Role
                </label>
                <select
                  value={editingUser.role}
                  onChange={(e) =>
                    setEditingUser({ ...editingUser, role: e.target.value })
                  }
                  style={{
                    width: "100%",
                    padding: "10px 12px",
                    fontSize: "14px",
                    border: "1px solid #d1d5db",
                    borderRadius: "6px",
                    outline: "none",
                    backgroundColor: "white",
                    cursor: "pointer",
                    transition: "border-color 0.2s, box-shadow 0.2s",
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = "#3b82f6";
                    e.target.style.boxShadow =
                      "0 0 0 3px rgba(59, 130, 246, 0.1)";
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = "#d1d5db";
                    e.target.style.boxShadow = "none";
                  }}
                >
                  <option value="USER">USER</option>
                  <option value="ADMIN">ADMIN</option>
                </select>
              </div>

              {/* Footer */}
              <div
                style={{
                  display: "flex",
                  gap: "12px",
                  justifyContent: "flex-end",
                }}
              >
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  style={{
                    padding: "10px 20px",
                    fontSize: "14px",
                    fontWeight: "500",
                    color: "#374151",
                    backgroundColor: "white",
                    border: "1px solid #d1d5db",
                    borderRadius: "6px",
                    cursor: "pointer",
                    transition: "background-color 0.2s",
                  }}
                  onMouseOver={(e) =>
                    (e.currentTarget.style.backgroundColor = "#f9fafb")
                  }
                  onMouseOut={(e) =>
                    (e.currentTarget.style.backgroundColor = "white")
                  }
                >
                  Close
                </button>
                <button
                  type="button"
                  onClick={handleSubmit}
                  style={{
                    padding: "10px 20px",
                    fontSize: "14px",
                    fontWeight: "500",
                    color: "white",
                    backgroundColor: "#3b82f6",
                    border: "none",
                    borderRadius: "6px",
                    cursor: "pointer",
                    transition: "background-color 0.2s",
                  }}
                  onMouseOver={(e) =>
                    (e.currentTarget.style.backgroundColor = "#2563eb")
                  }
                  onMouseOut={(e) =>
                    (e.currentTarget.style.backgroundColor = "#3b82f6")
                  }
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </>
      )}
      <AIQueryAgent />
    </div>
  );
}
