import mysql from 'mysql2/promise';
import 'dotenv/config';

// 1. Configuración de credenciales de conexión
const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  port: Number(process.env.DB_PORT) || 3306,
};

const DB_NAME = process.env.DB_NAME || 'aquachile_db';

// Pool de conexiones reutilizables para el servidor
let pool;

export const initDB = async () => {
  try {
    // Paso 1: Conexión temporal al servidor MySQL para asegurar que la BD exista
    const tempConnection = await mysql.createConnection(dbConfig);
    await tempConnection.query(
      `CREATE DATABASE IF NOT EXISTS \`${DB_NAME}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;`
    );
    await tempConnection.end();

    // Paso 2: Crear el Pool conectado directamente a la base de datos de AquaChile
    pool = mysql.createPool({
      ...dbConfig,
      database: DB_NAME,
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
    });

    // Paso 3: Crear tabla de candidatos si no existe
    await pool.query(`
      CREATE TABLE IF NOT EXISTS candidatos (
        id INT AUTO_INCREMENT PRIMARY KEY,
        nombre VARCHAR(150) NOT NULL,
        correo VARCHAR(150) NOT NULL UNIQUE,
        telefono VARCHAR(50) NOT NULL,
        cargo VARCHAR(150) NOT NULL,
        familiaCargo VARCHAR(100) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Paso 4: Crear tabla de solicitudes de evaluación
    await pool.query(`
      CREATE TABLE IF NOT EXISTS solicitudes (
        id INT AUTO_INCREMENT PRIMARY KEY,
        candidatoId INT NOT NULL,
        cargo VARCHAR(150) NOT NULL,
        familiaCargo VARCHAR(100) NOT NULL,
        fechaSolicitud DATE NOT NULL,
        estado ENUM('Pendiente', 'En proceso', 'Finalizada', 'Rechazada') NOT NULL DEFAULT 'Pendiente',
        evaluador VARCHAR(150) DEFAULT 'Juan Pérez',
        fechaEvaluacion DATE DEFAULT NULL,
        observaciones TEXT DEFAULT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (candidatoId) REFERENCES candidatos(id) ON DELETE CASCADE
      );
    `);

    // Paso 5: Poblar con datos iniciales si la tabla de candidatos está vacía
    const [candidatosCount] = await pool.query('SELECT COUNT(*) as total FROM candidatos');
    if (candidatosCount[0].total === 0) {
      await sembrarDatosIniciales();
    }

    console.log(`✅ Base de datos [${DB_NAME}] y tablas listas en MySQL (Laragon).`);
  } catch (error) {
    console.error('❌ Error al inicializar la base de datos:', error.message);
    throw error;
  }
};

// Función para poblar datos de prueba iniciales
export const sembrarDatosIniciales = async () => {
  console.log('🌱 Poblando base de datos con registros iniciales...');
  
  // Limpiar tablas para reset
  await pool.query('DELETE FROM solicitudes');
  await pool.query('DELETE FROM candidatos');
  await pool.query('ALTER TABLE candidatos AUTO_INCREMENT = 1');
  await pool.query('ALTER TABLE solicitudes AUTO_INCREMENT = 1');

  const candidatos = [
    { nombre: 'María González', correo: 'mgonzalez@ejemplo.cl', telefono: '+56 9 1234 5678', cargo: 'Operador de Planta', familiaCargo: 'Operaciones' },
    { nombre: 'Carlos Rojas', correo: 'crojas@ejemplo.cl', telefono: '+56 9 8765 4321', cargo: 'Analista de Calidad', familiaCargo: 'Calidad' },
    { nombre: 'Andrea Soto', correo: 'asoto@ejemplo.cl', telefono: '+56 9 5555 4444', cargo: 'Jefe de Turno', familiaCargo: 'Operaciones' },
    { nombre: 'Felipe Morales', correo: 'fmorales@ejemplo.cl', telefono: '+56 9 3333 2222', cargo: 'Técnico Mantenimiento', familiaCargo: 'Mantenimiento' },
  ];

  for (const c of candidatos) {
    const [res] = await pool.query(
      'INSERT INTO candidatos (nombre, correo, telefono, cargo, familiaCargo) VALUES (?, ?, ?, ?, ?)',
      [c.nombre, c.correo, c.telefono, c.cargo, c.familiaCargo]
    );
    const candidatoId = res.insertId;

    if (c.nombre === 'María González') {
      await pool.query(
        'INSERT INTO solicitudes (candidatoId, cargo, familiaCargo, fechaSolicitud, estado, evaluador) VALUES (?, ?, ?, ?, ?, ?)',
        [candidatoId, c.cargo, c.familiaCargo, '2026-10-20', 'Pendiente', 'Juan Pérez']
      );
    } else if (c.nombre === 'Carlos Rojas') {
      await pool.query(
        'INSERT INTO solicitudes (candidatoId, cargo, familiaCargo, fechaSolicitud, estado, evaluador) VALUES (?, ?, ?, ?, ?, ?)',
        [candidatoId, c.cargo, c.familiaCargo, '2026-10-22', 'Pendiente', 'Juan Pérez']
      );
    } else if (c.nombre === 'Andrea Soto') {
      await pool.query(
        'INSERT INTO solicitudes (candidatoId, cargo, familiaCargo, fechaSolicitud, estado, evaluador, fechaEvaluacion, observaciones) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
        [candidatoId, c.cargo, c.familiaCargo, '2026-10-18', 'En proceso', 'Juan Pérez', '2026-10-25', 'Entrevista técnica completada. Pendiente informe psicolaboral.']
      );
    } else if (c.nombre === 'Felipe Morales') {
      await pool.query(
        'INSERT INTO solicitudes (candidatoId, cargo, familiaCargo, fechaSolicitud, estado, evaluador, fechaEvaluacion, observaciones) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
        [candidatoId, c.cargo, c.familiaCargo, '2026-10-15', 'Finalizada', 'Juan Pérez', '2026-10-21', 'Aprobado. Perfil compatible con el cargo y competencias requeridas.']
      );
    }
  }
};

export const getPool = () => {
  if (!pool) {
    throw new Error('La base de datos no ha sido inicializada. Llama a initDB() primero.');
  }
  return pool;
};
