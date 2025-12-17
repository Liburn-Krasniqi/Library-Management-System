import { useState, useEffect } from "react";
import { BooksTable } from "../Books/BooksTable";
import { useSearchParams } from "react-router-dom";
import type { Book } from "../Books/Types";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, X } from "lucide-react";

const BOOKS_URL = "http://localhost:3333/books";

export function AdminBooks() {
  const [books, setBooks] = useState<Book[]>([]);
  const [isLoading, setLoading] = useState(true);
  const [searchParams] = useSearchParams();
  const userId = searchParams.get("userId");
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  const [showModal, setShowModal] = useState(false);
  const [editingBook, setEditingBook] = useState<Book | null>(null);

  const fetchBooks = () => {
    if (!userId) return;
    setLoading(true);
    fetch(`${BOOKS_URL}/user/${userId}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        setBooks(data);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchBooks();
  }, [userId]);

  const handleDelete = (id: string) => {
    if (!confirm("Are you sure you want to delete this book?")) return;

    fetch(`${BOOKS_URL}/admin/books/${id}/user/${userId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }).then(() => fetchBooks());
  };

  const handleEdit = (book: Book) => {
    setEditingBook(book);
    setShowModal(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingBook || !userId) return;

    fetch(`${BOOKS_URL}/admin/books/${editingBook.id}/user/${userId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        title: editingBook.title,
        author: editingBook.author,
        genre: editingBook.genre,
        readingStatus: editingBook.readingStatus,
      }),
    }).then(() => {
      setShowModal(false);
      setEditingBook(null);
      fetchBooks();
    });
  };

  return (
    <div
      style={{
        minHeight: "50vh",
        padding: "20px",
      }}
    >
      <div style={{ maxWidth: "1400px", margin: "0 auto" }}>
        <BooksTable
          books={books}
          isLoading={isLoading}
          onCreate={() => {
            throw new Error("Function not implemented.");
          }}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />

        {showModal && editingBook && (
          <>
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
                  Edit Book
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
                    Title
                  </label>
                  <input
                    type="text"
                    value={editingBook.title}
                    onChange={(e) =>
                      setEditingBook({ ...editingBook, title: e.target.value })
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
                    Author
                  </label>
                  <input
                    type="text"
                    value={editingBook.author}
                    onChange={(e) =>
                      setEditingBook({ ...editingBook, author: e.target.value })
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
                    Genre
                  </label>
                  <input
                    type="text"
                    value={editingBook.genre ?? ""}
                    onChange={(e) =>
                      setEditingBook({ ...editingBook, genre: e.target.value })
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
                    Reading Status
                  </label>
                  <select
                    value={editingBook.readingStatus}
                    onChange={(e) =>
                      setEditingBook({
                        ...editingBook,
                        readingStatus: e.target.value as Book["readingStatus"],
                      })
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
                    <option value="READING">READING</option>
                    <option value="COMPLETED">COMPLETED</option>
                    <option value="PLAN_TO_READ">PLAN_TO_READ</option>
                  </select>
                </div>

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
      </div>
      <div style={{ marginBottom: "24px" }}>
        <button
          onClick={() => navigate("/admin/users")}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            padding: "10px 20px",
            fontSize: "14px",
            fontWeight: "500",
            color: "#374151",
            backgroundColor: "white",
            border: "1px solid #d1d5db",
            borderRadius: "8px",
            cursor: "pointer",
            transition: "background-color 0.2s, border-color 0.2s",
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.backgroundColor = "#f9fafb";
            e.currentTarget.style.borderColor = "#9ca3af";
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.backgroundColor = "white";
            e.currentTarget.style.borderColor = "#d1d5db";
          }}
        >
          <ArrowLeft size={18} />
          Back
        </button>
      </div>
    </div>
  );
}
