// src/features/AdminUsers/UsersTable.tsx
import type { User } from "./types";

interface UsersTableProps {
  isLoading: boolean;
  users: User[];
  onEdit: (user: User) => void;
  onDelete: (userId: string) => void;
  onViewBooks: (userId: string) => void;
}

export function UsersTable({
  isLoading,
  users,
  onEdit,
  onDelete,
  onViewBooks,
}: UsersTableProps) {
  if (isLoading) return <div>Loading...</div>;

  return (
    <table className="table table-striped table-hover my-3">
      <thead>
        <tr>
          <th>Name</th>
          <th>Email</th>
          <th>Role</th>
          <th>Created At</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {users.map((user) => (
          <tr key={user.id}>
            <td>{user.name ?? "-"}</td>
            <td>{user.email}</td>
            <td>{user.role}</td>
            <td>{new Date(user.createdAt).toLocaleDateString()}</td>
            <td>
              <button
                className="btn btn-primary me-1"
                onClick={() => onViewBooks(user.id)}
              >
                View Books
              </button>
              <button
                className="btn btn-warning me-1"
                onClick={() => onEdit(user)}
              >
                Edit
              </button>
              <button
                className="btn btn-danger"
                onClick={() => onDelete(user.id)}
              >
                Delete
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
