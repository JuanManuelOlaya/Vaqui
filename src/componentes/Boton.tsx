"use client";
import { useFormStatus } from "react-dom";

export function Boton({ children }: { children: React.ReactNode }) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="rounded-lg bg-chispa px-4 py-2.5 font-medium text-white
                 transition-opacity hover:opacity-90 disabled:opacity-60"
    >
      {pending ? "Un momento…" : children}
    </button>
  );
}
