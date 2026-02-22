import React, { useState, useMemo } from "react";
import { Search, Filter, Download, Terminal, AlertCircle, CheckCircle2, Info, Bug, Activity } from "lucide-react";
import { fetchLogs } from '../../../server/fetchLogs'

const getLevelIcon = (level) => {
  switch (level) {
    case "error":   return <AlertCircle size={14} />;
    case "warn":    return <AlertCircle size={14} />;
    case "success": return <CheckCircle2 size={14} />;
    case "debug":   return <Bug size={14} />;
    case "info":    return <Activity size={14} />;
    default:        return <Info size={14} />;
  }
};

const getLevelStyles = (level) => {
  switch (level) {
    case "error":   return { bg: "#4c0519", color: "#f87171", border: "#9f1239" };
    case "warn":    return { bg: "#451a03", color: "#fbbf24", border: "#92400e" };
    case "success": return { bg: "#052e16", color: "#34d399", border: "#065f46" };
    case "debug":   return { bg: "#27272a", color: "#a1a1aa", border: "#3f3f46" };
    case "info":    return { bg: "#1e3a8a", color: "#60a5fa", border: "#1e40af" };
    default:        return { bg: "#27272a", color: "#a1a1aa", border: "#3f3f46" };
  }
};

function StatusBadge({ type, label, icon }) {
  const s = getLevelStyles(type);
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: "6px",
      background: s.bg, color: s.color, border: `1px solid ${s.border}`,
      padding: "4px 10px", borderRadius: "4px",
      fontSize: "11px", fontWeight: 600, letterSpacing: "0.05em",
      textTransform: "uppercase"
    }}>
      {icon} {label}
    </span>
  );
}

export default function AuditLogs() {
  const [search, setSearch] = useState("");
  const [filterLevel, setFilterLevel] = useState("all");

  const filteredLogs = useMemo(() => {
    return fetchLogs.filter((log) => {
      const matchesSearch = 
        log.message.toLowerCase().includes(search.toLowerCase()) || 
        log.service.toLowerCase().includes(search.toLowerCase());
      const matchesLevel = filterLevel === "all" || log.level === filterLevel;
      return matchesSearch && matchesLevel;
    });
  }, [search, filterLevel]);

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
          font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em;
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
        
        /* Shadcn Inputs */
        .shadcn-input {
          background: #09090b; border: 1px solid #27272a; color: #e4e4e7;
          padding: 8px 12px 8px 36px; border-radius: 6px; font-size: 13px;
          outline: none; transition: border-color 0.2s; width: 300px;
        }
        .shadcn-input:focus { border-color: #3f3f46; box-shadow: 0 0 0 2px rgba(255,255,255,0.05); }
        
        .shadcn-select {
          background: #09090b; border: 1px solid #27272a; color: #e4e4e7;
          padding: 8px 32px 8px 12px; border-radius: 6px; font-size: 13px;
          outline: none; cursor: pointer; appearance: none;
          background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%2371717a' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e");
          background-repeat: no-repeat;
          background-position: right 8px center;
          background-size: 14px;
        }
        .shadcn-select:focus { border-color: #3f3f46; }
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
            <span style={{ fontSize: "14px", color: "#a1a1aa", fontWeight: 500 }}>System Audit Logs</span>
          </div>
        </header>

        <main style={{ display: "flex", flexDirection: "column", flex: 1, padding: "24px", gap: "24px", overflow: "hidden" }}>
          
          {/* Page Header */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
            <div>
              <h1 style={{ fontSize: "24px", fontWeight: 600, color: "#ffffff", letterSpacing: "-0.5px", margin: "0 0 8px 0" }}>
                System Audit Logs
              </h1>
              <p style={{ fontSize: "14px", color: "#a1a1aa", margin: 0 }}>
                Immutable trace of agent executions, messaging gateways, and core system state changes.
              </p>
            </div>
          </div>

          {/* Toolbar */}
          <div style={{ 
            display: "flex", gap: "16px", padding: "16px", 
            background: "#18181b", border: "1px solid #27272a", borderRadius: "8px",
            alignItems: "center", flexShrink: 0
          }}>
            <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
              <Search size={16} color="#71717a" style={{ position: "absolute", left: "12px" }} />
              <input 
                type="text" 
                placeholder="Search payloads or subsystems..." 
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="shadcn-input"
              />
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginLeft: "auto" }}>
              <Filter size={16} color="#71717a" />
              <select 
                value={filterLevel}
                onChange={(e) => setFilterLevel(e.target.value)}
                className="shadcn-select"
              >
                <option value="all">All Levels</option>
                <option value="info">Info</option>
                <option value="success">Success</option>
                <option value="warn">Warning</option>
                <option value="error">Error</option>
                <option value="debug">Debug</option>
              </select>
            </div>
          </div>

          {/* Data Grid */}
          <div style={{ 
            flex: 1, background: "#09090b", border: "1px solid #27272a", 
            borderRadius: "8px", overflow: "hidden", display: "flex", flexDirection: "column"
          }}>
            <div style={{ flex: 1, overflowY: "auto", position: "relative" }}>
              <table className="data-grid">
                <thead>
                  <tr>
                    <th style={{ width: "12%" }}>Timestamp</th>
                    <th style={{ width: "12%" }}>Severity</th>
                    <th style={{ width: "20%" }}>Subsystem</th>
                    <th style={{ width: "56%" }}>Payload / Message</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredLogs.length === 0 ? (
                    <tr>
                      <td colSpan="4" style={{ textAlign: "center", padding: "64px 24px", color: "#71717a" }}>
                        <Terminal size={40} style={{ margin: "0 auto 16px", opacity: 0.3 }} strokeWidth={1.5} />
                        <div style={{ fontSize: "14px", fontWeight: 500, color: "#a1a1aa", marginBottom: "4px" }}>No logs found</div>
                        <div style={{ fontSize: "13px" }}>Try adjusting your search query or severity filter.</div>
                      </td>
                    </tr>
                  ) : filteredLogs.map((log) => (
                    <tr key={log.id}>
                      <td className="mono-cell" style={{ verticalAlign: "middle" }}>
                        {log.time}
                      </td>
                      <td style={{ verticalAlign: "middle" }}>
                        <StatusBadge type={log.level} label={log.level} icon={getLevelIcon(log.level)} />
                      </td>
                      <td className="mono-cell" style={{ color: "#e4e4e7 !important", verticalAlign: "middle" }}>
                        {log.service}
                      </td>
                      <td style={{ lineHeight: 1.5, wordBreak: "break-word", verticalAlign: "middle" }}>
                        {log.message}
                      </td>
                    </tr>
                  ))}
                  <tr style={{ height: 0 }}><td colSpan="4" style={{ padding: 0, border: "none" }}></td></tr>
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>
    </>
  );
}