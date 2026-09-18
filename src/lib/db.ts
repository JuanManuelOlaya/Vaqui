import "server-only";
import mysql from "mysql2/promise";
import type { ResultSetHeader } from "mysql2";

// Un solo pool para toda la aplicación.
// En desarrollo Next.js recarga los módulos en cada cambio, así que el pool
// se guarda en globalThis para no abrir conexiones nuevas cada vez.
const globalParaPool = globalThis as unknown as { poolVaqui?: mysql.Pool };

export const pool =
  globalParaPool.poolVaqui ??
  mysql.createPool({
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT ?? 3306),
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    // Devuelve DECIMAL como string en vez de number.
    // Es intencional: convertir a number pierde precisión en montos grandes.
    decimalNumbers: false,
  });

if (process.env.NODE_ENV !== "production") globalParaPool.poolVaqui = pool;

/** Para SELECT. Devuelve las filas. */
export async function consultar<T>(sql: string, parametros: unknown[] = []): Promise<T[]> {
  const [filas] = await pool.execute(sql, parametros);
  return filas as T[];
}

/** Para INSERT, UPDATE y DELETE. Devuelve insertId y affectedRows. */
export async function ejecutar(sql: string, parametros: unknown[] = []): Promise<ResultSetHeader> {
  const [resultado] = await pool.execute(sql, parametros);
  return resultado as ResultSetHeader;
}
