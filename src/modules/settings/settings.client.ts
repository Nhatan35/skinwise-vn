import type { MeUserDto } from "@/modules/users/app-user-profile.types";
import type { AccountDataExportDto } from "@/modules/account-data/account-data-export.dto";
import type { DeleteAccountAppDataDto } from "@/modules/account-data/delete-account-app-data.dto";

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
    return "Bạn cần đăng nhập để xem cài đặt.";
  }

  return "Không thể tải phần cài đặt. Vui lòng thử lại.";
}

function hasApiData<TData>(
  body: ApiResponse<TData>,
): body is { data: TData; error: null } {
  return body.error === null && body.data !== null;
}

export async function fetchCurrentUser(): Promise<MeUserDto> {
  const response = await fetch("/api/me", {
    headers: {
      Accept: "application/json",
    },
    method: "GET",
  });
  const body = await readApiResponse<{ user: MeUserDto }>(response);

  if (!response.ok || !hasApiData(body)) {
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

  if (!response.ok || !hasApiData(body)) {
    throw new SettingsClientError(
      body.error?.code === "UNAUTHORIZED"
        ? "Bạn cần đăng nhập để gửi yêu cầu xóa tài khoản."
        : "Không thể gửi yêu cầu xóa tài khoản lúc này. Vui lòng thử lại.",
      body.error?.code,
    );
  }

  return body.data;
}

export async function exportAccountData(): Promise<AccountDataExportDto> {
  const response = await fetch("/api/account/export", {
    headers: {
      Accept: "application/json",
    },
    method: "GET",
  });
  const body = await readApiResponse<{ export: AccountDataExportDto }>(response);

  if (!response.ok || !hasApiData(body)) {
    throw new SettingsClientError(
      body.error?.code === "UNAUTHORIZED"
        ? "Bạn cần đăng nhập để xuất dữ liệu."
        : "Không thể xuất dữ liệu lúc này. Vui lòng thử lại.",
      body.error?.code,
    );
  }

  return body.data.export;
}

export async function deleteAccountAppData(): Promise<DeleteAccountAppDataDto> {
  const response = await fetch("/api/account/app-data", {
    headers: {
      Accept: "application/json",
    },
    method: "DELETE",
  });
  const body = await readApiResponse<DeleteAccountAppDataDto>(response);

  if (!response.ok || !hasApiData(body)) {
    throw new SettingsClientError(
      body.error?.code === "UNAUTHORIZED"
        ? "Bạn cần đăng nhập để xóa dữ liệu skincare trong app."
        : "Không thể xóa dữ liệu skincare trong app lúc này. Vui lòng thử lại.",
      body.error?.code,
    );
  }

  return body.data;
}
