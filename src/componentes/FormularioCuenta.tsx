"use client";

import { useActionState, useEffect, useRef } from "react";
import { crearCuenta } from "@/modules/cuentas/cuentas.acciones";
import { Campo } from "./Campo";
import { Boton } from "./Boton";

export function FormularioCuenta() {
  const [estado, accion] = useActionState(crearCuenta, {});
  const formulario = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (estado.ok) formulario.current?.reset();
  }, [estado.ok]);

  return (
    <form ref={formulario} action={accion} className="flex flex-col gap-4">
      <Campo etiqueta="Nombre" nombre="nombre" error={estado.campos?.nombre} />

      <div className="flex flex-col gap-1.5">
        <label htmlFor="tipo" className="text-sm font-medium">Tipo</label>
        <select
          id="tipo"
          name="tipo"
          className="rounded-lg border border-tinta/20 px-3 py-2.5 focus:border-chispa"
        >
          <option value="efectivo">Efectivo</option>
          <option value="bancaria">Cuenta bancaria</option>
          <option value="billetera">Billetera digital</option>
          <option value="ahorro">Ahorro</option>
        </select>
      </div>

      <Campo
        etiqueta="Saldo inicial"
        nombre="saldoInicial"
        tipo="number"
        error={estado.campos?.saldoInicial}
        ayuda="Cuánto tienes ahí ahora mismo"
        defaultValue="0"
      />

      <Boton>Guardar cuenta</Boton>
    </form>
  );
}
