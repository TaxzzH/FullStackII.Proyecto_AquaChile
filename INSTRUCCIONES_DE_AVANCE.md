# Instrucciones de Avance – MVP Evaluación Psicolaboral AquaChile

Documento de coordinación del equipo para el proyecto VcM de **DSY1104 Full Stack II**.
Resume el estado actual del proyecto, lo que falta y cómo se divide el trabajo.

> Última revisión: 08/10/2026

**Equipo**

| Integrante | Módulo a cargo |
|---|---|
| Vicente Barrera | Candidatos, Dashboard y Acceso |
| Tomás Herrera | Solicitudes y Evaluaciones |

---

## 1. Estado actual

**Avance estimado:** ~10% del Hito 1 (Frontend) · ~5% del MVP completo.

| Elemento | Estado |
|---|---|
| Proyecto Vite + React 19 | ✅ Listo |
| Bootstrap 5 instalado e importado | ✅ Listo |
| React Router con rutas `/`, `/candidatos`, `/solicitudes` | ✅ Listo |
| Navbar responsive (`src/components/Navbar.jsx`) | ⚠️ Cambiar el texto "Fiumba" por "Inicio" |
| Páginas Dashboard, Candidatos y Solicitudes | ⚠️ Solo tienen título (placeholder) |
| Datos simulados, estado (`useState`/Context), props | ❌ Pendiente |
| Formularios y validaciones | ❌ Pendiente |
| Pruebas unitarias (Jasmine + Karma) | ❌ Pendiente |
| Documento ERS y documento de cobertura de testing | ❌ Pendiente |
| Backend, base de datos y despliegue | ❌ Pendiente (Hitos 2 y 3) |

### Correcciones rápidas
- `src/index.css` y `src/App.css` son estilos de la plantilla de Vite (`#root` con ancho fijo y texto centrado) y chocan con Bootstrap. Limpiar `index.css` y eliminar `App.css`.
- Corregir el enlace "Fiumba" en la Navbar.

---

## 2. Fechas clave

| Hito | Fecha | Contenido |
|---|---|---|
| **Hito 1 – Frontend funcional** (Evaluación Parcial 2) | **12 al 17 de octubre** | React + Bootstrap, responsive, formularios, validaciones, flujo con datos simulados, **10 pruebas unitarias con Jasmine y Karma**, ERS y documento de cobertura |
| Hito 2 – Integración Full Stack | 23 al 28 de noviembre | API REST + backend monolítico + base de datos |
| Hito 3 – MVP final desplegado | 30 de noviembre al 5 de diciembre | Solución integrada, probada y desplegada gratis |

**Entregables del Hito 1:** enlace público de GitHub, proyecto comprimido, documento ERS y documento de cobertura de testing.

> La presentación se evalúa **individualmente**. Cada integrante debe poder explicar sus componentes (props y estado), el diseño responsive y sus propias pruebas.

---

## 3. Lo que falta para el Hito 1

1. **Datos simulados** (`src/data/mockData.js`): candidatos, solicitudes, evaluaciones, cargos, familias de cargo y responsables. Solo datos ficticios.
2. **Estado global** (`src/context/`): Context con candidatos, solicitudes y usuario conectado.
3. **Vistas obligatorias:**
   - Dashboard con indicadores (total de candidatos, pendientes, en proceso, finalizadas).
   - Listado de candidatos.
   - Formulario de registro y edición de candidato.
   - Listado de solicitudes con filtros (estado, cargo, candidato, fecha).
   - Formulario de nueva solicitud.
   - Detalle de solicitud.
   - Sección para registrar o actualizar la evaluación (fecha, observaciones, estado).
4. **Login simple con roles simulados:** Analista, Evaluador y Jefatura (solo lectura).
5. **Componentes reutilizables con props:** tarjetas de indicadores, badge de estado, tablas e inputs con mensaje de error.
6. **Pruebas unitarias con Jasmine + Karma:** 10 pruebas como mínimo, con mocks y reporte de cobertura (`karma-coverage`).
7. **Documentos:** ERS (versión final) y documento de cobertura de testing.

Estados de una solicitud: **Pendiente → En proceso → Finalizada**.

---

## 4. División de tareas

### Día 1 – Trabajo conjunto
- [ ] Definir el modelo de datos y crear `src/data/mockData.js`
- [ ] Crear el Context de estado global
- [ ] Limpiar el CSS de la plantilla y corregir la Navbar
- [ ] Configurar Karma + Jasmine con una primera prueba funcionando
- [ ] Crear las ramas de trabajo en Git

### Vicente Barrera – Candidatos, Dashboard y Acceso

**Frontend**
- [ ] Login con roles simulados y rutas protegidas
- [ ] Listado de candidatos con búsqueda
- [ ] Formulario de crear/editar candidato con validaciones (campos obligatorios, email, teléfono)
- [ ] Dashboard con componente `TarjetaIndicador` (recibe props)
- [ ] Navbar que muestre opciones según el rol

**Pruebas (mínimo 5)**
- [ ] El login muestra error con un rol vacío o inválido
- [ ] El listado renderiza las filas a partir del mock
- [ ] La validación rechaza un email o teléfono incorrecto
- [ ] `TarjetaIndicador` muestra los valores recibidos por props
- [ ] El Dashboard calcula correctamente los totales por estado

**Documento:** ERS

### Tomás Herrera – Solicitudes y Evaluaciones

**Frontend**
- [ ] Listado de solicitudes con filtros (estado, cargo, candidato, fecha)
- [ ] Formulario de nueva solicitud (candidato, cargo, familia de cargo, fecha, responsable)
- [ ] Detalle de solicitud (ruta `/solicitudes/:id`)
- [ ] Sección de evaluación: fecha, observaciones y cambio de estado
- [ ] Componente `BadgeEstado` (color según el estado recibido por props)

**Pruebas (mínimo 5)**
- [ ] El filtro por estado devuelve solo las solicitudes que coinciden
- [ ] El formulario no se envía si falta el candidato o el cargo
- [ ] El detalle muestra los datos de la solicitud del mock
- [ ] El cambio de estado sigue el orden Pendiente → En proceso → Finalizada
- [ ] `BadgeEstado` aplica la clase correcta según el estado

**Documento:** Cobertura de testing (con el reporte de `karma-coverage`)

### Hitos 2 y 3 (se mantiene la división)
| Vicente Barrera | Tomás Herrera |
|---|---|
| Configuración del backend y la base de datos | Modelo y endpoints de `/solicitudes` y `/evaluaciones` |
| Endpoints de `/candidatos` y `/auth` | Integración de Solicitudes y Evaluaciones con la API |
| Integración de Candidatos y Dashboard con la API | Despliegue del backend y la base de datos |
| Despliegue del frontend | Pruebas del flujo completo |

---

## 5. Estructura de carpetas sugerida

```
proyectoAquaChile/src/
├── components/     # Componentes reutilizables (Navbar, TarjetaIndicador, BadgeEstado, ...)
├── context/        # Estado global (AppContext)
├── data/           # Datos simulados (mockData.js)
├── pages/          # Vistas (Dashboard, Candidatos, Solicitudes, DetalleSolicitud, Login, ...)
├── utils/          # Funciones de validación y filtrado
└── tests/          # Pruebas Jasmine (*.spec.js)
```

---

## 6. Forma de trabajo con Git

1. Clonar el repositorio (no trabajar sobre una copia descargada en ZIP).
2. Cada integrante trabaja en su rama:
   ```bash
   git checkout -b feature/candidatos     # Vicente Barrera
   git checkout -b feature/solicitudes    # Tomás Herrera
   ```
3. Hacer commits pequeños y descriptivos, por ejemplo `feat: formulario de candidato con validaciones`.
4. Antes de abrir un Pull Request, actualizar la rama con `main`:
   ```bash
   git pull origin main
   ```
5. Abrir un Pull Request hacia `main`; el otro integrante lo revisa antes de hacer merge.
6. No modificar archivos del módulo del compañero sin avisar. Los archivos compartidos (`mockData.js`, Context, `App.jsx`) se cambian de común acuerdo.

---

## 7. Ejecutar el proyecto

```bash
cd proyectoAquaChile
npm install
npm run dev
```

---

## 8. Reglas del caso

- Usar **solo datos ficticios**: nada de nombres, RUT, correos ni antecedentes reales.
- No publicar información interna de AquaChile.
- No usar servicios de pago ni credenciales corporativas.
- Arquitectura monolítica: frontend React + backend + base de datos, sin microservicios.
