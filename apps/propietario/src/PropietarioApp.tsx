import { useState } from "react";
import type { AppView, UserProfile } from "@api-client/types";
import { PawPrint } from "lucide-react";
import { AppointmentsScreen } from "@propietario/screens/AppointmentsScreen";
import { CreateAccountScreen } from "@propietario/screens/CreateAccountScreen";
import { ForgotPasswordScreen } from "@propietario/screens/ForgotPasswordScreen";
import { LoginScreen } from "@propietario/screens/LoginScreen";
import { PetsScreen } from "@propietario/screens/PetsScreen";
import { ProfileScreen } from "@propietario/screens/ProfileScreen";
import { BottomNav, type NavTab } from "@propietario/navigation/BottomNav";

export function PropietarioApp() {
  const [view, setView] = useState<AppView>("login");
  const [user, setUser] = useState<UserProfile | null>(null);
  const [activeTab, setActiveTab] = useState<NavTab>("pets");

  if (!user) {
    const loginContent =
      view === "create" ? (
        <CreateAccountScreen onBackToLogin={() => setView("login")} />
      ) : view === "forgot" ? (
        <ForgotPasswordScreen onDone={() => setView("login")} />
      ) : (
        <LoginScreen
          onLogin={(email) => {
            setUser({
              id: "demo-user",
              fullName: "Usuario GrownupsVet",
              email,
              role: "OWNER",
              active: true,
              dateOfBirth: "1980-01-01",
              phoneNumber: "",
              profilePhotoUrl: null,
            });
            setActiveTab("pets");
          }}
          onForgotPassword={() => setView("forgot")}
          onCreateAccount={() => setView("create")}
        />
      );

    return (
      <main className="mx-auto flex min-h-dvh w-full max-w-lg flex-col bg-app shadow-xl">
        <p
          role="status"
          className="bg-warning-surface px-5 py-3 text-center text-sm font-semibold text-warning"
        >
          Demostración: los datos y cambios son locales; esta app aún no se
          conecta al servidor.
        </p>
        {loginContent}
      </main>
    );
  }

  return (
    <main className="mx-auto flex min-h-dvh w-full max-w-lg flex-col bg-app shadow-xl">
      <header className="flex items-center gap-3 border-b border-border px-6 py-4">
        <PawPrint className="size-7 text-brand" aria-hidden="true" />
        <span className="text-lg font-bold">GrownupsVet</span>
      </header>
      <p
        role="status"
        className="bg-warning-surface px-5 py-3 text-center text-sm font-semibold text-warning"
      >
        Demostración: los datos y cambios son locales; esta app aún no se
        conecta al servidor.
      </p>
      {activeTab === "pets" && <PetsScreen active />}
      {activeTab === "appointments" && <AppointmentsScreen active />}
      {activeTab === "profile" && (
        <ProfileScreen
          user={user}
          onEditPhoto={() =>
            window.alert("La carga de foto todavía no está disponible.")
          }
          onEditPhone={(phone) =>
            setUser((current) =>
              current ? { ...current, phoneNumber: phone } : current,
            )
          }
          onLogout={() => {
            setUser(null);
            setView("login");
          }}
          onDeactivate={() => {
            if (
              window.confirm(
                "¿Quieres desactivar tu cuenta? Esta acción requiere confirmación.",
              )
            ) {
              setUser(null);
              setView("login");
            }
          }}
        />
      )}
      <BottomNav active={activeTab} onSelect={setActiveTab} />
    </main>
  );
}
