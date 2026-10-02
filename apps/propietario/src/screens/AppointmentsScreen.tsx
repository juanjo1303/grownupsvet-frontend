import { useEffect, useState, type FormEvent } from "react";
import { CalendarDays, Cat, Dog, Plus, X } from "lucide-react";
import { Button } from "@ui/button";
import { ListState } from "@propietario/components/ListState";

type Appointment = {
  id: number;
  pet: string;
  doctor: string;
  date: string;
  status: "Confirmada" | "Solicitada" | "Cancelada";
};
const initialAppointments: Appointment[] = [
  {
    id: 1,
    pet: "Firulais",
    doctor: "Dra. Ana Torres",
    date: "Mie 23 sep, 10:00 a.m.",
    status: "Confirmada",
  },
  {
    id: 2,
    pet: "Michi",
    doctor: "Por confirmar",
    date: "Vie 25 sep, 3:30 p.m.",
    status: "Solicitada",
  },
  {
    id: 3,
    pet: "Firulais",
    doctor: "Dra. Ana Torres",
    date: "Lun 14 sep, 9:00 a.m.",
    status: "Cancelada",
  },
];

export function AppointmentsScreen({ active }: { active: boolean }) {
  const [appointments, setAppointments] = useState(initialAppointments);
  const [filter, setFilter] = useState<"upcoming" | "history">("upcoming");
  const [loading, setLoading] = useState(true);
  const [offline, setOffline] = useState(false);
  const [adding, setAdding] = useState(false);
  const [pet, setPet] = useState("Firulais");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");

  useEffect(() => {
    const timer = window.setTimeout(() => setLoading(false), 650);
    const updateConnection = () => setOffline(!navigator.onLine);
    updateConnection();
    window.addEventListener("online", updateConnection);
    window.addEventListener("offline", updateConnection);
    return () => {
      window.clearTimeout(timer);
      window.removeEventListener("online", updateConnection);
      window.removeEventListener("offline", updateConnection);
    };
  }, []);
  const retry = () => {
    setLoading(true);
    window.setTimeout(() => {
      setOffline(!navigator.onLine);
      setLoading(false);
    }, 650);
  };
  const visible = appointments.filter(
    (item) => (filter === "history") === (item.status === "Cancelada"),
  );
  const submit = (event: FormEvent) => {
    event.preventDefault();
    if (!date || !time) return;
    const formatted = new Intl.DateTimeFormat("es-CO", {
      weekday: "short",
      day: "numeric",
      month: "short",
    }).format(new Date(`${date}T12:00:00`));
    setAppointments((current) => [
      {
        id: Date.now(),
        pet,
        doctor: "Por confirmar",
        date: `${formatted}, ${time}`,
        status: "Solicitada",
      },
      ...current,
    ]);
    setFilter("upcoming");
    setAdding(false);
    setDate("");
    setTime("");
  };

  return (
    <div
      className={`${active ? "flex" : "hidden"} min-h-0 flex-1 flex-col overflow-y-auto px-6 pb-6 pt-8`}
    >
      <div className="flex min-h-14 items-center justify-between gap-3">
        <h1 className="text-3xl font-bold">Mis citas</h1>
        <Button
          type="button"
          size="icon"
          onClick={() => setAdding(true)}
          disabled={loading || offline}
          aria-label="Solicitar cita"
          title="Solicitar cita"
          className="size-14 shrink-0 rounded-full bg-foreground text-background hover:bg-foreground/90"
        >
          <Plus className="!size-7" />
        </Button>
      </div>
      {loading ? (
        <ListState
          kind="appointments"
          state="loading"
          onAdd={() => setAdding(true)}
          onRetry={retry}
        />
      ) : offline ? (
        <ListState
          kind="appointments"
          state="error"
          onAdd={() => setAdding(true)}
          onRetry={retry}
        />
      ) : (
        <>
          {appointments.length > 0 && (
            <div
              className="mt-7 flex gap-2"
              role="tablist"
              aria-label="Filtrar citas"
            >
              {(["upcoming", "history"] as const).map((value) => (
                <Button
                  key={value}
                  type="button"
                  role="tab"
                  aria-selected={filter === value}
                  onClick={() => setFilter(value)}
                  className={`min-h-12 rounded-full px-5 text-base font-semibold ${filter === value ? "bg-foreground text-background hover:bg-foreground/90" : "bg-surface text-muted-foreground hover:bg-surface/80"}`}
                >
                  {value === "upcoming" ? "Próximas" : "Historial"}
                </Button>
              ))}
            </div>
          )}
          {visible.length === 0 ? (
            filter === "upcoming" ? (
              <ListState
                kind="appointments"
                state="empty"
                onAdd={() => setAdding(true)}
                onRetry={retry}
              />
            ) : (
              <p className="mt-16 text-center text-lg text-muted-foreground">
                No tienes citas en el historial.
              </p>
            )
          ) : (
            <div className="mt-6 space-y-4">
              {visible.map((item) => {
                const Icon = item.pet === "Michi" ? Cat : Dog;
                return (
                  <div
                    key={item.id}
                    className={`rounded-lg bg-surface p-4 ${item.status === "Cancelada" ? "opacity-60" : ""}`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex size-12 shrink-0 items-center justify-center rounded-full bg-avatar text-brand">
                        <Icon className="size-7" aria-hidden />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="break-words text-lg font-bold">
                          {item.pet}
                        </p>
                        <p className="text-base leading-tight text-muted-foreground">
                          {item.doctor}
                        </p>
                      </div>
                      <span
                        className={`shrink-0 rounded-full px-2 py-1 text-xs font-bold ${item.status === "Confirmada" ? "bg-success-surface text-success" : item.status === "Solicitada" ? "bg-warning-surface text-warning" : "bg-app text-muted-foreground"}`}
                      >
                        {item.status}
                      </span>
                    </div>
                    <div className="mt-4 flex items-center gap-2 border-t border-border pt-3 text-base font-semibold text-muted-foreground">
                      <CalendarDays className="size-5 shrink-0" aria-hidden />
                      <span>{item.date}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </>
      )}
      {adding && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 p-4">
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="add-appointment-title"
            className="w-full max-w-sm rounded-lg border border-border bg-app p-6 shadow-2xl"
          >
            <div className="flex items-center justify-between">
              <h2 id="add-appointment-title" className="text-2xl font-bold">
                Solicitar cita
              </h2>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                aria-label="Cerrar"
                onClick={() => setAdding(false)}
              >
                <X />
              </Button>
            </div>
            <form onSubmit={submit} className="mt-5 space-y-4">
              <label className="block text-base">
                Mascota
                <select
                  value={pet}
                  onChange={(e) => setPet(e.target.value)}
                  className="mt-2 min-h-12 w-full rounded-lg border border-border bg-surface px-3 text-foreground"
                >
                  <option>Firulais</option>
                  <option>Michi</option>
                </select>
              </label>
              <label className="block text-base">
                Fecha
                <input
                  type="date"
                  required
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="mt-2 min-h-12 w-full rounded-lg border border-border bg-surface px-3 text-foreground"
                />
              </label>
              <label className="block text-base">
                Hora
                <input
                  type="time"
                  required
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  className="mt-2 min-h-12 w-full rounded-lg border border-border bg-surface px-3 text-foreground"
                />
              </label>
              <Button
                type="submit"
                className="min-h-12 w-full bg-foreground text-base text-background hover:bg-foreground/90"
              >
                Solicitar cita
              </Button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
