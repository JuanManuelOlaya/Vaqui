import "server-only";
import { consultar, ejecutar } from "@/lib/db";

export type FilaDeuda = {
  id: number;
  tercero: string;
  monto: string;
  tipo: "debo" | "me_deben";
  fecha_limite: string | null;
  pagada: boolean;
};

export async function listarPorUsuario(usuarioId: number): Promise<FilaDeuda[]> {
  return consultar<FilaDeuda>(
    `SELECT id, tercero, monto, tipo, fecha_limite, pagada
       FROM deuda
      WHERE usuario_id = ?
      ORDER BY pagada ASC, fecha_limite ASC`,
    [usuarioId]
  );
}

export async function crear(
  usuarioId: number,
  datos: { tercero: string; monto: number; tipo: "debo" | "me_deben"; fechaLimite?: string }
): Promise<void> {
  await ejecutar(
    `INSERT INTO deuda (usuario_id, tercero, monto, tipo, fecha_limite)
     VALUES (?, ?, ?, ?, ?)`,
    [usuarioId, datos.tercero, datos.monto, datos.tipo, datos.fechaLimite || null]
  );
}