# Proyecto AquaChile

MVP web para gestionar evaluaciones psicolaborales (DSY1104 Full Stack II). Usa datos ficticios.

- `proyectoAquaChile/`: frontend con React, Vite y Bootstrap 5.
- `backendAquaChile/`: API REST con Express.
- MySQL: guarda candidatos y solicitudes.

## Cómo levantar el proyecto

Necesitas Node.js 18 o superior y Laragon. Usa tres pasos, cada uno en su propia terminal cuando corresponda:

1. **Base de datos:** abre Laragon y aprieta "Iniciar Todo". MySQL debe quedar activo en el puerto 3306.
2. **Backend:** crea la base de datos y los datos de prueba al iniciar.
   ```bash
   cd backendAquaChile
   npm install
   npm start
   ```
3. **Frontend:**
   ```bash
   cd proyectoAquaChile
   npm install
   npm run dev
   ```

Luego abre la dirección que indica la terminal, normalmente <http://localhost:5173>.

Si tu MySQL usa otra contraseña o puerto, copia `backendAquaChile/.env.example` como `.env` y ajusta los valores.

## Usuarios de prueba

El ingreso es simulado: eliges un usuario ficticio y su rol define qué puede hacer. No protege datos reales.

| Usuario | Rol | Puede |
| --- | --- | --- |
| Paula Reyes | Administrador | Crear y editar registros, evaluar, exportar JSON y resetear los datos |
| Sofía Lagos | Analista | Registrar candidatos y crear solicitudes |
| Juan Pérez, Camila Fuentes, Rodrigo Vera | Evaluador | Evaluar las solicitudes que tiene asignadas |
| Marta Díaz | Jefatura | Consultar en modo lectura |

Los postulantes usan el formulario público en `/rellenarNuevoFormulario`, sin ingresar al sistema.

## Pruebas

Desde `proyectoAquaChile`:

- `npm test`: ejecuta las pruebas unitarias con Vitest.
- `npm run coverage`: genera además el reporte de cobertura.

## Sistema de diseño

Las reglas de color, componentes y estructura están en [docs/DESIGN_SYSTEM.md](docs/DESIGN_SYSTEM.md).
