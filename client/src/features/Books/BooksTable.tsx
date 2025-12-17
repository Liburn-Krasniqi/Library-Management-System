import { CirclePlus } from "lucide-react";
import type { Book } from "./Types";

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
    return <div className="spinner-border text-info my-5" />;
  }

  return (
    <div className="table-responsive-lg my-3">
      <div className="d-flex align-items-center">
        <h1>Books</h1>
        <button className="btn btn-primary ms-auto" onClick={onCreate}>
          <CirclePlus /> Add Book
        </button>
      </div>

      <table className="table table-striped table-hover my-3">
        <thead>
          <tr>
            <th>Title</th>
            <th>Author</th>
            <th>Genre</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {books.map((book) => (
            <tr key={book.id}>
              <td>{book.title}</td>
              <td>{book.author}</td>
              <td>{book.genre ?? "-"}</td>
              <td>{book.readingStatus}</td>
              <td>
                <div className="btn-group">
                  <button
                    className="btn btn-warning"
                    onClick={() => onEdit(book)}
                  >
                    Edit
                  </button>
                  <button
                    className="btn btn-danger"
                    onClick={() => onDelete(book.id)}
                  >
                    Delete
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
