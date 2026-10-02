import { apiRequest } from "./client";
import type { AvailabilitySlot, Page } from "./types";

export interface ListAvailabilitySlotsParams {
  from: string;
  to: string;
  veterinarianId?: string;
  page?: number;
  size?: number;
}

export function listAvailabilitySlots(
  params: ListAvailabilitySlotsParams,
): Promise<Page<AvailabilitySlot>> {
  const query = new URLSearchParams({
    from: params.from,
    to: params.to,
  });
  if (params.veterinarianId) query.set("veterinarianId", params.veterinarianId);
  if (params.page !== undefined) query.set("page", String(params.page));
  if (params.size !== undefined) query.set("size", String(params.size));
  return apiRequest<Page<AvailabilitySlot>>(
    `/availability-slots?${query.toString()}`,
  );
}
