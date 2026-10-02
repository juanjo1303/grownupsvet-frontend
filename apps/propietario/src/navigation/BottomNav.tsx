import { Calendar, PawPrint, User, type LucideIcon } from "lucide-react";

export type NavTab = "pets" | "appointments" | "profile";

const items: { id: NavTab; label: string; icon: LucideIcon }[] = [
  { id: "pets", label: "Mascotas", icon: PawPrint },
  { id: "appointments", label: "Citas", icon: Calendar },
  { id: "profile", label: "Perfil", icon: User },
];

interface BottomNavProps {
  active: NavTab;
  onSelect: (tab: NavTab) => void;
}

export function BottomNav({ active, onSelect }: BottomNavProps) {
  return (
    <nav
      aria-label="Navegación principal"
      className="border-t border-border bg-app"
    >
      <ul className="grid grid-cols-3">
        {items.map(({ id, label, icon: Icon }) => {
          const isActive = id === active;
          return (
            <li key={id}>
              <button
                type="button"
                onClick={() => onSelect(id)}
                aria-current={isActive ? "page" : undefined}
                className={`flex min-h-[68px] w-full flex-col items-center justify-center gap-1 text-base font-semibold focus:outline-none focus-visible:ring-2 focus-visible:ring-brand ${isActive ? "text-brand" : "text-muted-foreground"}`}
              >
                <Icon className="size-6" aria-hidden />
                {label}
              </button>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
