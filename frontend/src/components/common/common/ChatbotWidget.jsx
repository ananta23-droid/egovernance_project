import React, { useEffect, useMemo, useState, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import { askChatbot } from "../../../api/chatbotApi";

const STORAGE_KEY = "sewabot_chat_history_v1";

const normalizeConfidence = (c) => {
  const value = (c || "").toLowerCase();
  if (value === "high" || value === "medium" || value === "low") return value;
  return "low";
};

const ChatbotWidget = () => {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const location = useLocation();
  const bodyRef = useRef(null);

  const [messages, setMessages] = useState(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) return JSON.parse(raw);
    } catch (_) {}
    return [
      {
        role: "bot",
        text: "Namaste! 👋 I am SewaBot, your Nepal Citizen Service AI Assistant. How can I help you today?",
        confidence: "high",
        sources: [],
      },
    ];
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
    } catch (_) {}
  }, [messages]);

  useEffect(() => {
    if (bodyRef.current) {
      bodyRef.current.scrollTop = bodyRef.current.scrollHeight;
    }
  }, [messages, loading, open]);

  const sendMessage = async (overrideText = null) => {
    const q = (overrideText || input).trim();
    if (!q || loading) return;

    setMessages((prev) => [
      ...prev,
      { role: "user", text: q, confidence: null, sources: [] },
    ]);
    if (!overrideText) setInput("");
    setLoading(true);

    try {
      const data = await askChatbot(q);
      setMessages((prev) => [
        ...prev,
        {
          role: "bot",
          text: data?.answer || "Sorry, I could not process your request right now. Please try again.",
          confidence: normalizeConfidence(data?.confidence),
          sources: Array.isArray(data?.sources) ? data.sources : [],
        },
      ]);
    } catch (err) {
      const msg =
        err?.response?.data?.message || "Chat service is temporarily unavailable. Please try again later.";
      setMessages((prev) => [
        ...prev,
        { role: "bot", text: msg, confidence: "low", sources: [] },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const clearChat = () => {
    const initial = [
      {
        role: "bot",
        text: "Namaste! 👋 I am SewaBot, your Nepal Citizen Service AI Assistant. How can I help you today?",
        confidence: "high",
        sources: [],
      },
    ];
    setMessages(initial);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(initial));
  };

  const onKeyDown = (e) => {
    if (e.key === "Enter") sendMessage();
  };

  const quickActions = useMemo(() => {
    if (location.pathname.includes("/apply")) {
      return [
        "What sample info should I enter here?",
        "Can I upload real documents?",
        "Will this application be submitted?",
      ];
    }
    return [
      "How to apply for e-Passport?",
      "Required documents for Driving License?",
      "Citizenship Certificate application process?",
    ];
  }, [location.pathname]);

  const confidenceClass = useMemo(
    () => ({
      high: "confidence-badge--high",
      medium: "confidence-badge--medium",
      low: "confidence-badge--low",
    }),
    []
  );

  return (
    <>
      {/* Floating Action Button */}
      <button
        className="chat-fab"
        onClick={() => setOpen((v) => !v)}
        title={open ? "Close SewaBot Assistant" : "Open SewaBot Assistant"}
        aria-label="Open SewaBot AI Chat Assistant"
      >
        <span className="chat-fab-icon">🤖</span>
        <span className="chat-fab-label">SewaBot AI</span>
      </button>

      {/* Floating Chat Box */}
      {open && (
        <div className="chatbox" role="dialog" aria-label="SewaBot AI Assistant Window">
          <div className="chatbox-header">
            <div className="chatbox-header-title">
              <span className="chatbox-header-icon">🤖</span>
              <div>
                <h4>SewaBot AI Assistant</h4>
                <span className="chatbox-status">● Nepal e-Governance Prototype</span>
              </div>
            </div>
            <div className="chatbox-actions">
              <button onClick={clearChat} title="Clear Chat History" aria-label="Clear Chat">
                🗑
              </button>
              <button onClick={() => setOpen(false)} title="Close Chat Window" aria-label="Close Chat Window">
                ✖
              </button>
            </div>
          </div>

          <div className="chatbox-body" ref={bodyRef}>
            {messages.map((m, i) => (
              <div key={i} className={`chat-row ${m.role}`}>
                <div className={`chat-msg ${m.role === "user" ? "user" : "bot"}`}>
                  {m.text}
                </div>
                {m.role === "bot" && m.confidence && (
                  <span className={`confidence-badge ${confidenceClass[m.confidence]}`}>
                    {m.confidence.toUpperCase()} CONFIDENCE
                  </span>
                )}

                {m.role === "bot" && m.sources?.length > 0 && (
                  <div className="source-wrap">
                    <span className="source-heading">Related Services:</span>
                    {m.sources.map((s, idx) => (
                      <div key={`${s.id}-${idx}`} className="source-chip">
                        <span>{s.title}</span>
                        {s.id ? (
                          <Link to={`/services/${s.id}`} className="open-link" onClick={() => setOpen(false)}>
                            View Service →
                          </Link>
                        ) : null}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}

            {loading && (
              <div className="chat-row bot">
                <div className="chat-msg bot chat-msg--loading">
                  <span className="chat-dot"></span>
                  <span className="chat-dot"></span>
                  <span className="chat-dot"></span>
                  <span>SewaBot is typing...</span>
                </div>
              </div>
            )}
          </div>

          {/* Quick Action Buttons */}
          <div className="chatbox-quick-actions">
            {quickActions.map((qa, idx) => (
              <button
                key={idx}
                className="quick-action-btn"
                onClick={() => sendMessage(qa)}
                disabled={loading}
              >
                {qa}
              </button>
            ))}
          </div>

          {/* Input & Footer */}
          <div className="chatbox-footer">
            <input
              type="text"
              className="chat-input"
              placeholder="Ask SewaBot about services or requirements..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={onKeyDown}
              disabled={loading}
              aria-label="Chat input query"
            />
            <button
              className="chat-send-btn"
              onClick={() => sendMessage()}
              disabled={loading || !input.trim()}
              aria-label="Send message"
            >
              Send
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default ChatbotWidget;