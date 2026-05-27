import "server-only";

import { ObjectId } from "mongodb";

import type {
  RoutineLog,
  RoutineLogDocument,
  RoutineLogPersistenceInput,
} from "@/modules/routine-logs/routine-log.types";

const mongoObjectIdPattern = /^[a-f\d]{24}$/i;

async function getRoutineLogCollection() {
  const { getRoutineLogsCollection } = await import(
    "@/infrastructure/database/collections"
  );

  return getRoutineLogsCollection<RoutineLogDocument>();
}

function toRoutineLogObjectId(routineLogId: string) {
  if (!mongoObjectIdPattern.test(routineLogId)) {
    return null;
  }

  return new ObjectId(routineLogId);
}

export async function findRoutineLogsByDate(
  userId: string,
  localDate: string,
): Promise<RoutineLog[]> {
  const collection = await getRoutineLogCollection();

  return collection.find({ userId, localDate }).sort({ updatedAt: -1 }).toArray();
}

export async function findRoutineLogByRoutineAndDate(
  userId: string,
  routineId: string,
  localDate: string,
): Promise<RoutineLog | null> {
  const collection = await getRoutineLogCollection();

  return collection.findOne({ userId, routineId, localDate });
}

export async function upsertRoutineLog(
  userId: string,
  input: RoutineLogPersistenceInput,
): Promise<RoutineLog> {
  const collection = await getRoutineLogCollection();
  const now = new Date();
  const updateSet: Partial<RoutineLogDocument> = {
    timezone: input.timezone,
    status: input.status,
    updatedAt: now,
  };
  const updateUnset: Record<string, ""> = {};

  if (input.completedStepIds) {
    updateSet.completedStepIds = [...input.completedStepIds];
  } else {
    updateUnset.completedStepIds = "";
  }

  if (input.note) {
    updateSet.note = input.note;
  } else {
    updateUnset.note = "";
  }

  const routineLog = await collection.findOneAndUpdate(
    {
      userId,
      routineId: input.routineId,
      localDate: input.localDate,
    },
    {
      $set: updateSet,
      $setOnInsert: {
        userId,
        routineId: input.routineId,
        localDate: input.localDate,
        createdAt: now,
      },
      ...(Object.keys(updateUnset).length > 0 ? { $unset: updateUnset } : {}),
    },
    {
      upsert: true,
      returnDocument: "after",
    },
  );

  if (!routineLog) {
    const existingRoutineLog = await findRoutineLogByRoutineAndDate(
      userId,
      input.routineId,
      input.localDate,
    );

    if (existingRoutineLog) {
      return existingRoutineLog;
    }

    throw new Error("RoutineLog upsert failed.");
  }

  return routineLog;
}

export async function deleteRoutineLogByIdAndUserId(
  userId: string,
  routineLogId: string,
): Promise<boolean> {
  const routineLogObjectId = toRoutineLogObjectId(routineLogId);

  if (!routineLogObjectId) {
    return false;
  }

  const collection = await getRoutineLogCollection();
  const result = await collection.deleteOne({
    _id: routineLogObjectId,
    userId,
  });

  return result.deletedCount > 0;
}
