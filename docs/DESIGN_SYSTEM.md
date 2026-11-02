# Sistema de diseño AquaChile

Toda pantalla nueva debe armarse con estas piezas. Si falta algo, se agrega aquí y en el código, no como un caso suelto.

## Principios

- **Una sola fuente de color:** los colores viven en `src/styles/tokens.css`. Los componentes no escriben colores directamente.
- **El color comunica estado:** amarillo, azul, verde y rojo se reservan para los estados de una solicitud y los avisos.
- **Claro y oscuro:** cada token tiene los dos valores, y cambian con el atributo `data-bs-theme`.
- **Bootstrap como base:** se usa react-bootstrap y sus variables se redefinen en `src/styles/`.

## Tokens

| Token | Uso | Claro | Oscuro |
| --- | --- | --- | --- |
| `--aqua-acento` | Acción principal y enlaces. Viene del azul pizarra del logo | `#2f4a60` | `#8fbce8` |
| `--aqua-barra` | Barra de navegación | `#b0cef2` | `#1e293b` |
| `--aqua-fondo` | Fondo de la página | `#f4f7fa` | `#0f172a` |
| `--aqua-superficie` | Tarjetas, ventanas y campos | `#ffffff` | `#1e293b` |
| `--aqua-superficie-suave` | Encabezados de tabla y etiquetas | `#e9eff5` | `#273449` |
| `--aqua-borde` | Bordes | `#d5dfe8` | `#3a4a60` |
| `--aqua-texto` | Texto principal | `#1c2a36` | `#f1f5f9` |
| `--aqua-texto-suave` | Texto secundario | `#52636f` | `#a9b7c6` |

La tipografía usa las fuentes del sistema (`--aqua-fuente`), para que la demostración funcione sin conexión. Las esquinas usan `--aqua-radio` y las superficies `--aqua-sombra`.

## Estados de una solicitud

Cada estado tiene un token de fondo y uno de texto. Se aplican con `BadgeEstado` y con el `tono` de `TarjetaIndicador`.

| Estado | Tokens | Significado |
| --- | --- | --- |
| Pendiente | `--aqua-pendiente-*` | Aún no se inicia la evaluación |
| En proceso | `--aqua-proceso-*` | Evaluación en curso |
| Finalizada | `--aqua-finalizada-*` | Evaluación aprobada |
| Rechazada | `--aqua-rechazada-*` | Evaluación no aprobada |

## Botones

| Variante | Uso | Ejemplo |
| --- | --- | --- |
| `primary` | La acción principal de la vista | Guardar candidato |
| `outline-secondary` | Acciones secundarias | Cancelar, Exportar a Excel, Editar |
| `outline-danger` | Acciones destructivas | Resetear datos de prueba |

No se usan otras variantes, para que el color de un botón no se confunda con un estado.

## Componentes (Atomic Design)

| Nivel | Componente | Para qué sirve |
| --- | --- | --- |
| Átomo | `BadgeEstado` | Estado de una solicitud |
| Átomo (CSS) | `.etiqueta` | Datos de catálogo, como la familia de cargo |
| Molécula | `CampoFormulario` | Etiqueta, control y mensaje de error |
| Molécula | `TarjetaIndicador` | Indicador del dashboard |
| Molécula | `EstadoCarga` | Espera y error con reintento al pedir datos |
| Organismo | `FormularioCandidato`, `FormularioSolicitud`, `FormularioEvaluacion`, `FormularioIngreso` | Formularios con estado local y validación |
| Organismo | `FiltrosSolicitudes` | Filtros del listado |
| Plantilla | `PlantillaPagina` | Título, descripción, acciones y contenido de una página interna |

## Reglas de cada página

1. Usa `PlantillaPagina` y deja las acciones en su espacio. El dashboard, el ingreso y el formulario público tienen estructura propia.
2. Pide los datos con `useCarga` y muéstralos dentro de `EstadoCarga`.
3. Accede al backend solo mediante `services/api.js`.
4. Muestra las tablas con `<Table responsive hover className="tabla-aqua">` dentro de una `Card`.
5. Informa el resultado con `Alert`: `success` si funcionó y `danger` si falló, con un mensaje que explique qué hacer.
6. Oculta lo que el rol no puede hacer con `puede` o `puedeEvaluar`.

## Responsivo

Es Mobile First, con los puntos de quiebre de Bootstrap. Las páginas nunca se desplazan horizontalmente: una tabla ancha se desplaza dentro de su contenedor, y el menú colapsa bajo 992 px.
