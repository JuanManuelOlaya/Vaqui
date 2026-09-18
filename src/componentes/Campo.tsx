type Props = {
  etiqueta: string;
  nombre: string;
  tipo?: string;
  error?: string;
  ayuda?: string;
  defaultValue?: string;
};

export function Campo({ etiqueta, nombre, tipo = "text", error, ayuda, defaultValue }: Props) {
  const idAyuda = `${nombre}-ayuda`;
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={nombre} className="text-sm font-medium text-tinta">
        {etiqueta}
      </label>
      <input
        id={nombre}
        name={nombre}
        type={tipo}
        defaultValue={defaultValue}
        aria-invalid={Boolean(error)}
        aria-describedby={error || ayuda ? idAyuda : undefined}
        className={`rounded-lg border px-3 py-2.5 text-tinta transition-colors
          ${error ? "border-alerta" : "border-tinta/20 focus:border-chispa"}`}
      />
      {(error || ayuda) && (
        <p id={idAyuda} className={`text-sm ${error ? "text-alerta" : "text-tinta-suave"}`}>
          {error ?? ayuda}
        </p>
      )}
    </div>
  );
}
