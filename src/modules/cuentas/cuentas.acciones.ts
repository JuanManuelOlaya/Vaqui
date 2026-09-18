"use server";

import { revalidatePath } from "next/cache";
import { esquemaCuenta } from "@/lib/validaciones";
import { exigirSesion } from "@/lib/sesion";
import * as repo from "./cuentas.repo";

export type EstadoCuenta = { campos?: Record<string, string>; ok?: boolean };

/** US1 — Crear una entidad/cuenta. */
export async function crearCuenta(
  _estadoPrevio: EstadoCuenta,
  datosFormulario: FormData
): Promise<EstadoCuenta> {
  // El usuarioId sale de la sesión. Si el formulario trajera un usuario_id,
  // se ignora: ese es exactamente el agujero que la regla de aislamiento evita.
  const { usuarioId } = await exigirSesion();

  const analisis = esquemaCuenta.safeParse({
    nombre: datosFormulario.get("nombre"),
    tipo: datosFormulario.get("tipo"),
    saldoInicial: datosFormulario.get("saldoInicial"),
  });

  if (!analisis.success) {
    const campos: Record<string, string> = {};
    for (const asunto of analisis.error.issues) campos[String(asunto.path[0])] = asunto.message;
    return { campos };
  }

  if (await repo.existeNombre(usuarioId, analisis.data.nombre)) {
    return { campos: { nombre: "Ya tienes una cuenta con ese nombre" } };
  }

  await repo.crear(usuarioId, analisis.data);
  revalidatePath("/cuentas");
  return { ok: true };
}
