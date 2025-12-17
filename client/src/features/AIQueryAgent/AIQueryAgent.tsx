import { useState } from "react";
import { Button, Form } from "react-bootstrap";

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
      <h2>AI Query Agent</h2>
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

      {result && (
        <div className="mt-4">
          <h5>Answer</h5>
          <p>{result.answer}</p>
        </div>
      )}
    </div>
  );
}
