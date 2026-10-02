export interface UserProfile {
  id: string;
  fullName: string;
  email: string;
  birthDate: string;
  phone: string;
}

export type Species = "DOG" | "CAT" | "OTHER";
export type Sex = "MALE" | "FEMALE" | "UNKNOWN";

export interface Pet {
  id: string;
  name: string;
  species: Species;
  sex: Sex;
  breed: string | null;
  birthDate: string | null;
  archived: boolean;
}

export type AppointmentStatus =
  "REQUESTED" | "CONFIRMED" | "REJECTED" | "CANCELLED";

export interface Appointment {
  id: string;
  petId: string;
  veterinarianId: string | null;
  availabilitySlotId: string | null;
  startsAt: string;
  endsAt: string;
  reason: string;
  status: AppointmentStatus;
}

export interface AppointmentEvent {
  id: string;
  appointmentId: string;
  type: string;
  occurredAt: string;
  description: string;
}

export interface AvailabilitySlot {
  id: string;
  veterinarianId: string;
  startsAt: string;
  endsAt: string;
  version: number;
}

export interface Page<T> {
  content: T[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
}

export type AppView =
  "login" | "forgot" | "create" | "pets" | "appointments" | "profile";
