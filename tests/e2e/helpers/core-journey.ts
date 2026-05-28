import { expect, type APIResponse, type Page } from "@playwright/test";

type ApiError = {
  code: string;
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

export type E2ERoutine = {
  id: string;
  name: string;
  timeOfDay: "morning" | "evening";
  steps: Array<{
    stepId: string;
    customProductName?: string;
    productNameSnapshot?: string;
  }>;
};

export type E2ERoutineLog = {
  id: string;
  routineId: string;
  localDate: string;
  status: "completed" | "partial" | "skipped";
  completedStepIds?: string[];
};

export type E2ESkinJournal = {
  id: string;
  localDate: string;
  observations: string[];
  notes?: string;
};

async function readApiResponse<TData>(
  response: APIResponse,
): Promise<ApiResponse<TData>> {
  return (await response.json()) as ApiResponse<TData>;
}

async function expectSuccessfulEnvelope<TData>(response: APIResponse) {
  expect(response.ok()).toBe(true);

  const body = await readApiResponse<TData>(response);

  expect(body.error).toBeNull();
  expect(body.data).not.toBeNull();

  return body.data as TData;
}

export async function getBrowserLocalDate(page: Page) {
  return page.evaluate(() => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const day = String(now.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
  });
}

export async function getBrowserTimezone(page: Page) {
  return page.evaluate(
    () => Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC",
  );
}

export async function createRoutineViaApi(
  page: Page,
  input: {
    name: string;
    timeOfDay?: "morning" | "evening";
    customProductName?: string;
    category?: string;
    frequency?: string;
    instructions?: string;
  },
) {
  const response = await page.request.post("/api/routines", {
    data: {
      name: input.name,
      timeOfDay: input.timeOfDay ?? "morning",
      steps: [
        {
          category: input.category ?? "cleanser",
          customProductName: input.customProductName ?? "E2E Gentle Cleanser",
          frequency: input.frequency ?? "daily",
          instructions: input.instructions ?? "Use gently in the morning.",
          order: 1,
        },
      ],
    },
  });

  const data = await expectSuccessfulEnvelope<{ routine: E2ERoutine }>(response);

  expect(data.routine.id).toBeTruthy();
  expect(data.routine.name).toBe(input.name);
  expect(data.routine.steps.length).toBeGreaterThan(0);
  expect(data.routine.steps[0]?.stepId).toBeTruthy();

  return data.routine;
}

export async function ensureSkinProfileViaApi(page: Page) {
  const response = await page.request.post("/api/skin-profile", {
    data: {
      avoidIngredients: ["e2e-fragrance-marker", "alcohol denat"],
      budgetRange: "300k_700k",
      concerns: ["acne"],
      experienceLevel: "beginner",
      sensitivityLevel: "medium",
      skinType: "combination",
    },
  });

  await expectSuccessfulEnvelope(response);
}

export async function markRoutineCompletedViaApi(
  page: Page,
  routine: E2ERoutine,
  input: {
    localDate: string;
    timezone: string;
  },
) {
  const response = await page.request.put("/api/routine-logs", {
    data: {
      completedStepIds: routine.steps.map((step) => step.stepId),
      localDate: input.localDate,
      routineId: routine.id,
      status: "completed",
      timezone: input.timezone,
    },
  });

  const data = await expectSuccessfulEnvelope<{ routineLog: E2ERoutineLog }>(
    response,
  );

  expect(data.routineLog.id).toBeTruthy();
  expect(data.routineLog.routineId).toBe(routine.id);
  expect(data.routineLog.status).toBe("completed");

  return data.routineLog;
}

export async function createSkinJournalViaApi(
  page: Page,
  input: {
    localDate: string;
    observations: string[];
    notes: string;
    timezone?: string;
  },
) {
  const response = await page.request.post("/api/skin-journal", {
    data: {
      localDate: input.localDate,
      notes: input.notes,
      observations: input.observations,
      productsUsed: [],
      symptoms: [],
      timezone: input.timezone ?? (await getBrowserTimezone(page)),
    },
  });

  const data = await expectSuccessfulEnvelope<{ skinJournal: E2ESkinJournal }>(
    response,
  );

  return data.skinJournal;
}

export async function runRoutineAnalysisViaApi(page: Page, routineId: string) {
  const response = await page.request.post(`/api/routines/${routineId}/analyze`, {
    data: {},
  });

  await expectSuccessfulEnvelope(response);
}
