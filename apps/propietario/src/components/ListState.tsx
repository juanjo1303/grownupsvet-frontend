import { CalendarDays, LoaderCircle, PawPrint, WifiOff } from "lucide-react";
import { Button } from "@ui/button";

interface ListStateProps {
  kind: "pets" | "appointments";
  state: "empty" | "loading" | "error";
  onAdd: () => void;
  onRetry: () => void;
}

export function ListState({ kind, state, onAdd, onRetry }: ListStateProps) {
  const pets = kind === "pets";
  if (state === "loading") {
    return (
      <div role="status" className="pt-20 text-center">
        <LoaderCircle
          className="mx-auto size-12 animate-spin text-foreground motion-reduce:animate-none"
          aria-hidden
        />
        <p className="mt-5 text-xl text-muted-foreground">
          Cargando tus {pets ? "mascotas" : "citas"}...
        </p>
        <div className="mt-9 space-y-4" aria-hidden>
          {[0, 1].map((item) => (
            <div
              key={item}
              className="flex h-28 items-center gap-4 rounded-lg bg-surface p-5 opacity-60"
            >
              <div className="size-16 shrink-0 rounded-full bg-app" />
              <div className="space-y-3">
                <div className="h-4 w-28 rounded bg-app" />
                <div className="h-4 w-20 rounded bg-app" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  const error = state === "error";
  const Icon = error ? WifiOff : pets ? PawPrint : CalendarDays;
  return (
    <div className="flex min-h-[560px] flex-col items-center justify-center pb-12 text-center">
      <div
        className={`flex size-32 items-center justify-center rounded-full ${error ? "bg-danger-border/40 text-danger" : "bg-avatar text-brand"}`}
      >
        <Icon className="size-14" strokeWidth={2.4} aria-hidden />
      </div>
      <h2 className="mt-8 text-2xl font-bold leading-tight">
        {error
          ? `No pudimos cargar tus ${pets ? "mascotas" : "citas"}`
          : pets
            ? "Aún no tienes mascotas"
            : "No tienes citas próximas"}
      </h2>
      <p className="mt-4 text-lg leading-relaxed text-muted-foreground">
        {error
          ? "Revisa tu conexión a internet e intenta de nuevo."
          : pets
            ? "Registra tu primera mascota para empezar a pedir citas y llevar su historia clínica."
            : "Cuando tu mascota necesite una consulta, solicita una cita aquí."}
      </p>
      <Button
        type="button"
        onClick={error ? onRetry : onAdd}
        className="mt-9 min-h-16 w-full whitespace-normal rounded-lg bg-foreground px-5 text-lg font-semibold leading-tight text-background hover:bg-foreground/90"
      >
        {error
          ? "Reintentar"
          : pets
            ? "Agregar mi primera mascota"
            : "Solicitar mi primera cita"}
      </Button>
    </div>
  );
}
