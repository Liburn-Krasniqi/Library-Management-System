import { PencilLine, Trash2, BookOpen } from "lucide-react";

interface User {
  id: string;
  name?: string;
  email: string;
  role: string;
  createdAt: string;
}

interface UsersTableProps {
  isLoading: boolean;
  users: User[];
  onEdit: (user: User) => void;
  onDelete: (userId: string) => void;
  onViewBooks: (userId: string) => void;
}

export function UsersTable({
  users,
  onEdit,
  onDelete,
  onViewBooks,
}: UsersTableProps) {
  if (!users || !Array.isArray(users)) {
    return (
      <div style={{ padding: "40px", textAlign: "center" }}>
        <p style={{ color: "#6b7280" }}>No users found</p>
      </div>
    );
  }
  return (
    <div>
      <div
        style={{
          backgroundColor: "white",
          borderRadius: "8px",
          border: "1px solid #e5e7eb",
          overflow: "hidden",
        }}
      >
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr
              style={{
                backgroundColor: "#f9fafb",
                borderBottom: "1px solid #e5e7eb",
              }}
            >
              <th
                style={{
                  padding: "12px 24px",
                  textAlign: "left",
                  fontSize: "12px",
                  fontWeight: "500",
                  color: "#6b7280",
                  textTransform: "uppercase",
                  letterSpacing: "0.05em",
                }}
              >
                Name
              </th>
              <th
                style={{
                  padding: "12px 24px",
                  textAlign: "left",
                  fontSize: "12px",
                  fontWeight: "500",
                  color: "#6b7280",
                  textTransform: "uppercase",
                  letterSpacing: "0.05em",
                }}
              >
                Email
              </th>
              <th
                style={{
                  padding: "12px 24px",
                  textAlign: "left",
                  fontSize: "12px",
                  fontWeight: "500",
                  color: "#6b7280",
                  textTransform: "uppercase",
                  letterSpacing: "0.05em",
                }}
              >
                Role
              </th>
              <th
                style={{
                  padding: "12px 24px",
                  textAlign: "left",
                  fontSize: "12px",
                  fontWeight: "500",
                  color: "#6b7280",
                  textTransform: "uppercase",
                  letterSpacing: "0.05em",
                }}
              >
                Created At
              </th>
              <th
                style={{
                  padding: "12px 24px",
                  textAlign: "left",
                  fontSize: "12px",
                  fontWeight: "500",
                  color: "#6b7280",
                  textTransform: "uppercase",
                  letterSpacing: "0.05em",
                }}
              >
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr
                key={user.id}
                style={{ borderBottom: "1px solid #e5e7eb" }}
                onMouseOver={(e) =>
                  (e.currentTarget.style.backgroundColor = "#f9fafb")
                }
                onMouseOut={(e) =>
                  (e.currentTarget.style.backgroundColor = "white")
                }
              >
                <td
                  style={{
                    padding: "16px 24px",
                    fontSize: "14px",
                    color: "#111827",
                  }}
                >
                  {user.name ?? "-"}
                </td>
                <td
                  style={{
                    padding: "16px 24px",
                    fontSize: "14px",
                    color: "#111827",
                  }}
                >
                  {user.email}
                </td>
                <td
                  style={{
                    padding: "16px 24px",
                    fontSize: "14px",
                    color: "#111827",
                  }}
                >
                  <span
                    style={{
                      padding: "4px 12px",
                      fontSize: "12px",
                      fontWeight: "500",
                      borderRadius: "9999px",
                      backgroundColor: "#dbeafe",
                      color: "#1e40af",
                    }}
                  >
                    {user.role}
                  </span>
                </td>
                <td
                  style={{
                    padding: "16px 24px",
                    fontSize: "14px",
                    color: "#111827",
                  }}
                >
                  {new Date(user.createdAt).toLocaleDateString()}
                </td>
                <td style={{ padding: "16px 24px" }}>
                  <div style={{ display: "flex", gap: "8px" }}>
                    <button
                      style={{
                        padding: "8px",
                        backgroundColor: "transparent",
                        border: "none",
                        borderRadius: "6px",
                        cursor: "pointer",
                        color: "#3b82f6",
                        display: "flex",
                        alignItems: "center",
                        transition: "background-color 0.2s",
                      }}
                      onClick={() => onViewBooks(user.id)}
                      onMouseOver={(e) =>
                        (e.currentTarget.style.backgroundColor = "#eff6ff")
                      }
                      onMouseOut={(e) =>
                        (e.currentTarget.style.backgroundColor = "transparent")
                      }
                      title="View Books"
                    >
                      <BookOpen size={18} />
                    </button>
                    <button
                      style={{
                        padding: "8px",
                        backgroundColor: "transparent",
                        border: "none",
                        borderRadius: "6px",
                        cursor: "pointer",
                        color: "#3b82f6",
                        display: "flex",
                        alignItems: "center",
                        transition: "background-color 0.2s",
                      }}
                      onClick={() => onEdit(user)}
                      onMouseOver={(e) =>
                        (e.currentTarget.style.backgroundColor = "#eff6ff")
                      }
                      onMouseOut={(e) =>
                        (e.currentTarget.style.backgroundColor = "transparent")
                      }
                      title="Edit"
                    >
                      <PencilLine size={18} />
                    </button>
                    <button
                      style={{
                        padding: "8px",
                        backgroundColor: "transparent",
                        border: "none",
                        borderRadius: "6px",
                        cursor: "pointer",
                        color: "#ef4444",
                        display: "flex",
                        alignItems: "center",
                        transition: "background-color 0.2s",
                      }}
                      onClick={() => onDelete(user.id)}
                      onMouseOver={(e) =>
                        (e.currentTarget.style.backgroundColor = "#fef2f2")
                      }
                      onMouseOut={(e) =>
                        (e.currentTarget.style.backgroundColor = "transparent")
                      }
                      title="Delete"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
