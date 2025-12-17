import { useState, useEffect } from "react";
import { BooksTable } from "../Books/BooksTable";
import { useSearchParams } from "react-router-dom";
import type { Book } from "../Books/Types";
import { Modal, Form, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

const BOOKS_URL = "http://localhost:3333/books";

export function AdminBooks() {
  const [books, setBooks] = useState<Book[]>([]);
  const [isLoading, setLoading] = useState(true);
  const [searchParams] = useSearchParams();
  const userId = searchParams.get("userId"); // injected from AdminUsers dashboard
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  // For editing
  const [showModal, setShowModal] = useState(false);
  const [editingBook, setEditingBook] = useState<Book | null>(null);

  // Fetch books
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

  // Delete a book
  const handleDelete = (id: string) => {
    if (!confirm("Are you sure you want to delete this book?")) return;

    fetch(`${BOOKS_URL}/admin/books/${id}/user/${userId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }).then(() => fetchBooks());
  };

  // Edit a book (open modal)
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
    <div>
      {/* <h1>User's Books</h1> */}

      <BooksTable
        books={books}
        isLoading={isLoading}
        onCreate={() => {
          throw new Error("Function not implemented.");
        }}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      {/* Edit Book Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Book</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {editingBook && (
            <Form onSubmit={handleSubmit}>
              <Form.Group className="mb-3">
                <Form.Label>Title</Form.Label>
                <Form.Control
                  type="text"
                  value={editingBook.title}
                  onChange={(e) =>
                    setEditingBook({ ...editingBook, title: e.target.value })
                  }
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Author</Form.Label>
                <Form.Control
                  type="text"
                  value={editingBook.author}
                  onChange={(e) =>
                    setEditingBook({ ...editingBook, author: e.target.value })
                  }
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Genre</Form.Label>
                <Form.Control
                  type="text"
                  value={editingBook.genre ?? ""}
                  onChange={(e) =>
                    setEditingBook({ ...editingBook, genre: e.target.value })
                  }
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Reading Status</Form.Label>
                <Form.Select
                  value={editingBook.readingStatus}
                  onChange={(e) =>
                    setEditingBook({
                      ...editingBook,
                      readingStatus: e.target.value as Book["readingStatus"],
                    })
                  }
                >
                  <option value="READING">READING</option>
                  <option value="COMPLETED">COMPLETED</option>
                  <option value="PLAN_TO_READ">PLAN_TO_READ</option>
                </Form.Select>
              </Form.Group>

              <Button variant="secondary" onClick={() => setShowModal(false)}>
                Close
              </Button>
              <Button variant="primary" type="submit" className="ms-2">
                Save Changes
              </Button>
            </Form>
          )}
        </Modal.Body>
      </Modal>

      <div className="d-flex align-items-center mb-3">
        <Button
          variant="secondary"
          onClick={() => navigate("/admin/dashboard")}
        >
          ← Back
        </Button>
      </div>
    </div>
  );
}
