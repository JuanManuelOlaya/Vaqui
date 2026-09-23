"use server";

import { revalidatePath } from "next/cache";
import { esquemaDeuda } from "@/lib/validaciones";
import { exigirSesion } from "@/lib/sesion";
import * as repo from "./deudas.repo";

export type EstadoDeuda = { campos?: Record<string, string>; ok?: boolean };

export async function registrarDeuda(
  _estadoPrevio: EstadoDeuda,
  datosFormulario: FormData
): Promise<EstadoDeuda> {
  const { usuarioId } = await exigirSesion();

  const analisis = esquemaDeuda.safeParse({
    tercero: datosFormulario.get("tercero"),
    monto: datosFormulario.get("monto"),
    tipo: datosFormulario.get("tipo"),
    fechaLimite: datosFormulario.get("fechaLimite"),
  });

  if (!analisis.success) {
    const campos: Record<string, string> = {};
    for (const asunto of analisis.error.issues) campos[String(asunto.path[0])] = asunto.message;
    return { campos };
  }

  await repo.crear(usuarioId, analisis.data);
  revalidatePath("/deudas");
  return { ok: true };
}