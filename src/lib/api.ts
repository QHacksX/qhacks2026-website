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
    this.errors = errors.map((err) => {
      let field = err.field;

      // Handle array types (e.g. potential_teammates.0 -> potential_teammates)
      if (field.includes(".")) {
        const parts = field.split(".");
        // If the part after dot is a number, strip it
        if (!isNaN(Number(parts[parts.length - 1]))) {
          parts.pop();
          field = parts.join(".");
        }
      }

      // Convert snake_case to camelCase
      field = field.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());

      return { ...err, field };
    });
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
    } catch {
      // Not JSON, leave as is
    }
  }

  const headers: HeadersInit = {
    Authorization: token ?? "",
    "X-Client-Type": "website", // Differentiate from dashboard
    ...options.headers,
  };

  if (!(options.body instanceof FormData)) {
    (headers as Record<string, string>)["Content-Type"] = "application/json";
  }

  const response = await fetch(url, {
    ...options,
    headers,
  });

  if (response.headers.get("X-User-Flags") !== null) {
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

export function hasFlag(user: User | null | undefined, flag: UserFlags): boolean {
  if (!user) return false;
  return (user.flags & flag) === flag;
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

export enum ApplicationStatus {
  Pending = 0,
  Accepted = 1,
  Denied = 2,
}

export enum LevelOfStudy {
  HighSchool = 0,
  Undergraduate = 1,
  Graduate = 2,
  PostGraduate = 3,
  Other = 4,
}

export interface ApplicationQuestions {
  whyJoin: string;
  projectIdea: string;
  experience?: string;
}

export interface ApplicationCreatePayload {
  country: string;
  city: string;
  age: number;
  phone: string;
  levelOfStudy: LevelOfStudy;
  major?: string;
  school?: string;
  schoolEmail?: string | null;
  questions: ApplicationQuestions;
  potentialTeammates?: string[];
  githubUrl?: string;
  linkedinUrl?: string;
  personalUrl?: string;
  travelRequired: boolean;
  dietaryRestrictions?: string;
  shirtSize: "XS" | "S" | "M" | "L" | "XL";
  underrepresented: boolean;
  gender?: "M" | "F" | "NB";
  sexualIdentity?: string;
  pronouns?: string;
  ethnicity?: string;
}

export interface Application extends ApplicationCreatePayload {
  id: string;
  userId: string;
  status: ApplicationStatus;
  resumeUrl: string;
  createdAt: string;
  user?: User;
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

export const applicationApi = {
  listSchools: () => fetchApi<string[]>("/applications/schools"),
  getMe: () => fetchApi<Application>("/applications/@me"),
  create: (data: ApplicationCreatePayload, resume: File) => {
    const formData = new FormData();
    // Convert camelCase payload to snake_case for the backend
    const snakeCaseData = camelToSnakeCase(data);
    formData.append("payload_json", JSON.stringify(snakeCaseData));
    formData.append("resume", resume);

    return fetchApi<Application>("/applications", {
      method: "POST",
      body: formData,
    });
  },
};
