import type { MeUserDto } from "@/modules/users/app-user-profile.types";

export type ApiError = {
  code: string;
  details?: unknown;
  message: string;
};

export type ApiResponse<TData> =
  | {
      data: TData;
      error: null;
    }
  | {
      data: null;
      error: ApiError;
    };

export class SettingsClientError extends Error {
  code: string;

  constructor(message: string, code = "INTERNAL_ERROR") {
    super(message);
    this.name = "SettingsClientError";
    this.code = code;
  }
}

async function readApiResponse<TData>(
  response: Response,
): Promise<ApiResponse<TData>> {
  try {
    return (await response.json()) as ApiResponse<TData>;
  } catch {
    return {
      data: null,
      error: {
        code: "INTERNAL_ERROR",
        message: "Invalid response body.",
      },
    };
  }
}

function getFriendlySettingsError(error?: ApiError | null) {
  if (error?.code === "UNAUTHORIZED") {
    return "Bạn cần đăng nhập để xem Settings.";
  }

  return "Không thể tải thông tin Settings. Vui lòng thử lại.";
}

export async function fetchCurrentUser(): Promise<MeUserDto> {
  const response = await fetch("/api/me", {
    headers: {
      Accept: "application/json",
    },
    method: "GET",
  });
  const body = await readApiResponse<{ user: MeUserDto }>(response);

  if (!response.ok || body.error) {
    throw new SettingsClientError(
      getFriendlySettingsError(body.error),
      body.error?.code,
    );
  }

  return body.data.user;
}

export async function requestAccountDeletion(): Promise<{
  requested: true;
  accountDeletionRequestedAt: string;
}> {
  const response = await fetch("/api/account/deletion-request", {
    headers: {
      Accept: "application/json",
    },
    method: "POST",
  });
  const body = await readApiResponse<{
    requested: true;
    accountDeletionRequestedAt: string;
  }>(response);

  if (!response.ok || body.error) {
    throw new SettingsClientError(
      body.error?.code === "UNAUTHORIZED"
        ? "Bạn cần đăng nhập để gửi yêu cầu xóa tài khoản."
        : "Không thể gửi yêu cầu xóa tài khoản lúc này. Vui lòng thử lại.",
      body.error?.code,
    );
  }

  return body.data;
}
