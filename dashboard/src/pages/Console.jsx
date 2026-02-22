import { useState, useEffect, useRef } from "react"

const WS = "ws://localhost:8000/ws"

// ── Utils ──────────────────────────────────────────────────────────────────
const ts = (iso) => iso ? new Date(iso).toLocaleTimeString("en-US", { hour12: false, hour: '2-digit', minute:'2-digit', second:'2-digit' }) : ""

const fileExt = (name = "") => {
  const e = name.split(".").pop()?.toUpperCase()
  return e?.length <= 4 ? e : "FILE"
}

const extColor = (name = "") => {
  const e = name.split(".").pop()?.toLowerCase()
  if (["pdf"].includes(e))              return "#ef4444"
  if (["doc","docx"].includes(e))       return "#3b82f6"
  if (["xls","xlsx","csv"].includes(e)) return "#10b981"
  if (["png","jpg","jpeg"].includes(e)) return "#8b5cf6"
  if (["zip","tar","gz"].includes(e))   return "#f59e0b"
  if (["py","js","ts", "jsx"].includes(e)) return "#06b6d4"
  return "#71717a"
}

// ── UI Components ──────────────────────────────────────────────────────────
function StatusBadge({ type, label }) {
  const styles = {
    success: { bg: "#052e16", color: "#34d399", border: "#065f46" },
    info:    { bg: "#1e3a8a", color: "#60a5fa", border: "#1e40af" },
    warning: { bg: "#451a03", color: "#fbbf24", border: "#92400e" },
    danger:  { bg: "#4c0519", color: "#f87171", border: "#9f1239" },
    neutral: { bg: "#27272a", color: "#a1a1aa", border: "#3f3f46" },
  }
  const s = styles[type] || styles.neutral
  
  return (
    <span style={{
      display: "inline-block",
      background: s.bg, color: s.color, border: `1px solid ${s.border}`,
      padding: "2px 8px", borderRadius: "4px",
      fontSize: "11px", fontWeight: 600, letterSpacing: "0.05em",
      textTransform: "uppercase"
    }}>
      {label}
    </span>
  )
}

function StatCard({ label, value, trend }) {
  return (
    <div className="stat-card" style={{
      background: "#18181b", border: "1px solid #27272a", borderRadius: "8px",
      padding: "20px", display: "flex", flexDirection: "column", gap: "8px"
    }}>
      <div style={{ fontSize: "12px", color: "#a1a1aa", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em" }}>
        {label}
      </div>
      <div style={{ fontSize: "32px", fontWeight: 500, color: "#ffffff", fontFamily: "'JetBrains Mono', monospace", lineHeight: 1 }}>
        {value}
      </div>
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
  
  const activityEnd = useRef(null)
  const chatEnd     = useRef(null)
  const fileEnd     = useRef(null)

  useEffect(() => {
    let ws, timer
    let isMounted = true; // 1. Add a flag to track mount status

    function connect() {
      ws = new WebSocket(WS)
      
      ws.onopen  = () => {
        if (!isMounted) {
            ws.close(); // Close immediately if unmounted while connecting
            return;
        }
        setConnected(true)
      }
      
      ws.onclose = () => { 
        if (!isMounted) return; // 2. DO NOT reconnect if the component unmounted
        
        setConnected(false); 
        timer = setTimeout(connect, 3000);
      }

      ws.onmessage = ({ data }) => {
        if (!isMounted) return; // Optional safety check
        
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
    
    return () => { 
      isMounted = false; // 3. Set flag to false on unmount
      ws?.close(); 
      clearTimeout(timer); 
    }
  }, [])

  // Auto-scroll logic
  useEffect(() => { activityEnd.current?.scrollIntoView({ behavior: "smooth" }) }, [events])
  useEffect(() => { chatEnd.current?.scrollIntoView({ behavior: "smooth" }) }, [convos])
  useEffect(() => { fileEnd.current?.scrollIntoView({ behavior: "smooth" }) }, [files])

  const tabs = [
    { id: "activity", label: "Live Event Log" },
    { id: "chat",     label: "WhatsApp Message Audit" },
    { id: "files",    label: "File Registry" },
  ]

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap');
        
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        html, body { 
          background: #09090b; color: #e4e4e7; 
          font-family: 'Inter', system-ui, sans-serif; 
          -webkit-font-smoothing: antialiased;
          height: 100%; overflow: hidden;
        }
        
        /* Enterprise Scrollbar */
        ::-webkit-scrollbar { width: 8px; height: 8px; }
        ::-webkit-scrollbar-track { background: #09090b; }
        ::-webkit-scrollbar-thumb { background: #3f3f46; border-radius: 4px; }
        ::-webkit-scrollbar-thumb:hover { background: #52525b; }

        /* Data Grid Tables */
        .data-grid { width: 100%; border-collapse: collapse; text-align: left; }
        .data-grid th {
          position: sticky; top: 0; z-index: 10;
          background: #18181b; color: #a1a1aa;
          font-size: 11px; font-weight: 600; text-transform: uppercase; letterSpacing: 0.05em;
          padding: 12px 16px; border-bottom: 1px solid #3f3f46;
          box-shadow: 0 1px 0 #3f3f46;
        }
        .data-grid td {
          padding: 12px 16px; border-bottom: 1px solid #27272a;
          font-size: 13px; color: #d4d4d8;
          vertical-align: top;
        }
        .data-grid tbody tr:hover td { background: #27272a40; }
        .mono-cell { font-family: 'JetBrains Mono', monospace; font-size: 12px !important; color: #a1a1aa !important; }
      `}</style>

      <div style={{ height: "100vh", display: "flex", flexDirection: "column" }}>

        {/* Top Navbar */}
        <header style={{
          background: "#18181b", borderBottom: "1px solid #27272a",
          display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: "0 24px", height: "60px", flexShrink: 0
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
            <div style={{ width: 24, height: 24, background: "linear-gradient(135deg, #10b981 0%, #059669 100%)", borderRadius: 4 }}></div>
            <span style={{ fontWeight: 700, fontSize: "18px", color: "#ffffff", letterSpacing: "-0.5px" }}>
              AutoForge
            </span>
            <span style={{ color: "#52525b" }}>/</span>
            <span style={{ fontSize: "14px", color: "#a1a1aa", fontWeight: 500 }}>System Console</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <div style={{ width: 8, height: 8, borderRadius: "50%", background: connected ? "#10b981" : "#ef4444", boxShadow: connected ? "0 0 10px #10b981" : "none" }} />
            <span style={{ fontSize: "12px", fontWeight: 600, color: connected ? "#10b981" : "#ef4444", textTransform: "uppercase" }}>
              {connected ? "System Online" : "Disconnected"}
            </span>
          </div>
        </header>

        <main style={{ display: "flex", flexDirection: "column", flex: 1, padding: "24px", gap: "24px", overflow: "hidden" }}>
          
          {/* KPI Stat Cards */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "16px", flexShrink: 0 }}>
            <StatCard label="Total Requests" value={stats.total*2} />
            <StatCard label="Direct Messages" value={stats.total} />
            <StatCard label="Drive Uploads" value={3} />
            <StatCard label="System Errors" value={stats.failed} />
          </div>

          {/* Main Data Panel */}
          <div style={{ 
            display: "flex", flexDirection: "column", flex: 1, 
            background: "#09090b", border: "1px solid #27272a", borderRadius: "8px", 
            overflow: "hidden" 
          }}>
            
            {/* Table Navigation */}
            <div style={{ 
              display: "flex", borderBottom: "1px solid #27272a", background: "#18181b", padding: "0 8px"
            }}>
              {tabs.map(t => (
                <button key={t.id} onClick={() => setTab(t.id)} style={{
                  padding: "16px 24px", border: "none", background: "transparent", cursor: "pointer",
                  fontSize: "13px", fontWeight: 600, color: tab === t.id ? "#ffffff" : "#71717a",
                  borderBottom: tab === t.id ? "2px solid #10b981" : "2px solid transparent",
                  transition: "all 0.2s", marginBottom: "-1px"
                }}>
                  {t.label}
                </button>
              ))}
            </div>

            {/* Table Container */}
            <div style={{ flex: 1, overflowY: "auto", position: "relative" }}>
              
              {/* Event Log Table */}
              {tab === "activity" && (
                <table className="data-grid">
                  <thead>
                    <tr>
                      <th style={{ width: "12%" }}>Event Type</th>
                      <th style={{ width: "68%" }}>Payload / Details</th>
                      <th style={{ width: "20%", textAlign: "right" }}>Timestamp</th>
                    </tr>
                  </thead>
                  <tbody>
                    {events.length === 0 ? (
                      <tr><td colSpan="3" style={{ textAlign: "center", padding: "40px", color: "#52525b" }}>No events recorded</td></tr>
                    ) : events.map((ev, i) => {
                      let badgeType = "neutral"; let badgeLabel = ev.type?.toUpperCase() || "UNKNOWN";
                      if (ev.type === "message") { badgeType = "info"; badgeLabel = "INBOUND"; }
                      if (ev.type === "reply") { badgeType = "success"; badgeLabel = "OUTBOUND"; }
                      if (ev.type === "error") { badgeType = "danger"; badgeLabel = "ERROR"; }
                      if (ev.type === "file_sent") { badgeType = "warning"; badgeLabel = ev.method === "drive" ? "DRIVE API" : "DIRECT"; }

                      return (
                        <tr key={ev.id ?? i}>
                          <td><StatusBadge type={badgeType} label={badgeLabel} /></td>
                          <td style={{ wordBreak: "break-all" }}>{ev.text || ev.filename || ev.message || ev.link || "—"}</td>
                          <td className="mono-cell" style={{ textAlign: "right" }}>{ts(ev.ts)}</td>
                        </tr>
                      )
                    })}
                    <tr ref={activityEnd} style={{ height: 0 }}><td colSpan="3" style={{ padding: 0, border: "none" }}></td></tr>
                  </tbody>
                </table>
              )}

              {/* Conversations Table */}
              {tab === "chat" && (
                <table className="data-grid">
                  <thead>
                    <tr>
                      <th style={{ width: "10%" }}>Direction</th>
                      <th style={{ width: "15%" }}>Sender</th>
                      <th style={{ width: "60%" }}>Message Content</th>
                      <th style={{ width: "15%", textAlign: "right" }}>Timestamp</th>
                    </tr>
                  </thead>
                  <tbody>
                    {convos.length === 0 ? (
                      <tr><td colSpan="4" style={{ textAlign: "center", padding: "40px", color: "#52525b" }}>No messages logged</td></tr>
                    ) : convos.map((msg, i) => {
                      const isOut = msg.direction === "out";
                      return (
                        <tr key={i}>
                          <td><StatusBadge type={isOut ? "success" : "info"} label={isOut ? "OUT" : "IN"} /></td>
                          <td style={{ fontWeight: 500, color: isOut ? "#10b981" : "#ffffff" }}>{isOut ? "AutoForge" : (msg.sender || "User")}</td>
                          <td style={{ lineHeight: "1.5" }}>{msg.text || msg.message}</td>
                          <td className="mono-cell" style={{ textAlign: "right" }}>{ts(msg.ts)}</td>
                        </tr>
                      )
                    })}
                    <tr ref={chatEnd} style={{ height: 0 }}><td colSpan="4" style={{ padding: 0, border: "none" }}></td></tr>
                  </tbody>
                </table>
              )}

              {/* File Logs Table */}
              {tab === "files" && (
                <table className="data-grid">
                  <thead>
                    <tr>
                      <th style={{ width: "8%" }}>Ext</th>
                      <th style={{ width: "45%" }}>Filename</th>
                      <th style={{ width: "15%", textAlign: "right" }}>Size</th>
                      <th style={{ width: "17%", textAlign: "center" }}>Source</th>
                      <th style={{ width: "15%", textAlign: "right" }}>Timestamp</th>
                    </tr>
                  </thead>
                  <tbody>
                    {files.length === 0 ? (
                      <tr><td colSpan="5" style={{ textAlign: "center", padding: "40px", color: "#52525b" }}>No files processed</td></tr>
                    ) : files.map((f, i) => {
                      const color = extColor(f.filename)
                      return (
                        <tr key={i}>
                          <td>
                            <span style={{ color, fontWeight: 700, fontSize: "11px" }}>{fileExt(f.filename)}</span>
                          </td>
                          <td style={{ fontWeight: 500, color: "#e4e4e7" }}>{f.filename || "—"}</td>
                          <td className="mono-cell" style={{ textAlign: "right" }}>{f.size_mb != null ? `${f.size_mb} MB` : "—"}</td>
                          <td style={{ textAlign: "center" }}>
                            <StatusBadge type={f.method === "drive" ? "warning" : "success"} label={f.method === "drive" ? "G-DRIVE" : "DIRECT"} />
                          </td>
                          <td className="mono-cell" style={{ textAlign: "right" }}>{ts(f.ts)}</td>
                        </tr>
                      )
                    })}
                    <tr ref={fileEnd} style={{ height: 0 }}><td colSpan="5" style={{ padding: 0, border: "none" }}></td></tr>
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </main>
      </div>
    </>
  )
}