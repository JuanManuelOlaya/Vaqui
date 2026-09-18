import "server-only";
import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";

const NOMBRE_COOKIE = "vaqui_sesion";
const DURACION_DIAS = 7;

function clave() {
  const secreto = process.env.SESSION_SECRET;
  if (!secreto) throw new Error("Falta SESSION_SECRET en las variables de entorno");
  return new TextEncoder().encode(secreto);
}

export type Sesion = { usuarioId: number; nombre: string };

/** Crea la cookie de sesión tras un registro o un inicio de sesión correcto. */
export async function abrirSesion(sesion: Sesion) {
  const token = await new SignJWT({ ...sesion })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${DURACION_DIAS}d`)
    .sign(clave());

  const tarro = await cookies();
  tarro.set(NOMBRE_COOKIE, token, {
    httpOnly: true,                                // el JavaScript del navegador no la puede leer
    secure: process.env.NODE_ENV === "production", // solo por HTTPS en el entorno desplegado
    sameSite: "lax",                               // mitiga CSRF
    path: "/",
    maxAge: DURACION_DIAS * 24 * 60 * 60,
  });
}

/** Devuelve la sesión activa o null. Es la única fuente del usuarioId. */
export async function leerSesion(): Promise<Sesion | null> {
  const token = (await cookies()).get(NOMBRE_COOKIE)?.value;
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, clave());
    return { usuarioId: Number(payload.usuarioId), nombre: String(payload.nombre) };
  } catch {
    return null; // token vencido o manipulado
  }
}

/**
 * Igual que leerSesion pero lanza si no hay sesión.
 * Si esto falla, el código nunca llega a consultar la base sin usuarioId.
 */
export async function exigirSesion(): Promise<Sesion> {
  const sesion = await leerSesion();
  if (!sesion) throw new Error("No hay sesión activa");
  return sesion;
}

export async function cerrarSesion() {
  (await cookies()).delete(NOMBRE_COOKIE);
}
