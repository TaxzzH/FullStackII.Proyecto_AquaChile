import { BrowserRouter, Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar";
import Dashboard from "./pages/Dashboard";
import Candidatos from "./pages/Candidatos";
import Solicitudes from "./pages/Solicitudes";

function App() {
  return (
    <BrowserRouter>
      {/* Esto hace que la navbar se mantenga visible en todas las paginas/pantallas */}
      <Navbar />
      <main>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/candidatos" element={<Candidatos />} />
          <Route path="/solicitudes" element={<Solicitudes />} />
        </Routes>
      </main>
    </BrowserRouter>
  );
}

export default App;
