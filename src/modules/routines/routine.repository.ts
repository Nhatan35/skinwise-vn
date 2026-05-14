import "server-only";

import { ObjectId } from "mongodb";

import type {
  Routine,
  RoutineDocument,
  RoutinePersistenceInput,
  RoutinePersistenceUpdateInput,
} from "@/modules/routines/routine.types";

const mongoObjectIdPattern = /^[a-f\d]{24}$/i;

async function getRoutineCollection() {
  const { getRoutinesCollection } = await import(
    "@/infrastructure/database/collections"
  );

  return getRoutinesCollection<RoutineDocument>();
}

function toRoutineObjectId(routineId: string) {
  if (!mongoObjectIdPattern.test(routineId)) {
    return null;
  }

  return new ObjectId(routineId);
}

export async function createRoutineForUser(
  userId: string,
  input: RoutinePersistenceInput,
): Promise<Routine> {
  const collection = await getRoutineCollection();
  const now = new Date();
  const routineDocument: RoutineDocument = {
    userId,
    name: input.name,
    timeOfDay: input.timeOfDay,
    steps: input.steps,
    createdAt: now,
    updatedAt: now,
  };
  const result = await collection.insertOne(routineDocument);

  return {
    ...routineDocument,
    _id: result.insertedId,
  };
}

export async function listRoutinesByUserId(userId: string): Promise<Routine[]> {
  const collection = await getRoutineCollection();

  return collection.find({ userId }).sort({ updatedAt: -1 }).toArray();
}

export async function findRoutineByIdAndUserId(
  routineId: string,
  userId: string,
): Promise<Routine | null> {
  const objectId = toRoutineObjectId(routineId);

  if (!objectId) {
    return null;
  }

  const collection = await getRoutineCollection();

  return collection.findOne({ _id: objectId, userId });
}

export async function updateRoutineByIdAndUserId(
  routineId: string,
  userId: string,
  input: RoutinePersistenceUpdateInput,
): Promise<Routine | null> {
  const objectId = toRoutineObjectId(routineId);

  if (!objectId) {
    return null;
  }

  const collection = await getRoutineCollection();

  return collection.findOneAndUpdate(
    { _id: objectId, userId },
    {
      $set: {
        ...input,
        updatedAt: new Date(),
      },
    },
    {
      returnDocument: "after",
    },
  );
}

export async function deleteRoutineByIdAndUserId(
  routineId: string,
  userId: string,
): Promise<Routine | null> {
  const objectId = toRoutineObjectId(routineId);

  if (!objectId) {
    return null;
  }

  const collection = await getRoutineCollection();

  return collection.findOneAndDelete({ _id: objectId, userId });
}
