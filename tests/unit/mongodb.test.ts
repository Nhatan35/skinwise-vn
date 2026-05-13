import { MongoClient } from "mongodb";
import { describe, expect, it, vi } from "vitest";

vi.mock("server-only", () => ({}));

import {
  createMongoClient,
  requireMongoUri,
} from "@/infrastructure/database/mongodb";

describe("MongoDB foundation helper", () => {
  it("throws a clear error when MONGODB_URI is undefined", () => {
    expect(() => requireMongoUri(undefined)).toThrow(
      "MONGODB_URI is required before using MongoDB infrastructure.",
    );
  });

  it("does not include secret values in missing URI errors", () => {
    const secret = "mongodb+srv://user:super-secret@example";

    try {
      requireMongoUri(undefined);
    } catch (error) {
      expect(error).toBeInstanceOf(Error);
      expect((error as Error).message).not.toContain(secret);
      expect((error as Error).message).not.toContain("super-secret");
    }
  });

  it("fails when MONGODB_URI is an empty string", () => {
    expect(() => requireMongoUri("")).toThrow(
      "MONGODB_URI is required before using MongoDB infrastructure.",
    );
  });

  it("passes local MongoDB connection strings", () => {
    const uri = "mongodb://localhost:27017/skinwise_test";

    expect(requireMongoUri(uri)).toBe(uri);
  });

  it("passes mongodb+srv connection strings by prefix", () => {
    const uri = "mongodb+srv://example";

    expect(requireMongoUri(uri)).toBe(uri);
  });

  it("creates a MongoClient object", () => {
    const client = createMongoClient("mongodb://localhost:27017/skinwise_test");

    expect(client).toBeInstanceOf(MongoClient);
  });

  it("does not connect when creating a MongoClient object", () => {
    const connectSpy = vi.spyOn(MongoClient.prototype, "connect");

    createMongoClient("mongodb://localhost:27017/skinwise_test");

    expect(connectSpy).not.toHaveBeenCalled();

    connectSpy.mockRestore();
  });
});
