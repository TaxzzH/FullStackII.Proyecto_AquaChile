# Frontend - Proyecto AquaChile (React + Vite + Bootstrap 5)

Aplicación web Single Page Application (SPA) desarrollada con **React 19**, **Vite** y **React-Bootstrap 5** para la gestión, seguimiento y calificación de evaluaciones psicolaborales en AquaChile.

---

## 1. Requisitos Previos

* **Node.js** versión 18 o superior.
* Servidor **Backend** en ejecución (`http://localhost:3000`) y **MySQL (Laragon)** activo para que las peticiones a la API funcionen correctamente.

---

## 2. Instrucciones para Levantar el Frontend

1. Abre una terminal y navega hasta la carpeta del frontend:
   ```bash
   cd proyectoAquaChile
   ```
2. Instala las dependencias (solo la primera vez o tras cambios en `package.json`):
   ```bash
   npm install
   ```
3. Inicia el servidor de desarrollo local con Vite:
   ```bash
   npm run dev
   ```
4. Abre en tu navegador la dirección indicada por la consola (habitualmente [http://localhost:5173](http://localhost:5173)).

> **Configuración de la API:**  
> Por defecto, el frontend se comunica con `http://localhost:3000/api`. Si necesitas cambiar la URL de la API, puedes definir la variable de entorno `VITE_API_URL` creando un archivo `.env` en la raíz de `proyectoAquaChile`.

---

## 3. Estructura del Proyecto (`src/`)

El código fuente sigue una arquitectura modular y organizada según el principio de **Atomic Design** para componentes reutilizables:

```text
proyectoAquaChile/
├── public/                 # Archivos estáticos públicos (favicons, etc.)
├── src/
│   ├── assets/             # Imágenes y recursos estáticos (logos AquaChile claro/oscuro)
│   ├── components/         # Componentes organizados por Atomic Design y navegación
│   │   ├── atoms/          # Componentes básicos indivisibles (BadgeEstado)
│   │   ├── molecules/      # Agrupaciones simples de átomos (CampoFormulario, EstadoCarga, TarjetaIndicador)
│   │   ├── organisms/      # Módulos complejos con lógica de negocio (formularios, barras de filtros)
│   │   ├── templates/      # Plantillas estructurales de vista (PlantillaPagina)
│   │   ├── Navbar.jsx      # Barra de navegación principal y control de tema
│   │   └── RutaProtegida.jsx # Guardián de rutas y control de acceso (RBAC)
│   ├── data/               # Catálogos estáticos, perfiles de prueba y gestión de sesión
│   ├── hooks/              # Custom hooks de React (useCarga)
│   ├── pages/              # Vistas completas asociadas a las rutas del sistema
│   ├── services/           # Capa de comunicación HTTP con la API REST (api.js)
│   ├── styles/             # Variables CSS (tokens de diseño) y estilos globales
│   ├── testing/            # Pruebas unitarias e integración con Vitest y RTL
│   ├── themes/             # Lógica y persistencia del modo claro / oscuro (useTheme)
│   ├── utils/              # Funciones puras (permisos, validaciones, exportación, filtros)
│   ├── App.jsx             # Enrutador principal y estado global de usuario
│   └── main.jsx            # Punto de entrada de React en el DOM
├── index.html              # Plantilla HTML base
├── package.json            # Scripts y dependencias del proyecto
└── vite.config.js          # Configuración de Vite y Vitest
```

---

## 4. Resumen de Archivos y Carpetas Clave

### 1. Enrutamiento y Control de Acceso
* **`src/App.jsx`**: Punto central de enrutamiento con `react-router-dom`. Define las rutas públicas y las rutas protegidas, manejando el estado de la sesión activa y el tema visual.
* **`src/components/RutaProtegida.jsx`**: Componente de envoltura que verifica si el usuario tiene sesión activa y si su rol posee el permiso requerido (`gestionarRegistros`, etc.). Si no tiene sesión, redirige a `/login`; si carece de permisos, muestra una alerta de acceso restringido.
* **`src/utils/permisos.js`**: Matriz de permisos RBAC (*Role-Based Access Control*). Define las funciones `puede()`, `solicitudesVisibles()` (filtra para que cada evaluador solo vea las suyas) y `puedeEvaluar()`.
* **`src/data/catalogos.js`**: Contiene listas fijas del dominio (familias de cargo, estados de solicitud), los usuarios de prueba con sus roles, y funciones de lectura/escritura en `sessionStorage` (`iniciarSesion`, `cerrarSesion`, `getSesion`).

### 2. Páginas del Sistema (`src/pages/`)
* **`Dashboard.jsx`**: Panel de control con métricas en tiempo real (candidatos registrados, solicitudes pendientes, en proceso, finalizadas y rechazadas). Incluye botones para abrir el formulario público, exportar datos a JSON y resetear datos de prueba (solo Admin).
* **`Candidatos.jsx`**: Listado de candidatos postulados y tabla inferior de *Solicitudes pendientes*. Permite a los evaluadores iniciar la evaluación de sus solicitudes asignadas.
* **`CandidatoForm.jsx`**: Formulario para registrar un nuevo candidato o editar datos de un candidato existente.
* **`Solicitudes.jsx`**: Tabla completa de solicitudes de evaluación con filtros dinámicos (texto, cargo, familia y estado) y exportación a Excel (CSV).
* **`SolicitudDetalle.jsx`**: Vista de detalle de una solicitud individual con sus antecedentes, estado, fechas, observaciones y modal de evaluación.
* **`NuevaSolicitud.jsx`**: Pantalla para crear una solicitud vinculada a un candidato existente y asignarle un profesional responsable.
* **`Resumen.jsx`**: Bandeja de trabajo de evaluaciones activas (*En proceso*, *Finalizada*, *Rechazada*). Permite calificar postulantes, definir la resolución final e ingresar observaciones técnicas.
* **`Login.jsx`**: Selector de perfiles ficticios para alternar roles rápidamente en el entorno de pruebas.
* **`RellenarNuevoFormulario.jsx`**: Vista pública y aislada (sin barra de navegación interna) para que postulantes externos registren sus antecedentes.

### 3. Componentes Reutilizables (`src/components/`)
* **`atoms/BadgeEstado.jsx`**: Etiqueta visual con código de colores según el estado (*Pendiente*, *En proceso*, *Finalizada*, *Rechazada*).
* **`molecules/CampoFormulario.jsx`**: Control de entrada accesible con etiqueta, texto de ayuda y mensajes de error de validación.
* **`molecules/EstadoCarga.jsx`**: Maneja de forma unificada los estados de carga (spinner), errores de red con botón para reintentar y alertas de datos vacíos.
* **`molecules/TarjetaIndicador.jsx`**: Tarjeta de métricas KPI usada en el Dashboard con enlaces rápidos a vistas filtradas.
* **`organisms/FormularioCandidato.jsx`**: Formulario reutilizable para ingreso/edición de datos de candidatos con validaciones chilenas (teléfono móvil, formato de correo).
* **`organisms/FormularioEvaluacion.jsx`**: Modal interactivo para que el evaluador califique, agregue observaciones y defina la resolución.
* **`organisms/FiltrosSolicitudes.jsx`**: Controles de búsqueda textual y selección de estado.
* **`templates/PlantillaPagina.jsx`**: Contenedor estándar con cabecera corporativa, título, descripción y botones de acción.

### 4. Conexión con el Backend (`src/services/`)
* **`api.js`**: Cliente centralizado que utiliza `fetch` para consumir los endpoints REST del backend (`/candidatos`, `/solicitudes`, `/estadisticas`, `/postulaciones`, `/reset`). Centraliza el manejo de cabeceras, serialización JSON y captura de errores de conexión.

### 5. Utilidades y Hooks (`src/utils/` y `src/hooks/`)
* **`hooks/useCarga.js`**: Hook personalizado para ejecutar llamadas asíncronas, exponiendo `{ datos, cargando, error, recargar }`.
* **`themes/useTheme.js`**: Hook para alternar entre tema claro y tema oscuro, sincronizando el atributo `data-bs-theme` en el HTML y persistiendo la preferencia en `localStorage`.
* **`utils/validaciones.js`**: Reglas de validación en el cliente (formato de correo, celular chileno `+56 9`, campos obligatorios y fechas no futuras).
* **`utils/exportar.js`**: Funciones para exportar tablas a archivos `.csv` compatibles con Excel y descargar datos completos en formato `.json`.
* **`utils/filtros.js`**: Algoritmos de filtrado y búsqueda de solicitudes en memoria.

---

## 5. Roles del Sistema y Permisos

El sistema implementa control de acceso simulado según el perfil seleccionado al ingresar:

| Rol | Usuario de Ejemplo | Permisos y Capacidades |
| :--- | :--- | :--- |
| **Administrador** | Paula Reyes | Acceso total: registrar y editar candidatos, crear solicitudes, evaluar cualquier solicitud, exportar JSON y resetear datos de prueba en MySQL. |
| **Analista** | Sofía Lagos | Gestión de registros: registrar y editar candidatos, crear solicitudes y asignarlas a evaluadores. No evalúa ni resetea datos. |
| **Evaluador** | Juan Pérez, Camila Fuentes, Rodrigo Vera | Rol operativo: iniciar y calificar evaluaciones psicolaborales. **Solo visualiza y evalúa las solicitudes asignadas a su propio nombre**. |
| **Jefatura** | Marta Díaz | Modo solo lectura: visualiza todas las estadísticas, candidatos y solicitudes de toda la empresa, y exporta a Excel/CSV. |
| *(Postulante)* | *(Sin sesión)* | Acceso exclusivo al formulario público en `/rellenarNuevoFormulario`. |

---

## 6. Pruebas Automatizadas

El proyecto incluye una suite de pruebas automatizadas con **Vitest** y **React Testing Library**:

* Ejecutar todas las pruebas en modo interactivo:
  ```bash
  npm test
  ```
* Ejecutar las pruebas generando reporte de cobertura de código:
  ```bash
  npm run coverage
  ```
* Ejecutar el linter de código rápido (oxlint):
  ```bash
  npm run lint
  ```
