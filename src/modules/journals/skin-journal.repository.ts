import "server-only";

import { ObjectId, type Filter } from "mongodb";

import type {
  CreateSkinJournalPersistenceInput,
  ListSkinJournalPersistenceInput,
  SkinJournal,
  SkinJournalDocument,
  UpdateSkinJournalPersistenceInput,
} from "@/modules/journals/skin-journal.types";

const mongoObjectIdPattern = /^[a-f\d]{24}$/i;

export class SkinJournalConflictError extends Error {
  constructor(message = "SkinJournal entry already exists for this localDate.") {
    super(message);
    this.name = "SkinJournalConflictError";
  }
}

async function getSkinJournalCollection() {
  const { getSkinJournalsCollection } = await import(
    "@/infrastructure/database/collections"
  );

  return getSkinJournalsCollection<SkinJournalDocument>();
}

function toSkinJournalObjectId(id: string) {
  if (!mongoObjectIdPattern.test(id)) {
    return null;
  }

  return new ObjectId(id);
}

function isDuplicateKeyError(error: unknown) {
  return (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    (error as { code?: unknown }).code === 11000
  );
}

function hasOwnField<TObject extends object>(
  value: TObject,
  field: keyof TObject,
) {
  return Object.prototype.hasOwnProperty.call(value, field);
}

export async function createSkinJournalEntry(
  userId: string,
  input: CreateSkinJournalPersistenceInput,
): Promise<SkinJournal> {
  const collection = await getSkinJournalCollection();
  const now = new Date();
  const skinJournalDocument: SkinJournalDocument = {
    userId,
    localDate: input.localDate,
    timezone: input.timezone,
    productsUsed: [...input.productsUsed],
    observations: [...input.observations],
    symptoms: [...input.symptoms],
    ...(input.sleepHours !== undefined ? { sleepHours: input.sleepHours } : {}),
    ...(input.stressLevel ? { stressLevel: input.stressLevel } : {}),
    ...(input.notes ? { notes: input.notes } : {}),
    createdAt: now,
    updatedAt: now,
  };

  try {
    const result = await collection.insertOne(skinJournalDocument);

    return {
      ...skinJournalDocument,
      _id: result.insertedId,
    };
  } catch (error) {
    if (isDuplicateKeyError(error)) {
      throw new SkinJournalConflictError();
    }

    throw error;
  }
}

export async function findSkinJournalEntriesByUserId(
  userId: string,
  input: ListSkinJournalPersistenceInput,
): Promise<SkinJournal[]> {
  const collection = await getSkinJournalCollection();
  const filter: Filter<SkinJournalDocument> = { userId };
  const localDateFilter: Record<string, string> = {};

  if (input.from) {
    localDateFilter.$gte = input.from;
  }

  if (input.to) {
    localDateFilter.$lte = input.to;
  }

  if (Object.keys(localDateFilter).length > 0) {
    filter.localDate = localDateFilter;
  }

  return collection
    .find(filter)
    .sort({ localDate: -1, createdAt: -1 })
    .limit(input.limit)
    .toArray();
}

export async function findSkinJournalEntryByIdForUser(
  id: string,
  userId: string,
): Promise<SkinJournal | null> {
  const objectId = toSkinJournalObjectId(id);

  if (!objectId) {
    return null;
  }

  const collection = await getSkinJournalCollection();

  return collection.findOne({ _id: objectId, userId });
}

export async function findSkinJournalEntryByUserAndLocalDate(
  userId: string,
  localDate: string,
): Promise<SkinJournal | null> {
  const collection = await getSkinJournalCollection();

  return collection.findOne({ userId, localDate });
}

export async function updateSkinJournalEntryByIdForUser(
  id: string,
  userId: string,
  input: UpdateSkinJournalPersistenceInput,
): Promise<SkinJournal | null> {
  const objectId = toSkinJournalObjectId(id);

  if (!objectId) {
    return null;
  }

  const collection = await getSkinJournalCollection();
  const updateSet: Partial<SkinJournalDocument> = {
    updatedAt: new Date(),
  };
  const updateUnset: Record<string, ""> = {};

  if (input.timezone !== undefined) {
    updateSet.timezone = input.timezone;
  }

  if (input.productsUsed !== undefined) {
    updateSet.productsUsed = [...input.productsUsed];
  }

  if (input.observations !== undefined) {
    updateSet.observations = [...input.observations];
  }

  if (input.symptoms !== undefined) {
    updateSet.symptoms = [...input.symptoms];
  }

  if (input.sleepHours !== undefined) {
    updateSet.sleepHours = input.sleepHours;
  }

  if (input.stressLevel !== undefined) {
    updateSet.stressLevel = input.stressLevel;
  }

  if (hasOwnField(input, "notes")) {
    if (input.notes) {
      updateSet.notes = input.notes;
    } else {
      updateUnset.notes = "";
    }
  }

  return collection.findOneAndUpdate(
    { _id: objectId, userId },
    {
      $set: updateSet,
      ...(Object.keys(updateUnset).length > 0 ? { $unset: updateUnset } : {}),
    },
    {
      returnDocument: "after",
    },
  );
}

export async function deleteSkinJournalEntryByIdForUser(
  id: string,
  userId: string,
): Promise<SkinJournal | null> {
  const objectId = toSkinJournalObjectId(id);

  if (!objectId) {
    return null;
  }

  const collection = await getSkinJournalCollection();

  return collection.findOneAndDelete({ _id: objectId, userId });
}
