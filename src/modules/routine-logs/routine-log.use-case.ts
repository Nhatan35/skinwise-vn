import { toRoutineLogDto } from "@/modules/routine-logs/routine-log.mapper";
import {
  findRoutineLogsByDate,
  upsertRoutineLog,
} from "@/modules/routine-logs/routine-log.repository";
import type { UpsertRoutineLogInput } from "@/modules/routine-logs/routine-log.schema";
import type { RoutineLogDto } from "@/modules/routine-logs/routine-log.dto";
import { findRoutineByIdAndUserId } from "@/modules/routines/routine.repository";
import type { Routine } from "@/modules/routines/routine.types";

export class RoutineLogValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "RoutineLogValidationError";
  }
}

function getRoutineStepIds(routine: Routine) {
  return routine.steps.map((step) => step.stepId);
}

function getUniqueStepIds(stepIds: string[] | undefined) {
  return Array.from(new Set(stepIds ?? []));
}

function assertKnownCompletedStepIds(
  completedStepIds: string[],
  routineStepIds: string[],
) {
  const knownStepIds = new Set(routineStepIds);
  const unknownStepIds = completedStepIds.filter(
    (stepId) => !knownStepIds.has(stepId),
  );

  if (unknownStepIds.length > 0) {
    throw new RoutineLogValidationError(
      "completedStepIds contains step IDs that do not belong to the routine.",
    );
  }
}

function normalizeCompletedStepIds(
  input: UpsertRoutineLogInput,
  routine: Routine,
) {
  const routineStepIds = getRoutineStepIds(routine);
  const completedStepIds = getUniqueStepIds(input.completedStepIds);

  assertKnownCompletedStepIds(completedStepIds, routineStepIds);

  if (input.status === "skipped") {
    if (completedStepIds.length > 0) {
      throw new RoutineLogValidationError(
        "Skipped routine logs cannot include completedStepIds.",
      );
    }

    return undefined;
  }

  if (input.status === "completed") {
    if (
      completedStepIds.length > 0 &&
      completedStepIds.length !== routineStepIds.length
    ) {
      throw new RoutineLogValidationError(
        "Completed routine logs must include every routine step when completedStepIds is provided.",
      );
    }

    return routineStepIds;
  }

  if (completedStepIds.length === 0) {
    throw new RoutineLogValidationError(
      "Partial routine logs require at least one completed step.",
    );
  }

  if (completedStepIds.length >= routineStepIds.length) {
    throw new RoutineLogValidationError(
      "Partial routine logs must include fewer than all routine steps.",
    );
  }

  return completedStepIds;
}

function normalizeNote(note: string | undefined) {
  const trimmedNote = note?.trim();

  return trimmedNote ? trimmedNote : undefined;
}

export async function getRoutineLogsForDate(
  userId: string,
  localDate: string,
): Promise<RoutineLogDto[]> {
  const routineLogs = await findRoutineLogsByDate(userId, localDate);

  return routineLogs.map(toRoutineLogDto);
}

export async function upsertRoutineLogForUser(
  userId: string,
  input: UpsertRoutineLogInput,
): Promise<RoutineLogDto | null> {
  const routine = await findRoutineByIdAndUserId(input.routineId, userId);

  if (!routine) {
    return null;
  }

  const completedStepIds = normalizeCompletedStepIds(input, routine);
  const note = normalizeNote(input.note);
  const routineLog = await upsertRoutineLog(userId, {
    routineId: input.routineId,
    localDate: input.localDate,
    timezone: input.timezone,
    status: input.status,
    ...(completedStepIds ? { completedStepIds } : {}),
    ...(note ? { note } : {}),
  });

  return toRoutineLogDto(routineLog);
}
