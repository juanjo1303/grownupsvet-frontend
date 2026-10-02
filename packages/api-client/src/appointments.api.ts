import { apiRequest } from "./client";
import type {
  Appointment,
  AppointmentEvent,
  AppointmentStatus,
  Page,
} from "./types";

export interface ListAppointmentsParams {
  from?: string;
  to?: string;
  status?: AppointmentStatus;
  page?: number;
  size?: number;
}

export interface RequestAppointmentInput {
  clientRequestId: string;
  petId: string;
  availabilitySlotId: string;
  expectedAvailabilitySlotVersion: number;
  reason: string;
}

export async function listAppointments(
  params: ListAppointmentsParams = {},
): Promise<Page<Appointment>> {
  const query = new URLSearchParams();
  if (params.from) query.set("from", params.from);
  if (params.to) query.set("to", params.to);
  if (params.status) query.set("status", params.status);
  if (params.page !== undefined) query.set("page", String(params.page));
  if (params.size !== undefined) query.set("size", String(params.size));
  const suffix = query.size ? `?${query.toString()}` : "";
  return apiRequest<Page<Appointment>>(`/appointments${suffix}`);
}

export function requestAppointment(
  input: RequestAppointmentInput,
): Promise<Appointment> {
  return apiRequest<Appointment>("/appointments", {
    method: "POST",
    body: JSON.stringify(input),
  });
}

export function getAppointment(appointmentId: string): Promise<Appointment> {
  return apiRequest<Appointment>(
    `/appointments/${encodeURIComponent(appointmentId)}`,
  );
}

export function listAppointmentEvents(
  appointmentId: string,
): Promise<AppointmentEvent[]> {
  return apiRequest<AppointmentEvent[]>(
    `/appointments/${encodeURIComponent(appointmentId)}/events`,
  );
}

export function cancelAppointment(appointmentId: string): Promise<Appointment> {
  return apiRequest<Appointment>(
    `/appointments/${encodeURIComponent(appointmentId)}/cancellations`,
    { method: "POST" },
  );
}
