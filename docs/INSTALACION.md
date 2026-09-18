# VAQUI · Puesta en marcha

## 1. Instalar dependencias

```bash
npm install
npm i mysql2 bcryptjs jose zod server-only
npm i -D @types/bcryptjs
```

## 2. Variables de entorno

Copiar `.env.example` como `.env.local` y llenarlo.

Generar el secreto de sesión:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

Verificar que `.gitignore` incluya `.env.local`.

## 3. Base de datos

Ejecutar el script del Líder de arquitectura en MySQL.

**Importante:** este código asume las tablas `usuario` y `cuenta` en singular,
con las columnas `hash_password`, `saldo_inicial`, `archivada` y `creado_en`.
Si el script oficial usa otros nombres, se ajustan únicamente estos archivos:

- `src/modules/usuarios/usuarios.repo.ts`
- `src/modules/cuentas/cuentas.repo.ts`

Ningún otro archivo toca la base de datos.

## 4. Arrancar

```bash
npm run dev
```

Si el puerto 3000 está ocupado: `npm run dev -- -p 3001`

## Reglas que el equipo no rompe

1. **Aislamiento.** Toda consulta a una tabla con `usuario_id` lleva
   `usuario_id = ?` en el `WHERE`, y ese valor viene de la sesión.
   MySQL no tiene seguridad a nivel de fila: la regla la cumple el código.
2. **SQL solo en `*.repo.ts`.** Nunca en una pantalla ni en una acción.
3. **Dinero en `DECIMAL`, jamás en `FLOAT`.**
4. **El saldo no se guarda, se calcula.** Una sola fuente de verdad.
5. **Nada se integra a `develop` sin Pull Request revisado.**

## Errores frecuentes

| Error | Causa |
|---|---|
| `ECONNREFUSED 3306` | MySQL no está corriendo |
| `Falta SESSION_SECRET` | El archivo se llama `.env` y no `.env.local` |
| `Unknown database 'vaqui'` | No se ejecutó el script de creación |
| `Table 'usuario' doesn't exist` | Los nombres del script no coinciden con los repos |
