import { apiRequest } from "./client";
import type { UserProfile } from "./types";

export interface LoginInput {
  email: string;
  password: string;
}

export interface RegisterInput extends LoginInput {
  fullName: string;
  birthDate: string;
  phone: string;
}

export interface SessionResponse {
  user: UserProfile;
  accessToken: string;
}

export function login(input: LoginInput): Promise<SessionResponse> {
  return apiRequest<SessionResponse>("/auth/sessions", {
    method: "POST",
    body: JSON.stringify(input),
  });
}

export function register(input: RegisterInput): Promise<UserProfile> {
  return apiRequest<UserProfile>("/auth/registrations", {
    method: "POST",
    body: JSON.stringify(input),
  });
}

export function logout(): Promise<void> {
  return apiRequest<void>("/auth/sessions/current", { method: "DELETE" });
}

export function requestPasswordRecovery(email: string): Promise<void> {
  return apiRequest<void>("/auth/password-recoveries", {
    method: "POST",
    body: JSON.stringify({ email }),
  });
}

export function verifyPasswordRecovery(
  recoveryId: string,
  code: string,
): Promise<void> {
  return apiRequest<void>(
    `/auth/password-recoveries/${encodeURIComponent(recoveryId)}/verifications`,
    {
      method: "POST",
      body: JSON.stringify({ code }),
    },
  );
}

export function resetPassword(input: {
  email: string;
  code: string;
  password: string;
}): Promise<void> {
  return apiRequest<void>("/auth/password-resets", {
    method: "POST",
    body: JSON.stringify(input),
  });
}
