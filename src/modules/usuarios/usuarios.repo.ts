import "server-only";
import { consultar, ejecutar } from "@/lib/db";

// OJO: los nombres de tabla y columnas deben coincidir con el script
// de base de datos del Líder de arquitectura. Si él usó plural
// (usuarios) o nombres distintos, se ajusta AQUÍ y en ningún otro lado.

export type FilaUsuario = {
  id: number;
  nombre: string;
  correo: string;
  hash_password: string;
};

export async function buscarPorCorreo(correo: string): Promise<FilaUsuario | null> {
  const filas = await consultar<FilaUsuario>(
    "SELECT id, nombre, correo, hash_password FROM usuario WHERE correo = ? LIMIT 1",
    [correo]
  );
  return filas[0] ?? null;
}

export async function crear(datos: {
  nombre: string;
  correo: string;
  hashPassword: string;
}): Promise<number> {
  const resultado = await ejecutar(
    "INSERT INTO usuario (nombre, correo, hash_password) VALUES (?, ?, ?)",
    [datos.nombre, datos.correo, datos.hashPassword]
  );
  return resultado.insertId;
}
