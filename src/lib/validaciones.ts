import { z } from "zod";

// ... (esquemas anteriores de registro, ingreso y cuenta)

export const esquemaPlanAhorro = z.object({
  nombreMeta: z.string().trim().min(2, "Escribe un nombre para la meta").max(100),
  montoObjetivo: z.coerce.number().min(1, "El objetivo debe ser mayor a 0").max(9_999_999_999),
  fechaLimite: z.string().min(1, "Selecciona una fecha límite"),
});

export const esquemaMovimiento = z.object({
  cuentaId: z.coerce.number().min(1, "Selecciona una cuenta"),
  categoriaId: z.coerce.number().min(1, "Selecciona una categoría"),
  monto: z.coerce.number().min(0.01, "El monto debe ser mayor a 0").max(9_999_999_999),
  tipo: z.enum(["ingreso", "gasto"]),
  descripcion: z.string().trim().max(255).optional(),
});

export const esquemaDeuda = z.object({
  tercero: z.string().trim().min(2, "Escribe el nombre de la persona").max(80),
  monto: z.coerce.number().min(0.01, "El monto debe ser mayor a 0").max(9_999_999_999),
  tipo: z.enum(["debo", "me_deben"]),
  fechaLimite: z.string().optional(),
});

export const esquemaAlerta = z.object({
  tipo: z.enum(["exceso_gasto", "saldo_bajo", "recordatorio_ahorro"]),
  umbral: z.coerce.number().min(0, "El umbral no puede ser negativo"),
});