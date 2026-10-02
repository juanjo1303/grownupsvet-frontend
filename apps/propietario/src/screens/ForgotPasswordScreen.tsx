import { useState, type FormEvent } from "react";
import { ArrowLeft, Lock, Mail, ShieldCheck } from "lucide-react";

interface ForgotPasswordViewProps {
  onDone: () => void;
}

const inputCls =
  "min-h-[52px] w-full rounded-xl border border-border bg-surface px-4 text-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-brand";

const primaryBtnCls =
  "min-h-[56px] w-full rounded-xl bg-foreground text-lg font-semibold text-background transition-opacity hover:opacity-90 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand";

const stepLabelCls = "text-lg font-semibold text-muted-foreground";

const iconCircleCls =
  "flex size-16 items-center justify-center rounded-full bg-avatar text-brand";

export function ForgotPasswordScreen({ onDone }: ForgotPasswordViewProps) {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");

  const back = () => {
    setError("");
    if (step === 1) onDone();
    else setStep((s) => (s === 2 ? 1 : 2) as 1 | 2);
  };

  const submitStep1 = (e: FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      setError("Escribe tu correo electrónico.");
      return;
    }
    setError("");
    setStep(2);
  };

  const submitStep2 = (e: FormEvent) => {
    e.preventDefault();
    if (!/^\d{6}$/.test(code)) {
      setError("Escribe el código de 6 dígitos.");
      return;
    }
    setError("");
    setStep(3);
  };

  const submitStep3 = (e: FormEvent) => {
    e.preventDefault();
    if (password.length < 15) {
      setError("La contraseña debe tener mínimo 15 caracteres.");
      return;
    }
    if (password !== confirm) {
      setError("Las contraseñas no coinciden.");
      return;
    }
    setError("");
    onDone();
  };

  const header =
    step < 3 ? (
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={back}
          aria-label="Volver"
          className="flex size-12 items-center justify-center rounded-full bg-surface text-foreground transition-opacity hover:opacity-80 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand"
        >
          <ArrowLeft className="size-6" />
        </button>
        <span className={stepLabelCls}>Paso {step} de 3</span>
      </div>
    ) : (
      <span className={stepLabelCls}>Paso 3 de 3</span>
    );

  return (
    <div className="flex flex-1 flex-col px-6 py-8">
      {header}

      <div className="mt-8">
        {step === 1 && (
          <div className="flex size-16 items-center justify-center rounded-full bg-avatar text-brand">
            <Mail className="size-8" />
          </div>
        )}
        {step === 2 && (
          <div className="flex size-16 items-center justify-center rounded-full bg-avatar text-brand">
            <ShieldCheck className="size-8" />
          </div>
        )}
        {step === 3 && (
          <div className="flex size-16 items-center justify-center rounded-full bg-avatar text-brand">
            <Lock className="size-8" />
          </div>
        )}
      </div>

      {step === 1 && (
        <>
          <h1 className="mt-6 text-3xl font-bold leading-tight">
            Recupera tu contraseña
          </h1>
          <p className="mt-3 text-lg text-muted-foreground">
            Escribe el correo con el que te registraste. Te enviaremos un código
            para continuar.
          </p>
          <form onSubmit={submitStep1} className="mt-8 space-y-5">
            <div className="space-y-2">
              <label
                htmlFor="recovery-email"
                className="block text-lg font-semibold"
              >
                Correo electrónico
              </label>
              <input
                id="recovery-email"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="nombre@correo.com"
                className={inputCls}
              />
            </div>
            {error && <p className="text-base text-danger">{error}</p>}
            <button type="submit" className={primaryBtnCls}>
              Enviar código
            </button>
          </form>
        </>
      )}

      {step === 2 && (
        <>
          <h1 className="mt-6 text-3xl font-bold leading-tight">
            Ingresa el código
          </h1>
          <p className="mt-3 text-lg text-muted-foreground">
            Enviamos un código de 6 dígitos a {email || "nombre@correo.com"}.
          </p>
          <form onSubmit={submitStep2} className="mt-8 space-y-5">
            <div className="space-y-2">
              <label
                htmlFor="recovery-code"
                className="block text-lg font-semibold"
              >
                Código de verificación
              </label>
              <input
                id="recovery-code"
                inputMode="numeric"
                autoComplete="one-time-code"
                maxLength={6}
                value={code}
                onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))}
                placeholder="000000"
                className="min-h-[64px] w-full rounded-xl border border-border bg-surface text-center text-3xl font-semibold tracking-[0.4em] text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-brand"
              />
              <p className="text-base text-muted-foreground">
                El código vence en 10 minutos.
              </p>
            </div>
            {error && <p className="text-base text-danger">{error}</p>}
            <button type="submit" className={primaryBtnCls}>
              Verificar código
            </button>
          </form>
          <p className="mt-6 text-center text-lg text-muted-foreground">
            ¿No recibiste el código?{" "}
            <button
              type="button"
              onClick={() => setCode("")}
              className="text-lg font-medium text-brand underline underline-offset-4 hover:opacity-80"
            >
              Reenviar
            </button>
          </p>
        </>
      )}

      {step === 3 && (
        <>
          <h1 className="mt-6 text-3xl font-bold leading-tight">
            Crea tu nueva contraseña
          </h1>
          <p className="mt-3 text-lg text-muted-foreground">
            Mínimo 15 caracteres. Puedes usar espacios y frases largas, son más
            fáciles de recordar.
          </p>
          <form onSubmit={submitStep3} className="mt-8 space-y-5">
            <div className="space-y-2">
              <label
                htmlFor="new-password"
                className="block text-lg font-semibold"
              >
                Nueva contraseña
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
              <label
                htmlFor="confirm-password"
                className="block text-lg font-semibold"
              >
                Confirmar nueva contraseña
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
            {error && <p className="text-base text-danger">{error}</p>}
            <button type="submit" className={primaryBtnCls}>
              Guardar nueva contraseña
            </button>
          </form>
        </>
      )}
    </div>
  );
}
