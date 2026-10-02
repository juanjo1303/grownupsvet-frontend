import { useState, type FormEvent } from "react";
import { Camera, LogOut, Pencil, User, UserX } from "lucide-react";
import { Button } from "@ui/button";
import { Input } from "@ui/input";
import type { UserProfile } from "@api-client/types";

interface ProfileScreenProps {
  user: UserProfile;
  onEditPhoto: () => void;
  onEditPhone: (phone: string) => void;
  onLogout: () => void;
  onDeactivate: () => void;
}

function formatBirthDate(iso: string) {
  const d = new Date(iso + "T00:00:00");
  const months = [
    "ene",
    "feb",
    "mar",
    "abr",
    "may",
    "jun",
    "jul",
    "ago",
    "sep",
    "oct",
    "nov",
    "dic",
  ];
  return `${String(d.getDate()).padStart(2, "0")} ${months[d.getMonth()]} ${d.getFullYear()}`;
}

export function ProfileScreen({
  user,
  onEditPhoto,
  onEditPhone,
  onLogout,
  onDeactivate,
}: ProfileScreenProps) {
  const [editingPhone, setEditingPhone] = useState(false);
  const [phone, setPhone] = useState(user.phone);

  const savePhone = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const updatedPhone = phone.trim();
    if (!updatedPhone) return;
    onEditPhone(updatedPhone);
    setEditingPhone(false);
  };

  return (
    <div className="flex-1 overflow-y-auto px-6 pb-6 pt-8">
      <h1 className="text-3xl font-bold">Mi perfil</h1>

      <div className="mt-6 flex flex-col items-center">
        <div className="relative">
          <div className="flex size-36 items-center justify-center rounded-full bg-avatar">
            <User className="size-14 text-brand" strokeWidth={2} aria-hidden />
          </div>
          <button
            type="button"
            onClick={onEditPhoto}
            aria-label="Cambiar foto de perfil"
            className="absolute -bottom-1 -right-1 flex size-12 items-center justify-center rounded-full bg-foreground text-background shadow-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-brand"
          >
            <Camera className="size-5" />
          </button>
        </div>
        <p className="mt-5 text-2xl font-bold">{user.fullName}</p>
        <p className="mt-1 text-lg text-muted-foreground">{user.email}</p>
      </div>

      <div className="mt-6 rounded-2xl bg-surface px-5">
        <div className="flex items-center justify-between gap-3 py-5">
          <span className="text-lg text-muted-foreground">
            Fecha de nacimiento
          </span>
          <span className="text-lg font-bold">
            {formatBirthDate(user.birthDate)}
          </span>
        </div>
        <div className="h-px bg-border" />
        <div className="flex items-center justify-between gap-3 py-5">
          <div>
            <p className="text-lg text-muted-foreground">Teléfono</p>
            <p className="text-lg font-bold">{user.phone}</p>
          </div>
          <button
            type="button"
            onClick={() => {
              setPhone(user.phone);
              setEditingPhone(true);
            }}
            aria-label="Editar teléfono"
            className="flex min-h-[44px] min-w-[44px] items-center justify-center rounded-full text-brand hover:bg-background/40 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand"
          >
            <Pencil className="size-5" />
          </button>
        </div>
      </div>
      {editingPhone && (
        <form
          onSubmit={savePhone}
          className="mt-4 space-y-3 rounded-xl bg-surface p-4"
        >
          <label
            htmlFor="profile-phone"
            className="block text-base font-semibold"
          >
            Nuevo número de teléfono
          </label>
          <Input
            id="profile-phone"
            type="tel"
            autoComplete="tel"
            autoFocus
            required
            value={phone}
            onChange={(event) => setPhone(event.target.value)}
          />
          <div className="flex gap-3">
            <Button type="submit" size="lg" className="flex-1">
              Guardar
            </Button>
            <Button
              type="button"
              variant="outline"
              size="lg"
              className="flex-1"
              onClick={() => setEditingPhone(false)}
            >
              Cancelar
            </Button>
          </div>
        </form>
      )}

      <p className="mt-5 text-base text-muted-foreground">
        Solo el teléfono se puede editar. Los demás datos quedan fijos desde el
        registro.
      </p>

      <div className="mt-6 space-y-4">
        <button
          type="button"
          onClick={onLogout}
          className="flex min-h-[56px] w-full items-center justify-center gap-3 rounded-xl bg-surface text-lg font-semibold hover:opacity-90 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand"
        >
          <LogOut className="size-5" aria-hidden /> Cerrar sesión
        </button>
        <button
          type="button"
          onClick={onDeactivate}
          className="flex min-h-[56px] w-full items-center justify-center gap-3 rounded-xl border border-danger-border bg-transparent text-lg font-semibold text-danger hover:bg-danger-border/20 focus:outline-none focus-visible:ring-2 focus-visible:ring-danger"
        >
          <UserX className="size-5" aria-hidden /> Desactivar mi cuenta
        </button>
      </div>
    </div>
  );
}
