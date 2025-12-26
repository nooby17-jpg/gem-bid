import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Viewer from "./pages/Viewer";
import Upload from "./pages/Upload";

export default function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Viewer />} />
        <Route path="/upload" element={<Upload />} />
      </Routes>
    </>
  );
}
