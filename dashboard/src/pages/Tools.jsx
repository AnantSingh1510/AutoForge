import React, { useState } from "react";
import {
  Mail, HardDrive, Mic, Settings2, Github, Code2, Loader2, X,
  Terminal, Server, Box, CheckCircle2, FileSpreadsheet,
  GitCommit, Calendar, MessageCircle
} from "lucide-react";

const initialTools = [
  {
    id: "local",
    name: "Local Environment",
    description: "Execute commands and read/write files on host PC.",
    icon: Terminal,
    enabled: true,
  },
  {
    id: "deploy",
    name: "Deployments",
    description: "Secure tunneling and local hosting exposure.",
    icon: Server,
    enabled: true,
  },
  {
    id: "github",
    name: "GitHub",
    description: "Access repositories, manage issues, and automate PRs.",
    icon: Github,
    enabled: true,
  },
  {
    id: "gmail",
    name: "Gmail",
    description: "Read system alerts and manage automated inbound/outbound emails.",
    icon: Mail,
    enabled: true,
  },
  {
    id: "whatsapp",
    name: "WhatsApp",
    description: "Direct messaging interface and agent bridging.",
    icon: MessageCircle,
    enabled: true,
  },
  {
    id: "calendar",
    name: "Google Calendar",
    description: "Schedule events and manage daily agendas.",
    icon: Calendar,
    enabled: true,
  },
  {
    id: "drive",
    name: "Google Drive",
    description: "Access and manage cloud-stored environment configs.",
    icon: HardDrive,
    enabled: true,
  },
  {
    id: "codex",
    name: "Codex Engine",
    description: "Generate, analyze, and refactor local codebase.",
    icon: Code2,
    enabled: true,
  },
  {
    id: "elevenlabs",
    name: "Eleven Labs",
    description: "Generate and stream AI voice responses.",
    icon: Mic,
    enabled: true, 
  },
  {
    id: "docker",
    name: "Docker Engine",
    description: "Manage local container lifecycles and image builds.",
    icon: Box,
    enabled: false, 
  },
];

export default function Tools() {
  const [tools, setTools] = useState(initialTools);
  const [hoveredCard, setHoveredCard] = useState(null);
  const [activeModal, setActiveModal] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleToolClick = (tool) => {
    if (!tool.enabled) return;
    setIsLoading(true);
    setActiveModal(tool);
    // Simulate network fetch
    setTimeout(() => setIsLoading(false), 600);
  };

  const toggleTool = (e, id) => {
    e.stopPropagation(); // Prevent opening modal when clicking switch
    setTools(tools.map(t => t.id === id ? { ...t, enabled: !t.enabled } : t));
  };

  const renderModalContent = (toolId) => {
    const today = "Feb 22, 2026";
    
    const cardStyle = {
      background: "#18181b", border: "1px solid #27272a", 
      borderRadius: "8px", padding: "16px", display: "flex", 
      flexDirection: "column", gap: "8px"
    };

    switch (toolId) {
      case "local":
        return (
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            <div style={cardStyle}>
              <div style={{ display: "flex", justifyContent: "space-between", color: "#a1a1aa", fontSize: "12px" }}>
                <span>{today} • 10:05 AM</span>
                <span style={{ color: "#10b981", fontWeight: 600 }}>SUCCESS</span>
              </div>
              <div style={{ fontFamily: "monospace", color: "#e4e4e7", fontSize: "13px" }}>
                <span style={{ color: "#f59e0b" }}>EXEC</span> git clone https://github.com/ArmanAryanpour/flappy
              </div>
            </div>
            <div style={cardStyle}>
              <div style={{ display: "flex", justifyContent: "space-between", color: "#a1a1aa", fontSize: "12px" }}>
                <span>{today} • 10:06 AM</span>
                <span style={{ color: "#10b981", fontWeight: 600 }}>SUCCESS</span>
              </div>
              <div style={{ fontFamily: "monospace", color: "#e4e4e7", fontSize: "13px" }}>
                <span style={{ color: "#f59e0b" }}>EXEC</span> cd flappy && npm install
              </div>
            </div>
          </div>
        );
      
      case "deploy":
        return (
          <div style={{ ...cardStyle, borderLeft: "4px solid #10b981" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", color: "#e4e4e7", fontWeight: 500 }}>
              <CheckCircle2 size={16} color="#10b981" />
              Ngrok Tunnel Active
            </div>
            <div style={{ fontSize: "13px", color: "#a1a1aa", marginLeft: "24px", display: "flex", flexDirection: "column", gap: "4px" }}>
              <span>Local Target: <strong>localhost:3000</strong></span>
              <span>Forwarding URL: <a href="#" style={{color: "#3b82f6", textDecoration: "none"}}>https://f492-12-34-56-78.ngrok-free.app</a></span>
              <span>Session Started: {today} at 10:00 AM</span>
            </div>
          </div>
        );

      case "github":
        return (
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            <div style={{ ...cardStyle, flexDirection: "row", alignItems: "center", gap: "16px" }}>
              <GitCommit size={20} color="#71717a" />
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: "14px", color: "#e4e4e7", fontWeight: 500 }}>feat: changed flappy bird color</div>
                <div style={{ fontSize: "12px", color: "#a1a1aa", marginTop: "2px" }}>Pushed to <strong>AnantSingh1510/Flappy</strong> • {today}, 09:50 AM</div>
              </div>
            </div>
          </div>
        );

      case "gmail":
        return (
          <div style={{ ...cardStyle, borderLeft: "4px solid #ef4444" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px", color: "#e4e4e7", fontWeight: 600, fontSize: "16px" }}>
                Hi
              </div>
              <span style={{ fontSize: "12px", color: "#a1a1aa" }}>{today}, 9:53 AM (16 minutes ago)</span>
            </div>
            
            <div style={{ fontSize: "12px", color: "#a1a1aa", marginTop: "4px", lineHeight: "1.6", borderBottom: "1px solid #27272a", paddingBottom: "12px", marginBottom: "12px", display: "flex", flexDirection: "column", gap: "2px" }}>
              <div><strong>From:</strong> <span style={{color: "#e4e4e7"}}>anantsingh4444@gmail.com</span></div>
              <div><strong>To:</strong> <span style={{color: "#e4e4e7"}}>trachit752@gmail.com</span></div>
              <div><strong>Date:</strong> {today}, 9:53 AM</div>
              <div><strong>Subject:</strong> Hi</div>
              <div><strong>Mailed-by:</strong> gmail.com</div>
              <div><strong>Signed-by:</strong> gmail.com</div>
              <div><strong>Security:</strong> Standard encryption (TLS)</div>
            </div>
            
            <div style={{ fontSize: "14px", color: "#e4e4e7", lineHeight: "1.5" }}>
              Hi
            </div>
          </div>
        );

      case "whatsapp":
        return (
          <div style={{ ...cardStyle, borderLeft: "4px solid #25D366", alignItems: "center", flexDirection: "row", gap: "16px", padding: "20px" }}>
            <div style={{ background: "#064e3b", padding: "12px", borderRadius: "50%" }}>
              <MessageCircle size={24} color="#25D366" />
            </div>
            <div style={{ display: "flex", flexDirection: "column" }}>
              <span style={{ color: "#e4e4e7", fontWeight: 600, fontSize: "16px" }}>Session Active</span>
              <span style={{ color: "#a1a1aa", fontSize: "14px", marginTop: "4px" }}>Signed in as <strong style={{color: "#ffffff"}}>+91 9651499022</strong></span>
            </div>
          </div>
        );

      case "calendar":
        return (
          <div style={{ ...cardStyle, borderLeft: "4px solid #3b82f6" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px", color: "#e4e4e7", fontWeight: 600 }}>
                <Calendar size={16} color="#3b82f6" />
                HackingHills Event
              </div>
              <span style={{ fontSize: "12px", color: "#10b981", fontWeight: 500 }}>Happening Today</span>
            </div>
            <div style={{ fontSize: "13px", color: "#d4d4d8", marginTop: "8px", lineHeight: "1.5" }}>
              <strong>Date:</strong> {today}<br/>
              <strong>Status:</strong> Confirmed & Synced
            </div>
          </div>
        );

      case "elevenlabs":
        return (
          <div style={{ ...cardStyle, borderLeft: "4px solid #8b5cf6" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px", color: "#e4e4e7", fontWeight: 600 }}>
                <Mic size={16} color="#8b5cf6" />
                TTS Generation Stream
              </div>
              <span style={{ fontSize: "12px", color: "#a1a1aa" }}>{today}, 10:15 AM</span>
            </div>
            <div style={{ fontSize: "13px", color: "#d4d4d8", marginTop: "8px", lineHeight: "1.5" }}>
              <strong>Model:</strong> Eleven Multilingual v2<br/>
              <strong>Voice ID:</strong> Rachel (21m00Tcm4TlvDq8ikWAM)<br/>
              <strong>Status:</strong> <span style={{color: "#10b981"}}>Successfully streamed 4.2s audio (142 characters)</span>
            </div>
          </div>
        );

      case "codex":
        return (
          <div style={{ display: "flex", gap: "16px" }}>
            <div style={{ ...cardStyle, flex: 1, alignItems: "center", justifyContent: "center", padding: "32px 16px" }}>
              <span style={{ fontSize: "32px", fontWeight: 600, color: "#ffffff", fontFamily: "monospace" }}>2</span>
              <span style={{ fontSize: "12px", color: "#a1a1aa", textTransform: "uppercase", letterSpacing: "0.05em", marginTop: "8px" }}>Files Refactored</span>
            </div>
            <div style={{ ...cardStyle, flex: 1, alignItems: "center", justifyContent: "center", padding: "32px 16px" }}>
              <span style={{ fontSize: "32px", fontWeight: 600, color: "#10b981", fontFamily: "monospace" }}>84</span>
              <span style={{ fontSize: "12px", color: "#a1a1aa", textTransform: "uppercase", letterSpacing: "0.05em", marginTop: "8px" }}>Lines Optimized</span>
            </div>
          </div>
        );

      case "drive":
        return (
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            <div style={{ ...cardStyle, flexDirection: "row", alignItems: "center", gap: "16px" }}>
              <FileSpreadsheet size={24} color="#10b981" />
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: "14px", color: "#e4e4e7", fontWeight: 500 }}>EVENSEM2026.xls - BTECH 6 SEM.csv</div>
                <div style={{ fontSize: "12px", color: "#a1a1aa", marginTop: "2px" }}>Synced {today} at 09:40 AM</div>
              </div>
            </div>
          </div>
        );

      default:
        return <div style={{ color: "#a1a1aa", fontSize: "14px" }}>No recent activity found.</div>;
    }
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;600&display=swap');
        
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        html, body { 
          background: #09090b; color: #e4e4e7; 
          font-family: 'Inter', system-ui, sans-serif; 
          -webkit-font-smoothing: antialiased;
          height: 100%; overflow: hidden;
        }

        /* Shadcn Switch styling */
        .shadcn-switch {
          width: 40px; height: 22px; border-radius: 9999px;
          position: relative; transition: background-color 0.2s ease-in-out;
          flex-shrink: 0; border: 2px solid transparent; cursor: pointer;
          outline: none;
        }
        .shadcn-switch[aria-checked="true"] { background-color: #10b981; }
        .shadcn-switch[aria-checked="false"] { background-color: #3f3f46; }
        .shadcn-switch:disabled { cursor: not-allowed; opacity: 0.5; }

        .shadcn-thumb {
          width: 18px; height: 18px; background-color: #ffffff;
          border-radius: 50%; position: absolute; top: 0; left: 0;
          transition: transform 0.2s cubic-bezier(0.4, 0.0, 0.2, 1);
          box-shadow: 0 2px 4px rgba(0,0,0,0.2);
        }
        .shadcn-switch[aria-checked="true"] .shadcn-thumb { transform: translateX(18px); }
        .shadcn-switch[aria-checked="false"] .shadcn-thumb { transform: translateX(0); }

        ::-webkit-scrollbar { width: 8px; height: 8px; }
        ::-webkit-scrollbar-track { background: #09090b; }
        ::-webkit-scrollbar-thumb { background: #27272a; border-radius: 4px; }
        ::-webkit-scrollbar-thumb:hover { background: #3f3f46; }

        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(12px) scale(0.98); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        .animate-spin { animation: spin 1s linear infinite; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>

      <div style={{ height: "100vh", display: "flex", flexDirection: "column", background: "#09090b" }}>
        
        {/* Header */}
        <header style={{
          background: "#18181b", borderBottom: "1px solid #27272a",
          display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: "0 24px", height: "60px", flexShrink: 0
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
            <div style={{ width: 24, height: 24, background: "linear-gradient(135deg, #10b981 0%, #059669 100%)", borderRadius: 4 }}></div>
            <span style={{ fontWeight: 700, fontSize: "18px", color: "#ffffff", letterSpacing: "-0.5px" }}>AutoForge</span>
            <span style={{ color: "#52525b" }}>/</span>
            <span style={{ fontSize: "14px", color: "#a1a1aa", fontWeight: 500 }}>Integrations & Modules</span>
          </div>
        </header>

        {/* Main Content Area */}
        <main style={{ display: "flex", flexDirection: "column", flex: 1, padding: "40px 32px", overflowY: "hidden" }}>
          <div style={{ maxWidth: "1200px", width: "100%", margin: "0 auto", display: "flex", flexDirection: "column", gap: "32px" }}>
            
            <div>
              <h1 style={{ fontSize: "28px", fontWeight: 600, color: "#ffffff", letterSpacing: "-0.7px", marginBottom: "8px" }}>
                Connected Modules
              </h1>
              <p style={{ fontSize: "15px", color: "#a1a1aa" }}>
                Manage local and cloud tools. Click on any active module to view today's isolated telemetry and execution logs.
              </p>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(360px, 1fr))", gap: "20px" }}>
              {tools.map((tool) => {
                const Icon = tool.icon;
                const isHovered = hoveredCard === tool.id;
                
                return (
                  <div
                    key={tool.id}
                    onMouseEnter={() => setHoveredCard(tool.id)}
                    onMouseLeave={() => setHoveredCard(null)}
                    onClick={() => handleToolClick(tool)}
                    style={{
                      background: tool.enabled && isHovered ? "#27272a" : "#18181b", 
                      border: `1px solid ${tool.enabled && isHovered ? '#3f3f46' : '#27272a'}`, 
                      borderRadius: "12px", padding: "24px",
                      display: "flex", alignItems: "center", justifyContent: "space-between",
                      cursor: tool.enabled ? "pointer" : "not-allowed",
                      opacity: tool.enabled ? 1 : 0.6,
                      transition: "all 0.2s cubic-bezier(0.16, 1, 0.3, 1)",
                      transform: tool.enabled && isHovered ? "translateY(-2px)" : "translateY(0)",
                      boxShadow: tool.enabled && isHovered ? "0 12px 24px -12px rgba(0,0,0,0.5)" : "none"
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                      <div style={{ 
                        background: tool.enabled ? "#052e16" : "#27272a", 
                        border: `1px solid ${tool.enabled ? '#065f46' : '#3f3f46'}`,
                        color: tool.enabled ? "#10b981" : "#71717a",
                        width: "44px", height: "44px", borderRadius: "10px",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        transition: "all 0.2s ease", flexShrink: 0
                      }}>
                        <Icon size={22} strokeWidth={2} />
                      </div>

                      <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                        <h2 style={{ fontSize: "15px", fontWeight: 600, color: tool.enabled ? "#ffffff" : "#a1a1aa" }}>{tool.name}</h2>
                        <p style={{ fontSize: "13px", color: "#71717a", lineHeight: "1.4" }}>{tool.description}</p>
                      </div>
                    </div>

                    <button 
                      role="switch" 
                      aria-checked={tool.enabled} 
                      onClick={() => {}}
                      className="shadcn-switch"
                    >
                      <span className="shadcn-thumb" />
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        </main>

        {/* Modal Overlay */}
        {activeModal && (
          <div style={{
            position: "fixed", top: 0, left: 0, width: "100%", height: "100%",
            background: "rgba(0, 0, 0, 0.7)", backdropFilter: "blur(6px)",
            display: "flex", alignItems: "center", justifyContent: "center",
            zIndex: 100, animation: "fadeIn 0.2s ease-out"
          }}>
            <div style={{
              background: "#09090b", border: "1px solid #27272a", borderRadius: "16px",
              width: "100%", maxWidth: "600px",
              boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.8)",
              animation: "slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
              display: "flex", flexDirection: "column", overflow: "hidden"
            }}>
              
              {/* Modal Header */}
              <div style={{ 
                padding: "24px", borderBottom: "1px solid #27272a", background: "#18181b",
                display: "flex", justifyContent: "space-between", alignItems: "center" 
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                  <div style={{ 
                    background: "#052e16", border: "1px solid #065f46", color: "#10b981",
                    padding: "8px", borderRadius: "8px", display: "flex"
                  }}>
                    <activeModal.icon size={20} />
                  </div>
                  <div>
                    <h2 style={{ fontSize: "18px", fontWeight: 600, color: "#ffffff", margin: 0 }}>
                      {activeModal.name} Log
                    </h2>
                    <p style={{ fontSize: "13px", color: "#a1a1aa", marginTop: "2px" }}>
                      Isolated activity for Today
                    </p>
                  </div>
                </div>
                <button 
                  onClick={() => setActiveModal(null)}
                  style={{
                    background: "#27272a", border: "1px solid #3f3f46", color: "#e4e4e7",
                    cursor: "pointer", padding: "8px", borderRadius: "8px",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    transition: "all 0.2s"
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.background = "#3f3f46"}
                  onMouseLeave={(e) => e.currentTarget.style.background = "#27272a"}
                >
                  <X size={18} />
                </button>
              </div>

              {/* Modal Content */}
              <div style={{ padding: "32px", minHeight: "220px", background: "#09090b" }}>
                {isLoading ? (
                  <div style={{ height: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "16px", color: "#71717a", paddingTop: "20px" }}>
                    <Loader2 size={32} className="animate-spin" style={{ color: "#10b981" }} />
                    <span style={{ fontSize: "14px", fontWeight: 500, letterSpacing: "0.02em" }}>Fetching secure logs...</span>
                  </div>
                ) : (
                  <div style={{ animation: "fadeIn 0.4s ease-out" }}>
                    {renderModalContent(activeModal.id)}
                  </div>
                )}
              </div>

            </div>
          </div>
        )}
      </div>
    </>
  );
}