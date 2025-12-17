import { CirclePlus, PencilLine, Trash2 } from "lucide-react";

interface Book {
  id: string;
  title: string;
  author: string;
  genre?: string;
  readingStatus: string;
}

interface Props {
  isLoading: boolean;
  books: Book[];
  onCreate: () => void;
  onEdit: (book: Book) => void;
  onDelete: (id: string) => void;
}

export function BooksTable({
  isLoading,
  books,
  onCreate,
  onEdit,
  onDelete,
}: Props) {
  if (isLoading) {
    return (
      <div style={{ padding: "20px" }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: "20px",
          }}
        >
          <h1 style={{ margin: 0, fontSize: "24px" }}>Books</h1>
          <button
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              padding: "10px 20px",
              backgroundColor: "#3b82f6",
              color: "white",
              border: "none",
              borderRadius: "6px",
              cursor: "pointer",
              fontSize: "14px",
            }}
            disabled
          >
            <CirclePlus size={20} />
            Add Book
          </button>
        </div>
        <div
          style={{
            backgroundColor: "white",
            borderRadius: "8px",
            border: "1px solid #e5e7eb",
            padding: "40px",
            textAlign: "center",
          }}
        >
          Loading...
        </div>
      </div>
    );
  }

  return (
    <div style={{ padding: "20px" }}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: "20px",
        }}
      >
        <h1 style={{ margin: 0, fontSize: "24px" }}>Books</h1>
        <button
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            padding: "10px 20px",
            backgroundColor: "#3b82f6",
            color: "white",
            border: "none",
            borderRadius: "6px",
            cursor: "pointer",
            fontSize: "14px",
            transition: "background-color 0.2s",
          }}
          onClick={onCreate}
          onMouseOver={(e) =>
            (e.currentTarget.style.backgroundColor = "#2563eb")
          }
          onMouseOut={(e) =>
            (e.currentTarget.style.backgroundColor = "#3b82f6")
          }
        >
          <CirclePlus size={20} />
          Add Book
        </button>
      </div>

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
                Title
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
                Author
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
                Genre
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
                Status
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
            {books.map((book) => (
              <tr
                key={book.id}
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
                  {book.title}
                </td>
                <td
                  style={{
                    padding: "16px 24px",
                    fontSize: "14px",
                    color: "#111827",
                  }}
                >
                  {book.author}
                </td>
                <td
                  style={{
                    padding: "16px 24px",
                    fontSize: "14px",
                    color: "#111827",
                  }}
                >
                  {book.genre ?? "-"}
                </td>
                <td
                  style={{
                    padding: "16px 24px",
                    fontSize: "14px",
                    color: "#111827",
                  }}
                >
                  {book.readingStatus}
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
                      onClick={() => onEdit(book)}
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
                      onClick={() => onDelete(book.id)}
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
