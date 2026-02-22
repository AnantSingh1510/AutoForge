import React, { useState } from "react";
import {
  Mail,
  HardDrive,
  Calendar,
  FileText,
  Mic,
  Settings2,
  Github,
  Code2,
  Loader2,
  X
} from "lucide-react";

const tools = [
  {
    name: "Gmail",
    description: "Send and read emails from connected accounts.",
    icon: Mail,
    enabled: true,
  },
  {
    name: "Google Drive",
    description: "Access and manage cloud stored files.",
    icon: HardDrive,
    enabled: true,
  },
  {
    name: "Notion",
    description: "Read and write structured workspace data.",
    icon: FileText,
    enabled: true,
  },
  {
    name: "Google Calendar",
    description: "Schedule and manage calendar events.",
    icon: Calendar,
    enabled: true,
  },
  {
    name: "Eleven Labs",
    description: "Generate and stream AI voice responses.",
    icon: Mic,
    enabled: true,
  },
  {
    name: "GitHub",
    description: "Access repositories, manage issues, and automate workflows.",
    icon: Github,
    enabled: true,
    interactive: true,
  },
  {
    name: "Codex",
    description: "Generate, analyze, and refactor code using advanced AI models.",
    icon: Code2,
    enabled: true,
  },
];

export default function Tools() {
  const [hoveredCard, setHoveredCard] = useState(null);
  
  // Modal & Fetch State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [githubData, setGithubData] = useState(null);

  const handleGithubClick = () => {
    setIsModalOpen(true);
    setIsLoading(true);
    setGithubData(null);

    // Simulate network delay and generate 52-week mock grid where ONLY today has contributions
    setTimeout(() => {
      const weeks = [];
      const today = new Date();
      
      // Generate 52 weeks
      for (let w = 0; w < 52; w++) {
        const days = [];
        for (let d = 0; d < 7; d++) {
          // Identify if this specific block represents "today" (last day of the 52nd week)
          const isToday = (w === 51 && d === today.getDay());
          
          // Stop adding blocks if we exceed today's day of the week in the final week
          if (w === 51 && d > today.getDay()) break; 
          
          days.push({
            date: isToday ? "Today" : "Past",
            contributionCount: isToday ? 1 : 0, // Only highlight today
            isToday: isToday
          });
        }
        weeks.push({ contributionDays: days });
      }

      setGithubData({
        totalContributions: 3,
        weeks: weeks
      });
      setIsLoading(false);
    }, 1200); 
  };

  // Helper to determine contribution colors based on count (GitHub Dark Mode standard)
  const getContributionColor = (count) => {
    if (count === 0) return "#161b22"; // Empty
    if (count <= 3) return "#0e4429"; // Low
    if (count <= 6) return "#006d32"; // Medium
    if (count <= 10) return "#26a641"; // High
    return "#39d353"; // Max
  };

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

        .shadcn-switch {
          width: 44px; height: 24px; border-radius: 9999px;
          position: relative; transition: background-color 0.2s ease-in-out;
          flex-shrink: 0; border: 2px solid transparent;
        }
        .shadcn-switch[aria-checked="true"] { background-color: #10b981; }
        .shadcn-switch[aria-checked="false"] { background-color: #3f3f46; }
        .shadcn-switch:disabled { cursor: not-allowed; opacity: 0.5; }

        .shadcn-thumb {
          width: 20px; height: 20px; background-color: #ffffff;
          border-radius: 50%; position: absolute; top: 0; left: 0;
          transition: transform 0.2s cubic-bezier(0.4, 0.0, 0.2, 1);
          box-shadow: 0 2px 4px rgba(0,0,0,0.2);
        }
        .shadcn-switch[aria-checked="true"] .shadcn-thumb { transform: translateX(20px); }
        .shadcn-switch[aria-checked="false"] .shadcn-thumb { transform: translateX(0); }

        ::-webkit-scrollbar { width: 8px; height: 8px; }
        ::-webkit-scrollbar-track { background: #09090b; }
        ::-webkit-scrollbar-thumb { background: #3f3f46; border-radius: 4px; }
        ::-webkit-scrollbar-thumb:hover { background: #52525b; }

        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(10px) scale(0.98); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        .animate-spin { animation: spin 1s linear infinite; }
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
            <span style={{ fontSize: "14px", color: "#a1a1aa", fontWeight: 500 }}>Tool Integrations</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", color: "#a1a1aa" }}>
            <Settings2 size={18} />
            <span style={{ fontSize: "12px", fontWeight: 600, textTransform: "uppercase" }}>Configure</span>
          </div>
        </header>

        {/* Main Content Area */}
        <main style={{ display: "flex", flexDirection: "column", flex: 1, padding: "32px 24px", overflowY: "auto" }}>
          <div style={{ maxWidth: "1200px", width: "100%", margin: "0 auto", display: "flex", flexDirection: "column", gap: "32px" }}>
            
            <div>
              <h1 style={{ fontSize: "24px", fontWeight: 600, color: "#ffffff", letterSpacing: "-0.5px", marginBottom: "6px" }}>
                System Tools
              </h1>
              <p style={{ fontSize: "14px", color: "#a1a1aa" }}>
                View external integrations connected to your workspace. Select an interactive tool to view analytics.
              </p>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(380px, 1fr))", gap: "24px" }}>
              {tools.map((tool, index) => {
                const Icon = tool.icon;
                const isHovered = hoveredCard === index;
                const isInteractive = tool.interactive;
                
                return (
                  <div
                    key={index}
                    onMouseEnter={() => setHoveredCard(index)}
                    onMouseLeave={() => setHoveredCard(null)}
                    onClick={() => {
                      if (isInteractive && tool.name === "GitHub") handleGithubClick();
                    }}
                    style={{
                      background: isInteractive && isHovered ? "#27272a" : "#18181b", 
                      border: `1px solid ${isInteractive && isHovered ? '#3f3f46' : '#27272a'}`, 
                      borderRadius: "8px", padding: "24px",
                      display: "flex", alignItems: "center", justifyContent: "space-between",
                      cursor: isInteractive ? "pointer" : "default",
                      transition: "all 0.2s ease",
                      transform: isInteractive && isHovered ? "translateY(-2px)" : "translateY(0)",
                      boxShadow: isInteractive && isHovered ? "0 10px 30px -10px rgba(0,0,0,0.5)" : "none"
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                      <div style={{ 
                        background: tool.enabled ? "#052e16" : "#27272a", 
                        border: `1px solid ${tool.enabled ? '#065f46' : '#3f3f46'}`,
                        color: tool.enabled ? "#34d399" : "#a1a1aa",
                        padding: "10px", borderRadius: "8px",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        transition: "all 0.2s ease"
                      }}>
                        <Icon size={20} strokeWidth={2.5} />
                      </div>

                      <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                        <h2 style={{ fontSize: "15px", fontWeight: 600, color: tool.enabled ? "#ffffff" : "#d4d4d8" }}>{tool.name}</h2>
                        <p style={{ fontSize: "13px", color: "#a1a1aa" }}>{tool.description}</p>
                      </div>
                    </div>

                    <button role="switch" aria-checked={tool.enabled} disabled className="shadcn-switch">
                      <span className="shadcn-thumb" />
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        </main>

        {/* Modal Overlay */}
        {isModalOpen && (
          <div style={{
            position: "fixed", top: 0, left: 0, width: "100%", height: "100%",
            background: "rgba(0, 0, 0, 0.6)", backdropFilter: "blur(4px)",
            display: "flex", alignItems: "center", justifyContent: "center",
            zIndex: 100, animation: "fadeIn 0.2s ease-out"
          }}>
            <div style={{
              background: "#09090b", border: "1px solid #27272a", borderRadius: "12px",
              width: "100%", maxWidth: "860px", padding: "24px",
              boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.8)",
              animation: "slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
              display: "flex", flexDirection: "column", gap: "24px"
            }}>
              
              {/* Modal Header */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <div>
                  <h2 style={{ fontSize: "18px", fontWeight: 600, color: "#ffffff", display: "flex", alignItems: "center", gap: "8px" }}>
                    <Github size={20} /> GitHub Contribution Activity
                  </h2>
                  <p style={{ fontSize: "14px", color: "#a1a1aa", marginTop: "4px" }}>
                    Showing isolated contributions for <span style={{ color: "#e4e4e7", fontWeight: 500 }}>Today</span>
                  </p>
                </div>
                <button 
                  onClick={() => setIsModalOpen(false)}
                  style={{
                    background: "transparent", border: "none", color: "#a1a1aa",
                    cursor: "pointer", padding: "4px", borderRadius: "4px",
                    display: "flex", alignItems: "center", justifyContent: "center"
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.color = "#ffffff"}
                  onMouseLeave={(e) => e.currentTarget.style.color = "#a1a1aa"}
                >
                  <X size={20} />
                </button>
              </div>

              {/* Modal Content - Loading or Graph */}
              <div style={{ 
                background: "#18181b", border: "1px solid #27272a", borderRadius: "8px", 
                padding: "24px", minHeight: "200px", display: "flex", 
                alignItems: "center", justifyContent: "center", overflowX: "auto"
              }}>
                {isLoading ? (
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "12px", color: "#71717a" }}>
                    <Loader2 size={28} className="animate-spin" style={{ color: "#10b981" }} />
                    <span style={{ fontSize: "13px", fontWeight: 500, letterSpacing: "0.02em" }}>Generating activity map...</span>
                  </div>
                ) : githubData ? (
                  <div style={{ display: "flex", flexDirection: "column", gap: "12px", width: "100%" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
                      <span style={{ fontSize: "14px", color: "#e4e4e7", fontWeight: 500 }}>
                        {githubData.totalContributions} contributions in the last year
                      </span>
                    </div>
                    
                    {/* The Contribution Graph Grid */}
                    <div style={{ display: "flex", gap: "4px" }}>
                      {githubData.weeks.map((week, wIdx) => (
                        <div key={wIdx} style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                          {week.contributionDays.map((day, dIdx) => (
                            <div 
                              key={dIdx}
                              title={day.isToday ? `${day.contributionCount} contributions today` : `0 contributions`}
                              style={{
                                width: "11px", 
                                height: "11px", 
                                background: getContributionColor(day.contributionCount),
                                borderRadius: "2px",
                                outline: "1px solid rgba(27,31,35,0.06)",
                                outlineOffset: "-1px",
                                boxShadow: day.isToday ? "0 0 8px rgba(57, 211, 83, 0.4)" : "none", // Added slight glow for today
                                zIndex: day.isToday ? 10 : 1
                              }}
                            />
                          ))}
                        </div>
                      ))}
                    </div>

                    {/* Graph Legend */}
                    <div style={{ display: "flex", justifyContent: "flex-end", alignItems: "center", gap: "6px", fontSize: "12px", color: "#71717a", marginTop: "8px" }}>
                      <span>Less</span>
                      <div style={{ width: 11, height: 11, background: "#161b22", borderRadius: 2 }} />
                      <div style={{ width: 11, height: 11, background: "#0e4429", borderRadius: 2 }} />
                      <div style={{ width: 11, height: 11, background: "#006d32", borderRadius: 2 }} />
                      <div style={{ width: 11, height: 11, background: "#26a641", borderRadius: 2 }} />
                      <div style={{ width: 11, height: 11, background: "#39d353", borderRadius: 2 }} />
                      <span>More</span>
                    </div>
                  </div>
                ) : (
                  <div style={{ color: "#ef4444", fontSize: "14px", fontWeight: 500 }}>
                    Failed to load graph data. Please try again.
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