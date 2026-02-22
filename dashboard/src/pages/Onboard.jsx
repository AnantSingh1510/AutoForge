import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Bot, Blocks, GitMerge, ShieldCheck, Activity, ChevronRight, ArrowRight } from "lucide-react";

export default function Onboard() {
  const [step, setStep] = useState(0);
  const navigate = useNavigate();

  const handleNext = () => {
    if (step < 4) setStep(step + 1);
    else navigate("/");
  };

  const steps = [
    {
      id: "engine",
      icon: <Bot size={32} strokeWidth={1.5} color="#10b981" />,
      title: "The AutoForge Engine",
      description: "Harness the power of advanced LLMs combined with OpenClaw architecture. AutoForge seamlessly navigates your local machine's file system, parsing context at scale.",
      features: ["Context-aware code parsing", "Local file system indexing", "Real-time syntax validation"],
      image: "https://placehold.co/600x180/18181b/10b981?text=AutoForge+Engine+Architecture"
    },
    {
      id: "integrations",
      icon: <Blocks size={32} strokeWidth={1.5} color="#3b82f6" />,
      title: "Omni-Channel Integrations",
      description: "Natively connected to your entire developer workspace. AutoForge orchestrates complex tasks across your existing toolchain without requiring context switching.",
      features: ["GitHub & GitLab sync", "Notion & Jira ticket tracking", "Slack/Discord webhooks"],
      image: "https://placehold.co/600x180/18181b/3b82f6?text=Workspace+Integrations+Flow"
    },
    {
      id: "devops",
      icon: <GitMerge size={32} strokeWidth={1.5} color="#8b5cf6" />,
      title: "Autonomous DevOps",
      description: "Accelerate your delivery pipeline. AutoForge autonomously manages code refactoring, orchestrates PR commits, and handles zero-touch deployments.",
      features: ["Automated PR generation", "Conflict resolution engine", "Zero-touch CI/CD triggers"],
      image: "https://placehold.co/600x180/18181b/8b5cf6?text=CI/CD+Pipeline+Automation"
    },
    {
      id: "security",
      icon: <ShieldCheck size={32} strokeWidth={1.5} color="#ef4444" />,
      title: "Local-First Security",
      description: "Your code remains secure. AutoForge leverages local execution boundaries and automatic PII redaction to ensure your IP never leaks.",
      features: ["Air-gapped execution mode", "Automated PII redaction", "Immutable audit logs"],
      image: "https://placehold.co/600x180/18181b/ef4444?text=Security+and+Guardrails"
    },
    {
      id: "analytics",
      icon: <Activity size={32} strokeWidth={1.5} color="#f59e0b" />,
      title: "Action Telemetry",
      description: "Monitor agent performance in real-time. Track token usage, execution time, and success rates across all autonomous operations on your machine.",
      features: ["Live execution graphs", "Token usage optimization", "Cost tracking dashboard"],
      image: "https://placehold.co/600x180/18181b/f59e0b?text=Action+Telemetry"
    }
  ];

  const currentStep = steps[step];

  return (
    <div>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        html, body {
          background: #09090b; color: #e4e4e7;
          font-family: 'Inter', system-ui, sans-serif;
          -webkit-font-smoothing: antialiased;
          overflow: hidden; /* Strictly prevent scrollbars */
        }
          
        @keyframes slideUpFade {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .step-container {
          animation: slideUpFade 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        .shadcn-btn {
          background: #e4e4e7; color: #09090b; border: none; padding: 12px 24px;
          border-radius: 6px; font-weight: 600; font-size: 14px; cursor: pointer;
          display: flex; justify-content: center; align-items: center; gap: 8px;
          transition: opacity 0.2s;
        }
        .shadcn-btn:hover { opacity: 0.9; }
      `}</style>

      <div style={{
        height: "100vh", width: "100vw", background: "#09090b",
        display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
        color: "#e4e4e7", padding: "16px", overflow: "hidden"
      }}>
        
        {/* Progress Indicators */}
        <div style={{ display: "flex", gap: "8px", position: "absolute", top: "32px" }}>
          {steps.map((_, i) => (
            <div key={i} style={{
              width: "32px", height: "4px", borderRadius: "2px",
              background: i <= step ? "#10b981" : "#27272a",
              transition: "background 0.3s ease"
            }} />
          ))}
        </div>

        {/* Main Presentation Card */}
        <div 
          key={step} 
          className="step-container"
          style={{
            maxWidth: "600px", width: "100%", padding: "32px",
            background: "#18181b", border: "1px solid #27272a", borderRadius: "16px",
            boxShadow: "0 25px 50px -12px rgba(0,0,0,0.5)",
            display: "flex", flexDirection: "column", gap: "20px",
            maxHeight: "90vh" /* Failsafe to ensure it stays within screen bounds */
          }}
        >
          {/* Header */}
          <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
            <div style={{ 
              width: "48px", height: "48px", borderRadius: "12px", 
              background: "#09090b", border: "1px solid #27272a",
              display: "flex", alignItems: "center", justifyContent: "center",
              boxShadow: "inset 0 2px 10px rgba(255,255,255,0.02)",
              flexShrink: 0
            }}>
              {currentStep.icon}
            </div>
            <h1 style={{ fontSize: "22px", fontWeight: 700, color: "#ffffff", letterSpacing: "-0.5px", margin: 0 }}>
              {currentStep.title}
            </h1>
          </div>

          {/* Flow Image Placeholder */}
          <div style={{ 
            width: "100%", height: "180px", borderRadius: "8px", overflow: "hidden", 
            border: "1px solid #27272a", background: "#09090b" 
          }}>
            <img 
              src={currentStep.image} 
              alt={`${currentStep.title} visualization`} 
              style={{ width: "100%", height: "100%", objectFit: "cover", opacity: 0.9 }} 
            />
          </div>

          {/* Description & Features */}
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            <p style={{ fontSize: "14px", color: "#a1a1aa", lineHeight: "1.5", margin: 0 }}>
              {currentStep.description}
            </p>
            
            <ul style={{ 
              display: "flex", flexDirection: "column", gap: "8px", 
              padding: 0, margin: 0, listStyle: "none" 
            }}>
              {currentStep.features.map((feature, idx) => (
                <li key={idx} style={{ 
                  display: "flex", alignItems: "center", gap: "8px", 
                  fontSize: "13px", color: "#e4e4e7" 
                }}>
                  <div style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#3f3f46" }} />
                  {feature}
                </li>
              ))}
            </ul>
          </div>

          {/* Actions */}
          <button 
            className="shadcn-btn" 
            style={{ width: "100%", marginTop: "4px" }}
            onClick={handleNext}
          >
            {step === steps.length - 1 ? "Initialize Workspace" : "Continue"}
            {step === steps.length - 1 ? <ArrowRight size={18} /> : <ChevronRight size={18} />}
          </button>
        </div>

      </div>
    </div>
  );
}