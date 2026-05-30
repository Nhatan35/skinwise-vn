import type { InsightsDto } from "@/modules/insights/insights.dto";
import { getBrowserLocalDate } from "@/modules/routine-logs/routine-log.client";

const INSIGHTS_API_PATH = "/api/insights";

type ApiError = {
  code: string;
  details?: unknown;
  message: string;
};

type ApiResponse<TData> =
  | {
      data: TData;
      error: null;
    }
  | {
      data: null;
      error: ApiError;
    };

export type InsightsDateRangeParams = {
  from?: string;
  to?: string;
};

export class InsightsClientError extends Error {
  code: string;
  status: number;

  constructor(message: string, code = "INTERNAL_ERROR", status = 500) {
    super(message);
    this.name = "InsightsClientError";
    this.code = code;
    this.status = status;
  }
}

function addBrowserLocalDateDays(localDate: string, days: number) {
  const [year, month, day] = localDate.split("-").map(Number);
  const date = new Date(year, month - 1, day + days);

  return getBrowserLocalDate(date);
}

export function getDefaultInsightsRange(date = new Date()) {
  const to = getBrowserLocalDate(date);

  return {
    from: addBrowserLocalDateDays(to, -29),
    to,
  };
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

function getSafeErrorMessage(error?: ApiError | null, status = 500) {
  if (status === 401 || error?.code === "UNAUTHORIZED") {
    return "You need to sign in to review your insights.";
  }

  if (status === 400 || error?.code === "VALIDATION_ERROR") {
    return "The selected insight date range is invalid.";
  }

  return "We couldn’t load your insights. Please try again.";
}

function buildInsightsUrl(params?: InsightsDateRangeParams) {
  const range =
    params?.from && params.to
      ? { from: params.from, to: params.to }
      : getDefaultInsightsRange();
  const searchParams = new URLSearchParams();

  searchParams.set("from", range.from);
  searchParams.set("to", range.to);

  return `${INSIGHTS_API_PATH}?${searchParams.toString()}`;
}

export async function getInsights(
  params?: InsightsDateRangeParams,
): Promise<InsightsDto> {
  let response: Response;

  try {
    response = await fetch(buildInsightsUrl(params), {
      headers: {
        Accept: "application/json",
      },
      method: "GET",
    });
  } catch {
    throw new InsightsClientError(getSafeErrorMessage());
  }

  const body = await readApiResponse<{ insights: InsightsDto }>(response);

  if (!response.ok || body.error !== null || body.data === null) {
    const error = body.error;

    throw new InsightsClientError(
      getSafeErrorMessage(error, response.status),
      error?.code,
      response.status,
    );
  }

  return body.data.insights;
}
