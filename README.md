# VAQUI

Aplicación web para la gestión de finanzas personales de estudiantes universitarios.

## Estado: Sprint 1

| Historia | Qué cubre | Estado |
|---|---|---|
| TEC-1 | Modelo E-R, diagrama de clases y esquema de base de datos | Borrador listo, falta aprobación |
| TEC-2 | Estructura del proyecto | Listo |
| US8 | Registro con correo y contraseña | Implementado |
| US7 | Inicio de sesión y protección de rutas | Implementado |
| US1 | Listado de cuentas y monto disponible | Implementado |
| TEC-3 | Identidad visual y componentes base | Tokens aplicados, faltan pantallas maquetadas |

## Stack

TypeScript · Next.js 15 (App Router) · MySQL 8 · Tailwind CSS 4

Autenticación propia con `bcryptjs` y una cookie firmada con `jose`. No se usa una librería de autenticación externa: con cinco archivos el equipo puede explicar exactamente qué pasa en cada paso durante la sustentación, que es más difícil con un adaptador de terceros.

## Puesta en marcha

Ver `docs/estructura-proyecto.md`.

## Reglas que el equipo no rompe

1. **Aislamiento.** Toda consulta a una tabla con `usuario_id` lleva `usuario_id = ?` en el `WHERE`, y ese valor viene de la sesión. MySQL no tiene seguridad a nivel de fila: la regla la cumple el código o no la cumple nadie.
2. **SQL solo en `*.repo.ts`.** Nunca en una pantalla ni en una acción.
3. **Dinero en `DECIMAL`, jamás en `FLOAT`.**
4. **El saldo no se guarda, se calcula.** Una sola fuente de verdad.
5. **Nada se integra a `develop` sin Pull Request revisado.**

## Documentación

- `docs/modelo-datos.md` — modelo E-R, diagrama de clases y las decisiones detrás
- `docs/estructura-proyecto.md` — carpetas y cómo levantar el proyecto
