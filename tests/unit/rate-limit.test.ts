import { ObjectId, type Collection, type Filter, type WithId } from "mongodb";
import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("server-only", () => ({}));

vi.mock("@/infrastructure/database/collections", () => ({
  getRateLimitsCollection: vi.fn(),
}));

import { getRateLimitsCollection } from "@/infrastructure/database/collections";
import {
  checkRateLimit,
  type RateLimitDocument,
} from "@/infrastructure/rate-limiting/rate-limit";

type RateLimitFilter = Filter<RateLimitDocument> & {
  key?: string;
  count?: {
    $lt?: number;
  };
  expiresAt?: {
    $gt?: Date;
    $lte?: Date;
  };
};

type RateLimitUpdate = {
  $inc?: {
    count?: number;
  };
  $set?: Partial<
    Pick<
      RateLimitDocument,
      "count" | "windowStart" | "expiresAt" | "createdAt" | "updatedAt"
    >
  >;
};

type FakeRateLimitCollection = {
  findOneAndUpdate: (
    filter: Filter<RateLimitDocument>,
    update: Parameters<Collection<RateLimitDocument>["findOneAndUpdate"]>[1],
  ) => Promise<WithId<RateLimitDocument> | null>;
  findOne: (
    filter: Filter<RateLimitDocument>,
  ) => Promise<WithId<RateLimitDocument> | null>;
  insertOne: (document: RateLimitDocument) => Promise<{
    acknowledged: boolean;
    insertedId: ObjectId;
  }>;
};

const mockedGetRateLimitsCollection = vi.mocked(getRateLimitsCollection);

const key = "routine_analysis:auth-user-id";
const limit = 10;
const windowMs = 60 * 60 * 1000;
const now = new Date("2026-05-15T00:00:00.000Z");

function cloneDocument(
  document: WithId<RateLimitDocument>,
): WithId<RateLimitDocument> {
  return {
    ...document,
    windowStart: new Date(document.windowStart),
    expiresAt: new Date(document.expiresAt),
    createdAt: new Date(document.createdAt),
    updatedAt: new Date(document.updatedAt),
  };
}

function getRequiredKey(filter: Filter<RateLimitDocument>) {
  const rateLimitFilter = filter as RateLimitFilter;

  if (typeof rateLimitFilter.key !== "string") {
    throw new Error("Fake rate limit collection requires key filters.");
  }

  return rateLimitFilter.key;
}

function matchesFilter(
  document: WithId<RateLimitDocument>,
  filter: Filter<RateLimitDocument>,
) {
  const rateLimitFilter = filter as RateLimitFilter;

  if (rateLimitFilter.key && document.key !== rateLimitFilter.key) {
    return false;
  }

  if (
    rateLimitFilter.expiresAt?.$gt &&
    !(document.expiresAt > rateLimitFilter.expiresAt.$gt)
  ) {
    return false;
  }

  if (
    rateLimitFilter.expiresAt?.$lte &&
    !(document.expiresAt <= rateLimitFilter.expiresAt.$lte)
  ) {
    return false;
  }

  if (
    typeof rateLimitFilter.count?.$lt === "number" &&
    !(document.count < rateLimitFilter.count.$lt)
  ) {
    return false;
  }

  return true;
}

function applyUpdate(
  document: WithId<RateLimitDocument>,
  update: Parameters<Collection<RateLimitDocument>["findOneAndUpdate"]>[1],
) {
  const rateLimitUpdate = update as RateLimitUpdate;

  if (typeof rateLimitUpdate.$inc?.count === "number") {
    document.count += rateLimitUpdate.$inc.count;
  }

  if (rateLimitUpdate.$set) {
    Object.assign(document, rateLimitUpdate.$set);
  }
}

function createFakeCollection() {
  const documents = new Map<string, WithId<RateLimitDocument>>();
  const collection: FakeRateLimitCollection = {
    async findOneAndUpdate(filter, update) {
      const document = documents.get(getRequiredKey(filter));

      if (!document || !matchesFilter(document, filter)) {
        return null;
      }

      applyUpdate(document, update);

      return cloneDocument(document);
    },
    async findOne(filter) {
      const document = documents.get(getRequiredKey(filter));

      return document ? cloneDocument(document) : null;
    },
    async insertOne(document) {
      if (documents.has(document.key)) {
        throw { code: 11000 };
      }

      const storedDocument = {
        ...document,
        _id: new ObjectId(),
      } satisfies WithId<RateLimitDocument>;

      documents.set(document.key, storedDocument);

      return {
        acknowledged: true,
        insertedId: storedDocument._id,
      };
    },
  };

  return {
    collection: collection as unknown as Collection<RateLimitDocument>,
    getDocument: (documentKey: string) => documents.get(documentKey),
  };
}

function mockRateLimitsCollection(collection: Collection<RateLimitDocument>) {
  mockedGetRateLimitsCollection.mockResolvedValue(
    collection as unknown as Awaited<ReturnType<typeof getRateLimitsCollection>>,
  );
}

describe("MongoDB-backed rate limiting", () => {
  beforeEach(() => {
    mockedGetRateLimitsCollection.mockReset();
  });

  it("allows the first request and creates a new window", async () => {
    const fake = createFakeCollection();
    mockRateLimitsCollection(fake.collection);

    await expect(checkRateLimit({ key, limit, windowMs, now })).resolves.toEqual(
      {
        allowed: true,
        limit,
        remaining: 9,
        retryAfterSeconds: 3600,
      },
    );
    expect(fake.getDocument(key)).toMatchObject({
      key,
      count: 1,
      windowStart: now,
      expiresAt: new Date(now.getTime() + windowMs),
    });
  });

  it("allows requests within the limit", async () => {
    const fake = createFakeCollection();
    mockRateLimitsCollection(fake.collection);

    for (let requestCount = 1; requestCount <= limit; requestCount += 1) {
      const result = await checkRateLimit({ key, limit, windowMs, now });

      expect(result.allowed).toBe(true);
      expect(result.remaining).toBe(limit - requestCount);
    }

    expect(fake.getDocument(key)?.count).toBe(limit);
  });

  it("blocks the 11th request within the same 60-minute window", async () => {
    const fake = createFakeCollection();
    mockRateLimitsCollection(fake.collection);

    for (let requestCount = 1; requestCount <= limit; requestCount += 1) {
      await checkRateLimit({ key, limit, windowMs, now });
    }

    await expect(
      checkRateLimit({
        key,
        limit,
        windowMs,
        now: new Date("2026-05-15T00:10:00.000Z"),
      }),
    ).resolves.toEqual({
      allowed: false,
      limit,
      remaining: 0,
      retryAfterSeconds: 3000,
    });
    expect(fake.getDocument(key)?.count).toBe(limit);
  });

  it("resets the counter after the window expires", async () => {
    const fake = createFakeCollection();
    mockRateLimitsCollection(fake.collection);

    for (let requestCount = 1; requestCount <= limit; requestCount += 1) {
      await checkRateLimit({ key, limit, windowMs, now });
    }

    const resetTime = new Date("2026-05-15T01:00:01.000Z");

    await expect(
      checkRateLimit({ key, limit, windowMs, now: resetTime }),
    ).resolves.toEqual({
      allowed: true,
      limit,
      remaining: 9,
      retryAfterSeconds: 3600,
    });
    expect(fake.getDocument(key)).toMatchObject({
      count: 1,
      windowStart: resetTime,
      expiresAt: new Date(resetTime.getTime() + windowMs),
    });
  });
});
