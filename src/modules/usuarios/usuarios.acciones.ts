"use server";

import bcrypt from "bcryptjs";
import { redirect } from "next/navigation";
import { esquemaRegistro, esquemaIngreso } from "@/lib/validaciones";
import { abrirSesion, cerrarSesion } from "@/lib/sesion";
import * as repo from "./usuarios.repo";

export type EstadoFormulario = { error?: string; campos?: Record<string, string> };

/** US8 — Crear cuenta con correo y contraseña. */
export async function registrar(
  _estadoPrevio: EstadoFormulario,
  datosFormulario: FormData
): Promise<EstadoFormulario> {
  const analisis = esquemaRegistro.safeParse({
    nombre: datosFormulario.get("nombre"),
    correo: datosFormulario.get("correo"),
    password: datosFormulario.get("password"),
  });

  if (!analisis.success) {
    const campos: Record<string, string> = {};
    for (const asunto of analisis.error.issues) campos[String(asunto.path[0])] = asunto.message;
    return { campos };
  }

  const { nombre, correo, password } = analisis.data;

  // Criterio de aceptación: no permite registrar un correo ya existente.
  if (await repo.buscarPorCorreo(correo)) {
    return { campos: { correo: "Ya existe una cuenta con este correo" } };
  }

  // Coste 10: suficiente para el proyecto y rápido en equipos modestos.
  const hashPassword = await bcrypt.hash(password, 10);
  const usuarioId = await repo.crear({ nombre, correo, hashPassword });

  // Criterio de aceptación: al completar el registro el usuario queda autenticado.
  await abrirSesion({ usuarioId, nombre });
  redirect("/cuentas");
}

/** US7 — Iniciar sesión. */
export async function ingresar(
  _estadoPrevio: EstadoFormulario,
  datosFormulario: FormData
): Promise<EstadoFormulario> {
  const analisis = esquemaIngreso.safeParse({
    correo: datosFormulario.get("correo"),
    password: datosFormulario.get("password"),
  });

  if (!analisis.success) return { error: "Revisa el correo y la contraseña" };

  const usuario = await repo.buscarPorCorreo(analisis.data.correo);

  // Criterio de aceptación: mensaje genérico que no revela cuál campo falló.
  // Se compara el hash incluso si el usuario no existe, para que el tiempo
  // de respuesta no delate qué correos están registrados.
  const hashComparacion =
    usuario?.hash_password ??
    "$2a$10$invalidinvalidinvalidinvalidinvalidinvalidinvalidinvalidin";
  const coincide = await bcrypt.compare(analisis.data.password, hashComparacion);

  if (!usuario || !coincide) return { error: "Correo o contraseña incorrectos" };

  await abrirSesion({ usuarioId: usuario.id, nombre: usuario.nombre });
  redirect("/cuentas");
}

export async function salir() {
  await cerrarSesion();
  redirect("/ingresar");
}
