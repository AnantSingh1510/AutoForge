import React, { useState } from "react";
import {
  Mail,
  HardDrive,
  Calendar,
  FileText,
  Mic,
  Settings2
} from "lucide-react";

// Kept the initial state, but they are now strictly read-only representations
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
];

export default function Tools() {
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

        /* Modern Shadcn-style Switch (Disabled State) */
        .shadcn-switch {
          width: 44px;
          height: 24px;
          border-radius: 9999px;
          position: relative;
          transition: background-color 0.2s ease-in-out;
          flex-shrink: 0;
          border: 2px solid transparent;
        }
        
        .shadcn-switch[aria-checked="true"] { background-color: #10b981; }
        .shadcn-switch[aria-checked="false"] { background-color: #3f3f46; }
        
        /* Disabled visual cues */
        .shadcn-switch:disabled {
          cursor: not-allowed;
          opacity: 0.5;
        }

        .shadcn-thumb {
          width: 20px;
          height: 20px;
          background-color: #ffffff;
          border-radius: 50%;
          position: absolute;
          top: 0;
          left: 0;
          transition: transform 0.2s cubic-bezier(0.4, 0.0, 0.2, 1);
          box-shadow: 0 2px 4px rgba(0,0,0,0.2);
        }
        .shadcn-switch[aria-checked="true"] .shadcn-thumb { transform: translateX(20px); }
        .shadcn-switch[aria-checked="false"] .shadcn-thumb { transform: translateX(0); }
      `}</style>

      <div style={{ height: "100vh", display: "flex", flexDirection: "column", background: "#09090b" }}>
        
        {/* Unified App Header */}
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
            <span style={{ fontSize: "14px", color: "#a1a1aa", fontWeight: 500 }}>Tool Integrations</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", color: "#a1a1aa" }}>
            <Settings2 size={18} />
            <span style={{ fontSize: "12px", fontWeight: 600, textTransform: "uppercase" }}>
              Configure
            </span>
          </div>
        </header>

        {/* Main Content Area */}
        <main style={{ display: "flex", flexDirection: "column", flex: 1, padding: "32px 24px", overflowY: "auto" }}>
          <div style={{ maxWidth: "1200px", width: "100%", margin: "0 auto", display: "flex", flexDirection: "column", gap: "32px" }}>
            
            {/* Page Title */}
            <div>
              <h1 style={{ fontSize: "24px", fontWeight: 600, color: "#ffffff", letterSpacing: "-0.5px", marginBottom: "6px" }}>
                System Tools
              </h1>
              <p style={{ fontSize: "14px", color: "#a1a1aa" }}>
                View external integrations connected to your workspace. (Read-only)
              </p>
            </div>

            {/* Tools Grid - Increased gap to 24px */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(380px, 1fr))", gap: "44px" }}>
              {tools.map((tool, index) => {
                const Icon = tool.icon;
                
                return (
                  <div
                    key={index}
                    style={{
                      background: "#18181b", 
                      border: "1px solid #27272a", 
                      borderRadius: "8px",
                      padding: "24px", // Increased padding slightly to balance the larger gap
                      display: "flex", 
                      alignItems: "center", 
                      justifyContent: "space-between",
                      cursor: "default", // Changed from pointer since it's no longer interactive
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                      {/* Dynamic Icon Container */}
                      <div style={{ 
                        background: tool.enabled ? "#052e16" : "#27272a", 
                        border: `1px solid ${tool.enabled ? '#065f46' : '#3f3f46'}`,
                        color: tool.enabled ? "#34d399" : "#a1a1aa",
                        padding: "10px", 
                        borderRadius: "8px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}>
                        <Icon size={20} strokeWidth={2.5} />
                      </div>

                      {/* Text Data */}
                      <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                        <h2 style={{ fontSize: "15px", fontWeight: 600, color: tool.enabled ? "#ffffff" : "#d4d4d8" }}>
                          {tool.name}
                        </h2>
                        <p style={{ fontSize: "13px", color: "#a1a1aa" }}>
                          {tool.description}
                        </p>
                      </div>
                    </div>

                    {/* Accessible Shadcn Switch - Disabled */}
                    <button
                      role="switch"
                      aria-checked={tool.enabled}
                      disabled
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
      </div>
    </>
  );
}