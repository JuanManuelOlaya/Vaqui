import { redirect } from "next/navigation";
import { leerSesion } from "@/lib/sesion";

export default async function Inicio() {
  const sesion = await leerSesion();
  redirect(sesion ? "/cuentas" : "/ingresar");
}
