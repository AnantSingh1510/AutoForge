import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import Console from "./pages/Console"; 
import Tools from "./pages/Tools";
import Onboard from "./pages/Onboard";
import AuditLogs from "./pages/AuditLogs";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Standalone Route */}
        <Route path="/onboard" element={<Onboard />} /> 
        
        {/* Wrapped Routes */}
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="console" element={<Console />} />
          <Route path="tools" element={<Tools />} />
          <Route path="logs" element={<AuditLogs />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}