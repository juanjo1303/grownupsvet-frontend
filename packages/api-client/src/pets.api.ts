import { apiRequest } from "./client";
import type { Page, Pet, Sex, Species } from "./types";

export interface ListPetsParams {
  active?: boolean;
  page?: number;
  size?: number;
}

export interface CreatePetInput {
  name: string;
  species: Species;
  sex: Sex;
  breed?: string;
  birthDate?: string;
}

export type UpdatePetInput = Partial<CreatePetInput> & { archived?: boolean };

export async function listPets(
  params: ListPetsParams = {},
): Promise<Page<Pet>> {
  const query = new URLSearchParams();
  if (params.active !== undefined) query.set("active", String(params.active));
  if (params.page !== undefined) query.set("page", String(params.page));
  if (params.size !== undefined) query.set("size", String(params.size));
  const suffix = query.size ? `?${query.toString()}` : "";
  return apiRequest<Page<Pet>>(`/pets${suffix}`);
}

export function createPet(input: CreatePetInput): Promise<Pet> {
  return apiRequest<Pet>("/pets", {
    method: "POST",
    body: JSON.stringify(input),
  });
}

export function updatePet(petId: string, input: UpdatePetInput): Promise<Pet> {
  return apiRequest<Pet>(`/pets/${encodeURIComponent(petId)}`, {
    method: "PATCH",
    body: JSON.stringify(input),
  });
}

export function setPetArchived(petId: string, archived: boolean): Promise<Pet> {
  return updatePet(petId, { archived });
}
