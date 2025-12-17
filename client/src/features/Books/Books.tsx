import { useEffect, useState } from "react";
import type { Book, BookFormState } from "./Types";
import { BooksTable } from "./BooksTable";
import { BookForm } from "./BookForm";

export const BOOKS_URL = "http://localhost:3333/books";

const emptyBook: BookFormState = {
  title: "",
  author: "",
  genre: "",
  readingStatus: "READING",
};

export function Books() {
  const [books, setBooks] = useState<Book[]>([]);
  const [isLoading, setLoading] = useState(true);
  const [isShow, setShow] = useState(false);
  const [isCreate, setCreate] = useState(true);
  const [book, setBook] = useState<BookFormState>(emptyBook);

  const token = localStorage.getItem("token"); // i should have named it access_token but wth

  useEffect(() => {
    fetch(BOOKS_URL, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setBooks(data);
        setLoading(false);
      });
  }, [isShow]);

  function handleCreate() {
    setCreate(true);
    setBook(emptyBook);
    setShow(true);
  }

  function handleEdit(b: Book) {
    setCreate(false);
    setBook({
      id: b.id,
      title: b.title,
      author: b.author,
      genre: b.genre ?? "",
      readingStatus: b.readingStatus,
    });
    setShow(true);
  }

  function handleDelete(id: string) {
    fetch(`${BOOKS_URL}/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }).then(() => setBooks((prev) => prev.filter((b) => b.id !== id)));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const method = isCreate ? "POST" : "PATCH";
    const endpoint = isCreate ? BOOKS_URL : `${BOOKS_URL}/${book.id}`;

    // DTO must NOT include id
    const { id, ...dto } = book;

    fetch(endpoint, {
      method,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(dto),
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error("Failed to save book");
        }
        return res.json();
      })
      .then(() => {
        setShow(false);
      })
      .catch((err) => {
        console.error(err);
        alert("Something went wrong while saving the book");
      });
  }

  return (
    <>
      <BookForm
        isShow={isShow}
        isCreate={isCreate}
        book={book}
        setBook={setBook}
        setShow={setShow}
        handleSubmit={handleSubmit}
      />

      <BooksTable
        isLoading={isLoading}
        books={books}
        onCreate={handleCreate}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
    </>
  );
}
