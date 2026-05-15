import "server-only";

import { ObjectId } from "mongodb";

import type {
  CreateRoutineAnalysisInput,
  RoutineAnalysis,
  RoutineAnalysisDocument,
} from "@/modules/ai-analysis/routine-analysis.types";

const mongoObjectIdPattern = /^[a-f\d]{24}$/i;

async function getRoutineAnalysisCollection() {
  const { getRoutineAnalysesCollection } = await import(
    "@/infrastructure/database/collections"
  );

  return getRoutineAnalysesCollection<RoutineAnalysisDocument>();
}

function toObjectId(id: string) {
  if (!mongoObjectIdPattern.test(id)) {
    return null;
  }

  return new ObjectId(id);
}

export async function createRoutineAnalysisForUser(
  userId: string,
  input: CreateRoutineAnalysisInput,
): Promise<RoutineAnalysis> {
  const collection = await getRoutineAnalysisCollection();
  const analysisDocument: RoutineAnalysisDocument = {
    ...input,
    userId,
    createdAt: new Date(),
  };
  const result = await collection.insertOne(analysisDocument);

  return {
    ...analysisDocument,
    _id: result.insertedId,
  };
}

export async function listRoutineAnalysesByRoutineIdAndUserId(
  routineId: string,
  userId: string,
): Promise<RoutineAnalysis[]> {
  const objectId = toObjectId(routineId);

  if (!objectId) {
    return [];
  }

  const collection = await getRoutineAnalysisCollection();

  return collection
    .find({
      routineId: objectId,
      userId,
    })
    .sort({ createdAt: -1 })
    .toArray();
}
