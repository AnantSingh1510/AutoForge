import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import Console from "./pages/Console"; 
import Tools from "./pages/Tools";


export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="console" element={<Console />} />
          <Route path="tools" element={<Tools />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}