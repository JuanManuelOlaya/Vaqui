import "server-only";
import { consultar, ejecutar } from "@/lib/db";

export type FilaCuenta = {
  id: number;
  nombre: string;
  tipo: "efectivo" | "bancaria" | "billetera" | "ahorro";
  saldo_disponible: string; // DECIMAL llega como string
};

/**
 * REGLA DE AISLAMIENTO:
 * toda función de este archivo recibe usuarioId y lo usa en el WHERE.
 * El usuarioId sale siempre de la sesión, nunca de la URL ni del formulario.
 * MySQL no tiene seguridad a nivel de fila: esta regla la cumple el código.
 */

export async function listarPorUsuario(usuarioId: number): Promise<FilaCuenta[]> {
  // En el Sprint 1 no existe la tabla de movimientos, así que el saldo
  // disponible es el saldo inicial. En el Sprint 2 esta consulta suma los
  // movimientos y ninguna pantalla tiene que cambiar.
  return consultar<FilaCuenta>(
    `SELECT id, nombre, tipo, saldo_inicial AS saldo_disponible
       FROM cuenta
      WHERE usuario_id = ? AND archivada = FALSE
      ORDER BY creado_en ASC`,
    [usuarioId]
  );
}

export async function totalPorUsuario(usuarioId: number): Promise<string> {
  const filas = await consultar<{ total: string | null }>(
    `SELECT COALESCE(SUM(saldo_inicial), 0) AS total
       FROM cuenta
      WHERE usuario_id = ? AND archivada = FALSE`,
    [usuarioId]
  );
  return filas[0]?.total ?? "0.00";
}

export async function existeNombre(usuarioId: number, nombre: string): Promise<boolean> {
  const filas = await consultar<{ n: number }>(
    "SELECT COUNT(*) AS n FROM cuenta WHERE usuario_id = ? AND nombre = ?",
    [usuarioId, nombre]
  );
  return Number(filas[0]?.n ?? 0) > 0;
}

export async function crear(
  usuarioId: number,
  datos: { nombre: string; tipo: FilaCuenta["tipo"]; saldoInicial: number }
): Promise<void> {
  await ejecutar(
    "INSERT INTO cuenta (usuario_id, nombre, tipo, saldo_inicial) VALUES (?, ?, ?, ?)",
    [usuarioId, datos.nombre, datos.tipo, datos.saldoInicial]
  );
}
