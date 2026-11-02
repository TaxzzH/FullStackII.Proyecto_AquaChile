import { getPool, sembrarDatosIniciales } from '../config/db.js';

const SELECT_SOLICITUD = `
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

// Fecha de hoy según el reloj local del servidor, en formato AAAA-MM-DD
const hoyISO = () => {
  const ahora = new Date();
  const mes = String(ahora.getMonth() + 1).padStart(2, '0');
  const dia = String(ahora.getDate()).padStart(2, '0');
  return `${ahora.getFullYear()}-${mes}-${dia}`;
};

const texto = (valor) => String(valor ?? '').trim();

// Mismas reglas del formulario: el servidor no confía solo en la validación del navegador
const errorCandidato = (datos) => {
  const { nombre, correo, telefono, cargo, familiaCargo } = datos;
  if (!texto(nombre) || !texto(correo) || !texto(telefono) || !texto(cargo) || !texto(familiaCargo)) {
    return 'Todos los campos son obligatorios: nombre, correo, telefono, cargo y familiaCargo.';
  }
  if (texto(nombre).length < 3) return 'El nombre debe tener al menos 3 caracteres.';
  if (!/^\S+@\S+\.\S+$/.test(texto(correo))) return 'El correo electrónico no es válido.';
  if (!/^(\+?56)?\s?9\s?\d{4}\s?\d{4}$/.test(texto(telefono))) return 'El teléfono debe ser un celular chileno.';
  return null;
};

const valoresCandidato = (datos) => [
  texto(datos.nombre),
  texto(datos.correo).toLowerCase(),
  texto(datos.telefono),
  texto(datos.cargo),
  texto(datos.familiaCargo),
];

const MENSAJE_CORREO_REPETIDO = 'Ya existe un candidato registrado con este correo electrónico.';

// ==========================================
// 1. CREAR UNA NUEVA POSTULACIÓN (Formulario Público)
// ==========================================
// Registra al candidato y le genera una solicitud en estado "Pendiente".
export const crearPostulacion = async (req, res) => {
  const pool = getPool();
  const conexion = await pool.getConnection();
  try {
    const error = errorCandidato(req.body);
    if (error) return res.status(400).json({ error });

    // Candidato y solicitud se guardan juntos: si uno falla, no queda ninguno a medias
    await conexion.beginTransaction();
    const [candidatoRes] = await conexion.query(
      'INSERT INTO candidatos (nombre, correo, telefono, cargo, familiaCargo) VALUES (?, ?, ?, ?, ?)',
      valoresCandidato(req.body)
    );
    const [solicitudRes] = await conexion.query(
      'INSERT INTO solicitudes (candidatoId, cargo, familiaCargo, fechaSolicitud, estado, evaluador) VALUES (?, ?, ?, ?, ?, ?)',
      [candidatoRes.insertId, texto(req.body.cargo), texto(req.body.familiaCargo), hoyISO(), 'Pendiente', 'Juan Pérez']
    );
    await conexion.commit();

    return res.status(201).json({
      success: true,
      mensaje: '¡Postulación enviada con éxito!',
      candidatoId: candidatoRes.insertId,
      solicitudId: solicitudRes.insertId,
    });
  } catch (error) {
    await conexion.rollback();
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({ error: 'Ya existe una postulación registrada con este correo electrónico.' });
    }
    console.error('Error al crear postulación:', error);
    return res.status(500).json({ error: 'Ocurrió un error en el servidor al registrar la postulación.' });
  } finally {
    conexion.release();
  }
};

// ==========================================
// 2. CANDIDATOS
// ==========================================
export const obtenerCandidatos = async (req, res) => {
  try {
    const [candidatos] = await getPool().query(
      'SELECT id, nombre, correo, telefono, cargo, familiaCargo FROM candidatos ORDER BY id'
    );
    return res.json(candidatos);
  } catch (error) {
    console.error('Error al obtener candidatos:', error);
    return res.status(500).json({ error: 'Error al consultar candidatos en la base de datos.' });
  }
};

export const crearCandidato = async (req, res) => {
  try {
    const error = errorCandidato(req.body);
    if (error) return res.status(400).json({ error });

    const [resultado] = await getPool().query(
      'INSERT INTO candidatos (nombre, correo, telefono, cargo, familiaCargo) VALUES (?, ?, ?, ?, ?)',
      valoresCandidato(req.body)
    );
    return res.status(201).json({ success: true, id: resultado.insertId });
  } catch (error) {
    if (error.code === 'ER_DUP_ENTRY') return res.status(409).json({ error: MENSAJE_CORREO_REPETIDO });
    console.error('Error al crear candidato:', error);
    return res.status(500).json({ error: 'Error al registrar el candidato.' });
  }
};

export const actualizarCandidato = async (req, res) => {
  try {
    const error = errorCandidato(req.body);
    if (error) return res.status(400).json({ error });

    const [resultado] = await getPool().query(
      'UPDATE candidatos SET nombre = ?, correo = ?, telefono = ?, cargo = ?, familiaCargo = ? WHERE id = ?',
      [...valoresCandidato(req.body), req.params.id]
    );
    if (resultado.affectedRows === 0) return res.status(404).json({ error: 'Candidato no encontrado.' });

    return res.json({ success: true });
  } catch (error) {
    if (error.code === 'ER_DUP_ENTRY') return res.status(409).json({ error: MENSAJE_CORREO_REPETIDO });
    console.error('Error al actualizar candidato:', error);
    return res.status(500).json({ error: 'Error al actualizar el candidato.' });
  }
};

// ==========================================
// 3. SOLICITUDES
// ==========================================
export const obtenerSolicitudes = async (req, res) => {
  try {
    const { estado } = req.query;
    const params = [];
    let query = SELECT_SOLICITUD;

    if (estado) {
      query += ' WHERE s.estado = ?';
      params.push(estado);
    }
    query += ' ORDER BY s.id DESC';

    const [solicitudes] = await getPool().query(query, params);
    return res.json(solicitudes);
  } catch (error) {
    console.error('Error al obtener solicitudes:', error);
    return res.status(500).json({ error: 'Error al consultar las solicitudes.' });
  }
};

export const obtenerSolicitud = async (req, res) => {
  try {
    const [filas] = await getPool().query(`${SELECT_SOLICITUD} WHERE s.id = ?`, [req.params.id]);
    if (filas.length === 0) return res.status(404).json({ error: 'Solicitud no encontrada.' });

    return res.json(filas[0]);
  } catch (error) {
    console.error('Error al obtener solicitud:', error);
    return res.status(500).json({ error: 'Error al consultar la solicitud.' });
  }
};

export const crearSolicitud = async (req, res) => {
  try {
    const { candidatoId, cargo, familiaCargo, fechaSolicitud, evaluador, observaciones } = req.body;

    if (!candidatoId || !texto(cargo) || !texto(familiaCargo) || !texto(fechaSolicitud) || !texto(evaluador)) {
      return res.status(400).json({
        error: 'Todos los campos son obligatorios: candidatoId, cargo, familiaCargo, fechaSolicitud y evaluador.',
      });
    }
    if (fechaSolicitud > hoyISO()) {
      return res.status(400).json({ error: 'La fecha de solicitud no puede ser futura.' });
    }

    const [resultado] = await getPool().query(
      'INSERT INTO solicitudes (candidatoId, cargo, familiaCargo, fechaSolicitud, estado, evaluador, observaciones) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [candidatoId, texto(cargo), texto(familiaCargo), fechaSolicitud, 'Pendiente', texto(evaluador), texto(observaciones) || null]
    );
    return res.status(201).json({ success: true, id: resultado.insertId });
  } catch (error) {
    if (error.code === 'ER_NO_REFERENCED_ROW_2') return res.status(400).json({ error: 'El candidato no existe.' });
    console.error('Error al crear solicitud:', error);
    return res.status(500).json({ error: 'Error al crear la solicitud.' });
  }
};

// ==========================================
// 4. INICIAR EVALUACIÓN (de Pendiente -> En proceso)
// ==========================================
export const iniciarEvaluacion = async (req, res) => {
  try {
    const { id } = req.params;
    const pool = getPool();

    // Solo una solicitud Pendiente puede iniciarse: así una finalizada no vuelve atrás
    const [resultado] = await pool.query(
      "UPDATE solicitudes SET estado = 'En proceso' WHERE id = ? AND estado = 'Pendiente'",
      [id]
    );

    if (resultado.affectedRows === 0) {
      const [filas] = await pool.query('SELECT estado FROM solicitudes WHERE id = ?', [id]);
      return filas.length === 0
        ? res.status(404).json({ error: 'Solicitud no encontrada.' })
        : res.status(409).json({ error: `La solicitud ya está en estado "${filas[0].estado}".` });
    }

    return res.json({ success: true, mensaje: 'Evaluación iniciada exitosamente.' });
  } catch (error) {
    console.error('Error al iniciar evaluación:', error);
    return res.status(500).json({ error: 'Error al actualizar el estado de la solicitud.' });
  }
};

// ==========================================
// 5. EVALUAR SOLICITUD (En proceso, Finalizada o Rechazada)
// ==========================================
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

    const esCierre = estado === 'Finalizada' || estado === 'Rechazada';
    if (esCierre && !texto(observaciones)) {
      return res.status(400).json({ error: 'Las observaciones son obligatorias al finalizar o rechazar.' });
    }
    if (esCierre && fechaEvaluacion > hoyISO()) {
      return res.status(400).json({ error: 'Una evaluación cerrada no puede tener fecha futura.' });
    }

    const pool = getPool();
    const [filas] = await pool.query(
      "SELECT DATE_FORMAT(fechaSolicitud, '%Y-%m-%d') AS fechaSolicitud FROM solicitudes WHERE id = ?",
      [id]
    );
    if (filas.length === 0) return res.status(404).json({ error: 'Solicitud no encontrada.' });
    if (fechaEvaluacion < filas[0].fechaSolicitud) {
      return res.status(400).json({ error: 'La fecha de evaluación no puede ser anterior a la solicitud.' });
    }

    await pool.query(
      `UPDATE solicitudes
       SET estado = ?, fechaEvaluacion = ?, observaciones = ?, evaluador = COALESCE(?, evaluador)
       WHERE id = ?`,
      [estado, fechaEvaluacion, texto(observaciones), evaluador || null, id]
    );

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
    const [candidatos] = await pool.query('SELECT COUNT(*) AS total FROM candidatos');

    const stats = filas[0];
    return res.json({
      candidatos: Number(candidatos[0].total),
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
