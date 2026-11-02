import { BrowserRouter, Route, Routes, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';
import Candidatos from './pages/Candidatos';
import Resumen from './pages/Resumen';
import RellenarNuevoFormulario from './pages/RellenarNuevoFormulario';

// Componente para controlar qué páginas muestran la barra de navegación del evaluador
function LayoutConNavbar() {
  const location = useLocation();
  // El formulario público se muestra limpio, sin la navbar administrativa
  const esFormularioPublico = location.pathname.toLowerCase() === '/rellenarnuevoformulario';

  return (
    <>
      {!esFormularioPublico && <Navbar />}
      <main>
        <Routes>
          {/* 1. Página pública de postulación */}
          <Route path="/rellenarNuevoFormulario" element={<RellenarNuevoFormulario />} />

          {/* 2. Páginas del sistema de evaluación */}
          <Route path="/" element={<Dashboard />} />
          <Route path="/candidatos" element={<Candidatos />} />
          <Route path="/resumen" element={<Resumen />} />
        </Routes>
      </main>
    </>
  );
}

function App() {
  return (
    <BrowserRouter>
      <LayoutConNavbar />
    </BrowserRouter>
  );
}

export default App;
