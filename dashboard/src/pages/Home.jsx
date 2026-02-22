import { useState, useEffect, useRef } from "react"

export default function Home() {
  const [uptime, setUptime] = useState("00:00:00")
  const startTime = useRef(null)

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

  const identityStats = [
    { label: "Agent Name", value: "AutoForge" },
    { label: "Agent ID", value: "main" },
    { label: "Model Engine", value: "GPT-5.1 Codex" },
    { label: "System Uptime", value: uptime, mono: true },
  ]

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        html, body {
          background: #09090b;
          color: #e4e4e7;
          font-family: 'Inter', system-ui, sans-serif;
          -webkit-font-smoothing: antialiased;
        }

        .card {
          background: #18181b;
          border: 1px solid #27272a;
          border-radius: 8px;
        }

        .label {
          font-size: 11px;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          color: #a1a1aa;
        }

        .value {
          font-size: 26px;
          font-weight: 500;
          color: #ffffff;
          line-height: 1.2;
        }

        .mono {
          font-family: 'JetBrains Mono', monospace;
          font-size: 24px;
        }

        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(6px); }
          to { opacity: 1; transform: translateY(0); }
        }

                /* Enterprise Scrollbar */
        ::-webkit-scrollbar { width: 8px; height: 8px; }
        ::-webkit-scrollbar-track { background: #09090b; }
        ::-webkit-scrollbar-thumb { background: #3f3f46; border-radius: 4px; }
        ::-webkit-scrollbar-thumb:hover { background: #52525b; }
      `}</style>

      <div style={{
        height: "100vh",
        display: "flex",
        flexDirection: "column"
      }}>

        {/* Top Header (Matches Console) */}
        <header style={{
          background: "#18181b",
          borderBottom: "1px solid #27272a",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 24px",
          height: "60px",
          flexShrink: 0
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
            <div style={{
              width: 24,
              height: 24,
              background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
              borderRadius: 4
            }} />
            <span style={{
              fontWeight: 700,
              fontSize: "18px",
              color: "#ffffff",
              letterSpacing: "-0.5px"
            }}>
              AutoForge
            </span>
            <span style={{ color: "#52525b" }}>/</span>
            <span style={{
              fontSize: "14px",
              color: "#a1a1aa",
              fontWeight: 500
            }}>
              Agent Overview
            </span>
          </div>
        </header>

        {/* Main Content */}
        <main style={{
          flex: 1,
          padding: "24px",
          display: "flex",
          flexDirection: "column",
          gap: "24px",
          animation: "fadeIn 0.3s ease-out"
        }}>

          {/* Section Title */}
          <div>
            <h1 style={{
              fontSize: "20px",
              fontWeight: 600,
              color: "#ffffff",
              letterSpacing: "-0.3px"
            }}>
              Identity & Runtime State
            </h1>
            <p style={{
              marginTop: "6px",
              fontSize: "13px",
              color: "#71717a"
            }}>
              Static configuration and real-time operational metrics.
            </p>
          </div>

          {/* Identity Grid */}
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
            gap: "16px"
          }}>
            {identityStats.map((stat, i) => (
              <div key={i} className="card" style={{
                padding: "20px",
                display: "flex",
                flexDirection: "column",
                gap: "10px"
              }}>
                <div className="label">{stat.label}</div>
                <div className={`value ${stat.mono ? "mono" : ""}`}>
                  {stat.value}
                </div>
              </div>
            ))}
          </div>

        </main>
      </div>
    </>
  )
}