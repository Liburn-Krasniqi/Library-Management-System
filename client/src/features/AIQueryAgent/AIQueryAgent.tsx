import { useState } from "react";
import { Sparkles, Send } from "lucide-react";

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

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !loading) {
      ask();
    }
  };

  return (
    <div style={{ padding: "20px", maxWidth: "800px", margin: "0 auto" }}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "12px",
          marginBottom: "24px",
        }}
      >
        <Sparkles size={32} style={{ color: "#8b5cf6" }} />
        <h1 style={{ margin: 0, fontSize: "24px" }} className="color-1">
          AI Query Agent
        </h1>
      </div>

      <div
        style={{
          backgroundColor: "white",
          borderRadius: "12px",
          border: "1px solid #e5e7eb",
          padding: "24px",
          boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
        }}
      >
        <div style={{ marginBottom: "16px" }}>
          <label
            style={{
              display: "block",
              fontSize: "14px",
              fontWeight: "500",
              color: "#374151",
              marginBottom: "8px",
            }}
          >
            Ask a question
          </label>
          <div style={{ position: "relative" }}>
            <input
              type="text"
              placeholder="Who owns the most books?"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              onKeyPress={handleKeyPress}
              disabled={loading}
              style={{
                width: "100%",
                padding: "12px 16px",
                fontSize: "14px",
                border: "1px solid #d1d5db",
                borderRadius: "8px",
                outline: "none",
                transition: "border-color 0.2s, box-shadow 0.2s",
                backgroundColor: loading ? "#f9fafb" : "white",
              }}
              onFocus={(e) => {
                e.target.style.borderColor = "#3b82f6";
                e.target.style.boxShadow = "0 0 0 3px rgba(59, 130, 246, 0.1)";
              }}
              onBlur={(e) => {
                e.target.style.borderColor = "#d1d5db";
                e.target.style.boxShadow = "none";
              }}
            />
          </div>
        </div>

        <button
          onClick={ask}
          disabled={loading || !question.trim()}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            padding: "10px 20px",
            backgroundColor:
              loading || !question.trim() ? "#9ca3af" : "#3b82f6",
            color: "white",
            border: "none",
            borderRadius: "8px",
            cursor: loading || !question.trim() ? "not-allowed" : "pointer",
            fontSize: "14px",
            fontWeight: "500",
            transition: "background-color 0.2s",
            width: "100%",
            justifyContent: "center",
          }}
          onMouseOver={(e) => {
            if (!loading && question.trim()) {
              e.currentTarget.style.backgroundColor = "#2563eb";
            }
          }}
          onMouseOut={(e) => {
            if (!loading && question.trim()) {
              e.currentTarget.style.backgroundColor = "#3b82f6";
            }
          }}
        >
          {loading ? (
            <>
              <div
                style={{
                  width: "16px",
                  height: "16px",
                  border: "2px solid rgba(255, 255, 255, 0.3)",
                  borderTopColor: "white",
                  borderRadius: "50%",
                  animation: "spin 0.8s linear infinite",
                }}
              />
              Thinking...
              <style>{`
                @keyframes spin {
                  to { transform: rotate(360deg); }
                }
              `}</style>
            </>
          ) : (
            <>
              <Send size={16} />
              Ask
            </>
          )}
        </button>
      </div>

      {result && (
        <div
          style={{
            backgroundColor: "white",
            borderRadius: "12px",
            border: "1px solid #e5e7eb",
            padding: "24px",
            marginTop: "20px",
            boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
            animation: "fadeIn 0.3s ease-in",
          }}
        >
          <style>{`
            @keyframes fadeIn {
              from { opacity: 0; transform: translateY(-10px); }
              to { opacity: 1; transform: translateY(0); }
            }
          `}</style>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              marginBottom: "12px",
            }}
          >
            <div
              style={{
                width: "32px",
                height: "32px",
                borderRadius: "50%",
                backgroundColor: "#eff6ff",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Sparkles size={18} style={{ color: "#3b82f6" }} />
            </div>
            <h5
              style={{
                margin: 0,
                fontSize: "16px",
                fontWeight: "600",
                color: "#111827",
              }}
            >
              Answer
            </h5>
          </div>
          <p
            style={{
              margin: 0,
              fontSize: "14px",
              lineHeight: "1.6",
              color: "#374151",
            }}
          >
            {result.answer}
          </p>
        </div>
      )}
    </div>
  );
}
