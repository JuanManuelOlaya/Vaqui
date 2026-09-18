"use client";

import { useActionState } from "react";
import Link from "next/link";
import { ingresar } from "@/modules/usuarios/usuarios.acciones";
import { Campo } from "@/componentes/Campo";
import { Boton } from "@/componentes/Boton";

// US7 — Yo como usuario nuevo, deseo iniciar sesión de forma segura.
export default function PaginaIngreso() {
  const [estado, accion] = useActionState(ingresar, {});

  return (
    <main className="mx-auto flex min-h-dvh max-w-md flex-col justify-center px-6 py-12">
      <h1 className="text-3xl font-semibold">Hola de nuevo</h1>

      <form action={accion} className="mt-8 flex flex-col gap-4">
        <Campo etiqueta="Correo" nombre="correo" tipo="email" />
        <Campo etiqueta="Contraseña" nombre="password" tipo="password" />

        {/* Mensaje genérico: no revela si falló el correo o la contraseña. */}
        {estado.error && (
          <p role="alert" className="text-sm text-alerta">
            {estado.error}
          </p>
        )}

        <Boton>Entrar</Boton>
      </form>

      <p className="mt-6 text-sm text-tinta-suave">
        ¿Es tu primera vez?{" "}
        <Link href="/registro" className="font-medium text-chispa underline">
          Crea tu cuenta
        </Link>
      </p>
    </main>
  );
}
