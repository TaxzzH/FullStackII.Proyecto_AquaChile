import { BrowserRouter, Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar";
import Dashboard from "./pages/Dashboard";
import Candidatos from "./pages/Candidatos";
import Resumen from "./pages/Resumen";
import CandidatoForm from "./pages/CandidatoForm";
import NuevaSolicitud from "./pages/NuevaSolicitud";

function App() {
  return (
    <BrowserRouter>
      {/* Esto hace que la navbar se mantenga visible en todas las paginas/pantallas */}
      <Navbar />
      <main>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/candidatos" element={<Candidatos />} />
          <Route path="/candidatos/nuevo" element={<CandidatoForm />} />
          <Route path="/candidatos/:id/editar" element={<CandidatoForm />} />
          <Route path="/solicitudes/nueva" element={<NuevaSolicitud />} />
          <Route path="/resumen" element={<Resumen />} />
        </Routes>
      </main>
    </BrowserRouter>
  );
}

export default App;
