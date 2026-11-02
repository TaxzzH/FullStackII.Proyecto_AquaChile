# Backend - Proyecto AquaChile (Node.js + Express + MySQL)

Servidor API REST desarrollado con **Express** y **MySQL 2 (Promise)** para la gestión y persistencia de postulantes y evaluaciones psicolaborales de AquaChile.

---

## 1. Instrucciones para Levantar la Base de Datos (Laragon)

La base de datos se ejecuta localmente mediante **Laragon**:

1. Abre el programa **Laragon**.
2. Haz clic en el botón **"Iniciar Todo"** (o *"Start All"*).
3. Verifica que el servicio **MySQL** figure activo en el puerto **`3306`**.
4. **¡Listo!** No necesitas crear manualmente la base de datos ni las tablas:
   * Al iniciar el backend, el código crea automáticamente la base de datos `aquachile_db`.
   * Si las tablas `candidatos` y `solicitudes` están vacías, inserta registros iniciales de prueba para que el sistema funcione de inmediato.

> **Credenciales por defecto en Laragon:**
> * **Host:** `localhost` (127.0.0.1)
> * **Puerto:** `3306`
> * **Usuario:** `root`
> * **Contraseña:** *(vacía)*
> * **Base de Datos:** `aquachile_db`

---

## 2. Instrucciones para Levantar el Servidor Backend

1. Abre una terminal y navega hasta la carpeta del backend:
   ```bash
   cd backendAquaChile
   ```
2. Instala las dependencias (solo la primera vez):
   ```bash
   npm install
   ```
3. Inicia el servidor en modo desarrollo (con reinicio automático al guardar cambios vía `nodemon`):
   ```bash
   npm run dev
   ```
   *(Para iniciar en modo estándar sin nodemon, puedes usar `npm start`).*

4. La consola confirmará que todo está listo con los siguientes mensajes:
   ```text
   Base de datos [aquachile_db] y tablas listas en MySQL (Laragon).
   Servidor Express AquaChile corriendo en: http://localhost:3000
   API disponible en: http://localhost:3000/api
   ```

---

## 3. Resumen de Archivos Clave del Backend

A continuación se explican los componentes fundamentales de la arquitectura:

### 1. Servidor y Configuración
* **`src/app.js`**: Punto de entrada del servidor Express. Configura los middlewares globales:
  * **CORS:** Permite peticiones cruzadas desde el frontend de React (`http://localhost:5173`).
  * **express.json:** Procesa peticiones con cuerpo en formato JSON (`req.body`).
  * **Rutas:** Monta los endpoints bajo el prefijo `/api`.
  * **Arranque:** Conecta a MySQL e inicia el listener en el puerto 3000.
* **`.env`**: Archivo de variables de entorno con las credenciales de conexión (`PORT`, `DB_HOST`, `DB_USER`, `DB_PASSWORD`, `DB_NAME`, `DB_PORT`). Permite cambiar credenciales sin tocar el código fuente.
* **`package.json`**: Define los scripts (`dev`, `start`), el tipo de módulo ES (`"type": "module"`) y las dependencias (`express`, `mysql2`, `cors`, `dotenv`, `nodemon`).

### 2. Base de Datos y Persistencia
* **`src/config/db.js`**: Gestiona la conexión con MySQL mediante un Pool de conexiones (`mysql2/promise`). Incluye:
  * Creación automática de la base de datos `aquachile_db` si no existe.
  * Creación automática de las tablas relacionales:
    * `candidatos` (id, nombre, correo único, teléfono, cargo, familiaCargo).
    * `solicitudes` (id, candidatoId foránea, fechaSolicitud, estado, evaluador, fechaEvaluacion, observaciones).
  * Función `sembrarDatosIniciales()` para poblar la base de datos al arrancar por primera vez o al usar el botón de reinicio.

### 3. Rutas y Controladores
* **`src/routes/api.js`**: Mapea las URLs y los métodos HTTP (POST, GET, PATCH) con sus respectivos controladores.
* **`src/controllers/postulacionController.js`**: Contiene la lógica del negocio y las consultas SQL:
  * `crearPostulacion`: Valida campos, registra al candidato e inserta su solicitud en estado *"Pendiente"*.
  * `obtenerCandidatos`: Retorna la lista de postulantes y el estado de su solicitud.
  * `obtenerSolicitudes`: Retorna las solicitudes de evaluación con soporte de filtrado (`?estado=...`).
  * `iniciarEvaluacion`: Cambia el estado de una solicitud de *"Pendiente"* a *"En proceso"*.
  * `evaluarSolicitud`: Actualiza la fecha, observaciones y resolución final (*"Finalizada"* o *"Rechazada"*).
  * `obtenerEstadisticas`: Calcula los totales para las tarjetas del Dashboard.
  * `resetearDatos`: Restablece la base de datos a los datos de prueba iniciales.

---

## 4. Resumen de Endpoints de la API

| Método | Ruta | Descripción |
| :--- | :--- | :--- |
| **POST** | `/api/postulaciones` | Recibe la postulación del formulario público y crea el candidato con su solicitud *Pendiente*. |
| **GET** | `/api/candidatos` | Lista los postulantes registrados y el estado de su solicitud. |
| **GET** | `/api/solicitudes` | Lista las solicitudes de evaluación (acepta parámetro opcional `?estado=En proceso`, etc.). |
| **PATCH** | `/api/solicitudes/:id/iniciar` | Cambia el estado de una solicitud a *"En proceso"*. |
| **PATCH** | `/api/solicitudes/:id/evaluar` | Guarda el resultado de la evaluación como *"Finalizada"* o *"Rechazada"*. |
| **GET** | `/api/estadisticas` | Devuelve los contadores en tiempo real para el panel principal. |
| **POST** | `/api/reset` | Restaura los datos iniciales de prueba en MySQL. |
| **GET** | `/api/health` | Comprobación de estado del servidor. |
