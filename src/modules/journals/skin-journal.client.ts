import type { SkinJournalDto } from "@/modules/journals/skin-journal.dto";
import type {
  CreateSkinJournalClientInput,
  UpdateSkinJournalClientInput,
} from "@/modules/journals/skin-journal-form.validation";

const SKIN_JOURNAL_API_PATH = "/api/skin-journal";
const DUPLICATE_LOCAL_DATE_MESSAGE =
  "You already have a journal entry for this date.";

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

export class SkinJournalClientError extends Error {
  code: string;
  status: number;

  constructor(message: string, code = "INTERNAL_ERROR", status = 500) {
    super(message);
    this.name = "SkinJournalClientError";
    this.code = code;
    this.status = status;
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

function getSafeErrorMessage(error?: ApiError | null, status = 500) {
  if (status === 409 || error?.code === "CONFLICT") {
    return DUPLICATE_LOCAL_DATE_MESSAGE;
  }

  if (error?.code === "UNAUTHORIZED") {
    return "You need to sign in to use Skin Journal.";
  }

  if (error?.code === "VALIDATION_ERROR") {
    return "Some journal details are invalid. Please check the form.";
  }

  if (error?.code === "NOT_FOUND") {
    return "This journal entry no longer exists.";
  }

  return "Unable to update Skin Journal. Please try again.";
}

async function requestSkinJournal<TData>(
  path: string,
  init: RequestInit,
): Promise<TData> {
  let response: Response;

  try {
    response = await fetch(path, {
      ...init,
      headers: {
        Accept: "application/json",
        ...init.headers,
      },
    });
  } catch {
    throw new SkinJournalClientError(getSafeErrorMessage());
  }

  const body = await readApiResponse<TData>(response);

  if (!response.ok || body.error !== null || body.data === null) {
    const error = body.error;

    throw new SkinJournalClientError(
      getSafeErrorMessage(error, response.status),
      error?.code,
      response.status,
    );
  }

  return body.data;
}

export function sanitizeCreateSkinJournalPayload(
  input: CreateSkinJournalClientInput,
): CreateSkinJournalClientInput {
  return {
    localDate: input.localDate,
    timezone: input.timezone,
    productsUsed: [...input.productsUsed],
    observations: [...input.observations],
    symptoms: [...input.symptoms],
    ...(input.sleepHours !== undefined ? { sleepHours: input.sleepHours } : {}),
    ...(input.stressLevel ? { stressLevel: input.stressLevel } : {}),
    ...(input.notes ? { notes: input.notes } : {}),
  };
}

export function sanitizeUpdateSkinJournalPayload(
  input: UpdateSkinJournalClientInput,
): UpdateSkinJournalClientInput {
  return {
    ...(input.timezone !== undefined ? { timezone: input.timezone } : {}),
    ...(input.productsUsed !== undefined
      ? { productsUsed: [...input.productsUsed] }
      : {}),
    ...(input.observations !== undefined
      ? { observations: [...input.observations] }
      : {}),
    ...(input.symptoms !== undefined ? { symptoms: [...input.symptoms] } : {}),
    ...(input.sleepHours !== undefined ? { sleepHours: input.sleepHours } : {}),
    ...(input.stressLevel ? { stressLevel: input.stressLevel } : {}),
    ...(input.notes !== undefined ? { notes: input.notes } : {}),
  };
}

export async function listSkinJournals() {
  const data = await requestSkinJournal<{ skinJournals: SkinJournalDto[] }>(
    SKIN_JOURNAL_API_PATH,
    {
      method: "GET",
    },
  );

  return data.skinJournals;
}

export async function createSkinJournal(
  input: CreateSkinJournalClientInput,
) {
  const data = await requestSkinJournal<{ skinJournal: SkinJournalDto }>(
    SKIN_JOURNAL_API_PATH,
    {
      body: JSON.stringify(sanitizeCreateSkinJournalPayload(input)),
      headers: {
        "Content-Type": "application/json",
      },
      method: "POST",
    },
  );

  return data.skinJournal;
}

export async function updateSkinJournal(
  id: string,
  input: UpdateSkinJournalClientInput,
) {
  const data = await requestSkinJournal<{ skinJournal: SkinJournalDto }>(
    `${SKIN_JOURNAL_API_PATH}/${id}`,
    {
      body: JSON.stringify(sanitizeUpdateSkinJournalPayload(input)),
      headers: {
        "Content-Type": "application/json",
      },
      method: "PATCH",
    },
  );

  return data.skinJournal;
}

export async function deleteSkinJournal(id: string) {
  const data = await requestSkinJournal<{ deleted: true }>(
    `${SKIN_JOURNAL_API_PATH}/${id}`,
    {
      method: "DELETE",
    },
  );

  return data.deleted;
}
