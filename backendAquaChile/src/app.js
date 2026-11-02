import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import { initDB } from './config/db.js';
import apiRouter from './routes/api.js';

const app = express();
const PORT = process.env.PORT || 3000;

// 1. Middlewares globales
// CORS permite que el frontend de React (localhost:5173) consuma esta API sin ser bloqueado
app.use(
  cors({
    origin: '*', // En desarrollo permitimos cualquier origen o frontend local
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

// Middleware para transformar el cuerpo de peticiones JSON a req.body
app.use(express.json());

// 2. Ruta de comprobación de salud (Health Check)
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', server: 'AquaChile Backend Express', time: new Date() });
});

// 3. Montar todas las rutas del sistema bajo el prefijo /api
app.use('/api', apiRouter);

// Manejo de rutas inexistentes (404)
app.use((req, res) => {
  res.status(404).json({ error: `La ruta [${req.method}] ${req.url} no existe en este servidor.` });
});

// 4. Inicializar base de datos MySQL y arrancar el servidor
const startServer = async () => {
  try {
    await initDB();
    app.listen(PORT, () => {
      console.log(`🚀 Servidor Express AquaChile corriendo en: http://localhost:${PORT}`);
      console.log(`📌 API disponible en: http://localhost:${PORT}/api`);
    });
  } catch (error) {
    console.error('No se pudo iniciar el servidor debido a un error de base de datos:', error);
    process.exit(1);
  }
};

startServer();
