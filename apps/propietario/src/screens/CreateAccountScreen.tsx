import { useState, type FormEvent } from "react";
import { Calendar } from "lucide-react";

interface CreateAccountViewProps {
  onBackToLogin: () => void;
}

const inputCls =
  "min-h-[56px] w-full rounded-full border border-border bg-surface px-5 text-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-brand";

const primaryBtnCls =
  "min-h-[56px] rounded-full bg-foreground px-8 text-lg font-semibold text-background transition-opacity hover:opacity-90 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand";

export function CreateAccountScreen({ onBackToLogin }: CreateAccountViewProps) {
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() || !email.trim()) {
      setError("Escribe tu nombre y tu correo electrónico.");
      return;
    }
    if (password.length < 15) {
      setError("La contraseña debe tener mínimo 15 caracteres.");
      return;
    }
    if (password !== confirm) {
      setError("Las contraseñas no coinciden.");
      return;
    }
    setError("");
    // TODO: integrar la creación de cuentas cuando la interfaz esté lista para conectarse.
    onBackToLogin();
  };

  return (
    <div className="flex flex-1 flex-col justify-center px-6 py-8">
      <h1 className="text-4xl font-bold leading-tight">
        Crear
        <br />
        cuenta
      </h1>

      <form
        onSubmit={handleSubmit}
        className="mt-8 grid grid-cols-2 gap-x-4 gap-y-5"
      >
        <div className="space-y-2">
          <label htmlFor="fullname" className="block text-base font-semibold">
            Nombre completo
          </label>
          <input
            id="fullname"
            type="text"
            autoComplete="name"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            placeholder="Como aparece en tu documento"
            className={inputCls}
          />
        </div>
        <div className="space-y-2">
          <label htmlFor="phone" className="block text-base font-semibold">
            Número de teléfono
          </label>
          <input
            id="phone"
            type="tel"
            autoComplete="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="Ejem: +57 300 1234567"
            className={inputCls}
          />
        </div>
        <div className="space-y-2">
          <label htmlFor="new-email" className="block text-base font-semibold">
            Correo electrónico
          </label>
          <input
            id="new-email"
            type="email"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="nombre@correo.com"
            className={inputCls}
          />
        </div>
        <div className="space-y-2">
          <label
            htmlFor="new-password"
            className="block text-base font-semibold"
          >
            Contraseña
          </label>
          <input
            id="new-password"
            type="password"
            autoComplete="new-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Mínimo 15 caracteres"
            className={inputCls}
          />
        </div>
        <div className="space-y-2">
          <label htmlFor="birthdate" className="block text-base font-semibold">
            Fecha de nacimiento
          </label>
          <div className="relative">
            <input
              id="birthdate"
              type="text"
              readOnly
              value={birthDate}
              onClick={(e) => (e.target as HTMLInputElement).showPicker?.()}
              placeholder="Seleccionar fecha"
              className={inputCls + " cursor-pointer pr-12"}
            />
            <Calendar
              aria-hidden="true"
              className="pointer-events-none absolute right-4 top-1/2 size-6 -translate-y-1/2 text-muted-foreground"
            />
          </div>
          <input
            type="date"
            aria-label="Fecha de nacimiento"
            value={birthDate}
            onChange={(e) => setBirthDate(e.target.value)}
            className="sr-only"
          />
        </div>
        <div className="space-y-2">
          <label
            htmlFor="confirm-password"
            className="block text-base font-semibold"
          >
            Confirmar contraseña
          </label>
          <input
            id="confirm-password"
            type="password"
            autoComplete="new-password"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            placeholder="Escríbela de nuevo"
            className={inputCls}
          />
        </div>

        <div className="col-span-2 flex justify-center pt-2">
          <button type="submit" className={primaryBtnCls}>
            Crear cuenta
          </button>
        </div>
      </form>

      {error && (
        <p className="mt-4 text-center text-base text-danger">{error}</p>
      )}

      <div className="mt-8 flex items-center justify-center gap-4">
        <span className="text-lg font-semibold">¿Ya tienes cuenta?</span>
        <button
          type="button"
          onClick={onBackToLogin}
          className="min-h-[52px] rounded-full bg-foreground px-7 text-lg font-semibold text-background transition-opacity hover:opacity-90 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand"
        >
          Inicia sesión
        </button>
      </div>
    </div>
  );
}
