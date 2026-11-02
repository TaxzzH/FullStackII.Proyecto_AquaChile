import { Router } from 'express';
import {
  actualizarCandidato,
  crearCandidato,
  crearPostulacion,
  crearSolicitud,
  evaluarSolicitud,
  iniciarEvaluacion,
  obtenerCandidatos,
  obtenerEstadisticas,
  obtenerSolicitud,
  obtenerSolicitudes,
  resetearDatos,
} from '../controllers/postulacionController.js';

const router = Router();

// Formulario público: guarda un candidato nuevo y su solicitud "Pendiente"
router.post('/postulaciones', crearPostulacion);

// Candidatos
router.get('/candidatos', obtenerCandidatos);
router.post('/candidatos', crearCandidato);
router.put('/candidatos/:id', actualizarCandidato);

// Solicitudes y evaluaciones (GET /solicitudes admite ?estado=En proceso)
router.get('/solicitudes', obtenerSolicitudes);
router.post('/solicitudes', crearSolicitud);
router.get('/solicitudes/:id', obtenerSolicitud);
router.patch('/solicitudes/:id/iniciar', iniciarEvaluacion);
router.patch('/solicitudes/:id/evaluar', evaluarSolicitud);

// Dashboard y datos de prueba
router.get('/estadisticas', obtenerEstadisticas);
router.post('/reset', resetearDatos);

export default router;
