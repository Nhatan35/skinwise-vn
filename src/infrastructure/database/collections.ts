import "server-only";

import type { Collection, Document } from "mongodb";

import { getMongoDb } from "@/infrastructure/database/mongodb";

export const COLLECTION_NAMES = {
  APP_USER_PROFILES: "app_user_profiles",
  SKIN_PROFILES: "skin_profiles",
  PRODUCTS: "products",
  INGREDIENTS: "ingredients",
  ROUTINES: "routines",
  ROUTINE_LOGS: "routine_logs",
  ROUTINE_ANALYSES: "routine_analyses",
  SKIN_JOURNALS: "skin_journals",
} as const;

export const AUTH_COLLECTION_NAMES = {
  USERS: "users",
  ACCOUNTS: "accounts",
  SESSIONS: "sessions",
  VERIFICATION_TOKENS: "verification_tokens",
} as const;

export type CollectionKey = keyof typeof COLLECTION_NAMES;
export type CollectionName = (typeof COLLECTION_NAMES)[CollectionKey];

export async function getCollection<TSchema extends Document = Document>(
  name: CollectionName,
): Promise<Collection<TSchema>> {
  const db = await getMongoDb();

  return db.collection<TSchema>(name);
}

export function getAppUserProfilesCollection<
  TSchema extends Document = Document,
>() {
  return getCollection<TSchema>(COLLECTION_NAMES.APP_USER_PROFILES);
}

export function getSkinProfilesCollection<TSchema extends Document = Document>() {
  return getCollection<TSchema>(COLLECTION_NAMES.SKIN_PROFILES);
}

export function getProductsCollection<TSchema extends Document = Document>() {
  return getCollection<TSchema>(COLLECTION_NAMES.PRODUCTS);
}

export function getIngredientsCollection<TSchema extends Document = Document>() {
  return getCollection<TSchema>(COLLECTION_NAMES.INGREDIENTS);
}

export function getRoutinesCollection<TSchema extends Document = Document>() {
  return getCollection<TSchema>(COLLECTION_NAMES.ROUTINES);
}

export function getRoutineLogsCollection<TSchema extends Document = Document>() {
  return getCollection<TSchema>(COLLECTION_NAMES.ROUTINE_LOGS);
}

export function getRoutineAnalysesCollection<
  TSchema extends Document = Document,
>() {
  return getCollection<TSchema>(COLLECTION_NAMES.ROUTINE_ANALYSES);
}

export function getSkinJournalsCollection<
  TSchema extends Document = Document,
>() {
  return getCollection<TSchema>(COLLECTION_NAMES.SKIN_JOURNALS);
}
