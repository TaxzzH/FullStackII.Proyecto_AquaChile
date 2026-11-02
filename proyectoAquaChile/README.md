# Frontend - Proyecto AquaChile (React + Vite)

Aplicación web desarrollada en **React 19** con **Vite** y **Bootstrap 5** para la gestión y evaluación de candidatos en AquaChile.

---

## Instrucciones para Levantar la Aplicación Web

### Requisitos Previos
1. **Node.js** instalado (versión 18 o superior).
2. Tener el servidor de base de datos encendido en **Laragon** (MySQL en puerto 3306).
3. Tener el servidor backend (`backendAquaChile`) ejecutándose en el puerto 3000.

### Pasos de Inicialización
1. Abre una terminal en la carpeta del frontend:
   ```bash
   cd proyectoAquaChile
   ```
2. Instala las dependencias (solo la primera vez):
   ```bash
   npm install
   ```
3. Inicia el servidor de desarrollo:
   ```bash
   npm run dev
   ```
4. Abre tu navegador web en la dirección indicada por la consola:
   * **Panel Administrativo / Evaluador:** [http://localhost:5173](http://localhost:5173)
   * **Formulario Público de Postulación:** [http://localhost:5173/rellenarNuevoFormulario](http://localhost:5173/rellenarNuevoFormulario)

### Otros Comandos Útiles
* **Ejecutar pruebas unitarias (Vitest):**
  ```bash
  npm test
  ```
* **Compilar para producción:**
  ```bash
  npm run build
  ```

---

## 📁 Resumen de Archivos Clave del Frontend

A continuación se detallan los archivos principales de la aplicación y el rol que cumple cada uno:

### 1. Núcleo y Rutas
* **`src/App.jsx`**: Punto de entrada de la navegación (React Router). Configura las rutas principales (`/`, `/candidatos`, `/resumen`, `/rellenarNuevoFormulario`) y controla que el formulario público se muestre de forma aislada, sin la barra de navegación del evaluador.
* **`src/main.jsx`**: Archivo inicial de React que renderiza el componente `<App />` e importa los estilos globales de Bootstrap y de la empresa.

### 2. Conexión con el Backend
* **`src/services/api.js`**: Capa de servicios HTTP que centraliza las llamadas `fetch` hacia el backend en Express (`http://localhost:3000/api`). Expone funciones limpias como `enviarPostulacion()`, `obtenerCandidatos()`, `iniciarEvaluacion()`, `evaluarSolicitud()` y `obtenerEstadisticas()`.

### 3. Vistas y Páginas (`src/pages/`)
* **`src/pages/RellenarNuevoFormulario.jsx`**: Vista pública tipo *Google Forms / Portal de Empleo*. Los postulantes ingresan sus datos y, al enviar, se registran directamente en MySQL con estado inicial *"Pendiente"*.
* **`src/pages/Candidatos.jsx`**: Muestra la lista de candidatos que han enviado el formulario y están a la espera de evaluación. Al hacer clic en *"Iniciar Evaluación"*, el postulante cambia a *"En proceso"* y **desaparece de esta vista para trasladarse a Resumen**.
* **`src/pages/Resumen.jsx`**: Panel de gestión de evaluaciones. Cuenta con filtros para revisar solicitudes en tres estados: **En proceso**, **Finalizadas (Aprobadas)** y **Rechazadas**. Permite abrir el modal para calificar al candidato.
* **`src/pages/Dashboard.jsx`**: Pantalla de inicio con métricas en tiempo real conectadas a MySQL (Pendientes, En Proceso, Finalizadas y Rechazadas) y botón para restablecer datos de prueba.

### 4. Componentes y Utilidades
* **`src/components/Navbar.jsx`**: Barra de navegación superior con enlaces de navegación y switch funcional de **Modo Oscuro / Modo Claro**.
* **`src/components/organisms/FormularioEvaluacion.jsx`**: Formulario modal en Resumen donde el evaluador asigna la fecha, observaciones y resolución final (*"Finalizada"* o *"Rechazada"*).
* **`src/utils/validaciones.js`**: Reglas de validación para correo electrónico, teléfono chileno (+56 9 ...), campos obligatorios y fechas lógicas.
* **`src/App.css`**: Variables CSS globales para compatibilidad completa de colores entre Modo Claro y Modo Oscuro (incluyendo el cuadro de bienvenida, modales y tablas).
