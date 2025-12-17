import { useState } from "react";
import { Table, Button, Form } from "react-bootstrap";

export function AIQueryAgent() {
  const [question, setQuestion] = useState("");
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const token = localStorage.getItem("token");

  const ask = async () => {
    if (!question.trim()) return;

    setLoading(true);
    const res = await fetch("http://localhost:3333/ai/query", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ question }),
    });

    const data = await res.json();
    setResult(data);
    setLoading(false);
  };

  return (
    <div>
      {/* Input */}
      <Form className="mb-3">
        <Form.Control
          type="text"
          placeholder="Ask something like: Who owns the most books?"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
        />
        <Button className="mt-2" onClick={ask} disabled={loading}>
          {loading ? "Thinking..." : "Ask"}
        </Button>
      </Form>

      {/* Results */}
      {Array.isArray(result) && (
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>User</th>
              <th>Books</th>
            </tr>
          </thead>
          <tbody>
            {result.map((row: any) => (
              <tr key={row.id}>
                <td>{row.email}</td>
                <td>{row._count?.books ?? "-"}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}

      {/* Non-table response */}
      {!Array.isArray(result) && result && (
        <pre>{JSON.stringify(result, null, 2)}</pre>
      )}
    </div>
  );
}
