"use server";

import { revalidatePath } from "next/cache";
import { esquemaMovimiento } from "@/lib/validaciones";
import { exigirSesion } from "@/lib/sesion";
import * as repo from "./movimientos.repo";

export type EstadoMovimiento = { campos?: Record<string, string>; ok?: boolean };

export async function registrarMovimiento(
  _estadoPrevio: EstadoMovimiento,
  datosFormulario: FormData
): Promise<EstadoMovimiento> {
  const { usuarioId } = await exigirSesion();

  const analisis = esquemaMovimiento.safeParse({
    cuentaId: datosFormulario.get("cuentaId"),
    categoriaId: datosFormulario.get("categoriaId"),
    monto: datosFormulario.get("monto"),
    tipo: datosFormulario.get("tipo"),
    descripcion: datosFormulario.get("descripcion"),
  });

  if (!analisis.success) {
    const campos: Record<string, string> = {};
    for (const asunto of analisis.error.issues) campos[String(asunto.path[0])] = asunto.message;
    return { campos };
  }

  await repo.crear(usuarioId, analisis.data);
  revalidatePath("/movimientos");
  return { ok: true };
}
