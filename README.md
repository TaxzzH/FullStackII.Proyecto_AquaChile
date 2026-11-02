# PROYECTO AQUACHILE - REACT

## Instrucciones de Lanzamiento

Para inicializar el proyecto:
- Tener node.js instalado
- Abrir terminal
- Navegar a la carpeta correspondiente - ("cd .../proyectoAquaChile")
- Ejecutar comando: npm install (solo la primera vez)
- Ejecutar comando: npm run dev

## Usuarios de prueba

El ingreso es simulado: se elige un usuario ficticio y su rol define qué puede hacer.

| Usuario | Rol | Puede |
| --- | --- | --- |
| Paula Reyes | Administrador | Crear y editar registros, evaluar y resetear los datos de prueba |
| Sofía Lagos | Analista | Registrar candidatos y crear solicitudes |
| Juan Pérez, Camila Fuentes, Rodrigo Vera | Evaluador | Evaluar las solicitudes que tiene asignadas |
| Marta Díaz | Jefatura | Consultar en modo lectura |

## Pruebas

- npm test: ejecuta las pruebas unitarias con Vitest
- npm run coverage: genera el reporte de cobertura en la carpeta coverage

## Alcance

Frontend del MVP con datos ficticios guardados en el navegador. El backend y la base de datos corresponden a los siguientes hitos.