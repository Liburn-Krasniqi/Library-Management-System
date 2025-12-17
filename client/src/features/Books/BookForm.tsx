import { Button, Modal, Form } from "react-bootstrap";
import type { BookFormState, ReadingStatus } from "./Types";
interface Props {
  isShow: boolean;
  isCreate: boolean;
  book: BookFormState;
  setBook: (b: BookFormState) => void;
  setShow: (v: boolean) => void;
  handleSubmit: (e: React.FormEvent) => void;
}

const statuses: ReadingStatus[] = ["READING", "COMPLETED", "ON_HOLD"];

export function BookForm({
  isShow,
  isCreate,
  book,
  setBook,
  setShow,
  handleSubmit,
}: Props) {
  return (
    <Modal show={isShow} onHide={() => setShow(false)}>
      <Modal.Header closeButton>
        <Modal.Title>{isCreate ? "Create Book" : "Edit Book"}</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Title</Form.Label>
            <Form.Control
              value={book.title}
              onChange={(e) => setBook({ ...book, title: e.target.value })}
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Author</Form.Label>
            <Form.Control
              value={book.author}
              onChange={(e) => setBook({ ...book, author: e.target.value })}
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Genre</Form.Label>
            <Form.Control
              value={book.genre}
              onChange={(e) => setBook({ ...book, genre: e.target.value })}
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Status</Form.Label>
            <Form.Select
              value={book.readingStatus}
              onChange={(e) =>
                setBook({
                  ...book,
                  readingStatus: e.target.value as ReadingStatus,
                })
              }
            >
              {statuses.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </Form.Select>
          </Form.Group>

          <Button variant="secondary" onClick={() => setShow(false)}>
            Cancel
          </Button>
          <Button className="ms-2" variant="primary" type="submit">
            Save
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
}
