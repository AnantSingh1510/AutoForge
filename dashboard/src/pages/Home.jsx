import { useState, useEffect, useRef } from "react"
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

export default function Home() {
  const [uptime, setUptime] = useState("00:00:00")
  const [chartData, setChartData] = useState([])
  const startTime = useRef(null)

  // ── Uptime Timer ─────────────────────────────────────────────────────────
  useEffect(() => {
    const storedStart = localStorage.getItem("agent_start_time")
    if (storedStart) {
      startTime.current = Number(storedStart)
    } else {
      const now = Date.now()
      localStorage.setItem("agent_start_time", String(now))
      startTime.current = now
    }

    const updateTimer = () => {
      if (!startTime.current) return
      const diff = Math.floor((Date.now() - startTime.current) / 1000)
      const h = String(Math.floor(diff / 3600)).padStart(2, "0")
      const m = String(Math.floor((diff % 3600) / 60)).padStart(2, "0")
      const s = String(diff % 60).padStart(2, "0")
      setUptime(`${h}:${m}:${s}`)
    }

    updateTimer()
    const timer = setInterval(updateTimer, 1000)
    return () => clearInterval(timer)
  }, [])

  // ── WebSocket & Token Calculation ────────────────────────────────────────
  useEffect(() => {
    let ws, timer

    const tsFormat = (iso) => new Date(iso || Date.now()).toLocaleTimeString("en-US", { 
      hour12: false, hour: '2-digit', minute:'2-digit', second:'2-digit' 
    })

    const calcTokens = (ev) => {
      const content = ev.text || ev.filename || ev.message || ""
      return content.length * 25 // 1 letter = 1 token approximation
    }

    function connect() {
      ws = new WebSocket("ws://localhost:8000/ws")

      ws.onmessage = ({ data }) => {
        const msg = JSON.parse(data)
        if (msg.type === "ping") return

        if (msg.type === "init") {
          const initialData = (msg.events || []).slice(-30).map(ev => ({
            time: tsFormat(ev.ts),
            tokens: calcTokens(ev)
          }))
          setChartData(initialData)
        }

        if (msg.type === "event") {
          const ev = msg.data
          setChartData(prev => {
            const newData = [...prev, { time: tsFormat(ev.ts), tokens: calcTokens(ev) }]
            return newData.slice(-30) // Keep last 30 data points
          })
        }
      }

      ws.onclose = () => { timer = setTimeout(connect, 3000) }
    }

    connect()
    return () => { ws?.close(); clearTimeout(timer) }
  }, [])

  const identityStats = [
    { label: "Agent Name", value: "AutoForge" },
    { label: "Agent ID", value: "main" },
    { label: "Model Engine", value: "GPT-5.1 Codex" },
    { label: "System Uptime", value: uptime, mono: true },
  ]

  // ── Custom Shadcn Tooltip ────────────────────────────────────────────────
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div style={{
          background: "#09090b", border: "1px solid #27272a", borderRadius: "8px",
          padding: "12px", boxShadow: "0 4px 12px rgba(0,0,0,0.5)"
        }}>
          <p style={{ color: "#a1a1aa", fontSize: "12px", marginBottom: "4px" }}>{label}</p>
          <p style={{ color: "#10b981", fontSize: "14px", fontWeight: 600, fontFamily: "'JetBrains Mono', monospace" }}>
            {payload[0].value} Tokens
          </p>
        </div>
      )
    }
    return null
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        html, body {
          background: #09090b; color: #e4e4e7;
          font-family: 'Inter', system-ui, sans-serif;
          -webkit-font-smoothing: antialiased;
        }
        .card {
          background: #18181b; border: 1px solid #27272a; border-radius: 8px;
        }
        .label {
          font-size: 11px; font-weight: 600; text-transform: uppercase;
          letter-spacing: 0.05em; color: #a1a1aa;
        }
        .value {
          font-size: 26px; font-weight: 500; color: #ffffff; line-height: 1.2;
        }
        .mono { font-family: 'JetBrains Mono', monospace; font-size: 24px; }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(6px); }
          to { opacity: 1; transform: translateY(0); }
        }
        ::-webkit-scrollbar { width: 8px; height: 8px; }
        ::-webkit-scrollbar-track { background: #09090b; }
        ::-webkit-scrollbar-thumb { background: #3f3f46; border-radius: 4px; }
        ::-webkit-scrollbar-thumb:hover { background: #52525b; }
      `}</style>

      <div style={{ height: "100vh", display: "flex", flexDirection: "column" }}>
        
        <header style={{
          background: "#18181b", borderBottom: "1px solid #27272a",
          display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: "0 24px", height: "60px", flexShrink: 0
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
            <div style={{
              width: 24, height: 24, borderRadius: 4,
              background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
            }} />
            <span style={{ fontWeight: 700, fontSize: "18px", color: "#ffffff", letterSpacing: "-0.5px" }}>
              AutoForge
            </span>
            <span style={{ color: "#52525b" }}>/</span>
            <span style={{ fontSize: "14px", color: "#a1a1aa", fontWeight: 500 }}>
              Agent Overview
            </span>
          </div>
        </header>

        <main style={{
          flex: 1, padding: "24px", display: "flex", flexDirection: "column", gap: "24px",
          animation: "fadeIn 0.3s ease-out", overflowY: "auto"
        }}>

          {/* Identity Grid */}
          <div>
            <h1 style={{ fontSize: "20px", fontWeight: 600, color: "#ffffff", letterSpacing: "-0.3px" }}>
              Identity & Runtime State
            </h1>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "16px" }}>
            {identityStats.map((stat, i) => (
              <div key={i} className="card" style={{ padding: "20px", display: "flex", flexDirection: "column", gap: "10px" }}>
                <div className="label">{stat.label}</div>
                <div className={`value ${stat.mono ? "mono" : ""}`}>{stat.value}</div>
              </div>
            ))}
          </div>

          {/* Token Usage Graph (Shadcn Style) */}
          <div className="card" style={{ padding: "24px", display: "flex", flexDirection: "column", gap: "20px", flex: 1, minHeight: "350px" }}>
            <div>
              <h2 style={{ fontSize: "16px", fontWeight: 600, color: "#ffffff" }}>Real-time Token Consumption</h2>
              <p style={{ fontSize: "13px", color: "#a1a1aa", marginTop: "4px" }}>Estimated tokens used per event payload over time.</p>
            </div>
            
            <div style={{ flex: 1, width: "100%", height: "100%" }}>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorTokens" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
                  <XAxis 
                    dataKey="time" 
                    stroke="#71717a" 
                    fontSize={11} 
                    tickLine={false} 
                    axisLine={false} 
                    minTickGap={20}
                  />
                  <YAxis 
                    stroke="#71717a" 
                    fontSize={11} 
                    tickLine={false} 
                    axisLine={false} 
                    tickFormatter={(value) => `${value}`}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Area 
                    type="monotone" 
                    dataKey="tokens" 
                    stroke="#10b981" 
                    strokeWidth={2}
                    fillOpacity={1} 
                    fill="url(#colorTokens)" 
                    isAnimationActive={false}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

        </main>
      </div>
    </>
  )
}