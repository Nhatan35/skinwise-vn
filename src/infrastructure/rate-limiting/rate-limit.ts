import "server-only";

import type { Collection, Document, Filter } from "mongodb";

import { getRateLimitsCollection } from "@/infrastructure/database/collections";

export type RateLimitDocument = Document & {
  key: string;
  count: number;
  windowStart: Date;
  expiresAt: Date;
  createdAt: Date;
  updatedAt: Date;
};

export type CheckRateLimitInput = {
  key: string;
  limit: number;
  windowMs: number;
  now?: Date;
};

export type RateLimitResult = {
  allowed: boolean;
  limit: number;
  remaining: number;
  retryAfterSeconds: number;
};

const DUPLICATE_KEY_ERROR_CODE = 11000;

function assertRateLimitInput(input: CheckRateLimitInput) {
  if (input.key.trim().length === 0) {
    throw new Error("Rate limit key is required.");
  }

  if (!Number.isInteger(input.limit) || input.limit < 1) {
    throw new Error("Rate limit must be a positive integer.");
  }

  if (!Number.isInteger(input.windowMs) || input.windowMs < 1) {
    throw new Error("Rate limit windowMs must be a positive integer.");
  }
}

function secondsUntil(expiresAt: Date, now: Date) {
  return Math.max(0, Math.ceil((expiresAt.getTime() - now.getTime()) / 1000));
}

function toAllowedResult(
  document: Pick<RateLimitDocument, "count" | "expiresAt">,
  limit: number,
  now: Date,
): RateLimitResult {
  return {
    allowed: true,
    limit,
    remaining: Math.max(0, limit - document.count),
    retryAfterSeconds: secondsUntil(document.expiresAt, now),
  };
}

function toDeniedResult(
  document: Pick<RateLimitDocument, "expiresAt"> | null,
  limit: number,
  windowMs: number,
  now: Date,
): RateLimitResult {
  const expiresAt = document?.expiresAt ?? new Date(now.getTime() + windowMs);

  return {
    allowed: false,
    limit,
    remaining: 0,
    retryAfterSeconds: Math.max(1, secondsUntil(expiresAt, now)),
  };
}

function hasMongoErrorCode(error: unknown): error is { code: number } {
  return (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    typeof error.code === "number"
  );
}

function isDuplicateKeyError(error: unknown) {
  return hasMongoErrorCode(error) && error.code === DUPLICATE_KEY_ERROR_CODE;
}

async function incrementActiveWindow(
  collection: Collection<RateLimitDocument>,
  key: string,
  limit: number,
  now: Date,
) {
  return collection.findOneAndUpdate(
    {
      key,
      expiresAt: { $gt: now },
      count: { $lt: limit },
    } satisfies Filter<RateLimitDocument>,
    {
      $inc: { count: 1 },
      $set: { updatedAt: now },
    },
    { returnDocument: "after" },
  );
}

async function resetExpiredWindow(
  collection: Collection<RateLimitDocument>,
  key: string,
  windowMs: number,
  now: Date,
) {
  const expiresAt = new Date(now.getTime() + windowMs);

  return collection.findOneAndUpdate(
    {
      key,
      expiresAt: { $lte: now },
    } satisfies Filter<RateLimitDocument>,
    {
      $set: {
        count: 1,
        windowStart: now,
        expiresAt,
        updatedAt: now,
      },
    },
    { returnDocument: "after" },
  );
}

async function consumeExistingWindow(
  collection: Collection<RateLimitDocument>,
  input: Required<CheckRateLimitInput>,
) {
  return (
    (await incrementActiveWindow(
      collection,
      input.key,
      input.limit,
      input.now,
    )) ??
    (await resetExpiredWindow(
      collection,
      input.key,
      input.windowMs,
      input.now,
    ))
  );
}

async function insertNewWindow(
  collection: Collection<RateLimitDocument>,
  input: Required<CheckRateLimitInput>,
) {
  const document: RateLimitDocument = {
    key: input.key,
    count: 1,
    windowStart: input.now,
    expiresAt: new Date(input.now.getTime() + input.windowMs),
    createdAt: input.now,
    updatedAt: input.now,
  };

  await collection.insertOne(document);

  return document;
}

export async function checkRateLimit(
  input: CheckRateLimitInput,
): Promise<RateLimitResult> {
  assertRateLimitInput(input);

  const normalizedInput: Required<CheckRateLimitInput> = {
    ...input,
    now: input.now ?? new Date(),
  };
  const collection = await getRateLimitsCollection<RateLimitDocument>();
  const consumedDocument = await consumeExistingWindow(
    collection,
    normalizedInput,
  );

  if (consumedDocument) {
    return toAllowedResult(consumedDocument, normalizedInput.limit, normalizedInput.now);
  }

  const existingDocument = await collection.findOne({ key: normalizedInput.key });

  if (existingDocument) {
    return toDeniedResult(
      existingDocument,
      normalizedInput.limit,
      normalizedInput.windowMs,
      normalizedInput.now,
    );
  }

  try {
    const insertedDocument = await insertNewWindow(collection, normalizedInput);

    return toAllowedResult(
      insertedDocument,
      normalizedInput.limit,
      normalizedInput.now,
    );
  } catch (error) {
    if (!isDuplicateKeyError(error)) {
      throw error;
    }

    const consumedAfterRace = await consumeExistingWindow(
      collection,
      normalizedInput,
    );

    if (consumedAfterRace) {
      return toAllowedResult(
        consumedAfterRace,
        normalizedInput.limit,
        normalizedInput.now,
      );
    }

    const deniedDocument = await collection.findOne({
      key: normalizedInput.key,
    });

    return toDeniedResult(
      deniedDocument,
      normalizedInput.limit,
      normalizedInput.windowMs,
      normalizedInput.now,
    );
  }
}
