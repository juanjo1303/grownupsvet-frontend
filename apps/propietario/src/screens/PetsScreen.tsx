import { useEffect, useState, type FormEvent } from "react";
import { Cat, ChevronRight, Dog, PawPrint, Plus, X } from "lucide-react";
import { Button } from "@ui/button";
import { ListState } from "@propietario/components/ListState";

type Pet = {
  id: number;
  name: string;
  species: "Perro" | "Gato";
  breed: string;
  age: string;
  archived: boolean;
};
const initialPets: Pet[] = [
  {
    id: 1,
    name: "Firulais",
    species: "Perro",
    breed: "Labrador",
    age: "3 años",
    archived: false,
  },
  {
    id: 2,
    name: "Michi",
    species: "Gato",
    breed: "Criollo",
    age: "1 año (estimada)",
    archived: false,
  },
  {
    id: 3,
    name: "Rocky",
    species: "Perro",
    breed: "",
    age: "",
    archived: true,
  },
];

export function PetsScreen({ active }: { active: boolean }) {
  const [pets, setPets] = useState(initialPets);
  const [filter, setFilter] = useState<"active" | "archived">("active");
  const [loading, setLoading] = useState(true);
  const [offline, setOffline] = useState(false);
  const [adding, setAdding] = useState(false);
  const [name, setName] = useState("");
  const [species, setSpecies] = useState<"Perro" | "Gato">("Perro");
  const [breed, setBreed] = useState("");
  const [age, setAge] = useState("");
  const [selected, setSelected] = useState<number | null>(null);

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

  const visible = pets.filter(
    (pet) => pet.archived === (filter === "archived"),
  );
  const retry = () => {
    setLoading(true);
    window.setTimeout(() => {
      setOffline(!navigator.onLine);
      setLoading(false);
    }, 650);
  };
  const submit = (event: FormEvent) => {
    event.preventDefault();
    if (!name.trim()) return;
    setPets((current) => [
      ...current,
      {
        id: Date.now(),
        name: name.trim(),
        species,
        breed: breed.trim(),
        age: age.trim(),
        archived: false,
      },
    ]);
    setName("");
    setBreed("");
    setAge("");
    setFilter("active");
    setAdding(false);
  };
  const toggleArchive = (id: number) => {
    setPets((current) =>
      current.map((pet) =>
        pet.id === id ? { ...pet, archived: !pet.archived } : pet,
      ),
    );
    setSelected(null);
  };

  return (
    <div
      className={`${active ? "flex" : "hidden"} min-h-0 flex-1 flex-col overflow-y-auto px-6 pb-6 pt-8`}
    >
      <div className="flex min-h-14 items-center justify-between gap-3">
        <h1 className="text-3xl font-bold">Mis mascotas</h1>
        <Button
          type="button"
          size="icon"
          onClick={() => setAdding(true)}
          disabled={loading || offline}
          aria-label="Agregar mascota"
          title="Agregar mascota"
          className="size-14 shrink-0 rounded-full bg-foreground text-background hover:bg-foreground/90"
        >
          <Plus className="!size-7" />
        </Button>
      </div>
      {loading ? (
        <ListState
          kind="pets"
          state="loading"
          onAdd={() => setAdding(true)}
          onRetry={retry}
        />
      ) : offline ? (
        <ListState
          kind="pets"
          state="error"
          onAdd={() => setAdding(true)}
          onRetry={retry}
        />
      ) : (
        <>
          {pets.length > 0 && (
            <div
              className="mt-7 flex gap-2"
              role="tablist"
              aria-label="Filtrar mascotas"
            >
              {(["active", "archived"] as const).map((value) => (
                <Button
                  key={value}
                  type="button"
                  role="tab"
                  aria-selected={filter === value}
                  onClick={() => setFilter(value)}
                  className={`min-h-12 rounded-full px-5 text-base font-semibold ${filter === value ? "bg-foreground text-background hover:bg-foreground/90" : "bg-surface text-muted-foreground hover:bg-surface/80"}`}
                >
                  {value === "active" ? "Activas" : "Archivadas"}
                </Button>
              ))}
            </div>
          )}
          {visible.length === 0 ? (
            filter === "active" ? (
              <ListState
                kind="pets"
                state="empty"
                onAdd={() => setAdding(true)}
                onRetry={retry}
              />
            ) : (
              <p className="mt-16 text-center text-lg text-muted-foreground">
                No tienes mascotas archivadas.
              </p>
            )
          ) : (
            <div className="mt-6 space-y-4">
              {visible.map((pet) => {
                const Icon = pet.species === "Gato" ? Cat : Dog;
                return (
                  <div
                    key={pet.id}
                    className={`flex min-h-28 items-center gap-4 rounded-lg bg-surface p-4 ${pet.archived ? "opacity-65" : ""}`}
                  >
                    <div className="flex size-16 shrink-0 items-center justify-center rounded-full bg-avatar text-brand">
                      <Icon className="size-8" aria-hidden />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="break-words text-xl font-bold">
                        {pet.name}
                      </p>
                      <p className="mt-1 text-base leading-snug text-muted-foreground">
                        {pet.archived
                          ? "Archivada"
                          : [pet.species, pet.breed, pet.age]
                              .filter(Boolean)
                              .join(" · ")}
                      </p>
                    </div>
                    {pet.archived ? (
                      <Button
                        type="button"
                        variant="ghost"
                        onClick={() => toggleArchive(pet.id)}
                        className="px-1 text-sm font-semibold text-brand hover:text-brand"
                      >
                        Reactivar
                      </Button>
                    ) : (
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        aria-label={`Ver ${pet.name}`}
                        title={`Ver ${pet.name}`}
                        onClick={() => setSelected(pet.id)}
                        className="size-10 shrink-0 text-muted-foreground"
                      >
                        <ChevronRight className="!size-6" />
                      </Button>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </>
      )}
      {adding && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 p-4"
          role="presentation"
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="add-pet-title"
            className="w-full max-w-sm rounded-lg border border-border bg-app p-6 shadow-2xl"
          >
            <div className="flex items-center justify-between">
              <h2 id="add-pet-title" className="text-2xl font-bold">
                Agregar mascota
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
                Nombre
                <input
                  required
                  autoFocus
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="mt-2 min-h-12 w-full rounded-lg border border-border bg-surface px-3 text-foreground"
                />
              </label>
              <label className="block text-base">
                Tipo
                <select
                  value={species}
                  onChange={(e) =>
                    setSpecies(e.target.value as "Perro" | "Gato")
                  }
                  className="mt-2 min-h-12 w-full rounded-lg border border-border bg-surface px-3 text-foreground"
                >
                  <option>Perro</option>
                  <option>Gato</option>
                </select>
              </label>
              <label className="block text-base">
                Raza
                <input
                  value={breed}
                  onChange={(e) => setBreed(e.target.value)}
                  className="mt-2 min-h-12 w-full rounded-lg border border-border bg-surface px-3 text-foreground"
                />
              </label>
              <label className="block text-base">
                Edad
                <input
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                  placeholder="Ej. 3 años"
                  className="mt-2 min-h-12 w-full rounded-lg border border-border bg-surface px-3 text-foreground"
                />
              </label>
              <Button
                type="submit"
                className="min-h-12 w-full bg-foreground text-base text-background hover:bg-foreground/90"
              >
                <PawPrint /> Guardar mascota
              </Button>
            </form>
          </div>
        </div>
      )}
      {selected !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 p-4">
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="pet-detail-title"
            className="w-full max-w-sm rounded-lg border border-border bg-app p-6 shadow-2xl"
          >
            <div className="flex items-center justify-between">
              <h2 id="pet-detail-title" className="text-2xl font-bold">
                {pets.find((pet) => pet.id === selected)?.name}
              </h2>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                aria-label="Cerrar"
                onClick={() => setSelected(null)}
              >
                <X />
              </Button>
            </div>
            <p className="mt-3 text-lg text-muted-foreground">
              {[
                pets.find((pet) => pet.id === selected)?.species,
                pets.find((pet) => pet.id === selected)?.breed,
                pets.find((pet) => pet.id === selected)?.age,
              ]
                .filter(Boolean)
                .join(" · ")}
            </p>
            <Button
              type="button"
              onClick={() => toggleArchive(selected)}
              className="mt-7 min-h-12 w-full bg-surface text-base text-foreground hover:bg-surface/80"
            >
              Archivar mascota
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
