import { Button, Modal, Form } from "react-bootstrap";

interface CustomFormProps<T extends Record<string, any>> {
  isCreate: boolean;
  isShow: boolean;
  setShow: (show: boolean) => void;
  entity: T;
  entityName: string;
  setEntity: (entity: T) => void;
  entityFormat: T;
  fields: (keyof T)[];
  fieldType: string[];
  fieldDisplayName: string[];
  placeholders: string[];
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
}

export function CustomForm<T extends Record<string, any>>({
  isCreate,
  isShow,
  setShow,
  entity,
  entityName,
  setEntity,
  entityFormat,
  fields,
  fieldType,
  fieldDisplayName,
  placeholders,
  handleSubmit,
}: CustomFormProps<T>) {
  return (
    <Modal
      show={isShow}
      onHide={() => {
        setShow(false);
        setEntity(entityFormat);
      }}
    >
      <Modal.Header closeButton>
        <Modal.Title>
          {isCreate
            ? `Create ${entityName}`
            : `Edit ${entityName}: ${entity?.name ?? ""}`}
        </Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <Form
          onSubmit={(e) => {
            e.preventDefault();
            handleSubmit(e);
            setShow(false);
          }}
        >
          {fields.map((field, index) => (
            <Form.Group
              className="mb-3"
              controlId={`form-${String(field)}`}
              key={String(field)}
            >
              <Form.Label>{fieldDisplayName[index]}</Form.Label>

              <Form.Control
                type={fieldType[index]}
                placeholder={isCreate ? placeholders[index] : undefined}
                defaultValue={
                  !isCreate
                    ? String(field).includes("date")
                      ? String(entity[field]).slice(0, 10)
                      : entity[field]
                    : undefined
                }
                onChange={(e) =>
                  setEntity({ ...entity, [field]: e.target.value })
                }
              />
            </Form.Group>
          ))}

          <div className="d-flex justify-content-between mt-4">
            <Button
              variant="secondary"
              onClick={() => {
                setShow(false);
                setEntity(entityFormat);
              }}
            >
              Close
            </Button>

            <Button variant="primary" type="submit">
              Save Changes
            </Button>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
}
