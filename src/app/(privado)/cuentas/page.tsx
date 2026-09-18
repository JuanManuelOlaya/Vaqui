import { exigirSesion } from "@/lib/sesion";
import { salir } from "@/modules/usuarios/usuarios.acciones";
import * as repo from "@/modules/cuentas/cuentas.repo";
import { pesos } from "@/lib/formato";
import { FormularioCuenta } from "@/componentes/FormularioCuenta";

// US1 — Visualizar mis entidades/cuentas y el monto disponible en cada una.
export default async function PaginaCuentas() {
  const sesion = await exigirSesion();
  const [cuentas, total] = await Promise.all([
    repo.listarPorUsuario(sesion.usuarioId),
    repo.totalPorUsuario(sesion.usuarioId),
  ]);

  return (
    <main className="mx-auto max-w-2xl px-6 py-10">
      <header className="flex items-start justify-between">
        <div>
          <p className="text-sm text-tinta-suave">Hola, {sesion.nombre}</p>
          <h1 className="mt-1 text-3xl font-semibold">Tus cuentas</h1>
        </div>
        <form action={salir}>
          <button className="text-sm text-tinta-suave underline">Salir</button>
        </form>
      </header>

      {/* El total consolidado es el dato que el usuario vino a ver: va primero y grande. */}
      <section className="mt-8 rounded-xl bg-tinta px-6 py-7 text-white">
        <p className="text-sm opacity-80">Tienes en total</p>
        <p className="mt-1 text-4xl font-semibold tabular-nums">{pesos(total)}</p>
      </section>

      {cuentas.length === 0 ? (
        // Estado vacío: una invitación a actuar, no un mensaje de error.
        <section className="mt-8 rounded-xl border border-dashed border-tinta/25 px-6 py-10 text-center">
          <p className="font-medium">Todavía no has registrado ninguna cuenta</p>
          <p className="mt-1 text-sm text-tinta-suave">
            Agrega tu efectivo, tu Nequi o tu cuenta del banco para empezar.
          </p>
        </section>
      ) : (
        <ul className="mt-8 divide-y divide-tinta/10">
          {cuentas.map((cuenta) => (
            <li key={cuenta.id} className="flex items-center justify-between py-4">
              <div>
                <p className="font-medium">{cuenta.nombre}</p>
                <p className="text-sm capitalize text-tinta-suave">{cuenta.tipo}</p>
              </div>
              <p className="tabular-nums">{pesos(cuenta.saldo_disponible)}</p>
            </li>
          ))}
        </ul>
      )}

      <section className="mt-12 rounded-xl bg-chispa-tenue p-6">
        <h2 className="text-lg font-semibold">Agregar una cuenta</h2>
        <div className="mt-4">
          <FormularioCuenta />
        </div>
      </section>
    </main>
  );
}
