import { useState } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar";
import RutaProtegida from "./components/RutaProtegida";
import { cerrarSesion, getSesion, iniciarSesion } from "./data/mockData";
import Dashboard from "./pages/Dashboard";
import Candidatos from "./pages/Candidatos";
import Resumen from "./pages/Resumen";
import CandidatoForm from "./pages/CandidatoForm";
import NuevaSolicitud from "./pages/NuevaSolicitud";
import Login from "./pages/Login";
import Solicitudes from "./pages/Solicitudes";
import SolicitudDetalle from "./pages/SolicitudDetalle";

function App() {
  // El usuario vive en el componente padre y baja por props a quien lo necesita
  const [usuario, setUsuario] = useState(getSesion);

  const handleIngresar = (elegido) => {
    iniciarSesion(elegido);
    setUsuario(elegido);
  };

  const handleSalir = () => {
    cerrarSesion();
    setUsuario(null);
  };

  const protegida = (pagina, permiso) => (
    <RutaProtegida usuario={usuario} permiso={permiso}>{pagina}</RutaProtegida>
  );

  return (
    <BrowserRouter>
      {/* Esto hace que la navbar se mantenga visible en todas las paginas/pantallas */}
      <Navbar usuario={usuario} onSalir={handleSalir} />
      <main className="pb-5">
        <Routes>
          <Route path="/login" element={<Login usuario={usuario} onIngresar={handleIngresar} />} />
          <Route path="/" element={protegida(<Dashboard usuario={usuario} />)} />
          <Route path="/candidatos" element={protegida(<Candidatos usuario={usuario} />)} />
          <Route path="/candidatos/nuevo" element={protegida(<CandidatoForm />, "gestionarRegistros")} />
          <Route path="/candidatos/:id/editar" element={protegida(<CandidatoForm />, "gestionarRegistros")} />
          <Route path="/solicitudes" element={protegida(<Solicitudes usuario={usuario} />)} />
          <Route path="/solicitudes/nueva" element={protegida(<NuevaSolicitud />, "gestionarRegistros")} />
          <Route path="/solicitudes/:id" element={protegida(<SolicitudDetalle usuario={usuario} />)} />
          <Route path="/resumen" element={protegida(<Resumen usuario={usuario} />)} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </BrowserRouter>
  );
}

export default App;
