import { NextResponse, type NextRequest } from "next/server";
import { jwtVerify } from "jose";

const RUTAS_PRIVADAS = ["/cuentas", "/resumen", "/deudas"];
const RUTAS_PUBLICAS = ["/ingresar", "/registro"];

export async function middleware(peticion: NextRequest) {
  const ruta = peticion.nextUrl.pathname;
  const token = peticion.cookies.get("vaqui_sesion")?.value;

  let haySesion = false;
  if (token) {
    try {
      await jwtVerify(token, new TextEncoder().encode(process.env.SESSION_SECRET));
      haySesion = true;
    } catch {
      haySesion = false;
    }
  }

  // Criterio de aceptación US7: ruta privada sin sesión redirige al inicio de sesión.
  if (RUTAS_PRIVADAS.some((r) => ruta.startsWith(r)) && !haySesion) {
    return NextResponse.redirect(new URL("/ingresar", peticion.url));
  }

  // Si ya inició sesión, no tiene sentido mostrarle el formulario otra vez.
  if (RUTAS_PUBLICAS.includes(ruta) && haySesion) {
    return NextResponse.redirect(new URL("/cuentas", peticion.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.svg).*)"],
};
