const formateadorPesos = new Intl.NumberFormat("es-CO", {
  style: "currency",
  currency: "COP",
  maximumFractionDigits: 0,
});

/** Los montos llegan de MySQL como string para no perder precisión. */
export function pesos(monto: string | number): string {
  return formateadorPesos.format(Number(monto));
}
