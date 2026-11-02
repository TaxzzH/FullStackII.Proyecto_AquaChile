import { Router } from 'express';
import {
  crearPostulacion,
  obtenerCandidatos,
  obtenerSolicitudes,
  iniciarEvaluacion,
  evaluarSolicitud,
  obtenerEstadisticas,
  resetearDatos,
} from '../controllers/postulacionController.js';

const router = Router();

// -------------------------------------------------------------
// RUTAS PARA POSTULANTES (Formulario público)
// -------------------------------------------------------------
// POST /api/postulaciones -> Guarda nuevo candidato y su solicitud "Pendiente"
router.post('/postulaciones', crearPostulacion);

// -------------------------------------------------------------
// RUTAS PARA CANDIDATOS (Vista evaluador /candidatos)
// -------------------------------------------------------------
// GET /api/candidatos -> Listado de postulantes que enviaron formulario
router.get('/candidatos', obtenerCandidatos);

// -------------------------------------------------------------
// RUTAS PARA SOLICITUDES Y EVALUACIONES (Vista /resumen)
// -------------------------------------------------------------
// GET /api/solicitudes -> Lista todas las solicitudes (soporta ?estado=En proceso)
router.get('/solicitudes', obtenerSolicitudes);

// PATCH /api/solicitudes/:id/iniciar -> Pasa de "Pendiente" a "En proceso"
router.patch('/solicitudes/:id/iniciar', iniciarEvaluacion);

// PATCH /api/solicitudes/:id/evaluar -> Pasa a "Finalizada" o "Rechazada" con observaciones
router.patch('/solicitudes/:id/evaluar', evaluarSolicitud);

// -------------------------------------------------------------
// RUTAS DE APOYO (Dashboard y pruebas)
// -------------------------------------------------------------
// GET /api/estadisticas -> Contadores del panel principal
router.get('/estadisticas', obtenerEstadisticas);

// POST /api/reset -> Reiniciar datos de prueba iniciales
router.post('/reset', resetearDatos);

export default router;
