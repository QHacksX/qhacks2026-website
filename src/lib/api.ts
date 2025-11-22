import { useAuthStore } from "@/stores/auth";
import { useCaptchaStore } from "@/stores/captcha";
import { snakeToCamelCase, camelToSnakeCase } from "./utils";

const BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000/api";

export class HTTPError extends Error {
  constructor(
    public status: number,
    public message: string,
    public errors: { field: string; message: string }[] = [],
  ) {
    super(message);
    this.status = status;
    this.message = message;
    this.errors = errors;
  }

  isFormError(): boolean {
    return this.status === 422;
  }

  isRateLimitError(): boolean {
    return this.status === 429;
  }
}

export class CaptchaCancelledError extends Error {
  constructor() {
    super("Captcha cancelled");
  }
}

// Generic fetch function with error handling
export async function fetchApi<T>(
  endpoint: string,
  options: RequestInit = {},
): Promise<T> {
  const url = `${BASE_URL}${endpoint}`;
  const { token } = useAuthStore.getState();

  // Convert request body from camelCase to snake_case if it exists
  if (options.body && typeof options.body === "string") {
    try {
      const bodyObj = JSON.parse(options.body);
      options.body = JSON.stringify(camelToSnakeCase(bodyObj));
    } catch (e) {
      // Not JSON, leave as is
    }
  }

  const response = await fetch(url, {
    ...options,
    headers: {
      Authorization: token ?? "",
      "Content-Type": "application/json",
      "X-Client-Type": "website", // Differentiate from dashboard
      ...options.headers,
    },
  });

  if (response.headers.get("X-User-Flags") !== undefined) {
    // Lazily update user flags
    const flags = parseInt(response.headers.get("X-User-Flags") || "0", 10);
    useAuthStore.getState().updateFlags(flags);
  }

  if (!response.ok) {
    const errorData = await response.json();
    if (errorData.captcha_errors) {
      // Open captcha modal and wait for token
      try {
        const token = await new Promise<string>((resolve, reject) => {
          useCaptchaStore
            .getState()
            .open(errorData.captcha_sitekey, resolve, reject);
        });

        // Retry request with captcha token
        return fetchApi<T>(endpoint, {
          ...options,
          headers: {
            ...options.headers,
            "X-Captcha-Response": token,
          },
        });
      } catch (e) {
        if (e instanceof Error && e.message === "Captcha cancelled") {
          throw new CaptchaCancelledError();
        }
        throw e;
      }
    }

    const message = errorData.message || "An error occurred";
    const errors = Array.isArray(errorData.errors) ? errorData.errors : [];
    throw new HTTPError(response.status, message, errors);
  }

  if (response.status === 204) {
    return null as T;
  }

  // Convert response from snake_case to camelCase
  const data = await response.json();
  return snakeToCamelCase(data) as T;
}

export interface User {
  id: string;
  email: string;
  givenName: string;
  surname: string;
  flags: number;
  createdAt: string;
}

export enum UserFlags {
  VerifiedEmail = 1 << 0,
  Admin = 1 << 1,
  Staff = 1 << 2,
  Applied = 1 << 3,
  Accepted = 1 << 4,
}

export interface TokenResponse {
  token: string;
}

export interface LoginRequest {
  email: string;
  password: string;
  loginSource?: "website" | "dashboard";
}

export interface RegisterRequest {
  email: string;
  password: string;
  givenName: string;
  surname: string;
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface ResetPasswordRequest {
  token: string;
  newPassword: string;
}

export interface TokenRequest {
  token: string;
}

export interface OAuth2CodeExchangeRequest {
  code: string;
  redirectUri?: string;
}

export interface UpdateUserRequest {
  firstName?: string;
  surname?: string;
  password?: string;
  newPassword?: string;
}

export const authApi = {
  login: (data: LoginRequest) =>
    fetchApi<TokenResponse>("/auth/login", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  register: (data: RegisterRequest) =>
    fetchApi<TokenResponse>("/auth/register", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  logout: () => fetchApi<void>("/auth/logout", { method: "POST" }),
  verify: (data: TokenRequest) =>
    fetchApi<void>("/auth/verify", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  resendVerification: () =>
    fetchApi<void>("/auth/verify/resend-email", { method: "POST" }),
  forgotPassword: (data: ForgotPasswordRequest) =>
    fetchApi<void>("/auth/forgot", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  resetPassword: (data: ResetPasswordRequest) =>
    fetchApi<TokenResponse>("/auth/forgot/reset", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  trustIp: (data: TokenRequest) =>
    fetchApi<void>("/auth/trust-ip", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  githubCallback: (data: OAuth2CodeExchangeRequest) =>
    fetchApi<TokenResponse>("/auth/callback/github", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  googleCallback: (data: OAuth2CodeExchangeRequest) =>
    fetchApi<TokenResponse>("/auth/callback/google", {
      method: "POST",
      body: JSON.stringify(data),
    }),
};

export const userApi = {
  getMe: () => fetchApi<User>("/users/@me"),
  updateMe: (data: UpdateUserRequest) =>
    fetchApi<User>("/users/@me", {
      method: "PATCH",
      body: JSON.stringify(data),
    }),
};
