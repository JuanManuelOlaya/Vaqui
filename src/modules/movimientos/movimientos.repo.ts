import "server-only";
import { consultar, ejecutar } from "@/lib/db";

export type FilaMovimiento = {
  id: number;
  cuenta_id: number;
  categoria_id: number;
  monto: string;
  tipo: "ingreso" | "gasto";
  descripcion: string;
  fecha: string;
};

export async function listarPorUsuario(usuarioId: number): Promise<FilaMovimiento[]> {
  return consultar<FilaMovimiento>(
    `SELECT id, cuenta_id, categoria_id, monto, tipo, descripcion, fecha
       FROM movimiento
      WHERE usuario_id = ?
      ORDER BY fecha DESC`,
    [usuarioId]
  );
}

export async function crear(
  usuarioId: number,
  datos: { cuentaId: number; categoriaId: number; monto: number; tipo: "ingreso" | "gasto"; descripcion?: string }
): Promise<void> {
  await ejecutar(
    `INSERT INTO movimiento (usuario_id, cuenta_id, categoria_id, monto, tipo, descripcion)
     VALUES (?, ?, ?, ?, ?, ?)`,
    [usuarioId, datos.cuentaId, datos.categoriaId, datos.monto, datos.tipo, datos.descripcion ?? null]
  );
}
