import { useEffect, useRef, useState } from "react";

const INITIAL_MESSAGES = `[
  {
    "id": "03014cda",
    "message": "Session 1 started",
    "sent_by_name": "system",
    "sent_by_type": "system",
    "created_at": "2026-02-28T08:12:30.646Z"
  },
  {
    "id": "31fbcfca",
    "message": "ID 25590401 | Hi... aku mau tanya-tanya dulu soal <company_name> yaa",
    "sent_by_name": "Bagas",
    "sent_by_type": "user",
    "created_at": "2026-02-28T08:12:30.649Z"
  },
  {
    "id": "8d6c0f13",
    "message": "Halo, Kak!\\nKenalin, aku Mila, ahli gizi <company_name> untuk bantu jawab semua pertanyaan Kakak.",
    "sent_by_name": "<company_name> Official",
    "sent_by_type": "inbox",
    "created_at": "2026-02-28T08:12:35.377Z"
  },
  {
    "id": "6bc4d3ce",
    "message": "Kakak mau aku bantu konsultasi dulu atau langsung aku bantu order aja nih?",
    "sent_by_name": "<company_name> Official",
    "sent_by_type": "inbox",
    "created_at": "2026-02-28T08:12:37.963Z"
  },
  {
    "id": "97367e0e",
    "message": "Conversation assigned to AI Agent <agent_name> from Flows",
    "sent_by_name": "system",
    "sent_by_type": "system",
    "created_at": "2026-02-28T08:12:38.468Z"
  },
  {
    "id": "97f99e56",
    "message": "Konsultasi dlu kak",
    "sent_by_name": "Bagas",
    "sent_by_type": "user",
    "created_at": "2026-02-28T08:14:12.008Z"
  },
  {
    "id": "539e2732",
    "message": "Okee Kak, aku bantu konsultasinya ya.",
    "sent_by_name": "<agent_name>",
    "sent_by_type": "ai",
    "chat_credits_used": 5,
    "created_at": "2026-02-28T08:15:18.395Z"
  },
  {
    "id": "8f2d4884",
    "message": "Sekarang Kakak punya goals kesehatan apaa? Mau atur berat badan atau ada tujuan lain?",
    "sent_by_name": "<agent_name>",
    "sent_by_type": "ai",
    "created_at": "2026-02-28T08:15:21.360Z"
  },
  {
    "id": "760d4450",
    "message": "Mau turun bb",
    "sent_by_name": "Bagas",
    "sent_by_type": "user",
    "created_at": "2026-02-28T08:19:08.184Z"
  },
  {
    "id": "2be47fe8",
    "message": "Oke, Kak, aku bantu untuk capai menurunkan berat badan ya.",
    "sent_by_name": "<agent_name>",
    "sent_by_type": "ai",
    "chat_credits_used": 5,
    "created_at": "2026-02-28T08:20:14.356Z"
  },
  {
    "id": "2ccbd963",
    "message": "Sebelumnya Kakak udah pernah coba cara apa untuk menurunkan berat badan? Ada kendala nggak selama ngejalaninnya?",
    "sent_by_name": "<agent_name>",
    "sent_by_type": "ai",
    "created_at": "2026-02-28T08:20:17.514Z"
  },
  {
    "id": "7f4ffd7e",
    "message": "Sudah tidak makan nasi.. Cuma makan kukus Aja tp kok kadang masih pingin makan yg lain.. Tp smpai saat ini masih kuat menahan",
    "sent_by_name": "Bagas",
    "sent_by_type": "user",
    "created_at": "2026-02-28T08:21:48.431Z"
  },
  {
    "id": "c823141f",
    "message": "Saya paham banget, Kak. Kadang nafsu makan ngemil itu sulit diatasi, apalagi lagi diet.\\n\\nBoleh aku rekomendasiin program yang paling sesuai dengan kebutuhan Kakak?",
    "sent_by_name": "<agent_name>",
    "sent_by_type": "ai",
    "chat_credits_used": 5,
    "created_at": "2026-02-28T08:22:53.693Z"
  },
  {
    "id": "68822dc5",
    "message": "Boleh kak",
    "sent_by_name": "Bagas",
    "sent_by_type": "user",
    "created_at": "2026-02-28T08:29:18.470Z"
  }
]`;

const INITIAL_RESPONSE = `{
  "success": true,
  "messages": [
    {
      "role": "system",
      "content": "Successfully executed tool calls"
    },
    {
      "role": "system",
      "content": "Please provide an address to get the shipping rate."
    },
    {
      "role": "assistant",
      "content": "Maaf Kak, aku belum bisa cek ongkirnya dulu ya. Sebelum itu, aku mau kirimkan pricelist <company_name> terlebih dahulu.\\n\\nBerikut adalah pricelist <company_name>:\\nhttps://files.cekat.ai/Pricelist_<company_name>_XK8ErO.png\\n\\nBerdasarkan kondisi Kakak, program yang paling cocok adalah Program 1\\u20132 Bulan.\\n\\nApa Kakak mau aku bantu order programnya sekarang?",
      "credits_used": 7
    }
  ],
  "chat_data": {}
}`;

const INITIAL_REASONING = `Got it, let's tackle this. First, the user agreed to the recommendation, so I need to follow Flow B Tahap 4a. First send the pricelist image, then explain the best program for weight loss, which is 1-2 months, add the promo, then the CTA.

Wait, let's structure it properly. First, send the pricelist link. Then explain that based on their case (trying to cut rice but still craving snacks, wanting to lose weight), the best is 1-2 months program. Mention the benefits: meal plan, free 1 box <company_name>, break down the cost per sachet ~19k.

Wait, let's follow the exact script from Tahap 4a. Also need to make sure the bubbles are separated with ###, no emojis, natural language. Let's format it correctly. Yeah that's right.`;

function parseTime(dateStr) {
  try {
    const d = new Date(dateStr);
    return d.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" });
  } catch { return ""; }
}

function parseMessages(raw) {
  try {
    const arr = JSON.parse(raw);
    return arr.map((m) => ({
      id: m.id,
      sender: m.sent_by_type === "user" ? "user" : m.sent_by_type === "ai" ? "ai" : m.sent_by_type === "system" ? "system" : "bot",
      name: m.sent_by_name || "System",
      text: m.message,
      time: parseTime(m.created_at),
      credits: m.chat_credits_used || null,
    }));
  } catch { return null; }
}

function parseResponse(raw) {
  try {
    const obj = JSON.parse(raw);
    const msgs = obj.messages || [];
    const assistant = msgs.find((m) => m.role === "assistant");
    const systems = msgs.filter((m) => m.role === "system");
    if (!assistant) return null;
    return { text: assistant.content, credits: assistant.credits_used || null, systems };
  } catch { return null; }
}

function SenderBadge({ type }) {
  const c = {
    user: { label: "Customer", bg: "#dbeafe", color: "#1e40af" },
    bot: { label: "Bot", bg: "#fef3c7", color: "#92400e" },
    ai: { label: "AI Agent", bg: "#ede9fe", color: "#6d28d9" },
    system: { label: "System", bg: "#f3f4f6", color: "#6b7280" },
  }[type] || { label: type, bg: "#f3f4f6", color: "#6b7280" };
  return (
    <span style={{ fontSize: 9, fontWeight: 700, padding: "1px 5px", borderRadius: 3, background: c.bg, color: c.color, textTransform: "uppercase", letterSpacing: 0.5 }}>
      {c.label}
    </span>
  );
}

function SystemMsg({ text, time }) {
  return (
    <div style={{ textAlign: "center", margin: "6px 0" }}>
      <span style={{ display: "inline-block", background: "#fef9c3", color: "#854d0e", fontSize: 11, padding: "3px 10px", borderRadius: 5, fontWeight: 500, maxWidth: "85%" }}>
        {text}{time ? ` · ${time}` : ""}
      </span>
    </div>
  );
}

function Bubble({ msg }) {
  const isUser = msg.sender === "user";
  return (
    <div style={{ display: "flex", justifyContent: isUser ? "flex-end" : "flex-start", marginBottom: 6, paddingLeft: isUser ? 40 : 0, paddingRight: isUser ? 0 : 40 }}>
      <div style={{
        maxWidth: "82%", background: isUser ? "#dcf8c6" : "#fff",
        borderRadius: isUser ? "10px 10px 2px 10px" : "10px 10px 10px 2px",
        padding: "7px 10px", boxShadow: "0 1px 1px rgba(0,0,0,0.06)",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 5, marginBottom: 3 }}>
          <span style={{ fontSize: 11, fontWeight: 600, color: "#374151" }}>{msg.name}</span>
          <SenderBadge type={msg.sender} />
        </div>
        <div style={{ fontSize: 13, color: "#1a1a1a", whiteSpace: "pre-wrap", lineHeight: 1.4 }}>{msg.text}</div>
        <div style={{ display: "flex", justifyContent: "flex-end", alignItems: "center", gap: 5, marginTop: 3 }}>
          {msg.credits && <span style={{ fontSize: 9, color: "#9ca3af", background: "#f3f4f6", padding: "1px 4px", borderRadius: 3 }}>{msg.credits} credits</span>}
          <span style={{ fontSize: 10, color: "#9ca3af" }}>{msg.time}</span>
        </div>
      </div>
    </div>
  );
}

function ReasoningBlock({ text }) {
  const [open, setOpen] = useState(false);
  const lines = text.split("\n");
  return (
    <div style={{ margin: "8px 40px 8px 0", border: "1px solid #e0d4f5", borderRadius: 8, overflow: "hidden", background: "#faf8ff" }}>
      <button onClick={() => setOpen(!open)} style={{
        width: "100%", display: "flex", alignItems: "center", gap: 5, padding: "7px 10px",
        border: "none", background: "linear-gradient(135deg,#f0e8ff,#e8ddf8)", cursor: "pointer",
        fontSize: 11, fontWeight: 600, color: "#6d28d9", textAlign: "left",
      }}>
        <span style={{ fontSize: 13 }}>🧠</span>
        <span style={{ flex: 1 }}>AI Reasoning</span>
        <span style={{ fontSize: 9, background: "#e9d5ff", padding: "1px 5px", borderRadius: 3, color: "#7c3aed" }}>{lines.length} lines</span>
        <span style={{ fontSize: 9, transition: "transform 0.2s", transform: open ? "rotate(180deg)" : "rotate(0)" }}>▼</span>
      </button>
      <div style={{ maxHeight: open ? 350 : 0, overflow: open ? "auto" : "hidden", transition: "max-height 0.3s ease" }}>
        <pre style={{ margin: 0, padding: "8px 10px", fontSize: 11, lineHeight: 1.45, color: "#4b5563", whiteSpace: "pre-wrap", wordBreak: "break-word", fontFamily: "'Fira Code','Consolas',monospace", background: "#faf8ff" }}>
          {text}
        </pre>
      </div>
      {!open && (
        <div style={{ padding: "4px 10px 6px", fontSize: 10, color: "#9ca3af", fontStyle: "italic", whiteSpace: "pre-wrap", overflow: "hidden", maxHeight: 36, lineHeight: 1.35 }}>
          {lines.slice(0, 2).join("\n")}...
        </div>
      )}
    </div>
  );
}

function ResponseBubble({ data }) {
  return (
    <div style={{ display: "flex", justifyContent: "flex-start", marginBottom: 6, paddingRight: 40 }}>
      <div style={{
        maxWidth: "82%", background: "#f0fdf4", border: "1px solid #bbf7d0",
        borderRadius: "10px 10px 10px 2px", padding: "7px 10px", boxShadow: "0 1px 1px rgba(0,0,0,0.06)",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 5, marginBottom: 3 }}>
          <span style={{ fontSize: 11, fontWeight: 600, color: "#374151" }}>AI Response</span>
          <span style={{ fontSize: 9, fontWeight: 700, padding: "1px 5px", borderRadius: 3, background: "#dcfce7", color: "#166534", textTransform: "uppercase", letterSpacing: 0.5 }}>NEW</span>
        </div>
        {data.systems.length > 0 && (
          <div style={{ marginBottom: 5 }}>
            {data.systems.map((s, i) => (
              <div key={i} style={{ fontSize: 10, color: "#6b7280", background: "#f9fafb", padding: "2px 6px", borderRadius: 3, marginBottom: 2, fontStyle: "italic" }}>
                ⚙ {s.content}
              </div>
            ))}
          </div>
        )}
        <div style={{ fontSize: 13, color: "#1a1a1a", whiteSpace: "pre-wrap", lineHeight: 1.4 }}>{data.text}</div>
        <div style={{ display: "flex", justifyContent: "flex-end", alignItems: "center", gap: 5, marginTop: 3 }}>
          {data.credits && <span style={{ fontSize: 9, color: "#9ca3af", background: "#f3f4f6", padding: "1px 4px", borderRadius: 3 }}>{data.credits} credits</span>}
        </div>
      </div>
    </div>
  );
}

function Tab({ label, active, onClick, icon }) {
  return (
    <button onClick={onClick} style={{
      padding: "7px 14px", fontSize: 11, fontWeight: active ? 700 : 500, border: "none",
      borderBottom: active ? "2px solid #6d28d9" : "2px solid transparent",
      background: "transparent", color: active ? "#6d28d9" : "#6b7280", cursor: "pointer",
      transition: "all 0.15s", display: "flex", alignItems: "center", gap: 4,
    }}>
      <span>{icon}</span> {label}
    </button>
  );
}

export default function ChatDebugger() {
  const [messagesRaw, setMessagesRaw] = useState(INITIAL_MESSAGES);
  const [responseRaw, setResponseRaw] = useState(INITIAL_RESPONSE);
  const [reasoningRaw, setReasoningRaw] = useState(INITIAL_REASONING);
  const [activeTab, setActiveTab] = useState("messages");

  const [chatMessages, setChatMessages] = useState([]);
  const [chatResponse, setChatResponse] = useState(null);
  const [chatReasoning, setChatReasoning] = useState("");
  const [error, setError] = useState("");

  const chatEndRef = useRef(null);

  function handleUpdate() {
    setError("");
    const parsed = parseMessages(messagesRaw);
    if (!parsed) { setError("Invalid Messages JSON"); return; }
    const resp = responseRaw.trim() ? parseResponse(responseRaw) : null;
    if (responseRaw.trim() && !resp) { setError("Invalid Response JSON"); return; }
    setChatMessages(parsed);
    setChatResponse(resp);
    setChatReasoning(reasoningRaw.trim());
  }

  useEffect(() => { handleUpdate(); }, []);
  useEffect(() => { chatEndRef.current?.scrollIntoView({ behavior: "smooth" }); }, [chatMessages, chatResponse]);

  const textareaBase = {
    width: "100%", flex: 1, resize: "none", border: "1px solid #e5e7eb", borderRadius: 6,
    padding: "10px", fontSize: 11.5, lineHeight: 1.45, color: "#1f2937", background: "#fafafa",
    outline: "none", boxSizing: "border-box",
  };

  return (
    <div style={{ display: "flex", height: "100vh", fontFamily: "'Segoe UI',-apple-system,BlinkMacSystemFont,sans-serif", background: "#f3f4f6" }}>
      {/* LEFT PANEL */}
      <div style={{ width: "45%", minWidth: 300, display: "flex", flexDirection: "column", borderRight: "1px solid #e5e7eb", background: "#fff" }}>
        <div style={{ display: "flex", borderBottom: "1px solid #e5e7eb", padding: "0 10px", background: "#fafafa", flexShrink: 0 }}>
          <Tab label="Messages" icon="💬" active={activeTab === "messages"} onClick={() => setActiveTab("messages")} />
          <Tab label="Response" icon="🤖" active={activeTab === "response"} onClick={() => setActiveTab("response")} />
          <Tab label="Reasoning" icon="🧠" active={activeTab === "reasoning"} onClick={() => setActiveTab("reasoning")} />
        </div>

        <div style={{ flex: 1, display: "flex", flexDirection: "column", padding: 10, overflow: "hidden" }}>
          <div style={{ fontSize: 9, fontWeight: 700, color: "#9ca3af", textTransform: "uppercase", letterSpacing: 0.8, marginBottom: 5 }}>
            {activeTab === "messages" && "Conversation Messages — JSON Array"}
            {activeTab === "response" && "AI Response — JSON Object"}
            {activeTab === "reasoning" && "Reasoning Output — Plain Text (Optional)"}
          </div>

          {activeTab === "messages" && (
            <textarea value={messagesRaw} onChange={(e) => setMessagesRaw(e.target.value)}
              style={{ ...textareaBase, fontFamily: "'Fira Code','Consolas',monospace" }} spellCheck={false} />
          )}
          {activeTab === "response" && (
            <textarea value={responseRaw} onChange={(e) => setResponseRaw(e.target.value)}
              style={{ ...textareaBase, fontFamily: "'Fira Code','Consolas',monospace" }} spellCheck={false} />
          )}
          {activeTab === "reasoning" && (
            <textarea value={reasoningRaw} onChange={(e) => setReasoningRaw(e.target.value)}
              style={{ ...textareaBase, fontSize: 12 }} spellCheck={false}
              placeholder="Paste model reasoning / chain-of-thought here (optional)..." />
          )}
        </div>

        <div style={{ padding: "8px 10px", borderTop: "1px solid #e5e7eb", background: "#fafafa", flexShrink: 0 }}>
          {error && <div style={{ fontSize: 11, color: "#dc2626", marginBottom: 5, fontWeight: 500 }}>⚠ {error}</div>}
          <button onClick={handleUpdate} style={{
            width: "100%", padding: "10px 0", border: "none", borderRadius: 6,
            background: "linear-gradient(135deg,#7c3aed,#6d28d9)", color: "#fff",
            fontSize: 13, fontWeight: 700, cursor: "pointer", letterSpacing: 0.3,
            boxShadow: "0 2px 8px rgba(109,40,217,0.25)",
          }}>
            ▶ Update View
          </button>
        </div>
      </div>

      {/* RIGHT PANEL */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", background: "#e5ddd5" }}>
        <div style={{ background: "#075e54", color: "#fff", padding: "10px 14px", display: "flex", alignItems: "center", gap: 10, flexShrink: 0 }}>
          <div style={{ width: 34, height: 34, borderRadius: "50%", background: "#128c7e", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: 13 }}>KC</div>
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: 600, fontSize: 13 }}>Chat Preview</div>
            <div style={{ fontSize: 10, opacity: 0.75 }}>
              {chatMessages.filter(m => m.sender !== "system").length} messages
              {chatResponse ? " · response loaded" : ""}
              {chatReasoning ? " · reasoning loaded" : ""}
            </div>
          </div>
        </div>

        <div style={{
          flex: 1, overflowY: "auto", padding: "10px",
          backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23c9c3ba' fill-opacity='0.12'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")",
        }}>
          {chatMessages.length === 0 && (
            <div style={{ textAlign: "center", marginTop: 80, color: "#9ca3af", fontSize: 13 }}>
              Paste JSON and click <b>Update View</b>
            </div>
          )}

          {chatMessages.map((msg) =>
            msg.sender === "system"
              ? <SystemMsg key={msg.id} text={msg.text} time={msg.time} />
              : <Bubble key={msg.id} msg={msg} />
          )}

          {chatReasoning && <ReasoningBlock text={chatReasoning} />}
          {chatResponse && <ResponseBubble data={chatResponse} />}
          <div ref={chatEndRef} />
        </div>
      </div>
    </div>
  );
}
