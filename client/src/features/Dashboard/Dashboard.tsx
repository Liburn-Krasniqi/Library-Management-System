// src/features/AdminUsers/AdminUsers.tsx
import { useState, useEffect } from "react";
import { UsersTable } from "./UsersTable";
import type { User } from "./types";
import { userFormat } from "./types";
import { Modal, Button, Form } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

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
    <div>
      <h1>Admin Dashboard</h1>
      <UsersTable
        isLoading={isLoading}
        users={users}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onViewBooks={handleViewBooks}
      />

      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Edit User: {editingUser.name}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                value={editingUser.name ?? ""}
                onChange={(e) =>
                  setEditingUser({ ...editingUser, name: e.target.value })
                }
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                value={editingUser.email}
                onChange={(e) =>
                  setEditingUser({ ...editingUser, email: e.target.value })
                }
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Role</Form.Label>
              <Form.Select
                value={editingUser.role}
                onChange={(e) =>
                  setEditingUser({ ...editingUser, role: e.target.value })
                }
              >
                <option value="USER">USER</option>
                <option value="ADMIN">ADMIN</option>
              </Form.Select>
            </Form.Group>

            <Button variant="secondary" onClick={() => setShowModal(false)}>
              Close
            </Button>
            <Button variant="primary" type="submit">
              Save Changes
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  );
}
