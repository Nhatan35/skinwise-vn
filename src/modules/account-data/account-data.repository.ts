import "server-only";

import type { ObjectId } from "mongodb";

import {
  getAppUserProfilesCollection,
  getProductsCollection,
  getRoutineAnalysesCollection,
  getRoutineLogsCollection,
  getRoutinesCollection,
  getSavedProductsCollection,
  getSkinJournalsCollection,
  getSkinProfilesCollection,
} from "@/infrastructure/database/collections";
import type {
  RoutineAnalysis,
  RoutineAnalysisDocument,
} from "@/modules/ai-analysis/routine-analysis.types";
import type { Product, ProductDocument } from "@/modules/products/product.types";
import type {
  RoutineLog,
  RoutineLogDocument,
} from "@/modules/routine-logs/routine-log.types";
import type { Routine, RoutineDocument } from "@/modules/routines/routine.types";
import type {
  SavedProduct,
  SavedProductDocument,
} from "@/modules/saved-products/saved-product.types";
import type {
  SkinJournal,
  SkinJournalDocument,
} from "@/modules/journals/skin-journal.types";
import type {
  SkinProfile,
  SkinProfileDocument,
} from "@/modules/skin-profile/skin-profile.types";
import type {
  AppUserProfile,
  AppUserProfileDocument,
} from "@/modules/users/app-user-profile.types";

export type AccountDataSavedProductSnapshot = {
  savedProduct: SavedProduct;
  product: Product | null;
};

export type AccountDataExportSnapshot = {
  appProfile: AppUserProfile | null;
  skinProfile: SkinProfile | null;
  savedProducts: AccountDataSavedProductSnapshot[];
  routines: Routine[];
  routineLogs: RoutineLog[];
  routineAnalyses: RoutineAnalysis[];
  skinJournals: SkinJournal[];
};

export type AccountAppDataDeletedCounts = {
  skinProfiles: number;
  savedProducts: number;
  routines: number;
  routineLogs: number;
  routineAnalyses: number;
  skinJournals: number;
};

export type AccountAppDataSummaryCounts = AccountAppDataDeletedCounts;

export type DeleteAccountAppDataRepositoryResult = {
  deletedCounts: AccountAppDataDeletedCounts;
  appUserProfileMatched: boolean;
  appUserProfileOnboardingReset: boolean;
};

function uniqueObjectIds(ids: ObjectId[]) {
  const seenIds = new Set<string>();
  const uniqueIds: ObjectId[] = [];

  for (const id of ids) {
    const stringId = id.toString();

    if (!seenIds.has(stringId)) {
      seenIds.add(stringId);
      uniqueIds.push(id);
    }
  }

  return uniqueIds;
}

function mapProductsById(products: Product[]) {
  return new Map(products.map((product) => [product._id.toString(), product]));
}

export async function getAccountDataExportSnapshot(
  userId: string,
): Promise<AccountDataExportSnapshot> {
  const [
    appUserProfilesCollection,
    skinProfilesCollection,
    savedProductsCollection,
    routinesCollection,
    routineLogsCollection,
    routineAnalysesCollection,
    skinJournalsCollection,
  ] = await Promise.all([
    getAppUserProfilesCollection<AppUserProfileDocument>(),
    getSkinProfilesCollection<SkinProfileDocument>(),
    getSavedProductsCollection<SavedProductDocument>(),
    getRoutinesCollection<RoutineDocument>(),
    getRoutineLogsCollection<RoutineLogDocument>(),
    getRoutineAnalysesCollection<RoutineAnalysisDocument>(),
    getSkinJournalsCollection<SkinJournalDocument>(),
  ]);

  const [
    appProfile,
    skinProfile,
    savedProducts,
    routines,
    routineLogs,
    routineAnalyses,
    skinJournals,
  ] = await Promise.all([
    appUserProfilesCollection.findOne({ userId }),
    skinProfilesCollection.findOne({ userId }),
    savedProductsCollection.find({ userId }).sort({ createdAt: -1 }).toArray(),
    routinesCollection.find({ userId }).sort({ updatedAt: -1 }).toArray(),
    routineLogsCollection
      .find({ userId })
      .sort({ localDate: -1, updatedAt: -1 })
      .toArray(),
    routineAnalysesCollection.find({ userId }).sort({ createdAt: -1 }).toArray(),
    skinJournalsCollection
      .find({ userId })
      .sort({ localDate: -1, createdAt: -1 })
      .toArray(),
  ]);

  const productIds = uniqueObjectIds(
    savedProducts.map((savedProduct) => savedProduct.productId),
  );
  const productsCollection = await getProductsCollection<ProductDocument>();
  const linkedProducts =
    productIds.length > 0
      ? await productsCollection
          .find({
            _id: {
              $in: productIds,
            },
          })
          .toArray()
      : [];
  const productsById = mapProductsById(linkedProducts);

  return {
    appProfile,
    skinProfile,
    savedProducts: savedProducts.map((savedProduct) => ({
      savedProduct,
      product: productsById.get(savedProduct.productId.toString()) ?? null,
    })),
    routines,
    routineLogs,
    routineAnalyses,
    skinJournals,
  };
}

export async function countAccountAppDataByUserId(
  userId: string,
): Promise<AccountAppDataSummaryCounts> {
  const [
    skinProfilesCollection,
    savedProductsCollection,
    routinesCollection,
    routineLogsCollection,
    routineAnalysesCollection,
    skinJournalsCollection,
  ] = await Promise.all([
    getSkinProfilesCollection<SkinProfileDocument>(),
    getSavedProductsCollection<SavedProductDocument>(),
    getRoutinesCollection<RoutineDocument>(),
    getRoutineLogsCollection<RoutineLogDocument>(),
    getRoutineAnalysesCollection<RoutineAnalysisDocument>(),
    getSkinJournalsCollection<SkinJournalDocument>(),
  ]);

  const [
    skinProfiles,
    savedProducts,
    routines,
    routineLogs,
    routineAnalyses,
    skinJournals,
  ] = await Promise.all([
    skinProfilesCollection.countDocuments({ userId }),
    savedProductsCollection.countDocuments({ userId }),
    routinesCollection.countDocuments({ userId }),
    routineLogsCollection.countDocuments({ userId }),
    routineAnalysesCollection.countDocuments({ userId }),
    skinJournalsCollection.countDocuments({ userId }),
  ]);

  return {
    skinProfiles,
    savedProducts,
    routines,
    routineLogs,
    routineAnalyses,
    skinJournals,
  };
}

export async function deleteAccountAppDataByUserId(
  userId: string,
  deletedAt: Date,
): Promise<DeleteAccountAppDataRepositoryResult> {
  const [
    appUserProfilesCollection,
    skinProfilesCollection,
    savedProductsCollection,
    routinesCollection,
    routineLogsCollection,
    routineAnalysesCollection,
    skinJournalsCollection,
  ] = await Promise.all([
    getAppUserProfilesCollection<AppUserProfileDocument>(),
    getSkinProfilesCollection<SkinProfileDocument>(),
    getSavedProductsCollection<SavedProductDocument>(),
    getRoutinesCollection<RoutineDocument>(),
    getRoutineLogsCollection<RoutineLogDocument>(),
    getRoutineAnalysesCollection<RoutineAnalysisDocument>(),
    getSkinJournalsCollection<SkinJournalDocument>(),
  ]);
  const appUserProfile = await appUserProfilesCollection.findOne({ userId });
  const shouldResetOnboarding = appUserProfile?.onboardingCompleted === true;

  const [
    skinProfileResult,
    savedProductsResult,
    routinesResult,
    routineLogsResult,
    routineAnalysesResult,
    skinJournalsResult,
    appUserProfileResetResult,
  ] = await Promise.all([
    skinProfilesCollection.deleteMany({ userId }),
    savedProductsCollection.deleteMany({ userId }),
    routinesCollection.deleteMany({ userId }),
    routineLogsCollection.deleteMany({ userId }),
    routineAnalysesCollection.deleteMany({ userId }),
    skinJournalsCollection.deleteMany({ userId }),
    shouldResetOnboarding
      ? appUserProfilesCollection.updateOne(
          { userId },
          {
            $set: {
              onboardingCompleted: false,
              updatedAt: deletedAt,
            },
          },
        )
      : Promise.resolve({ matchedCount: appUserProfile ? 1 : 0, modifiedCount: 0 }),
  ]);

  return {
    deletedCounts: {
      skinProfiles: skinProfileResult.deletedCount,
      savedProducts: savedProductsResult.deletedCount,
      routines: routinesResult.deletedCount,
      routineLogs: routineLogsResult.deletedCount,
      routineAnalyses: routineAnalysesResult.deletedCount,
      skinJournals: skinJournalsResult.deletedCount,
    },
    appUserProfileMatched: appUserProfileResetResult.matchedCount > 0,
    appUserProfileOnboardingReset: appUserProfileResetResult.modifiedCount > 0,
  };
}
