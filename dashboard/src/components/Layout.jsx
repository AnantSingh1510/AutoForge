import { Link, useLocation, Outlet } from "react-router-dom";
import { useEffect, useRef } from "react";

export default function Layout() {
  const location = useLocation();
  const scrollRef = useRef(null);

  // ✅ Reset scroll on route change
  useEffect(() => {
    scrollRef.current?.scrollTo({
      top: 0,
      left: 0,
      behavior: "auto"
    });
  }, [location.key]);

  const navItems = [
    { path: "/", label: "Agent Overview", icon: "❖" },
    { path: "/console", label: "System Console", icon: "⌘" },
    { path: "/tools", label: "Tools", icon: "⚙" },
    { path: "/logs", label: "Audit Logs", icon: "▤" }
  ];

  return (
    <div
      style={{
        display: "flex",
        height: "100vh",
        width: "100vw",
        background: "#09090b",
        color: "#e4e4e7"
      }}
    >
      {/* Sidebar */}
      <aside
        style={{
          width: "260px",
          background: "#18181b",
          borderRight: "1px solid #27272a",
          display: "flex",
          flexDirection: "column",
          flexShrink: 0,
          zIndex: 50
        }}
      >
        {/* Brand Header */}
        <div
          style={{
            padding: "24px",
            display: "flex",
            alignItems: "center",
            gap: "12px",
            borderBottom: "1px solid #27272a"
          }}
        >
          <div
            style={{
              width: 28,
              height: 28,
              background:
                "linear-gradient(135deg, #10b981 0%, #059669 100%)",
              borderRadius: 6,
              boxShadow: "0 0 12px rgba(16, 185, 129, 0.3)"
            }}
          ></div>
          <span
            style={{
              fontWeight: 700,
              fontSize: "20px",
              color: "#ffffff",
              letterSpacing: "-0.5px"
            }}
          >
            AutoForge
          </span>
        </div>

        {/* Navigation */}
        <nav
          style={{
            flex: 1,
            padding: "20px 12px",
            display: "flex",
            flexDirection: "column",
            gap: "8px"
          }}
        >
          <div
            style={{
              fontSize: "11px",
              color: "#71717a",
              fontWeight: 600,
              textTransform: "uppercase",
              letterSpacing: "0.05em",
              padding: "0 12px 8px"
            }}
          >
            Menu
          </div>

          {navItems.map((item) => {
            const isActive = location.pathname === item.path;

            return (
              <Link
                key={item.path}
                to={item.path}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                  padding: "10px 12px",
                  borderRadius: "8px",
                  textDecoration: "none",
                  fontSize: "14px",
                  fontWeight: 500,
                  color: isActive ? "#ffffff" : "#a1a1aa",
                  background: isActive ? "#27272a" : "transparent",
                  borderLeft: isActive
                    ? "3px solid #10b981"
                    : "3px solid transparent",
                  transition: "all 0.2s ease"
                }}
                onMouseOver={(e) => {
                  if (!isActive)
                    e.currentTarget.style.background = "#27272a80";
                }}
                onMouseOut={(e) => {
                  if (!isActive)
                    e.currentTarget.style.background = "transparent";
                }}
              >
                <span
                  style={{
                    fontSize: "16px",
                    color: isActive ? "#10b981" : "#71717a"
                  }}
                >
                  {item.icon}
                </span>
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div
          style={{
            padding: "20px",
            borderTop: "1px solid #27272a",
            display: "flex",
            alignItems: "center",
            gap: "12px"
          }}
        >
          <div
            style={{
              width: 32,
              height: 32,
              borderRadius: "50%",
              background: "#3f3f46",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "12px",
              fontWeight: 600
            }}
          >
            RT
          </div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <span
              style={{
                fontSize: "13px",
                fontWeight: 600,
                color: "#ffffff"
              }}
            >
              Admin Console
            </span>
            <span style={{ fontSize: "11px", color: "#a1a1aa" }}>
              v1.0.0-beta
            </span>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          overflow: "hidden"
        }}
      >
        <div
          ref={scrollRef}
          style={{
            flex: 1,
            overflowY: "auto",
            padding: "32px"
          }}
        >
          <Outlet />
        </div>
      </main>
    </div>
  );
}