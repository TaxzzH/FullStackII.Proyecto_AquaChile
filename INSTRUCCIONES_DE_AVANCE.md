# Instrucciones de Avance – MVP Evaluación Psicolaboral AquaChile

Documento de coordinación del equipo para el proyecto VcM de **DSY1104 Full Stack II**.
Resume el estado actual del proyecto, lo que falta y cómo se divide el trabajo.
Todo el desarrollo se basa en el material entregado por el profesor (carpeta `materia/`). Lo que se agregue fuera de ese material se indica en la sección 6.

> Última revisión: 15/10/2026

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
| Navbar responsive con logo de AquaChile | ✅ Listo (ver corrección del logo abajo) |
| Páginas Dashboard, Candidatos y Solicitudes | ⚠️ Solo tienen título (placeholder) |
| react-bootstrap | ❌ No instalado |
| Datos simulados, props, `useState` y localStorage | ❌ Pendiente |
| Formularios y validaciones | ❌ Pendiente |
| Pruebas unitarias (Jasmine + Karma) | ❌ Pendiente |
| Documento ERS y documento de cobertura de testing | ❌ Pendiente |
| Backend, base de datos y despliegue | ❌ Pendiente (Hitos 2 y 3) |

### Correcciones rápidas
- **Logo:** `Navbar.jsx` importa `../assets/Logo_Aquachile.png`, pero el archivo se llama `Logo_AquaChile.png`. En Windows funciona, pero en Linux (EC2, Vercel, etc.) el build falla porque distingue mayúsculas. Corregir el import.
- **CSS de la plantilla:** `src/index.css` y `src/App.css` son estilos de la plantilla de Vite (`#root` con ancho fijo y texto centrado) y chocan con Bootstrap. Limpiar `index.css` y eliminar `App.css`.

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

1. **Instalar react-bootstrap** (`npm install react-bootstrap`) y usar sus componentes: `Container`, `Row`, `Col`, `Navbar`, `Nav`, `Form`, `Button`, `Table`, `Card`, `Badge`. *(Materia 2.1)*
2. **Datos simulados** (`src/data/mockData.js`): candidatos, solicitudes, evaluaciones, cargos, familias de cargo y responsables. Solo datos ficticios.
3. **Manejo de datos con props, `useState` y localStorage:** el estado de candidatos y solicitudes vive en `App.jsx` con `useState`, se pasa a las páginas por **props** (flujo unidireccional, de padre a hijo) y se guarda en **localStorage** para que no se pierda al recargar. *(Materia 2.1 y 2.2)*
4. **Vistas obligatorias:**
   - Dashboard con indicadores (total de candidatos, pendientes, en proceso, finalizadas).
   - Listado de candidatos.
   - Formulario de registro y edición de candidato.
   - Listado de solicitudes con filtros (estado, cargo, candidato, fecha).
   - Formulario de nueva solicitud.
   - Detalle de solicitud con **`useParams`** (ruta `/solicitudes/:id`). *(Materia 2.2)*
   - Sección para registrar o actualizar la evaluación (fecha, observaciones, estado).
5. **Login simple con roles simulados y rutas protegidas:** Analista, Evaluador y Jefatura (solo lectura). *(Materia 2.2: protección de rutas)*
6. **Formularios controlados con validación:** cada campo con `useState` y `onChange`, validación en `handleSubmit` y mensaje de error visible (`{error && <p className="text-danger">...}`), indicando qué campos están vacíos. Opcional: react-hook-form. *(Materia 1.3 y 2.2.2)*
7. **Componentes reutilizables con props** organizados con **Atomic Design** (ver sección 5). *(Materia 2.2)*
8. **Diseño responsive** con la grilla de Bootstrap (`Col xs/md/lg`), siguiendo el enfoque *Mobile First*. *(Materia 1.2.6)*
9. **Pruebas unitarias con Jasmine + Karma:** 10 pruebas como mínimo, con mocks y reporte de cobertura (`karma-coverage`). *(Exigido por la rúbrica; ver sección 6)*
10. **Documentos:** ERS (versión final) y documento de cobertura de testing.

Estados de una solicitud: **Pendiente → En proceso → Finalizada**.

---

## 4. División de tareas

### Primer día – Trabajo conjunto
- [ ] Corregir el import del logo y limpiar el CSS de la plantilla
- [ ] Instalar react-bootstrap y migrar la Navbar a sus componentes
- [ ] Definir el modelo de datos y crear `src/data/mockData.js`
- [ ] Dejar en `App.jsx` el estado con `useState` + localStorage y pasarlo por props
- [ ] Crear la estructura de carpetas Atomic Design
- [ ] Configurar Karma + Jasmine con una primera prueba funcionando
- [ ] Crear las ramas de trabajo en Git

### Vicente Barrera – Candidatos, Dashboard y Acceso

**Frontend**
- [ ] Login con roles simulados y rutas protegidas
- [ ] Listado de candidatos con búsqueda (`Table` de react-bootstrap)
- [ ] Formulario controlado de crear/editar candidato con validaciones (campos obligatorios, email, teléfono)
- [ ] Dashboard con la molécula `TarjetaIndicador` (recibe props)
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
- [ ] Formulario controlado de nueva solicitud (candidato, cargo, familia de cargo, fecha, responsable)
- [ ] Detalle de solicitud con `useParams` (ruta `/solicitudes/:id`)
- [ ] Sección de evaluación: fecha, observaciones y cambio de estado
- [ ] Átomo `BadgeEstado` (color según el estado recibido por props)

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

> El despliegue que enseña la materia es en **AWS EC2** (guías 2.1.2 y 2.2.2). La tecnología de backend y base de datos se definirá cuando se entregue el material correspondiente.

---

## 5. Estructura de carpetas (Atomic Design)

Basada en la metodología **Atomic Design** vista en la materia 2.2:

```
proyectoAquaChile/src/
├── assets/             # Imágenes (logo)
├── components/
│   ├── atoms/          # Elementos básicos: BadgeEstado, Boton, CampoTexto, MensajeError
│   ├── molecules/      # Combinaciones simples: TarjetaIndicador, BarraBusqueda, FiltroEstado
│   ├── organisms/      # Componentes complejos: Navbar, TablaCandidatos, TablaSolicitudes,
│   │                   #   FormularioCandidato, FormularioSolicitud, FormularioEvaluacion
│   └── templates/      # Estructura de página: LayoutPrincipal (Navbar + Container)
├── pages/              # Vistas finales: Login, Dashboard, Candidatos, Solicitudes, DetalleSolicitud
├── data/               # Datos simulados (mockData.js)
└── utils/              # Funciones de validación, filtrado y localStorage
```

Las pruebas Jasmine se ubican junto al componente que prueban (`BadgeEstado.spec.jsx`) o en una carpeta `src/tests/`, según quede la configuración de Karma.

---

## 6. Contenido usado fuera de la materia

Lo siguiente **no aparece** en la carpeta `materia/`, pero se necesita para cumplir con la rúbrica o con el proyecto:

| Elemento | Motivo |
|---|---|
| **Jasmine + Karma, mocks y cobertura** | La rúbrica de la Evaluación Parcial 2 los exige por nombre, pero la materia aún no tiene material de testing. Conviene preguntarle al profesor si entregará una guía. |
| **Configuración de Karma con Vite** | La materia usa create-react-app; el proyecto usa Vite y Karma no viene preparado para Vite, así que necesita una configuración aparte. |
| **Vite** (en vez de create-react-app) | El proyecto ya se creó con Vite. Cambia solo el comando de inicio (`npm run dev` en vez de `npm start`). |

---

## 7. Forma de trabajo con Git

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
5. Abrir un Pull Request hacia `main`; el otro integrante lo revisa antes de hacer merge. Si hay conflictos, se resuelven antes de juntar los cambios. *(Materia 1.3.3)*
6. No modificar archivos del módulo del compañero sin avisar. Los archivos compartidos (`mockData.js`, `App.jsx`, `utils/`) se cambian de común acuerdo.

---

## 8. Ejecutar el proyecto

```bash
cd proyectoAquaChile
npm install
npm run dev
```

---

## 9. Reglas del caso

- Usar **solo datos ficticios**: nada de nombres, RUT, correos ni antecedentes reales.
- No publicar información interna de AquaChile.
- No usar servicios de pago ni credenciales corporativas.
- Arquitectura monolítica: frontend React + backend + base de datos, sin microservicios.
