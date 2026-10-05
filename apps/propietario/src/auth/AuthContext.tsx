import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  configureApiClient,
  login as apiLogin,
  register as apiRegister,
  logout as apiLogout,
  type AuthenticatedUser,
  type LoginInput,
  type RegisterInput,
} from "@grownupsvet/api-client";
import { API_BASE_URL } from "../config";
import { clearAccessToken, getAccessToken, saveAccessToken } from "./session";

type AuthStatus = "checking" | "signedOut" | "signedIn";

interface AuthContextValue {
  status: AuthStatus;
  user: AuthenticatedUser | null;
  initializationError: string | null;
  retrySessionCheck: () => void;
  login: (input: LoginInput) => Promise<void>;
  register: (input: RegisterInput) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

configureApiClient({
  baseUrl: API_BASE_URL,
  getAccessToken: async () => (await getAccessToken()) ?? undefined,
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [status, setStatus] = useState<AuthStatus>("checking");
  const [user, setUser] = useState<AuthenticatedUser | null>(null);
  const [initializationError, setInitializationError] = useState<string | null>(
    null,
  );

  const checkSession = useCallback(async () => {
    setStatus("checking");
    setInitializationError(null);
    try {
      // The backend has no lightweight endpoint to validate a token on launch.
      // TODO: revisit this when a screen requires real user data (Phase 3+).
      const token = await getAccessToken();
      setStatus(token ? "signedIn" : "signedOut");
    } catch {
      setStatus("signedOut");
      setInitializationError(
        "No pudimos revisar tu sesión guardada. Intenta de nuevo.",
      );
    }
  }, []);

  useEffect(() => {
    void checkSession();
  }, [checkSession]);

  const login = useCallback(async (input: LoginInput) => {
    const response = await apiLogin(input);
    await saveAccessToken(response.accessToken);
    setUser(response.user);
    setStatus("signedIn");
  }, []);

  const register = useCallback(async (input: RegisterInput) => {
    await apiRegister(input);
  }, []);

  const logout = useCallback(async () => {
    try {
      await apiLogout();
    } finally {
      await clearAccessToken();
      setUser(null);
      setStatus("signedOut");
    }
  }, []);

  const value = useMemo(
    () => ({
      status,
      user,
      initializationError,
      retrySessionCheck: () => void checkSession(),
      login,
      register,
      logout,
    }),
    [status, user, initializationError, checkSession, login, register, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth debe usarse dentro de AuthProvider");
  }
  return context;
}
