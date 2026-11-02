import { useState } from "react";
import { BrowserRouter, Navigate, Route, Routes, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar";
import RutaProtegida from "./components/RutaProtegida";
import { cerrarSesion, getSesion, iniciarSesion } from "./data/catalogos";
import CandidatoForm from "./pages/CandidatoForm";
import Candidatos from "./pages/Candidatos";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import NuevaSolicitud from "./pages/NuevaSolicitud";
import RellenarNuevoFormulario from "./pages/RellenarNuevoFormulario";
import Resumen from "./pages/Resumen";
import SolicitudDetalle from "./pages/SolicitudDetalle";
import Solicitudes from "./pages/Solicitudes";
import { useTheme } from "./themes/useTheme";

function Contenido() {
  // El usuario vive en el componente padre y baja por props a quien lo necesita
  const [usuario, setUsuario] = useState(getSesion);
  const { theme, toggleTheme } = useTheme();
  const { pathname } = useLocation();

  // El formulario público se muestra limpio, sin la barra del sistema interno
  const esFormularioPublico = pathname.toLowerCase() === "/rellenarnuevoformulario";

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
    <>
      {!esFormularioPublico && (
        <Navbar usuario={usuario} onSalir={handleSalir} tema={theme} onCambiarTema={toggleTheme} />
      )}
      <main className={esFormularioPublico ? undefined : "pb-5"}>
        <Routes>
          <Route path="/rellenarNuevoFormulario" element={<RellenarNuevoFormulario tema={theme} />} />
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
    </>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Contenido />
    </BrowserRouter>
  );
}

export default App;
