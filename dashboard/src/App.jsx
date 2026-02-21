import { useState, useEffect, useRef } from "react"

const WS = "ws://localhost:8000/ws"

// ── Utils ──────────────────────────────────────────────────────────────────
const ts = (iso) => iso ? new Date(iso).toLocaleTimeString("en-US", { hour12: false }) : ""

const fileExt = (name = "") => {
  const e = name.split(".").pop()?.toUpperCase()
  return e?.length <= 4 ? e : "FILE"
}

const extColor = (name = "") => {
  const e = name.split(".").pop()?.toLowerCase()
  if (["pdf"].includes(e))              return "#ef4444"
  if (["doc","docx"].includes(e))       return "#3b82f6"
  if (["xls","xlsx","csv"].includes(e)) return "#22c55e"
  if (["png","jpg","jpeg"].includes(e)) return "#a78bfa"
  if (["zip","tar","gz"].includes(e))   return "#f59e0b"
  if (["py","js","ts"].includes(e))     return "#06b6d4"
  return "#6b7280"
}

// ── Components ─────────────────────────────────────────────────────────────
function LiveDot({ on }) {
  return (
    <span style={{ position: "relative", display: "inline-flex", alignItems: "center" }}>
      {on && <span style={{
        position: "absolute", width: 8, height: 8, borderRadius: "50%",
        background: "#22c55e", opacity: 0.5,
        animation: "ripple 1.4s ease-out infinite",
      }}/>}
      <span style={{
        width: 8, height: 8, borderRadius: "50%",
        background: on ? "#22c55e" : "#374151",
        display: "inline-block",
      }}/>
    </span>
  )
}

function Stat({ label, value, accent }) {
  return (
    <div style={{
      background: "#0d1117",
      border: "1px solid #161b22",
      borderRadius: 12,
      padding: "18px 20px",
      borderTop: `3px solid ${accent}`,
    }}>
      <div style={{
        fontSize: 36, fontWeight: 800,
        color: accent, lineHeight: 1,
        fontVariantNumeric: "tabular-nums",
      }}>{value}</div>
      <div style={{ fontSize: 11, color: "#4b5563", marginTop: 6, letterSpacing: "0.07em" }}>
        {label}
      </div>
    </div>
  )
}

function EventRow({ ev }) {
  const cfg = {
    message:   { label: "IN",     color: "#3b82f6" },
    reply:     { label: "OUT",    color: "#22c55e" },
    file_sent: { label: ev.method === "drive" ? "DRIVE" : "DIRECT", color: ev.method === "drive" ? "#f59e0b" : "#22c55e" },
    error:     { label: "ERROR",  color: "#ef4444" },
  }
  const c = cfg[ev.type] || { label: ev.type?.toUpperCase(), color: "#6b7280" }

  return (
    <div style={{
      display: "flex", gap: 10, alignItems: "flex-start",
      padding: "9px 0", borderBottom: "1px solid #0d1117",
      animation: "fadeUp 0.25s ease both",
    }}>
      <span style={{
        fontSize: 9, fontWeight: 700, letterSpacing: "0.07em",
        padding: "3px 6px", borderRadius: 4, flexShrink: 0,
        background: c.color + "18", color: c.color,
        minWidth: 46, textAlign: "center", marginTop: 1,
      }}>{c.label}</span>
      <span style={{ flex: 1, fontSize: 13, color: "#9ca3af", lineHeight: 1.5, wordBreak: "break-word" }}>
        {ev.text || ev.filename || ev.message || ev.link || "—"}
      </span>
      <span style={{ fontSize: 11, color: "#374151", flexShrink: 0 }}>{ts(ev.ts)}</span>
    </div>
  )
}

function ChatBubble({ msg }) {
  const out = msg.direction === "out"
  return (
    <div style={{
      display: "flex", justifyContent: out ? "flex-end" : "flex-start",
      marginBottom: 10, animation: "fadeUp 0.2s ease both",
    }}>
      <div style={{
        maxWidth: "72%",
        background: out ? "#0a2e1a" : "#0d1117",
        border: `1px solid ${out ? "#14532d" : "#161b22"}`,
        borderRadius: out ? "12px 2px 12px 12px" : "2px 12px 12px 12px",
        padding: "9px 13px",
      }}>
        <p style={{ margin: 0, fontSize: 13, color: out ? "#86efac" : "#d1d5db", lineHeight: 1.55 }}>
          {msg.text || msg.message}
        </p>
        <p style={{ margin: "5px 0 0", fontSize: 10, color: "#374151" }}>
          {out ? "DevMate" : (msg.sender || "User")} · {ts(msg.ts)}
        </p>
      </div>
    </div>
  )
}

function FileRow({ f }) {
  const color = extColor(f.filename)
  const isDrive = f.method === "drive"
  return (
    <div style={{
      display: "grid",
      gridTemplateColumns: "40px 1fr 70px 72px 76px",
      alignItems: "center", gap: 12,
      padding: "10px 0", borderBottom: "1px solid #0d1117",
      animation: "fadeUp 0.25s ease both",
    }}>
      <div style={{
        background: color + "18", border: `1px solid ${color}33`,
        borderRadius: 6, padding: "5px 0", textAlign: "center",
        fontSize: 9, fontWeight: 800, color, letterSpacing: "0.05em",
      }}>{fileExt(f.filename)}</div>
      <span style={{
        fontSize: 13, color: "#d1d5db",
        overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
      }}>{f.filename || "—"}</span>
      <span style={{ fontSize: 12, color: "#6b7280", textAlign: "right" }}>
        {f.size_mb != null ? `${f.size_mb} MB` : "—"}
      </span>
      <span style={{
        fontSize: 10, fontWeight: 700, letterSpacing: "0.06em",
        padding: "3px 0", borderRadius: 999, textAlign: "center",
        background: isDrive ? "#78350f22" : "#052e1622",
        color: isDrive ? "#f59e0b" : "#22c55e",
      }}>{isDrive ? "DRIVE" : "DIRECT"}</span>
      <span style={{ fontSize: 11, color: "#374151", textAlign: "right" }}>{ts(f.ts)}</span>
    </div>
  )
}

// ── App ────────────────────────────────────────────────────────────────────
export default function App() {
  const [connected, setConnected]  = useState(false)
  const [stats, setStats]          = useState({ total: 0, direct: 0, drive: 0, failed: 0 })
  const [events, setEvents]        = useState([])
  const [convos, setConvos]        = useState([])
  const [files, setFiles]          = useState([])
  const [tab, setTab]              = useState("activity")
  const activityEnd                = useRef(null)
  const chatEnd                    = useRef(null)

  useEffect(() => {
    let ws, timer

    function connect() {
      ws = new WebSocket(WS)
      ws.onopen  = () => setConnected(true)
      ws.onclose = () => { setConnected(false); timer = setTimeout(connect, 3000) }

      ws.onmessage = ({ data }) => {
        const msg = JSON.parse(data)
        if (msg.type === "ping") return

        if (msg.type === "init") {
          setStats(msg.stats || {})
          setEvents(msg.events || [])
          setConvos(msg.conversations || [])
          setFiles(msg.files || [])
          return
        }

        if (msg.type === "event") {
          const ev = msg.data
          setStats(msg.stats)
          setEvents(p => [...p.slice(-200), ev])
          if (ev.type === "message" || ev.type === "reply") setConvos(p => [...p.slice(-100), ev])
          if (ev.type === "file_sent") setFiles(p => [...p.slice(-100), ev])
        }
      }
    }

    connect()
    return () => { ws?.close(); clearTimeout(timer) }
  }, [])

  useEffect(() => { activityEnd.current?.scrollIntoView({ behavior: "smooth" }) }, [events])
  useEffect(() => { chatEnd.current?.scrollIntoView({ behavior: "smooth" }) }, [convos])

  const tabs = [
    { id: "activity", label: "Live Activity" },
    { id: "chat",     label: "Conversations" },
    { id: "files",    label: "File Log" },
  ]

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=IBM+Plex+Mono:wght@400;500&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        html, body { background: #060b12; color: #e5e7eb; font-family: 'IBM Plex Mono', monospace; height: 100%; }
        ::-webkit-scrollbar { width: 3px; }
        ::-webkit-scrollbar-thumb { background: #1e293b; border-radius: 2px; }
        @keyframes ripple { 0% { transform: scale(1); opacity: 0.6; } 100% { transform: scale(2.5); opacity: 0; } }
        @keyframes fadeUp { from { opacity: 0; transform: translateY(5px); } to { opacity: 1; transform: none; } }
      `}</style>

      <div style={{ minHeight: "100vh", background: "#060b12" }}>

        {/* Header */}
        <header style={{
          position: "sticky", top: 0, zIndex: 100,
          background: "#060b12ee", backdropFilter: "blur(16px)",
          borderBottom: "1px solid #0d1117",
          display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: "0 28px", height: 52,
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <span style={{
              fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 17,
              color: "#f9fafb", letterSpacing: "-0.3px",
            }}>DevMate</span>
            <span style={{
              fontSize: 9, letterSpacing: "0.12em", color: "#374151",
              border: "1px solid #161b22", padding: "2px 7px", borderRadius: 4,
            }}>DASHBOARD</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <LiveDot on={connected} />
            <span style={{ fontSize: 11, color: connected ? "#22c55e" : "#4b5563" }}>
              {connected ? "LIVE" : "OFFLINE"}
            </span>
          </div>
        </header>

        <main style={{ maxWidth: 1080, margin: "0 auto", padding: "28px 20px 48px" }}>

          {/* Stats */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 14, marginBottom: 28 }}>
            <Stat label="TOTAL REQUESTS" value={stats.total}  accent="#3b82f6" />
            <Stat label="SENT DIRECTLY"  value={stats.direct} accent="#22c55e" />
            <Stat label="DRIVE UPLOADS"  value={stats.drive}  accent="#f59e0b" />
            <Stat label="ERRORS"         value={stats.failed} accent="#ef4444" />
          </div>

          {/* Tabs */}
          <div style={{
            display: "flex", gap: 2, marginBottom: 16,
            background: "#0d1117", borderRadius: 8, padding: 3, width: "fit-content",
          }}>
            {tabs.map(t => (
              <button key={t.id} onClick={() => setTab(t.id)} style={{
                padding: "6px 16px", borderRadius: 6,
                border: "none", cursor: "pointer",
                fontSize: 11, fontFamily: "inherit",
                letterSpacing: "0.05em",
                background: tab === t.id ? "#161b22" : "transparent",
                color: tab === t.id ? "#e5e7eb" : "#4b5563",
                transition: "all 0.15s",
              }}>{t.label}</button>
            ))}
          </div>

          {/* Panel */}
          <div style={{
            background: "#0d1117",
            border: "1px solid #161b22",
            borderRadius: 12,
            overflow: "hidden",
          }}>

            {/* Activity */}
            {tab === "activity" && <>
              <div style={{
                padding: "12px 18px", borderBottom: "1px solid #0d1117",
                display: "flex", justifyContent: "space-between",
              }}>
                <span style={{ fontSize: 10, color: "#374151", letterSpacing: "0.1em" }}>LIVE AGENT ACTIVITY</span>
                <span style={{ fontSize: 10, color: "#1e293b" }}>{events.length} events</span>
              </div>
              <div style={{ height: 460, overflowY: "auto", padding: "4px 18px" }}>
                {events.length === 0
                  ? <Empty text="Waiting for activity" sub="Send a WhatsApp message to start" />
                  : events.map((ev, i) => <EventRow key={ev.id ?? i} ev={ev} />)
                }
                <div ref={activityEnd} />
              </div>
            </>}

            {/* Conversations */}
            {tab === "chat" && <>
              <div style={{ padding: "12px 18px", borderBottom: "1px solid #0d1117" }}>
                <span style={{ fontSize: 10, color: "#374151", letterSpacing: "0.1em" }}>WHATSAPP CONVERSATIONS</span>
              </div>
              <div style={{ height: 460, overflowY: "auto", padding: "16px 18px" }}>
                {convos.length === 0
                  ? <Empty text="No messages yet" />
                  : convos.map((m, i) => <ChatBubble key={i} msg={m} />)
                }
                <div ref={chatEnd} />
              </div>
            </>}

            {/* Files */}
            {tab === "files" && <>
              <div style={{ padding: "12px 18px", borderBottom: "1px solid #0d1117" }}>
                <div style={{ display: "grid", gridTemplateColumns: "40px 1fr 70px 72px 76px", gap: 12 }}>
                  {["TYPE","FILENAME","SIZE","METHOD","TIME"].map(h =>
                    <span key={h} style={{ fontSize: 9, color: "#374151", letterSpacing: "0.1em" }}>{h}</span>
                  )}
                </div>
              </div>
              <div style={{ height: 460, overflowY: "auto", padding: "4px 18px" }}>
                {files.length === 0
                  ? <Empty text="No files fetched yet" />
                  : files.map((f, i) => <FileRow key={i} f={f} />)
                }
              </div>
            </>}

          </div>
        </main>
      </div>
    </>
  )
}

function Empty({ text, sub }) {
  return (
    <div style={{ textAlign: "center", padding: "72px 0", color: "#1e293b" }}>
      <p style={{ fontSize: 13 }}>{text}</p>
      {sub && <p style={{ fontSize: 11, marginTop: 6 }}>{sub}</p>}
    </div>
  )
}