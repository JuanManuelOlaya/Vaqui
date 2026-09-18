"use client";

import { useActionState } from "react";
import Link from "next/link";
import { registrar } from "@/modules/usuarios/usuarios.acciones";
import { Campo } from "@/componentes/Campo";
import { Boton } from "@/componentes/Boton";

// US8 — Yo como usuario nuevo, deseo crear una cuenta con mi correo y contraseña.
export default function PaginaRegistro() {
  const [estado, accion] = useActionState(registrar, {});

  return (
    <main className="mx-auto flex min-h-dvh max-w-md flex-col justify-center px-6 py-12">
      <h1 className="text-3xl font-semibold">Crea tu cuenta</h1>
      <p className="mt-2 text-tinta-suave">Empieza a ver en qué se te va la plata.</p>

      <form action={accion} className="mt-8 flex flex-col gap-4">
        <Campo etiqueta="Nombre" nombre="nombre" error={estado.campos?.nombre} />
        <Campo etiqueta="Correo" nombre="correo" tipo="email" error={estado.campos?.correo} />
        <Campo
          etiqueta="Contraseña"
          nombre="password"
          tipo="password"
          error={estado.campos?.password}
          ayuda="Mínimo 8 caracteres"
        />
        <Boton>Crear cuenta</Boton>
      </form>

      <p className="mt-6 text-sm text-tinta-suave">
        ¿Ya tienes cuenta?{" "}
        <Link href="/ingresar" className="font-medium text-chispa underline">
          Inicia sesión
        </Link>
      </p>
    </main>
  );
}
