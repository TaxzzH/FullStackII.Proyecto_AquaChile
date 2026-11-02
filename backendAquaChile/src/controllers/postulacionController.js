import { getPool, sembrarDatosIniciales } from '../config/db.js';

// ==========================================
// 1. CREAR UNA NUEVA POSTULACIÓN (Formulario Público)
// ==========================================
// Este controlador recibe la información del postulante desde /rellenarNuevoFormulario,
// la valida, registra al candidato y automáticamente le genera una solicitud en estado "Pendiente".
export const crearPostulacion = async (req, res) => {
  try {
    const { nombre, correo, telefono, cargo, familiaCargo } = req.body;

    // Validaciones básicas en el servidor
    if (!nombre || !correo || !telefono || !cargo || !familiaCargo) {
      return res.status(400).json({
        error: 'Todos los campos son obligatorios: nombre, correo, telefono, cargo y familiaCargo.',
      });
    }

    const pool = getPool();

    // Comprobar si ya existe un candidato con ese correo
    const [candidatoExistente] = await pool.query(
      'SELECT id FROM candidatos WHERE LOWER(correo) = LOWER(?)',
      [correo.trim()]
    );

    if (candidatoExistente.length > 0) {
      return res.status(400).json({
        error: 'Ya existe una postulación registrada con este correo electrónico.',
      });
    }

    // 1. Insertar el candidato
    const [candidatoRes] = await pool.query(
      'INSERT INTO candidatos (nombre, correo, telefono, cargo, familiaCargo) VALUES (?, ?, ?, ?, ?)',
      [nombre.trim(), correo.trim().toLowerCase(), telefono.trim(), cargo.trim(), familiaCargo.trim()]
    );
    const candidatoId = candidatoRes.insertId;

    // 2. Crear automáticamente la solicitud de evaluación en estado "Pendiente"
    const fechaHoy = new Date().toISOString().split('T')[0];
    const [solicitudRes] = await pool.query(
      'INSERT INTO solicitudes (candidatoId, cargo, familiaCargo, fechaSolicitud, estado, evaluador) VALUES (?, ?, ?, ?, ?, ?)',
      [candidatoId, cargo.trim(), familiaCargo.trim(), fechaHoy, 'Pendiente', 'Juan Pérez']
    );

    return res.status(201).json({
      success: true,
      mensaje: '¡Postulación enviada con éxito!',
      candidatoId,
      solicitudId: solicitudRes.insertId,
    });
  } catch (error) {
    console.error('Error al crear postulación:', error);
    return res.status(500).json({ error: 'Ocurrió un error en el servidor al registrar la postulación.' });
  }
};

// ==========================================
// 2. OBTENER LISTA DE CANDIDATOS POSTULADOS
// ==========================================
// Utilizado en la página "Candidatos" para listar a todos los que enviaron el formulario
export const obtenerCandidatos = async (req, res) => {
  try {
    const pool = getPool();
    const [candidatos] = await pool.query(`
      SELECT 
        c.id,
        c.nombre,
        c.correo,
        c.telefono,
        c.cargo,
        c.familiaCargo,
        s.id AS solicitudId,
        s.estado AS estadoSolicitud,
        DATE_FORMAT(s.fechaSolicitud, '%Y-%m-%d') AS fechaSolicitud
      FROM candidatos c
      LEFT JOIN solicitudes s ON s.candidatoId = c.id
      ORDER BY c.id DESC
    `);

    return res.json(candidatos);
  } catch (error) {
    console.error('Error al obtener candidatos:', error);
    return res.status(500).json({ error: 'Error al consultar candidatos en la base de datos.' });
  }
};

// ==========================================
// 3. OBTENER SOLICITUDES (con filtro de estado opcional)
// ==========================================
// Utilizado en "Resumen" y "Dashboard"
export const obtenerSolicitudes = async (req, res) => {
  try {
    const { estado } = req.query;
    const pool = getPool();

    let query = `
      SELECT 
        s.id,
        s.candidatoId,
        c.nombre AS nombreCandidato,
        c.correo,
        c.telefono,
        s.cargo,
        s.familiaCargo,
        DATE_FORMAT(s.fechaSolicitud, '%Y-%m-%d') AS fechaSolicitud,
        s.estado,
        s.evaluador,
        DATE_FORMAT(s.fechaEvaluacion, '%Y-%m-%d') AS fechaEvaluacion,
        s.observaciones
      FROM solicitudes s
      JOIN candidatos c ON s.candidatoId = c.id
    `;
    const params = [];

    if (estado) {
      query += ' WHERE s.estado = ?';
      params.push(estado);
    }

    query += ' ORDER BY s.id DESC';

    const [solicitudes] = await pool.query(query, params);
    return res.json(solicitudes);
  } catch (error) {
    console.error('Error al obtener solicitudes:', error);
    return res.status(500).json({ error: 'Error al consultar las solicitudes.' });
  }
};

// ==========================================
// 4. INICIAR EVALUACIÓN (de Pendiente -> En proceso)
// ==========================================
// Se gatilla desde el botón "Iniciar Evaluación" en la vista de Candidatos
export const iniciarEvaluacion = async (req, res) => {
  try {
    const { id } = req.params;
    const pool = getPool();

    const [resultado] = await pool.query(
      'UPDATE solicitudes SET estado = ? WHERE id = ?',
      ['En proceso', id]
    );

    if (resultado.affectedRows === 0) {
      return res.status(404).json({ error: 'Solicitud no encontrada.' });
    }

    return res.json({ success: true, mensaje: 'Evaluación iniciada exitosamente.' });
  } catch (error) {
    console.error('Error al iniciar evaluación:', error);
    return res.status(500).json({ error: 'Error al actualizar el estado de la solicitud.' });
  }
};

// ==========================================
// 5. EVALUAR SOLICITUD (Finalizada o Rechazada)
// ==========================================
// Se gatilla desde el modal en "Resumen"
export const evaluarSolicitud = async (req, res) => {
  try {
    const { id } = req.params;
    const { estado, fechaEvaluacion, observaciones, evaluador } = req.body;

    if (!estado || !['Finalizada', 'Rechazada', 'En proceso'].includes(estado)) {
      return res.status(400).json({ error: 'El estado debe ser: En proceso, Finalizada o Rechazada.' });
    }

    if (!fechaEvaluacion) {
      return res.status(400).json({ error: 'La fecha de evaluación es obligatoria.' });
    }

    if ((estado === 'Finalizada' || estado === 'Rechazada') && (!observaciones || !observaciones.trim())) {
      return res.status(400).json({ error: 'Las observaciones son obligatorias al finalizar o rechazar.' });
    }

    const pool = getPool();
    const [resultado] = await pool.query(
      `UPDATE solicitudes 
       SET estado = ?, fechaEvaluacion = ?, observaciones = ?, evaluador = COALESCE(?, evaluador)
       WHERE id = ?`,
      [estado, fechaEvaluacion, observaciones.trim(), evaluador || null, id]
    );

    if (resultado.affectedRows === 0) {
      return res.status(404).json({ error: 'Solicitud no encontrada.' });
    }

    return res.json({ success: true, mensaje: `Evaluación guardada como ${estado}.` });
  } catch (error) {
    console.error('Error al evaluar solicitud:', error);
    return res.status(500).json({ error: 'Error al registrar la evaluación en la base de datos.' });
  }
};

// ==========================================
// 6. ESTADÍSTICAS DEL DASHBOARD
// ==========================================
export const obtenerEstadisticas = async (req, res) => {
  try {
    const pool = getPool();
    const [filas] = await pool.query(`
      SELECT 
        SUM(CASE WHEN estado = 'Pendiente' THEN 1 ELSE 0 END) AS pendientes,
        SUM(CASE WHEN estado = 'En proceso' THEN 1 ELSE 0 END) AS enProceso,
        SUM(CASE WHEN estado = 'Finalizada' THEN 1 ELSE 0 END) AS finalizadas,
        SUM(CASE WHEN estado = 'Rechazada' THEN 1 ELSE 0 END) AS rechazadas,
        COUNT(*) AS total
      FROM solicitudes
    `);

    const stats = filas[0] || { pendientes: 0, enProceso: 0, finalizadas: 0, rechazadas: 0, total: 0 };
    return res.json({
      pendientes: Number(stats.pendientes) || 0,
      enProceso: Number(stats.enProceso) || 0,
      finalizadas: Number(stats.finalizadas) || 0,
      rechazadas: Number(stats.rechazadas) || 0,
      total: Number(stats.total) || 0,
    });
  } catch (error) {
    console.error('Error al obtener estadísticas:', error);
    return res.status(500).json({ error: 'Error al calcular estadísticas.' });
  }
};

// ==========================================
// 7. RESETEAR A DATOS DE PRUEBA
// ==========================================
export const resetearDatos = async (req, res) => {
  try {
    await sembrarDatosIniciales();
    return res.json({ success: true, mensaje: 'Base de datos restaurada con datos iniciales.' });
  } catch (error) {
    console.error('Error al resetear datos:', error);
    return res.status(500).json({ error: 'Error al resetear datos de prueba.' });
  }
};
