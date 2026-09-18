import { z } from "zod";

// Los criterios de aceptación del acta del Sprint 1 se traducen aquí.
// Si cambia un criterio, cambia este archivo y nada más.

export const esquemaRegistro = z.object({
  nombre: z.string().trim().min(2, "Escribe tu nombre").max(80),
  correo: z.string().trim().toLowerCase().email("Ese correo no es válido"),
  password: z.string().min(8, "La contraseña necesita al menos 8 caracteres").max(72),
});

export const esquemaIngreso = z.object({
  correo: z.string().trim().toLowerCase().email("Ese correo no es válido"),
  password: z.string().min(1, "Escribe tu contraseña"),
});

export const esquemaCuenta = z.object({
  nombre: z.string().trim().min(2, "Ponle un nombre a la cuenta").max(80),
  tipo: z.enum(["efectivo", "bancaria", "billetera", "ahorro"]),
  saldoInicial: z.coerce
    .number()
    .min(0, "El saldo no puede ser negativo")
    .max(9_999_999_999),
});
