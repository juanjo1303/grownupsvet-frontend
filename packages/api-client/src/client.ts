export interface ApiClientConfig {
  baseUrl: string;
  getAccessToken?: () => string | undefined | Promise<string | undefined>;
}

export class ApiError extends Error {
  constructor(
    message: string,
    public readonly status: number,
    public readonly responseBody?: unknown,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

let config: ApiClientConfig | undefined;

export function configureApiClient(nextConfig: ApiClientConfig): void {
  const baseUrl = nextConfig.baseUrl.trim().replace(/\/+$/, "");
  if (!baseUrl) {
    throw new Error("The API base URL cannot be empty.");
  }
  config = { ...nextConfig, baseUrl };
}

export async function apiRequest<T>(
  path: string,
  init: RequestInit = {},
): Promise<T> {
  if (!config) {
    throw new Error(
      "Configure the API client with a base URL before making requests.",
    );
  }

  const token = await config.getAccessToken?.();
  const headers = new Headers(init.headers);
  if (init.body && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }
  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  const response = await fetch(
    `${config.baseUrl}/${path.replace(/^\/+/, "")}`,
    {
      ...init,
      headers,
    },
  );
  const responseText = await response.text();
  let body: unknown;
  if (responseText) {
    try {
      body = JSON.parse(responseText) as unknown;
    } catch {
      if (response.ok) {
        throw new ApiError(
          "The API returned an invalid JSON response.",
          response.status,
          responseText,
        );
      }
      body = responseText;
    }
  }

  if (!response.ok) {
    const message =
      typeof body === "object" &&
      body !== null &&
      "detail" in body &&
      typeof body.detail === "string"
        ? body.detail
        : `API request failed with status ${response.status}.`;
    throw new ApiError(message, response.status, body);
  }
  if (response.status === 204) {
    return undefined as T;
  }
  return body as T;
}
