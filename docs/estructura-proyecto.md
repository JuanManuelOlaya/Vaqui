# VAQUI · Estructura del proyecto

Documento de la tarea **TEC-2** del Sprint 1.

```
vaqui/
├── db/
│   ├── 01_schema_sprint1.sql     Tablas usuario y cuenta
│   └── 02_datos_prueba.sql       Solo desarrollo
├── docs/
│   ├── modelo-datos.md           TEC-1: E-R, clases y decisiones
│   └── estructura-proyecto.md    Este documento
└── src/
    ├── app/                      Rutas. Cada carpeta es una URL.
    │   ├── (publico)/            Sin sesión: /registro y /ingresar
    │   └── (privado)/            Con sesión: /cuentas
    ├── componentes/              Piezas de interfaz reutilizables
    ├── lib/                      Infraestructura compartida
    │   ├── db.ts                 Pool de MySQL
    │   ├── sesion.ts             Cookie firmada, única fuente del usuario_id
    │   ├── validaciones.ts       Criterios de aceptación en código
    │   └── formato.ts            Pesos colombianos
    ├── modules/                  Un módulo por entidad del negocio
    │   ├── usuarios/
    │   │   ├── usuarios.repo.ts      SQL. Solo aquí se toca la base de datos.
    │   │   └── usuarios.acciones.ts  Reglas de negocio. Lo que llaman las pantallas.
    │   └── cuentas/
    │       ├── cuentas.repo.ts
    │       └── cuentas.acciones.ts
    └── middleware.ts             Protege las rutas privadas
```

## Por qué está organizado así

**`modules/` refleja el modelo de datos, no las pantallas.** Cada entidad del modelo E-R tiene su carpeta. Cuando llegue el Sprint 2, se agregan `modules/transacciones/` y `modules/deudas/` sin tocar nada de lo anterior. Es la traducción directa de la decisión de arrancar por la base de datos.

**Dos archivos por módulo, con una frontera clara.**

- `*.repo.ts` es el único sitio donde se escribe SQL. Todas sus funciones reciben `usuarioId` y lo usan en el `WHERE`. Concentrar el SQL en un archivo hace que revisar la regla de aislamiento sea leer un archivo, no auditar todo el proyecto.
- `*.acciones.ts` valida, decide y llama al repositorio. Es lo único que las pantallas pueden importar.

Una pantalla nunca importa un `.repo.ts` directamente, salvo cuando solo lee datos para mostrarlos, como hace la página de cuentas.

**Los paréntesis en `(publico)` y `(privado)` son grupos de rutas de Next.js: organizan sin aparecer en la URL.** `/cuentas` es la dirección real, no `/privado/cuentas`.

**`lib/` es infraestructura, no negocio.** Si algo sabe qué es una cuenta o una deuda, va en `modules/`. Si sirve para cualquier módulo, va en `lib/`.

## Orden para levantar el proyecto

1. `npm install`
2. Copiar `.env.example` a `.env.local` y llenarlo
3. Generar el secreto: `openssl rand -base64 32`
4. Crear la base: `mysql -u root -p < db/01_schema_sprint1.sql`
5. Datos de prueba: `mysql -u root -p < db/02_datos_prueba.sql`
6. `npm run dev`

Usuario de prueba: `demo@vaqui.co` / `Vaqui2026`
