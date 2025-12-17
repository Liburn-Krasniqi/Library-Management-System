import { CirclePlus, PencilLine, Trash2 } from "lucide-react";
import { Card } from "../../UI";

interface CustomTableProps<T extends { id: string | number }> {
  isLoading: boolean;
  entities: T[];
  entityName: string;
  fields: (keyof T)[];
  fieldDisplayName: string[];
  allowCreate: boolean;
  handleEdit: (entity: T) => void;
  handleDelete: (id: string | number) => void;
  handleCreate: () => void;
}

export function CustomTable<T extends { id: string | number }>({
  isLoading,
  entities,
  entityName,
  fields,
  fieldDisplayName,
  allowCreate,
  handleEdit,
  handleDelete,
  handleCreate,
}: CustomTableProps<T>) {
  if (isLoading) {
    return (
      <div className="table-responsive-lg my-3">
        <div className="d-flex align-items-center">
          <h1>{entityName}s</h1>

          <button
            type="button"
            className={`btn btn-primary ms-auto ${
              allowCreate ? "" : "disabled"
            }`}
            onClick={handleCreate}
          >
            <CirclePlus /> Add {entityName}
          </button>
        </div>

        <Card>
          <div className="d-flex justify-content-center">
            <div
              className="spinner-border text-info my-5"
              style={{ width: "10rem", height: "10rem" }}
              role="status"
            >
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="table-responsive-lg my-3">
      <div className="d-flex align-items-center">
        <h1>{entityName}s</h1>

        <button
          type="button"
          className={`btn btn-primary ms-auto ${allowCreate ? "" : "disabled"}`}
          onClick={handleCreate}
        >
          <CirclePlus /> Add {entityName}
        </button>
      </div>

      <Card>
        <table className="table table-striped table-hover my-3">
          <thead>
            <tr>
              {fieldDisplayName.map((field) => (
                <th scope="col" key={field}>
                  {field}
                </th>
              ))}
              <th scope="col">Actions</th>
            </tr>
          </thead>

          <tbody className="table-group-divider">
            {entities.map((entity) => (
              <tr key={entity.id}>
                {fields.map((field) => (
                  <td key={String(field)}>
                    {String(field).includes("date")
                      ? String(entity[field]).slice(0, 10)
                      : String(entity[field])}
                  </td>
                ))}

                <td>
                  <div className="btn-group" role="group">
                    <button
                      type="button"
                      className="btn btn-warning"
                      onClick={() => handleEdit(entity)}
                    >
                      <PencilLine />
                    </button>

                    <button
                      type="button"
                      className="btn btn-danger"
                      onClick={() => handleDelete(entity.id)}
                    >
                      <Trash2 />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  );
}
