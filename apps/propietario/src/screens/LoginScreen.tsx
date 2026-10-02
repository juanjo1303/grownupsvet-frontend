import { useState, type FormEvent } from "react";

interface LoginViewProps {
  onLogin: (email: string, password: string) => void;
  onForgotPassword: () => void;
  onCreateAccount: () => void;
}

const inputCls =
  "min-h-[52px] w-full rounded-xl border border-border bg-surface px-4 text-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-brand";

export function LoginScreen({
  onLogin,
  onForgotPassword,
  onCreateAccount,
}: LoginViewProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    onLogin(email, password);
  };

  return (
    <div className="flex flex-1 flex-col justify-center px-6 py-10">
      <h1 className="text-3xl font-bold leading-tight">
        Bienvenido a GrownupsVet
      </h1>
      <p className="mt-2 text-lg text-muted-foreground">
        Inicia sesión para cuidar a tus mascotas.
      </p>

      <form onSubmit={handleSubmit} className="mt-8 space-y-5">
        <div className="space-y-2">
          <label htmlFor="email" className="block text-lg font-medium">
            Correo electrónico
          </label>
          <input
            id="email"
            type="email"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="tu@correo.com"
            className={inputCls}
          />
        </div>
        <div className="space-y-2">
          <label htmlFor="password" className="block text-lg font-medium">
            Contraseña
          </label>
          <input
            id="password"
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={inputCls}
          />
        </div>
        <button
          type="submit"
          className="min-h-[56px] w-full rounded-xl bg-brand text-lg font-semibold text-background transition-opacity hover:opacity-90 focus:outline-none focus-visible:ring-2 focus-visible:ring-foreground"
        >
          Iniciar sesión
        </button>
      </form>

      <div className="mt-6 flex flex-col items-center gap-2">
        <button
          type="button"
          onClick={onForgotPassword}
          className="min-h-[44px] px-3 text-lg font-medium text-brand underline-offset-4 hover:underline"
        >
          ¿Olvidaste tu contraseña?
        </button>
        <button
          type="button"
          onClick={onCreateAccount}
          className="min-h-[44px] px-3 text-lg font-medium text-brand underline-offset-4 hover:underline"
        >
          Crear una cuenta nueva
        </button>
      </div>
    </div>
  );
}
